// app.js — 状态管理 / 渲染 / 交互（数据来自 mock.js，接口走 api.js 桩）
// 流程：战况录入（pick）→ 定制生成翌日恢复航线（plan）→ 展开节点累计恢复力 → 恢复结算报告
'use strict';

const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);
const ico = (name, cls) => `<svg class="ic ${cls || ''}"><use href="#i-${name}"/></svg>`;
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const state = {
  condId: null,      // 当前战况 id（light / heavy / allnighter）
  conditions: [],
  actions: new Set(),// 选中的昨夜行为 id（可多选）
  plan: null,        // 当前恢复航线
  applied: new Set(),// 已展开（计入恢复力）的节点下标
  recovery: 0        // 今日恢复力（%），基础航线合计 100，加项可超额
};

/* ---------- 顶部时钟 / 侧栏状态面板 ---------- */
function startClock() {
  const chip = $('#clock');
  const side = $('#clock-side');
  const tick = () => {
    const t = new Date();
    chip.textContent = t.toTimeString().slice(0, 5);
    if (side) side.textContent = t.toTimeString().slice(0, 8);
  };
  tick();
  setInterval(tick, 1000);

  const d = new Date();
  const wd = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][d.getDay()];
  $('#date-side').textContent = `${d.getMonth() + 1}月${d.getDate()}日 · ${wd}`;
}

/* ---------- 战况录入 ---------- */
function renderCondCards(conditions) {
  $('#cond-grid').innerHTML = conditions.map((c) => `
    <button class="cond-card" data-cond-id="${c.id}" style="--tab:${c.color};--tab-rgb:${c.rgb}">
      <span class="cond-ic">${ico(c.icon)}</span>
      <span class="cond-txt">
        <span class="cond-tag mono">${c.lv} · ${c.sub}</span>
        <b class="cond-name">${c.name}</b>
        <span class="cond-note">${c.note}</span>
      </span>
      <span class="cond-balance">
        <span class="cond-balance-lbl mono">睡眠余额</span>
        <span class="bar"><span class="bar-fill" style="width:${c.balance}%"></span></span>
        <b class="mono">${c.balance}%</b>
      </span>
    </button>`).join('');
}

function renderActionTags(actions) {
  $('#actions-grid').innerHTML = actions.map((a) => `
    <button class="action-tag" data-action-id="${a.id}" title="${a.name}">
      ${ico(a.icon, 'ic-14')}<span>${a.name}</span>
    </button>`).join('');
}

function pickCond(id) {
  state.condId = id;
  $$('.cond-card').forEach((b) => b.classList.toggle('active', b.dataset.condId === id));
  const btn = $('#btn-generate');
  btn.disabled = false;
  btn.innerHTML = `${ico('route')}生成翌日回血航线`;
  try { localStorage.setItem('nr:cond', id); } catch (e) { /* 忽略 */ }
}

async function generate() {
  const condId = state.condId;
  if (!condId) return;
  const btn = $('#btn-generate');
  if (btn.disabled) return;
  const actions = [...state.actions];
  btn.disabled = true;
  btn.innerHTML = '<span class="spin"></span>正在扫描黑眼圈…';

  // 切到航线态：摘要 + 骨架屏先出场
  $('#pick').hidden = true;
  $('#plan').hidden = false;
  resetProgress();

  const res = await API.generatePlan(condId, actions);
  if (state.condId !== condId || $('#plan').hidden) {
    // 等待期间更换了战况 / 已回到录入态：放弃本次结果并复位按钮
    btn.disabled = !state.condId;
    if (state.condId) btn.innerHTML = `${ico('route')}生成翌日回血航线`;
    return;
  }

  state.plan = res.data;
  document.body.dataset.route = condId;
  $('#stat-slept').textContent = state.plan.slept;
  $('#stat-debt').textContent = state.plan.debt;
  $('#stat-tonight').textContent = state.plan.tonight;
  updateMeter();
  renderTimeline(state.plan);
  const extra = actions.length ? ` · 定制加项 ×${actions.length}` : ' · 含今日彩蛋';
  toast(`已规划 · ${state.plan.name}${extra} · 今晚 ${state.plan.tonight} 入箱`);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showPick() {
  closeModal();
  $('#plan').hidden = true;
  $('#pick').hidden = false;
  resetProgress();
  const btn = $('#btn-generate');
  btn.disabled = !state.condId;
  if (state.condId) btn.innerHTML = `${ico('route')}生成翌日回血航线`;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function resetProgress() {
  state.plan = null;
  state.applied = new Set();
  state.recovery = 0;
  updateMeter();
}

/* ---------- 恢复时间轴 ---------- */
function nodeHTML(n, i, no) {
  const chips = n.chips
    .map((c) => `<span class="chip chip-${c.type}">${c.icon ? ico(c.icon, 'ic-14') : ''}${c.text}</span>`)
    .join('');
  return `
  <article class="node" style="--d:${no * 60}ms">
    <div class="node-rail">
      <span class="node-time mono">${n.time}</span>
      <span class="node-pin">${ico(n.icon)}</span>
    </div>
    <div class="node-card" role="button" tabindex="0" aria-expanded="false" data-idx="${i}">
      <div class="node-head"><h3>${n.title}</h3><span class="chev">${ico('chevron-down')}</span></div>
      <p class="node-teaser">${n.teaser}</p>
      <div class="node-detail"><div class="nd-inner">
        <p>${n.detail}</p>
        <div class="nd-tip">${ico('leaf')}${n.tip}</div>
        <div class="node-chips">${chips}</div>
      </div></div>
    </div>
  </article>`;
}

function endHTML(r, no) {
  return `
  <article class="node node-end" style="--d:${no * 60}ms">
    <div class="node-rail">
      <span class="node-time mono">${r.end.time}</span>
      <span class="node-pin pin-end">${ico('moon')}</span>
    </div>
    <div class="node-card end-card">
      <div class="node-head"><h3>${r.end.title}</h3></div>
      <p class="node-teaser">${r.end.desc}</p>
      <button class="btn-primary" id="btn-report">${ico('scan-face')}生成恢复结算报告</button>
    </div>
  </article>`;
}

function renderTimeline(r) {
  let lastSeg = '';
  let no = 0;
  const parts = [];
  r.nodes.forEach((n, i) => {
    if (n.seg !== lastSeg) {
      parts.push(`<div class="seg-divider" style="--d:${no * 60}ms"><span>${n.seg}</span></div>`);
      lastSeg = n.seg;
      no++;
    }
    parts.push(nodeHTML(n, i, no));
    no++;
  });
  parts.push(endHTML(r, no));
  $('#timeline').innerHTML = parts.join('');
}

/* ---------- 今日恢复力（基础航线满分 100，加项可超额） ---------- */
function updateMeter() {
  $('#recovery-fill').style.width = Math.min(state.recovery, 100) + '%';
  $('#recovery-num').textContent = state.recovery + '%';
}

function toggleNode(card) {
  const idx = Number(card.dataset.idx);
  const open = card.classList.toggle('open');
  card.setAttribute('aria-expanded', String(open));
  if (open && !state.applied.has(idx)) {
    state.applied.add(idx);
    state.recovery = Math.max(0, state.recovery + state.plan.nodes[idx].gain);
    updateMeter();
  }
}

/* ---------- 恢复结算报告 ---------- */
function gradeFor(p) {
  if (p >= 100) return { lv: 5, label: '满血复活', note: '教科书级止损，系统向你致敬。' };
  if (p >= 70) return { lv: 4, label: '回血优秀', note: '执行力惊人，身体已开始发放奖金。' };
  if (p >= 40) return { lv: 3, label: '回血过半', note: '及格线以上。剩下的缺口，今晚早点躺来补。' };
  if (p > 0) return { lv: 2, label: '勉强开机', note: '回了一点，但不多。今晚咱们补个大的。' };
  return { lv: 1, label: '原地待命', note: '一个节点都没点开——系统救不了不展开航线的人。' };
}

function renderReport(plan, pct) {
  const g = gradeFor(pct);
  const segs = Array.from({ length: 5 }, (_, i) =>
    `<span class="seg${i < g.lv ? ' on' : ''}" style="--d:${i * 80}ms"></span>`
  ).join('');
  const done = [...state.applied].map((i) => plan.nodes[i].title);
  const doneChips = done.length
    ? done.map((t) => `<span class="chip chip-info">${t}</span>`).join('')
    : '<span class="chip chip-info">暂无——行动清单在等你</span>';
  const customSec = (plan.custom && plan.custom.length) ? `
    <div class="rp-sec">
      <span class="rp-lbl">${ico('zap', 'ic-14')}定制提醒 · 针对昨晚</span>
      <ul class="rp-advice">${plan.custom.map((a) => `<li>${DB.tagAdvice[a] || ''}</li>`).join('')}</ul>
    </div>` : '';
  const verdict = pct > 100
    ? `超额回血 +${pct - 100}%，系统已无话可说。${plan.verdict}`
    : plan.verdict;

  $('#report-body').innerHTML = `
    <div class="rp-face">
      <div class="rp-face-ring">${ico('battery-charging')}</div>
      <div class="rp-face-info">
        <span class="rp-lbl">今日恢复力评级</span>
        <b class="rp-lv">Lv.${g.lv} · ${g.label}</b>
        <p class="rp-note">${g.note}</p>
        <div class="rp-segs">${segs}</div>
      </div>
    </div>
    <div>
      <div class="rp-meter-head">${ico('zap', 'ic-14')}<span>今日恢复力</span><b class="mono" id="rp-recovery-num">0%</b></div>
      <div class="bar bar-lg"><div class="bar-fill" id="rp-recovery-fill" style="width:0%"></div></div>
    </div>
    <div class="rp-sec">
      <span class="rp-lbl">${ico('moon', 'ic-14')}今晚入箱建议</span>
      <div class="rp-tonight"><b class="mono">${plan.tonight}</b><span>${plan.tonightWhy}</span></div>
    </div>
    <div class="rp-sec">
      <span class="rp-lbl">${ico('eye', 'ic-14')}黑眼圈消退预估</span>
      <p class="rp-line">${plan.darkCircle}</p>
    </div>
    ${customSec}
    <div class="rp-sec">
      <span class="rp-lbl">${ico('sparkles', 'ic-14')}已完成行动 · ${done.length}/${plan.nodes.length}</span>
      <div class="loot-chips">${doneChips}</div>
    </div>
    <blockquote class="rp-verdict">${ico('leaf')}<span>${verdict}</span></blockquote>
    <div class="rp-foot mono">RECOVERY REPORT NO.${plan.code} · 数据仅存在于今天</div>`;

  // 恢复力条延迟展开，制造结算扫描感
  requestAnimationFrame(() => setTimeout(() => {
    $('#rp-recovery-fill').style.width = Math.min(pct, 100) + '%';
    $('#rp-recovery-num').textContent = pct + '%';
  }, 120));
}

async function handleReport(btn) {
  if (btn.disabled) return;
  const condId = state.condId; // 锁定发起结算时的战况
  btn.disabled = true;
  btn.innerHTML = '<span class="spin"></span>正在扫描黑眼圈…';
  await wait(600); // 模拟结算扫描耗时
  if (state.condId !== condId || $('#plan').hidden) return; // 期间换了战况，放弃
  renderReport(state.plan, state.recovery);
  openModal();
}

/* ---------- 弹层 / Toast ---------- */
function openModal() {
  const backdrop = $('#modal');
  backdrop.hidden = false;
  requestAnimationFrame(() => backdrop.classList.add('open'));
}

function closeModal() {
  const backdrop = $('#modal');
  if (backdrop.hidden) return;
  backdrop.classList.remove('open');
  setTimeout(() => { backdrop.hidden = true; }, 280);
}

let toastTimer = null;
function toast(msg) {
  const t = $('#toast');
  t.innerHTML = `${ico('navigation-2')}<span>${msg}</span>`;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2400);
}

/* ---------- 事件委托 ---------- */
document.addEventListener('click', (e) => {
  const cond = e.target.closest('.cond-card');
  if (cond) { pickCond(cond.dataset.condId); return; }

  const act = e.target.closest('.action-tag');
  if (act) {
    const id = act.dataset.actionId;
    if (state.actions.has(id)) { state.actions.delete(id); act.classList.remove('on'); }
    else { state.actions.add(id); act.classList.add('on'); }
    return;
  }

  if (e.target.closest('#btn-generate')) { generate(); return; }

  if (e.target.closest('#btn-reupdate')) { showPick(); toast('战况重报 · 选择昨晚熬到几点'); return; }

  const card = e.target.closest('.node-card');
  if (card && !card.classList.contains('end-card')) { toggleNode(card); return; }

  const reportBtn = e.target.closest('#btn-report');
  if (reportBtn) { handleReport(reportBtn); return; }

  if (e.target.closest('#modal-close')) { closeModal(); return; }
  if (e.target.id === 'modal-backdrop') { closeModal(); return; }
  if (e.target.closest('#btn-again')) { showPick(); toast('新的一晚，重新上报战况'); return; }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
  const el = document.activeElement;
  if ((e.key === 'Enter' || e.key === ' ') && el && el.classList && el.classList.contains('node-card')) {
    e.preventDefault();
    toggleNode(el);
  }
});

/* ---------- 启动 ---------- */
async function init() {
  startClock();

  const res = await API.fetchConditions(); // 骨架屏期间载入
  state.conditions = res.data.conditions;
  renderCondCards(res.data.conditions);
  renderActionTags(res.data.actions);

  // 恢复上次战况：仅预选，不自动生成
  try {
    const saved = localStorage.getItem('nr:cond');
    if (saved && state.conditions.some((c) => c.id === saved)) pickCond(saved);
  } catch (e) { /* 忽略 */ }
}

init();
