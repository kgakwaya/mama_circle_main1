import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { RootState } from '../store';
import { MessageCircle, Users, BookOpen, MessageSquare, ShieldCheck } from 'lucide-react';

const affirmations = [
  'Being a mother is learning about strengths you did not know you had. It is okay to ask for help.',
  'You are doing better than you think. Every small step forward counts.',
  'Healing is not linear. Be gentle with yourself on the difficult days.',
  'You are not alone in this. Thousands of mothers walk this path with you.',
];
const todayAffirmation = affirmations[new Date().getDay() % affirmations.length];

interface CardProps {
  to: string; tag: string; title: string; body: string; linkLabel: string;
  icon: React.ElementType; iconBgCls: string; iconColorCls: string; accentCls: string;
}

const FeatureCard = ({ to, icon: Icon, iconBgCls, iconColorCls, accentCls, tag, title, body, linkLabel }: CardProps) => (
  <div className="bg-cream p-6 lg:p-9 flex flex-col">
    <span className={`font-jost text-[9px] tracking-[0.2em] uppercase font-medium mb-3.5 opacity-80 ${accentCls}`}>{tag}</span>
    <div className={`w-[42px] h-[42px] ${iconBgCls} rounded-sm flex items-center justify-center mb-4 shrink-0`}>
      <Icon size={19} className={iconColorCls} />
    </div>
    <h3 className="font-serif font-bold text-charcoal leading-[1.3] mb-2 text-[clamp(15px,2vw,19px)]">{title}</h3>
    <p className="font-jost text-[13px] font-light text-ink-mid leading-[1.8] flex-1 mb-5">{body}</p>
    <Link to={to} className={`font-jost text-[11px] tracking-widest uppercase font-medium no-underline ${accentCls}`}>{linkLabel} →</Link>
  </div>
);

const Dashboard = () => {
  const { user } = useSelector((s: RootState) => s.auth) as any;

  const stats = [
    { v: '5,000+', l: 'Mothers supported' },
    { v: '12',     l: 'African countries'  },
    { v: '100%',   l: 'Anonymous & safe'   },
    { v: '24/7',   l: 'Community access'   },
  ];

  return (
    <div className="bg-ivory min-h-[calc(100vh-62px)]">

      {/* Hero */}
      <div className="bg-rose-deep px-6 lg:px-16 py-10 lg:py-16">
        <div className="max-w-[1100px] mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-7 bg-gold-light" />
            <span className="font-jost text-[10px] tracking-[0.2em] uppercase text-gold-light font-medium">Your sanctuary</span>
          </div>
          <h1 className="font-serif font-bold text-white leading-[1.15] mb-3 text-[clamp(28px,5vw,42px)]">
            Welcome back,<br /><em className="text-gold-light italic">{user?.nickname}</em>.
          </h1>
          <p className="font-cormorant italic text-white/72 leading-[1.6] text-[clamp(15px,2.5vw,20px)]">You are not alone. This is your safe space.</p>
        </div>
      </div>

      {/* Stats bar */}
      <div className="bg-cream border-b border-border-gold">
        <div className="max-w-[1100px] mx-auto flex flex-wrap">
          {stats.map((s, i, a) => (
            <div key={s.l} className={`flex-1 min-w-[120px] text-center py-5 px-2 ${i < a.length - 1 ? 'border-r border-border-gold' : ''}`}>
              <div className="font-serif font-bold text-rose-deep text-[clamp(20px,3vw,26px)]">{s.v}</div>
              <div className="font-jost text-[10px] tracking-widest uppercase text-ink-soft mt-1">{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1100px] mx-auto px-4 lg:px-16 py-12 lg:py-16">
        <div className="flex items-center gap-4 mb-7">
          <div className="h-px flex-1 bg-border-gold" />
          <span className="font-jost text-[10px] tracking-[0.2em] uppercase text-gold font-medium">Your tools</span>
          <div className="h-px flex-1 bg-border-gold" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-border-gold border border-border-gold">
          <FeatureCard to="/forums" icon={MessageCircle} iconBgCls="bg-rose-pale"  iconColorCls="text-rose-deep" accentCls="text-rose-deep" tag="Community"  title="Discussion forums"   body="Share anonymously, ask questions, and read stories from mothers who understand your journey."         linkLabel="Browse forums" />
          <FeatureCard to="/groups" icon={Users}         iconBgCls="bg-sage-light"  iconColorCls="text-sage"      accentCls="text-sage"      tag="Connection" title="Peer support groups" body="Join moderated small-group environments for intimate and continuous support from mothers like you."     linkLabel="Find a group"  />
          <FeatureCard to="/chat"   icon={MessageSquare} iconBgCls="bg-gold-pale"   iconColorCls="text-gold"      accentCls="text-gold"      tag="Chat"       title="Live chat rooms"    body="Talk in real time with your support group or open a private conversation with a trained specialist." linkLabel="Open chat"     />
          <FeatureCard to="/forums" icon={BookOpen}      iconBgCls="bg-ivory-dark"  iconColorCls="text-ink-mid"   accentCls="text-ink-mid"   tag="Education"  title="Resources & guides" body="Curated articles on postpartum depression, self-care, and maternal wellness in simple language."      linkLabel="Read articles" />
        </div>

        {/* Affirmation */}
        <div className="mt-10 bg-cream border border-border-gold rounded-sm px-8 lg:px-10 py-10 lg:py-12 text-center">
          <div className="flex items-center gap-3 justify-center mb-4">
            <div className="h-px w-7 bg-gold-light" />
            <span className="font-jost text-[9px] tracking-[0.22em] uppercase text-gold font-medium">Today's affirmation</span>
            <div className="h-px w-7 bg-gold-light" />
          </div>
          <p className="font-cormorant italic text-rose-deep leading-[1.75] max-w-[560px] mx-auto text-[clamp(16px,2.5vw,22px)]">"{todayAffirmation}"</p>
        </div>

        {/* Safety note */}
        <div className="mt-4 p-3.5 border border-border-gold rounded-sm bg-gold-pale flex items-start gap-2.5">
          <ShieldCheck size={15} className="text-gold shrink-0 mt-0.5" />
          <p className="font-jost text-xs text-gold leading-[1.65]">All conversations are monitored by trained volunteer moderators to ensure a safe, respectful environment.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
