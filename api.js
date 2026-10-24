// api.js — 接口桩层：函数签名即未来真实接口
// 现阶段内部返回 mock 数据并模拟网络延迟；后续接后端时保持签名与返回结构不变

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const API = {
  // GET /api/stay-up/conditions
  // 返回 { code: 0, data: { conditions, actions } }
  async fetchConditions() {
    await delay(400); // 模拟网络延迟
    // TODO: 接后端时替换为 fetch('/api/stay-up/conditions')，保持返回结构一致
    return { code: 0, data: { conditions: DB.conditions, actions: DB.actions } };
  },

  // POST /api/stay-up/plans  body: { conditionId, lastNightActions: string[] }
  // 返回 { code: 0, data: plan }（基础航线 + 今日彩蛋 + 行为加项，按时间排序）
  async generatePlan(conditionId, lastNightActions = []) {
    await delay(700); // 模拟「扫描黑眼圈 → 个性化规划」耗时
    // TODO: 接后端时替换为
    //   fetch('/api/stay-up/plans', { method: 'POST', body: JSON.stringify({ conditionId, lastNightActions }) })
    return { code: 0, data: DB.buildPlan(conditionId, lastNightActions) };
  }
};
