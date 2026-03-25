import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const LogoMark = ({ size = 30 }: { size?: number }) => (
  <div style={{ width: size, height: size }} className="rounded-full bg-rose-deep flex items-center justify-center shrink-0">
    <svg width={size * 0.47} height={size * 0.47} viewBox="0 0 18 18" fill="none">
      <circle cx="9" cy="9" r="7" stroke="rgba(255,255,255,.4)" strokeWidth="1" />
      <path d="M5.5 9.5C5.5 7.3 7.1 5.5 9 5.5s3.5 1.8 3.5 4-1.6 4-3.5 4" stroke="#fff" strokeWidth="1.3" strokeLinecap="round" />
      <circle cx="9" cy="9" r="2" fill="#fff" />
    </svg>
  </div>
);

const Eyebrow = ({ label, light = false }: { label: string; light?: boolean }) => (
  <div className="flex items-center gap-3.5 justify-center mb-4">
    <div className={`h-px w-9 shrink-0 ${light ? 'bg-gold-light' : 'bg-gold-light'}`} />
    <span className={`font-jost text-[10px] tracking-[0.22em] uppercase font-medium ${light ? 'text-gold-light' : 'text-gold'}`}>{label}</span>
    <div className={`h-px w-9 shrink-0 ${light ? 'bg-gold-light' : 'bg-gold-light'}`} />
  </div>
);

const EyebrowLeft = ({ label }: { label: string }) => (
  <div className="flex items-center gap-3 mb-4">
    <div className="h-px w-7 bg-gold-light shrink-0" />
    <span className="font-jost text-[10px] tracking-[0.2em] uppercase text-gold font-medium">{label}</span>
  </div>
);

const Landing = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const go = (path: string) => { navigate(path); setMenuOpen(false); };
  const scrollTo = (id: string) => { document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); setMenuOpen(false); };

  const navItems: [string, string][] = [['About', 'about'], ['How it works', 'how-it-works'], ['Community', 'community'], ['Resources', 'resources']];

  return (
    <div className="bg-ivory overflow-x-hidden">

      {/* NAV */}
      <nav className="sticky top-0 z-50 bg-cream border-b border-border-gold">
        <div className="h-0.5 bg-rose-deep" />
        <div className="max-w-[1140px] mx-auto px-4 lg:px-12 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <LogoMark size={30} />
            <span className="font-serif text-[19px] font-bold text-rose-deep">Mama <span className="text-gold">Circle</span></span>
          </div>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map(([l, id]) => (
              <button key={id} onClick={() => scrollTo(id)}
                className="bg-transparent border-none font-jost text-[11px] tracking-widest uppercase text-ink-soft cursor-pointer hover:text-rose-deep transition-colors">
                {l}
              </button>
            ))}
            <div className="w-px h-4 bg-border-gold" />
            <button onClick={() => go('/auth?mode=login')}
              className="border border-rose-light text-rose-deep bg-transparent px-[18px] py-[9px] rounded-sm font-jost text-[11px] tracking-widest uppercase font-medium cursor-pointer hover:bg-rose-pale transition-colors whitespace-nowrap">
              Sign in
            </button>
            <button onClick={() => go('/auth?mode=register')}
              className="bg-rose-deep text-white border-none px-[18px] py-[9px] rounded-sm font-jost text-[11px] tracking-widest uppercase font-medium cursor-pointer hover:opacity-90 transition-opacity whitespace-nowrap">
              Join free
            </button>
          </div>

          <button onClick={() => setMenuOpen(o => !o)} className="md:hidden bg-transparent border-none cursor-pointer p-1">
            {menuOpen ? <X size={20} className="text-ink-mid" /> : <Menu size={20} className="text-ink-mid" />}
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden bg-cream border-t border-border-gold px-5 py-3 flex flex-col gap-1">
            {navItems.map(([l, id]) => (
              <button key={id} onClick={() => scrollTo(id)}
                className="bg-transparent border-none text-left w-full px-3 py-2.5 font-jost text-xs tracking-widest uppercase text-ink-mid cursor-pointer hover:bg-rose-pale rounded-sm transition-colors">
                {l}
              </button>
            ))}
            <div className="h-px bg-border-gold my-2" />
            <div className="flex gap-2.5 py-1">
              <button onClick={() => go('/auth?mode=login')} className="flex-1 border border-rose-light text-rose-deep bg-transparent py-2.5 rounded-sm font-jost text-[11px] tracking-widest uppercase font-medium cursor-pointer">Sign in</button>
              <button onClick={() => go('/auth?mode=register')} className="flex-1 bg-rose-deep text-white border-none py-2.5 rounded-sm font-jost text-[11px] tracking-widest uppercase font-medium cursor-pointer">Join free</button>
            </div>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section className="grid grid-cols-1 md:grid-cols-2 min-h-[520px] md:min-h-[580px]">
        <div className="flex flex-col justify-center px-6 sm:px-10 lg:px-[120px] py-12 lg:py-24 border-b md:border-b-0 md:border-r border-border-gold">
          <EyebrowLeft label="Postpartum support · Africa" />
          <h1 className="font-serif font-bold text-charcoal leading-[1.08] mb-4 text-[clamp(36px,5vw,56px)]">
            You are not<br /><em className="text-rose-deep italic">alone</em> in this.
          </h1>
          <p className="font-cormorant italic text-ink-mid leading-[1.65] mb-9 max-w-[420px] text-[clamp(16px,2vw,21px)]">
            A dignified, confidential space where African mothers find understanding, community, and healing after childbirth.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <button onClick={() => go('/auth?mode=register')} className="bg-rose-deep text-white border-none px-8 py-3.5 rounded-sm font-jost text-[11px] tracking-widest uppercase font-medium cursor-pointer hover:opacity-90 transition-opacity">Begin your journey</button>
            <button onClick={() => go('/auth?mode=login')} className="border border-rose-light text-rose-deep bg-transparent px-7 py-3 rounded-sm font-jost text-[11px] tracking-widest uppercase font-medium cursor-pointer hover:bg-rose-pale transition-colors">Sign in</button>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <svg width="11" height="11" viewBox="0 0 14 14" fill="none" className="shrink-0">
              <path d="M7 1l1.8 3.6L13 5.4l-3 2.9.7 4L7 10.3l-3.7 2 .7-4L1 5.4l4.2-.8z" stroke="#A07840" strokeWidth="1.2" fill="none" />
            </svg>
            <span className="font-jost text-[11px] text-ink-soft tracking-[0.05em]">Anonymous · No real name required · Free forever</span>
          </div>
        </div>

        <div className="bg-rose-pale flex flex-col justify-center items-center py-12 lg:py-20 px-6 sm:px-10 lg:px-16 text-center">
          <span className="font-serif text-rose-light leading-[0.7] block mb-6 text-[clamp(60px,8vw,96px)]">"</span>
          <p className="font-cormorant italic text-rose-deep leading-[1.7] max-w-[340px] mb-6 text-[clamp(17px,2.2vw,24px)]">
            Every mother deserves a circle of warmth — especially in her most vulnerable hours.
          </p>
          <div className="flex items-center gap-3 mb-9">
            <div className="h-px w-7 bg-rose-light" />
            <span className="font-jost text-[10px] tracking-[0.16em] uppercase text-rose-mid">Founding principle</span>
          </div>
          <button onClick={() => go('/auth?mode=register')} className="bg-rose-deep text-white border-none px-10 py-3.5 rounded-sm font-jost text-[11px] tracking-widest uppercase font-medium cursor-pointer hover:opacity-90 transition-opacity">Join the circle</button>
          <p className="font-jost text-[10px] text-rose-mid tracking-widest uppercase mt-3">Free · Anonymous · Safe</p>
        </div>
      </section>

      {/* STATS BAR */}
      <div className="bg-cream border-t border-b border-border-gold">
        <div className="max-w-[1140px] mx-auto flex flex-wrap">
          {[{ v: '5,000+', l: 'Mothers supported' }, { v: '12', l: 'African countries' }, { v: '100%', l: 'Anonymous & safe' }, { v: '24/7', l: 'Community access' }].map((s, i, a) => (
            <div key={s.l} className={`flex-1 min-w-[140px] text-center py-6 px-2 ${i < a.length - 1 ? 'border-r border-border-gold' : ''}`}>
              <div className="font-serif font-bold text-rose-deep text-[clamp(22px,3vw,30px)]">{s.v}</div>
              <div className="font-jost text-[10px] tracking-widest uppercase text-ink-soft mt-1">{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ABOUT */}
      <section id="about" className="bg-cream border-b border-border-gold py-16 lg:py-24 px-6 lg:px-[120px]">
        <div className="max-w-[1140px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-20 items-center">
          <div>
            <div className="inline-flex items-center gap-2.5 bg-gold-pale border border-border-gold rounded-sm px-4 py-1.5 mb-6">
              <div className="w-[5px] h-[5px] rounded-full bg-gold" />
              <span className="font-jost text-[10px] tracking-[0.18em] uppercase text-gold font-medium">Our mission</span>
            </div>
            <h2 className="font-serif font-bold text-charcoal leading-[1.2] mb-5 text-[clamp(24px,3.5vw,36px)]">Breaking the silence around maternal mental health</h2>
            <p className="font-jost text-sm font-light text-ink-mid leading-[1.85] mb-3.5">Postpartum depression affects 1 in 5 new mothers across Africa, yet cultural stigma, limited professional resources, and geographical barriers keep most women from ever seeking help.</p>
            <p className="font-jost text-sm font-light text-ink-mid leading-[1.85]">Mama Circle was built specifically for the African context — low-bandwidth, mobile-first, anonymous by design, and deeply sensitive to the cultural realities our mothers live within.</p>
          </div>
          <div className="bg-ivory border border-border-gold rounded-sm px-8 lg:px-10 py-6 lg:py-10">
            {[
              { n: '01', t: 'Safe & anonymous', b: 'Your real identity is never revealed. Share freely, connect genuinely, heal privately.' },
              { n: '02', t: 'Culturally grounded', b: 'Built for African mothers, with the language, context, and sensitivity the experience deserves.' },
              { n: '03', t: 'Expert moderated', b: 'Trained volunteer moderators keep every conversation safe, respectful, and supportive.' },
            ].map((p, i) => (
              <div key={p.n}>
                <div className="flex gap-5 items-start py-5">
                  <span className="font-serif text-[32px] font-bold text-ivory-dark leading-none min-w-[40px] shrink-0" style={{ WebkitTextStroke: '1px #D4889A' }}>{p.n}</span>
                  <div>
                    <div className="font-serif text-[15px] font-semibold text-rose-deep mb-1.5">{p.t}</div>
                    <div className="font-jost text-[13px] font-light text-ink-mid leading-[1.7]">{p.b}</div>
                  </div>
                </div>
                {i < 2 && <div className="h-px bg-border-gold" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="community" className="bg-ivory border-b border-border-gold py-16 lg:py-24 px-6 lg:px-[120px]">
        <div className="max-w-[1140px] mx-auto">
          <div className="text-center mb-12">
            <Eyebrow label="Platform features" />
            <h2 className="font-serif font-bold text-charcoal mb-3 text-[clamp(24px,3.5vw,38px)]">Everything a new mother needs</h2>
            <p className="font-cormorant italic text-ink-mid leading-[1.6] text-[clamp(15px,2vw,18px)]">Thoughtfully designed tools for sharing, learning, and healing.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border-gold border border-border-gold">
            {[
              { tag: 'Community', title: 'Discussion forums',    body: 'Open, topic-based spaces where mothers share experiences, ask questions, and find women who truly understand their journey.' },
              { tag: 'Connection',title: 'Peer support groups',  body: 'Small, moderated circles of mothers with shared circumstances — rural communities, first-time mothers, and recovery journeys.' },
              { tag: 'Education', title: 'Resource library',     body: 'Curated articles and tools on postpartum depression, self-care, and maternal wellness — in clear, simple language.' },
              { tag: 'Wellness',  title: 'Daily mood check-in',  body: 'A gentle daily ritual to log how you are feeling, helping you track your emotional wellbeing and notice patterns.' },
              { tag: 'Identity',  title: 'Anonymous profiles',   body: 'Participate fully using only a chosen nickname. Your personal identity remains entirely yours — private and protected.' },
              { tag: 'Safety',    title: 'Content moderation',   body: 'Trained volunteer moderators review content around the clock, ensuring every conversation remains safe and constructive.' },
            ].map(f => (
              <div key={f.title} className="bg-cream p-8 lg:p-10">
                <span className="font-jost text-[9px] tracking-[0.2em] uppercase text-rose-light font-medium block mb-3">{f.tag}</span>
                <h3 className="font-serif font-bold text-charcoal mb-2.5 leading-[1.3] text-[clamp(15px,2vw,18px)]">{f.title}</h3>
                <p className="font-jost text-[13px] font-light text-ink-mid leading-[1.8]">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="bg-cream border-b border-border-gold py-16 lg:py-24 px-6 lg:px-[120px]">
        <div className="max-w-[1140px] mx-auto">
          <div className="text-center mb-12">
            <Eyebrow label="Your path forward" />
            <h2 className="font-serif font-bold text-charcoal mb-3 text-[clamp(24px,3.5vw,38px)]">How Mama Circle works</h2>
            <p className="font-cormorant italic text-ink-mid leading-[1.6] text-[clamp(15px,2vw,18px)]">Four gentle steps to finding the support every mother deserves.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-border-gold border border-border-gold">
            {[
              { n: '01', t: 'Create your account', b: 'Register using only a nickname. No real name, no phone number, no identification required.' },
              { n: '02', t: 'Choose your circle',  b: 'Browse moderated peer groups that reflect your specific situation and needs.' },
              { n: '03', t: 'Share and listen',    b: 'Post in discussion forums, respond to others, access resources, and log your mood.' },
              { n: '04', t: 'Heal together',        b: 'Through connection and peer support, begin your journey from isolation to belonging.' },
            ].map(s => (
              <div key={s.n} className="bg-cream p-8 lg:p-10">
                <span className="font-serif font-bold text-ivory-dark leading-none block mb-4 text-[clamp(40px,5vw,56px)]">{s.n}</span>
                <div className="w-[22px] h-0.5 bg-rose-deep mb-4" />
                <div className="font-serif font-bold text-charcoal mb-2 text-[clamp(14px,1.8vw,16px)]">{s.t}</div>
                <p className="font-jost text-[13px] font-light text-ink-mid leading-[1.75]">{s.b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-rose-deep py-16 lg:py-24 px-6 lg:px-[120px]">
        <div className="max-w-[1140px] mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center gap-3.5 justify-center mb-4">
              <div className="h-px w-8 bg-gold-light" />
              <span className="font-jost text-[10px] tracking-[0.22em] uppercase text-gold-light font-medium">Voices from our circle</span>
              <div className="h-px w-8 bg-gold-light" />
            </div>
            <h2 className="font-serif font-bold text-white mb-2 text-[clamp(24px,3.5vw,38px)]">Words from our mothers</h2>
            <p className="font-cormorant italic text-white/65 leading-[1.6] text-[clamp(15px,2vw,18px)]">Real stories from women who found their footing through Mama Circle.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { q: "I thought something was wrong with me. Reading others' stories here made me realise I was not broken — I was just a mother who needed support.", loc: 'Nairobi, Kenya' },
              { q: 'My village has no counsellor, no clinic nearby. This platform gave me what I could not find anywhere close to home. It saved me in my darkest weeks.', loc: 'Rural Ghana' },
              { q: 'The peer group gave me courage to speak to my husband. Within one month, our home felt different. I am so grateful I found this safe space.', loc: 'Kigali, Rwanda' },
            ].map((t, i) => (
              <div key={i} className="bg-white/[0.08] border border-white/[0.14] rounded-sm p-8 lg:p-9">
                <p className="font-cormorant italic text-white/90 leading-[1.75] mb-6 text-[clamp(15px,2vw,17px)]">"{t.q}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-rose-mid flex items-center justify-center font-serif text-xs font-bold text-white shrink-0">A</div>
                  <div>
                    <div className="font-jost text-xs font-medium text-white">Anonymous Mother</div>
                    <div className="font-jost text-[11px] text-white/45 mt-0.5">{t.loc}</div>
                  </div>
                  <span className="ml-auto font-jost text-[9px] tracking-[0.08em] px-2 py-0.5 border border-white/[0.18] text-white/40 rounded-sm shrink-0">Anon</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RESOURCES */}
      <section id="resources" className="bg-ivory border-b border-border-gold py-16 lg:py-24 px-6 lg:px-[120px]">
        <div className="max-w-[1140px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-20 items-center">
          <div>
            <EyebrowLeft label="Education" />
            <h2 className="font-serif font-bold text-charcoal leading-[1.2] mb-4 text-[clamp(24px,3.5vw,36px)]">
              Learn. Understand. <em className="text-rose-deep italic">Heal.</em>
            </h2>
            <p className="font-jost text-sm font-light text-ink-mid leading-[1.85] mb-7">Our resource library provides plain-language articles and tools — written specifically for African mothers navigating postpartum depression.</p>
            <button onClick={() => go('/auth?mode=register')} className="bg-rose-deep text-white border-none px-8 py-3.5 rounded-sm font-jost text-[11px] tracking-widest uppercase font-medium cursor-pointer hover:opacity-90 transition-opacity">Access the library</button>
          </div>
          <div className="flex flex-col gap-px bg-border-gold border border-border-gold">
            {[
              { tag: 'What is PPD', title: 'Understanding Postpartum Depression', desc: "Signs, symptoms, and why PPD is not your fault — a beginner's guide in simple language." },
              { tag: 'Self-care',   title: 'Simple Ways to Cope Each Day',        desc: 'Small practices that support your mental wellbeing even with a newborn at home.' },
              { tag: 'Family',      title: 'How to Talk to Your Partner',          desc: 'Guides for starting the conversation about how you are really feeling.' },
            ].map(r => (
              <div key={r.title} className="bg-cream p-5 lg:p-6 flex gap-4 items-start">
                <span className="font-jost text-[8px] tracking-widest uppercase px-2 py-0.5 rounded-sm bg-rose-pale text-rose-deep border border-border-rose font-medium shrink-0 mt-0.5 whitespace-nowrap">{r.tag}</span>
                <div>
                  <div className="font-serif font-bold text-charcoal mb-1 text-[clamp(13px,1.8vw,14px)]">{r.title}</div>
                  <div className="font-jost text-xs font-light text-ink-soft leading-[1.6]">{r.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-ivory border-b border-border-gold py-16 lg:py-24 px-6 lg:px-[120px] text-center">
        <div className="bg-cream border border-border-gold rounded-sm px-6 sm:px-12 lg:px-20 py-10 lg:py-20 max-w-[720px] mx-auto">
          <Eyebrow label="Join the circle" />
          <h2 className="font-serif font-bold text-charcoal leading-[1.2] mb-4 text-[clamp(26px,4vw,42px)]">
            Begin your path to <em className="text-rose-deep italic">healing today</em>
          </h2>
          <p className="font-cormorant italic text-ink-mid leading-[1.65] mb-8 text-[clamp(15px,2vw,18px)]">Join thousands of African mothers who chose not to suffer in silence.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => go('/auth?mode=register')} className="bg-rose-deep text-white border-none px-8 py-3.5 rounded-sm font-jost text-[11px] tracking-widest uppercase font-medium cursor-pointer hover:opacity-90 transition-opacity">Create free account</button>
            <button onClick={() => go('/auth?mode=login')} className="border border-rose-light text-rose-deep bg-transparent px-7 py-3 rounded-sm font-jost text-[11px] tracking-widest uppercase font-medium cursor-pointer hover:bg-rose-pale transition-colors">Sign in</button>
          </div>
          <p className="font-jost text-[10px] tracking-widest uppercase text-ink-soft mt-5">Anonymous by design · No cost, ever · Available 24/7</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-charcoal px-6 lg:px-[120px] pt-10 lg:pt-16 pb-6 lg:pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr] gap-8 lg:gap-14 mb-10 lg:mb-12 pb-10 lg:pb-11 border-b border-white/[0.08]">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <LogoMark size={26} />
              <span className="font-serif text-[17px] font-bold text-white">Mama <span className="text-gold-light">Circle</span></span>
            </div>
            <p className="font-jost text-[13px] font-light text-white/38 leading-[1.8]">A digital sanctuary for African mothers navigating postpartum depression — with dignity, anonymity, and community at every step.</p>
          </div>
          {[
            { title: 'Platform',     links: ['Discussion forums', 'Peer support groups', 'Resource library', 'Mood tracker'] },
            { title: 'Organisation', links: ['Our mission', 'The team', 'Become a moderator', 'Partner with us'] },
            { title: 'Support',      links: ['Help centre', 'Privacy policy', 'Terms of use', 'Contact us'] },
          ].map(col => (
            <div key={col.title}>
              <div className="font-jost text-[10px] tracking-[0.2em] uppercase text-gold-light font-medium mb-4">{col.title}</div>
              <ul className="list-none flex flex-col gap-2.5">
                {col.links.map(l => (
                  <li key={l}><a href="#" className="font-jost text-[13px] font-light text-white/40 no-underline hover:text-white/60 transition-colors">{l}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap justify-between items-center gap-3">
          <span className="font-jost text-[11px] text-white/22">© 2026 Mama Circle · Student Project · Gakwaya Ineza Ketia</span>
          <div className="flex gap-2 flex-wrap">
            {['Anonymous', 'Encrypted', 'Free forever'].map(b => (
              <span key={b} className="font-jost text-[9px] tracking-widest px-3 py-1 border border-white/[0.1] text-white/25 rounded-sm uppercase">{b}</span>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
