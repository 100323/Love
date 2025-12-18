
import React, { useState } from 'react';

interface LoginPageProps {
  onLogin: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate "Security Check"
    setTimeout(() => {
      if (username === '盛杰' && password === 'zhangjiqian') {
        onLogin();
      } else {
        setIsLoading(false);
        const funnyErrors = [
          "密码错误！你是不是想张继迁想疯了？",
          "账号不认识你，除非你给张继迁买奶茶。",
          "拦截！非本系统认证的帅哥禁止入内。",
          "这密码... 难道你忘记我们的暗号了吗？"
        ];
        setError(funnyErrors[Math.floor(Math.random() * funnyErrors.length)]);
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative z-10">
      <div className="bg-white/80 backdrop-blur-md p-8 rounded-3xl shadow-2xl w-full max-w-md border-4 border-pink-200">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-pink-600 mb-2">💘 恋爱准考系统</h1>
          <p className="text-gray-500 text-sm">只有被录取的恋人才能进入此空间</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-pink-700 mb-1">身份识别码 (姓名)</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-pink-100 focus:border-pink-400 focus:outline-none transition-all bg-white/50"
              placeholder="请输入你的真名"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-pink-700 mb-1">爱的口令 (密码)</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-pink-100 focus:border-pink-400 focus:outline-none transition-all bg-white/50"
              placeholder="张继迁拼音?"
              required
            />
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm animate-bounce text-center">
              ⚠️ {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-4 rounded-2xl bg-gradient-to-r from-pink-400 to-rose-400 text-white font-bold text-lg shadow-lg transform hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                正在扫描帅气程度...
              </>
            ) : (
              '点击投递爱意 ❤️'
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-xs text-pink-400 italic">提示：账号是男方姓名，密码是女方姓名的拼音全拼哦~</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
