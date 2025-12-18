
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { START_DATE, NEXT_BIRTHDAY_SOLAR, COUPLE_NAMES, INITIAL_VOUCHERS, POTENTIAL_TASKS } from '../constants';
import { UserStats, Voucher, LoveTask } from '../types';

interface DashboardProps {
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const [stats, setStats] = useState<UserStats>({
    points: 0,
    lastCheckIn: null,
    totalCheckIns: 0,
    completedTasks: [],
    lastTaskRefresh: null
  });
  const [vouchers, setVouchers] = useState<Voucher[]>(INITIAL_VOUCHERS);
  const [dailyTasks, setDailyTasks] = useState<LoveTask[]>([]);
  const [daysTogether, setDaysTogether] = useState(0);
  const [showMystery, setShowMystery] = useState(false);
  const [mysteryMsg, setMysteryMsg] = useState('');
  const [pendingVoucher, setPendingVoucher] = useState<Voucher | null>(null);

  useEffect(() => {
    const savedStats = localStorage.getItem('love_stats_v2');
    const savedVouchers = localStorage.getItem('love_vouchers_v2');
    
    let currentStats: UserStats = savedStats ? JSON.parse(savedStats) : stats;
    let currentVouchers: Voucher[] = savedVouchers ? JSON.parse(savedVouchers) : INITIAL_VOUCHERS;
    
    const today = new Date().toDateString();
    
    // 每日重置逻辑
    if (currentStats.lastTaskRefresh !== today) {
      const shuffled = [...POTENTIAL_TASKS].sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, 3).map(t => ({ ...t, completed: false }));
      
      const newStats: UserStats = { 
        ...currentStats, 
        lastTaskRefresh: today, 
        completedTasks: [] 
      };
      
      setStats(newStats);
      setDailyTasks(selected);
      localStorage.setItem('love_stats_v2', JSON.stringify(newStats));
    } else {
      setStats(currentStats);
      // 保持当天的随机任务（为了简单，这里按ID过滤）
      const shuffled = [...POTENTIAL_TASKS].sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, 3).map(t => ({ 
        ...t, 
        completed: currentStats.completedTasks.includes(t.id) 
      }));
      setDailyTasks(selected);
    }
    
    setVouchers(currentVouchers);

    const calculateDays = () => {
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - START_DATE.getTime());
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      setDaysTogether(diffDays);
    };

    calculateDays();
    const interval = setInterval(calculateDays, 1000 * 60 * 60);
    return () => clearInterval(interval);
  }, []);

  const saveStats = (newStats: UserStats) => {
    setStats(newStats);
    localStorage.setItem('love_stats_v2', JSON.stringify(newStats));
  };

  const saveVouchers = (newVouchers: Voucher[]) => {
    setVouchers(newVouchers);
    localStorage.setItem('love_vouchers_v2', JSON.stringify(newVouchers));
  };

  const daysToBirthday = useMemo(() => {
    const now = new Date();
    const diff = NEXT_BIRTHDAY_SOLAR.getTime() - now.getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }, []);

  const handleTaskComplete = (taskId: string, reward: number) => {
    if (stats.completedTasks.includes(taskId)) return;

    const newStats = {
      ...stats,
      points: stats.points + reward,
      completedTasks: [...stats.completedTasks, taskId]
    };
    saveStats(newStats);
    setDailyTasks(prev => prev.map(t => t.id === taskId ? { ...t, completed: true } : t));
    alert(`任务完成！获得 ${reward} 积分 💝`);
  };

  const redeemVoucher = (id: string) => {
    const voucher = vouchers.find(v => v.id === id);
    if (!voucher) return;
    if (stats.points < voucher.cost) {
      alert("积分不足，加油完成任务哦！");
      return;
    }
    const newStats = { ...stats, points: stats.points - voucher.cost };
    const newVouchers = vouchers.map(v => v.id === id ? { ...v, unlocked: true } : v);
    saveStats(newStats);
    saveVouchers(newVouchers);
    alert(`兑换成功！“${voucher.title}”已飞入你的背篓 🦋`);
  };

  const handleUseClick = (v: Voucher) => {
    setPendingVoucher(v);
  };

  const confirmUseVoucher = () => {
    if (!pendingVoucher) return;
    const newVouchers = vouchers.map(v => 
      v.id === pendingVoucher.id ? { ...v, unlocked: false, used: true } : v
    );
    saveVouchers(newVouchers);
    const title = pendingVoucher.title;
    setPendingVoucher(null);
    setMysteryMsg(`券已生效：【${title}】！盛杰必须立即执行此特权！💖`);
    setShowMystery(true);
    setTimeout(() => setShowMystery(false), 5000);
  };

  const triggerMystery = useCallback(() => {
    const messages = [
      "张继迁是这个宇宙最亮的星星 🌟",
      "盛杰会一直宠着他的小祖宗。",
      "无论风雨，我都会为你撑伞。",
      "今天的隐藏奖励是：盛杰多爱你一点点。",
      "全世界最好的继迁，值得全世界最好的爱。"
    ];
    setMysteryMsg(messages[Math.floor(Math.random() * messages.length)]);
    setShowMystery(true);
    setTimeout(() => setShowMystery(false), 3000);
  }, []);

  const unlockedVouchers = vouchers.filter(v => v.unlocked && !v.used);
  const availableVouchers = vouchers.filter(v => !v.unlocked && !v.used);

  return (
    <div className="relative z-10 max-w-5xl mx-auto px-4 py-12 space-y-10">
      <header className="text-center space-y-4">
        <h1 className="text-6xl font-romantic text-rose-500 font-bold drop-shadow-md">Love Story</h1>
        <div className="flex items-center justify-center gap-6 text-2xl font-bold text-gray-700">
          <span className="bg-white/50 px-4 py-1 rounded-full shadow-sm border border-white">{COUPLE_NAMES.male}</span>
          <span className="text-rose-400 animate-pulse text-4xl">❤️</span>
          <span className="bg-white/50 px-4 py-1 rounded-full shadow-sm border border-white">{COUPLE_NAMES.female}</span>
        </div>
      </header>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white/90 rounded-[2.5rem] p-8 shadow-xl border-b-[12px] border-rose-400 text-center flex flex-col justify-center">
          <p className="text-gray-400 font-black uppercase tracking-[0.2em] text-xs mb-2">相爱已历经</p>
          <div className="flex items-center justify-center gap-2">
            <span className="text-8xl md:text-[10rem] font-black text-transparent bg-clip-text bg-gradient-to-br from-rose-400 to-rose-600 tracking-tighter leading-none">
              {daysTogether}
            </span>
            <span className="text-2xl font-bold text-gray-300 mt-12">天</span>
          </div>
          <p className="text-sm text-gray-400 mt-6 font-medium">✨ 始于 2020.09.24 · 故事还在继续 ✨</p>
        </div>

        <div className="bg-gradient-to-br from-rose-400 to-pink-600 rounded-[2.5rem] p-8 shadow-xl text-white text-center flex flex-col justify-center">
          <p className="text-rose-100 font-bold text-sm mb-2">距离 继迁 生日倒计时</p>
          <div className="text-7xl font-black mb-1 drop-shadow-lg">{daysToBirthday}</div>
          <p className="text-xl font-bold">天</p>
          <div className="mt-6 pt-4 border-t border-white/20">
            <p className="text-xs text-rose-100 opacity-80">农历十一月初十</p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <section className="bg-white/80 backdrop-blur-sm rounded-[2rem] p-8 shadow-lg space-y-6 border-l-[10px] border-pink-400">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-black text-gray-800">🎯 每日挑战</h2>
            <div className="flex items-center gap-2 bg-pink-50 px-4 py-2 rounded-2xl">
              <span className="text-pink-600 font-black text-lg">💰 {stats.points}</span>
            </div>
          </div>
          <div className="space-y-4">
            {dailyTasks.map(task => (
              <div 
                key={task.id}
                onClick={() => !task.completed && handleTaskComplete(task.id, task.reward)}
                className={`p-5 rounded-2xl flex justify-between items-center transition-all cursor-pointer border-2 ${
                  task.completed ? 'bg-gray-50/50 border-gray-100 opacity-60' : 'bg-white border-transparent hover:border-pink-200 shadow-sm'
                }`}
              >
                <div>
                  <p className={`font-bold text-lg ${task.completed ? 'text-gray-400 line-through' : 'text-gray-700'}`}>{task.text}</p>
                  <p className="text-xs text-pink-400 font-bold">+{task.reward} Points</p>
                </div>
                <div className="text-xl">{task.completed ? '✓' : '🔥'}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white/80 backdrop-blur-sm rounded-[2rem] p-8 shadow-lg space-y-6 border-r-[10px] border-purple-400">
          <h2 className="text-2xl font-black text-gray-800">🎒 继迁的背篓</h2>
          <div className="min-h-[200px]">
            {unlockedVouchers.length === 0 ? (
              <div className="h-40 flex items-center justify-center border-2 border-dashed border-purple-100 rounded-3xl text-gray-300">背篓空空</div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {unlockedVouchers.map(v => (
                  <button key={v.id} onClick={() => handleUseClick(v)} className="bg-white p-4 rounded-2xl border-2 border-purple-100 shadow-sm hover:shadow-md text-center group">
                    <div className="text-4xl mb-2">{v.icon}</div>
                    <div className="font-black text-gray-700 text-sm">{v.title}</div>
                    <div className="mt-2 text-[10px] bg-purple-500 text-white py-1 px-2 rounded-full font-bold">点击使用</div>
                  </button>
                ))}
              </div>
            )}
          </div>
          <button onClick={triggerMystery} className="w-full mt-6 p-5 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl text-white font-black shadow-lg">🔮 抽取随机情书</button>
        </section>
      </div>

      <section className="space-y-10">
        <h2 className="text-4xl font-black text-gray-800 text-center">🛍️ 积分大商城</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {availableVouchers.map(v => (
            <div key={v.id} className="bg-white rounded-[2.5rem] p-8 shadow-xl border-4 border-transparent hover:border-pink-100 flex flex-col h-full transition-all hover:-translate-y-1">
              <div className="flex justify-between mb-6">
                <div className="text-5xl">{v.icon}</div>
                <div className="text-right">
                  <p className="text-[10px] text-pink-300 font-black">Cost</p>
                  <p className="text-3xl text-pink-500 font-black">{v.cost}</p>
                </div>
              </div>
              <h3 className="text-2xl font-black text-gray-800 mb-2">{v.title}</h3>
              <p className="text-gray-400 text-sm flex-1">{v.description}</p>
              <button 
                onClick={() => redeemVoucher(v.id)} 
                disabled={stats.points < v.cost}
                className={`mt-8 w-full py-5 rounded-2xl font-black shadow-lg transition-all ${stats.points >= v.cost ? 'bg-rose-500 text-white hover:bg-rose-600' : 'bg-gray-100 text-gray-300 cursor-not-allowed'}`}
              >
                {stats.points >= v.cost ? '立即兑换' : `还差 ${v.cost - stats.points} 分`}
              </button>
            </div>
          ))}
        </div>
      </section>

      {pendingVoucher && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-rose-900/40 backdrop-blur-md">
          <div className="bg-white rounded-[2.5rem] p-10 max-w-sm w-full text-center shadow-2xl border-t-[12px] border-purple-500">
            <div className="text-6xl mb-6">{pendingVoucher.icon}</div>
            <h3 className="text-2xl font-black text-gray-800 mb-2">使用该券？</h3>
            <p className="text-gray-500 mb-8">使用后该券将从背篓移除，请确保盛杰就在您面前哦！</p>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => setPendingVoucher(null)} className="py-4 bg-gray-100 text-gray-500 rounded-2xl font-black">等会儿</button>
              <button onClick={confirmUseVoucher} className="py-4 bg-purple-500 text-white rounded-2xl font-black shadow-lg">确认使用</button>
            </div>
          </div>
        </div>
      )}

      {showMystery && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-[2.5rem] p-12 max-w-md w-full text-center shadow-2xl border-4 border-rose-400">
            <p className="text-2xl font-black text-gray-800 mb-10 leading-snug">{mysteryMsg}</p>
            <div className="text-rose-400 font-romantic text-3xl">— Love Forever —</div>
          </div>
        </div>
      )}

      <footer className="pt-16 border-t border-rose-100 text-center">
        <button onClick={onLogout} className="text-gray-300 hover:text-rose-400 text-xs underline decoration-dotted mb-4">退出登录</button>
        <p className="text-gray-400 text-sm font-medium">MADE WITH ❤️ BY SHENG JIE FOR ZHANG JI QIAN</p>
      </footer>
    </div>
  );
};

export default Dashboard;
