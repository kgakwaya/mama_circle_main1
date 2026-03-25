import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { login, register } from '../store/slices/authSlice';
import type { AppDispatch, RootState } from '../store';
import toast, { Toaster } from 'react-hot-toast';

const Auth = () => {
  const [searchParams] = useSearchParams();
  const [isLogin, setIsLogin] = useState(searchParams.get('mode') !== 'register');
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading } = useSelector((s: RootState) => s.auth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname || !password) { toast.error('Please fill in all fields'); return; }
    try {
      if (isLogin) {
        await dispatch(login({ nickname, password })).unwrap();
        toast.success('Welcome back.');
      } else {
        await dispatch(register({ nickname, password })).unwrap();
        toast.success('Welcome to Mama Circle.');
      }
      navigate('/dashboard');
    } catch (err: any) {
      toast.error(err || 'An error occurred');
    }
  };

  const inputCls = 'w-full px-4 py-3 text-sm border border-border-gold rounded-sm bg-ivory text-charcoal font-jost outline-none focus:border-rose-mid transition-colors';
  const labelCls = 'block text-[10px] tracking-[0.18em] uppercase text-ink-mid font-medium mb-2 font-jost';

  return (
    <div className="min-h-screen flex">
      <Toaster position="top-center" toastOptions={{ style: { fontFamily: 'Jost, sans-serif', fontSize: '13px' } }} />

      {/* Left panel — hidden on mobile */}
      <div className="hidden md:flex w-[42%] bg-rose-deep flex-col justify-between px-10 lg:px-16 py-10 lg:py-14 shrink-0">
        <div>
          <Link to="/" className="inline-flex items-center gap-2 no-underline mb-10">
            <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
              <path d="M11 4L6 9l5 5" stroke="rgba(255,255,255,.6)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="font-jost text-[11px] tracking-widest uppercase text-white/55">Back to home</span>
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <circle cx="9" cy="9" r="7" stroke="rgba(255,255,255,.4)" strokeWidth="1" />
                <path d="M5.5 9.5C5.5 7.3 7.1 5.5 9 5.5s3.5 1.8 3.5 4-1.6 4-3.5 4" stroke="#fff" strokeWidth="1.3" strokeLinecap="round" />
                <circle cx="9" cy="9" r="2" fill="#fff" />
              </svg>
            </div>
            <span className="font-serif text-[21px] font-bold text-white">Mama <span className="text-gold-light">Circle</span></span>
          </div>
        </div>

        <div>
          <span className="font-serif text-[72px] text-white/13 leading-[0.7] block mb-5">"</span>
          <p className="font-cormorant italic text-[clamp(17px,2vw,22px)] text-white/90 leading-[1.7] max-w-[320px]">
            {isLogin ? 'Welcome back. Your circle has been waiting for you.' : 'Every mother deserves a circle of warmth — especially in her most vulnerable hours.'}
          </p>
          <div className="flex items-center gap-3 mt-6">
            <div className="h-px w-7 bg-gold-light" />
            <span className="font-jost text-[10px] tracking-[0.16em] uppercase text-gold-light font-medium">Mama Circle · Since 2026</span>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {['Anonymous by design', 'Moderated & safe', 'Built for African mothers', 'Free forever'].map(t => (
            <div key={t} className="flex items-center gap-2.5">
              <div className="w-[5px] h-[5px] rounded-full bg-gold-light shrink-0" />
              <span className="font-jost text-[11px] tracking-[0.08em] uppercase text-white/50">{t}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 bg-ivory flex items-center justify-center px-5 sm:px-10 lg:px-20 py-10">
        <div className="w-full max-w-[420px]">

          {/* Mobile back link */}
          <Link to="/" className="md:hidden inline-flex items-center gap-2 no-underline mb-7 text-ink-soft">
            <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
              <path d="M11 4L6 9l5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="font-jost text-[11px] tracking-widest uppercase">Back to home</span>
          </Link>

          {/* Eyebrow */}
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px flex-1 bg-border-gold" />
            <span className="font-jost text-[10px] tracking-[0.2em] uppercase text-gold font-medium">
              {isLogin ? 'Welcome back' : 'Join the circle'}
            </span>
            <div className="h-px flex-1 bg-border-gold" />
          </div>

          <h1 className="font-serif text-[clamp(26px,4vw,36px)] font-bold text-charcoal leading-[1.15] mb-2">
            {isLogin ? 'Sign in to' : 'Create your'}<br />
            <em className="text-rose-deep not-italic italic">{isLogin ? 'your space' : 'account'}</em>
          </h1>
          <p className="font-jost text-[13px] text-ink-soft mb-7 leading-relaxed">
            {isLogin ? 'Your anonymous identity and all your conversations are waiting.' : 'No real name needed. A nickname is all it takes to begin.'}
          </p>

          {/* Tab toggle */}
          <div className="flex mb-6 border border-border-gold rounded-sm overflow-hidden">
            {[{ label: 'Sign in', val: true }, { label: 'Join free', val: false }].map(({ label, val }) => (
              <button key={label} type="button" onClick={() => setIsLogin(val)}
                className={`flex-1 py-[11px] border-none cursor-pointer font-jost text-[11px] tracking-[0.14em] uppercase font-medium transition-all duration-200 ${
                  isLogin === val ? 'bg-rose-deep text-white' : 'bg-transparent text-ink-soft hover:bg-rose-pale'
                }`}>
                {label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className={labelCls}>Nickname</label>
              <input type="text" placeholder={isLogin ? 'Your nickname' : 'Choose an anonymous nickname'} required className={inputCls}
                value={nickname} onChange={e => setNickname(e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Password</label>
              <input type="password" placeholder="Your password" required className={inputCls}
                value={password} onChange={e => setPassword(e.target.value)} />
            </div>
            <button type="submit" disabled={loading}
              className={`w-full py-3.5 mt-1 font-jost text-xs tracking-[0.16em] uppercase font-medium text-white rounded-sm border-none transition-opacity ${
                loading ? 'bg-rose-light cursor-not-allowed opacity-65' : 'bg-rose-deep cursor-pointer hover:opacity-90'
              }`}>
              {loading ? 'Please wait…' : isLogin ? 'Sign In' : 'Join Anonymously'}
            </button>
          </form>

          <div className="text-center mt-5">
            <button type="button" onClick={() => setIsLogin(!isLogin)}
              className="bg-transparent border-none cursor-pointer font-jost text-[13px] text-ink-soft">
              {isLogin ? "Don't have an account? " : 'Already a member? '}
              <span className="text-rose-deep font-medium">{isLogin ? 'Join the circle.' : 'Sign in.'}</span>
            </button>
          </div>

          <div className="mt-7 p-4 border border-border-gold rounded-sm bg-gold-pale">
            <p className="font-jost text-[11px] text-gold leading-[1.7] text-center">
              Your identity is always protected — only a nickname is used, no real name required, ever.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
