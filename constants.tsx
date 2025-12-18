
import React from 'react';

export const START_DATE = new Date('2020-09-24');
export const LUNAR_BIRTHDAY_MONTH = 11; // 农历11月
export const LUNAR_BIRTHDAY_DAY = 10;   // 农历10日

// 2025年农历11/10 对应的公历日期是 2025-12-29
export const NEXT_BIRTHDAY_SOLAR = new Date('2025-12-29');

export const COUPLE_NAMES = {
  male: '盛杰',
  female: '张继迁'
};

/**
 * 积分平衡逻辑：
 * 每日3个任务，平均奖励约 10-15 积分/个 -> 每日约 35 积分。
 * 7天约 245 积分。
 * 按摩券定价 250 积分，刚好符合一周一个的进度。
 */
export const INITIAL_VOUCHERS = [
  { id: '1', title: '清空购物车券', description: '虽然余额有限（上限100元），但陪你挑的心意无限！', cost: 450, unlocked: false, used: false, icon: '🛒' },
  { id: '2', title: '全天候按摩券', description: '享受专业级的SPA待遇，盛杰牌按摩，按到你满意为止。', cost: 250, unlocked: false, used: false, icon: '💆' },
  { id: '3', title: '无理由不生气券', description: '吵架时的免死金牌！只要出示，盛杰立刻原地认错。', cost: 500, unlocked: false, used: false, icon: '🤫' },
  { id: '4', title: '超级豪华大餐券', description: '地点随你挑！如果是楼下的麻辣烫，可以吃三份。', cost: 700, unlocked: false, used: false, icon: '🍲' },
  { id: '5', title: '终极告白券', description: '在任何公开场合（如朋友圈、大街上）进行羞耻但真诚的告白。', cost: 1200, unlocked: false, used: false, icon: '📢' },
  { id: '6', title: '家务豁免券', description: '今天的洗碗、扫地、倒垃圾全部归盛杰，你只需负责美。', cost: 100, unlocked: false, used: false, icon: '🍽️' },
];

export const POTENTIAL_TASKS = [
  { id: 't1', text: '给对方一个长达10秒的拥抱', reward: 10 },
  { id: 't2', text: '分享一件今天发生的趣事', reward: 8 },
  { id: 't3', text: '夸奖张继迁三个不重复的优点', reward: 15 },
  { id: 't4', text: '一起闭眼听完一首慢歌', reward: 10 },
  { id: 't5', text: '拍一张合照并设置成对方锁屏', reward: 12 },
  { id: 't6', text: '给对方准备一杯温热的奶茶/温水', reward: 10 },
  { id: 't7', text: '深情对视20秒不许笑场', reward: 20 },
];
