import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../store';
import { logout } from '../store/slices/authSlice';
import { Home, Users, MessageCircle, LogOut, MessageSquare, ShieldCheck, Menu, X } from 'lucide-react';

const LogoSvg = () => (
  <svg width="15" height="15" viewBox="0 0 18 18" fill="none">
    <circle cx="9" cy="9" r="7" stroke="rgba(255,255,255,.4)" strokeWidth="1" />
    <path d="M5.5 9.5C5.5 7.3 7.1 5.5 9 5.5s3.5 1.8 3.5 4-1.6 4-3.5 4" stroke="#fff" strokeWidth="1.3" strokeLinecap="round" />
    <circle cx="9" cy="9" r="2" fill="#fff" />
  </svg>
);

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((s: RootState) => s.auth) as any;
  const [open, setOpen] = useState(false);

  const handleLogout = () => { dispatch(logout()); navigate('/'); setOpen(false); };
  const isActive = (p: string) => location.pathname === p;

  const navLinks = [
    { to: '/dashboard', label: 'Home',    Icon: Home },
    { to: '/forums',    label: 'Forums',  Icon: MessageCircle },
    { to: '/groups',    label: 'Groups',  Icon: Users },
    { to: '/chat',      label: 'Chat',    Icon: MessageSquare },
    ...(user?.role === 'admin' ? [{ to: '/admin', label: 'Admin', Icon: ShieldCheck }] : []),
  ];

  const avatarBg    = user?.role === 'psychologist' ? 'bg-sage-light text-sage' : user?.role === 'admin' ? 'bg-gold-pale text-gold' : 'bg-rose-pale text-rose-deep';
  const roleBadgeCls = user?.role === 'psychologist' ? 'bg-sage-light text-sage' : 'bg-gold-pale text-gold';

  return (
    <nav className="sticky top-0 z-50 bg-cream border-b border-border-gold">
      <div className="h-0.5 bg-rose-deep" />

      <div className="max-w-[1200px] mx-auto px-4 lg:px-10 h-[62px] flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/dashboard" className="flex items-center gap-2.5 shrink-0 no-underline">
          <div className="w-8 h-8 rounded-full bg-rose-deep flex items-center justify-center shrink-0">
            <LogoSvg />
          </div>
          <span className="font-serif text-[19px] font-bold text-rose-deep leading-none">
            Mama <span className="text-gold">Circle</span>
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-7">
          {navLinks.map(({ to, label, Icon }) => (
            <Link key={to} to={to}
              className={`flex items-center gap-1.5 no-underline font-jost text-[11px] tracking-widest uppercase font-medium pb-0.5 border-b-2 transition-colors duration-200 ${
                isActive(to)
                  ? to === '/admin' ? 'text-gold border-gold' : 'text-rose-deep border-rose-deep'
                  : 'text-ink-soft border-transparent hover:text-rose-deep'
              }`}
            >
              <Icon size={13} />
              {label}
            </Link>
          ))}
        </div>

        {/* Right */}
        <div className="flex items-center gap-4 shrink-0">
          {/* Avatar chip */}
          <div className="hidden md:flex items-center gap-2">
            <div className={`w-[30px] h-[30px] rounded-full flex items-center justify-center font-serif text-xs font-bold shrink-0 ${avatarBg}`}>
              {user?.nickname?.[0]?.toUpperCase()}
            </div>
            {user?.role !== 'mother' && (
              <span className={`text-[8px] px-1.5 py-0.5 rounded-sm font-medium tracking-widest uppercase font-jost ${roleBadgeCls}`}>
                {user?.role}
              </span>
            )}
          </div>

          {/* Desktop logout */}
          <button onClick={handleLogout}
            className="hidden md:flex items-center gap-1.5 bg-transparent border-none cursor-pointer font-jost text-[11px] tracking-widest uppercase text-ink-soft hover:text-charcoal transition-colors whitespace-nowrap">
            <LogOut size={13} /> Exit
          </button>

          {/* Hamburger */}
          <button onClick={() => setOpen(o => !o)} aria-label="Menu"
            className="md:hidden bg-transparent border-none cursor-pointer p-1 flex items-center justify-center">
            {open ? <X size={20} className="text-ink-mid" /> : <Menu size={20} className="text-ink-mid" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-cream border-t border-border-gold px-5 py-3 flex flex-col gap-0.5">
          {navLinks.map(({ to, label, Icon }) => (
            <Link key={to} to={to}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-2.5 px-3 py-2.5 no-underline font-jost text-xs tracking-widest uppercase font-medium rounded-sm transition-colors ${
                isActive(to) ? 'text-rose-deep bg-rose-pale' : 'text-ink-mid hover:bg-rose-pale'
              }`}
            >
              <Icon size={15} />
              {label}
            </Link>
          ))}
          <div className="h-px bg-border-gold my-2" />
          <div className="flex items-center justify-between px-3 py-2">
            <span className="text-xs text-ink-mid font-medium font-jost">{user?.nickname}</span>
            <button onClick={handleLogout}
              className="flex items-center gap-1.5 bg-transparent border-none cursor-pointer font-jost text-[11px] tracking-widest uppercase text-rose-deep">
              <LogOut size={13} /> Sign out
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
