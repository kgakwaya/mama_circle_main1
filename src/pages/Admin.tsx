import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import toast, { Toaster } from 'react-hot-toast';
import { Users, MessageCircle, BarChart2, ShieldAlert, Activity, UserPlus, ToggleLeft, ToggleRight, Trash2 } from 'lucide-react';

const fmt = (iso: string) =>
  new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

const roleCls = (role: string) =>
  role === 'psychologist' ? 'bg-sage-light text-sage' :
  role === 'admin'        ? 'bg-gold-pale text-gold'  :
                            'bg-rose-pale text-rose-deep';

const Stat = ({ icon: Icon, value, label, colorCls }: { icon: any; value: any; label: string; colorCls: string }) => (
  <div className="bg-cream border border-border-gold rounded-sm p-6 lg:p-7 flex gap-4 items-center">
    <div className={`w-11 h-11 rounded-sm flex items-center justify-center shrink-0 ${colorCls} bg-opacity-10`}>
      <Icon size={20} className={colorCls} />
    </div>
    <div>
      <div className="font-serif text-[28px] font-bold text-charcoal leading-none">{value}</div>
      <div className="font-jost text-[11px] tracking-widest uppercase text-ink-soft mt-1">{label}</div>
    </div>
  </div>
);

const TABS = [
  ['overview', 'Overview',      BarChart2  ],
  ['users',    'Users',         Users      ],
  ['create',   'Add Specialist',UserPlus   ],
  ['flagged',  'Flagged Posts', ShieldAlert],
  ['activity', 'Activity',      Activity   ],
] as const;

const Admin = () => {
  const navigate = useNavigate();
  const { user } = useSelector((s: RootState) => s.auth) as any;

  const [tab,      setTab]      = useState<typeof TABS[number][0]>('overview');
  const [stats,    setStats]    = useState<any>(null);
  const [users,    setUsers]    = useState<any[]>([]);
  const [flagged,  setFlagged]  = useState<any[]>([]);
  const [activity, setActivity] = useState<any[]>([]);
  const [newNick,  setNewNick]  = useState('');
  const [newPass,  setNewPass]  = useState('');
  const [loading,  setLoading]  = useState(false);

  useEffect(() => { if (user && user.role !== 'admin') navigate('/dashboard'); }, [user, navigate]);

  const loadStats    = () => api.get('/admin/stats').then(r => setStats(r.data));
  const loadUsers    = () => api.get('/admin/users').then(r => setUsers(r.data));
  const loadFlagged  = () => api.get('/admin/flagged-posts').then(r => setFlagged(r.data));
  const loadActivity = () => api.get('/admin/activity').then(r => setActivity(r.data));

  useEffect(() => { loadStats(); }, []);
  useEffect(() => {
    if (tab === 'users')    loadUsers();
    if (tab === 'flagged')  loadFlagged();
    if (tab === 'activity') loadActivity();
  }, [tab]);

  const createPsych = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    try {
      await api.post('/admin/psychologists', { nickname: newNick, password: newPass });
      toast.success(`Specialist "${newNick}" created`);
      setNewNick(''); setNewPass(''); loadUsers();
    } catch (err: any) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setLoading(false); }
  };

  const toggleUser = async (id: string) => {
    try {
      const { data } = await api.patch(`/admin/users/${id}/toggle`);
      setUsers(u => u.map((x: any) => x.id === id ? { ...x, is_active: data.is_active } : x));
      toast.success(data.is_active ? 'Account enabled' : 'Account disabled');
    } catch { toast.error('Failed'); }
  };

  const deleteUser = async (id: string, nick: string) => {
    if (!confirm(`Delete "${nick}"? This cannot be undone.`)) return;
    try { await api.delete(`/admin/users/${id}`); setUsers(u => u.filter((x: any) => x.id !== id)); toast.success('Deleted'); }
    catch { toast.error('Failed'); }
  };

  const moderatePost = async (id: string, status: string) => {
    try { await api.put(`/posts/${id}/moderate`, { status }); setFlagged(f => f.filter((p: any) => p.id !== id)); toast.success(`Post ${status}`); }
    catch { toast.error('Failed'); }
  };

  const totalUsers  = stats?.users?.reduce((s: number, r: any) => s + parseInt(r.count), 0) ?? '—';
  const mothers     = stats?.users?.find((r: any) => r.role === 'mother')?.count ?? 0;
  const psychs      = stats?.users?.find((r: any) => r.role === 'psychologist')?.count ?? 0;
  const activePosts = stats?.posts?.find((r: any) => r.status === 'active')?.count ?? 0;
  const flaggedCnt  = stats?.posts?.find((r: any) => r.status === 'flagged')?.count ?? 0;

  const inputCls = 'w-full px-3.5 py-3 text-[13px] border border-border-gold rounded-sm bg-ivory text-charcoal font-jost outline-none focus:border-rose-mid transition-colors';
  const labelCls = 'block font-jost text-[10px] tracking-[0.16em] uppercase text-ink-mid font-medium mb-1.5';

  return (
    <div className="bg-ivory min-h-[calc(100vh-62px)] font-jost">
      <Toaster position="top-center" toastOptions={{ style: { fontFamily: 'Jost, sans-serif', fontSize: '13px' } }} />

      {/* Header */}
      <div className="bg-charcoal px-4 lg:px-16 pt-8 lg:pt-10 pb-0">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-px h-8 bg-gold shrink-0" />
          <div>
            <div className="font-serif text-[clamp(20px,3vw,28px)] font-bold text-white">
              Admin <em className="text-gold-light italic">Dashboard</em>
            </div>
            <div className="font-jost text-[11px] text-white/40 tracking-widest uppercase mt-1">Mama Circle · Management Console</div>
          </div>
        </div>

        <div className="flex gap-px overflow-x-auto">
          {TABS.map(([key, label, Icon]) => (
            <button key={key} onClick={() => setTab(key)}
              className={`flex items-center gap-2 px-4 lg:px-5 py-2.5 border-none cursor-pointer font-jost text-[11px] tracking-widest uppercase font-medium whitespace-nowrap border-b-2 transition-all ${
                tab === key
                  ? 'bg-cream text-rose-deep border-rose-deep'
                  : 'bg-transparent text-white/50 border-transparent hover:text-white/80'
              }`}>
              <Icon size={13} />
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 lg:px-16 py-10 lg:py-12 max-w-[1200px]">

        {/* OVERVIEW */}
        {tab === 'overview' && (
          <div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <Stat icon={Users}         value={totalUsers}              label="Total users"   colorCls="text-rose-deep" />
              <Stat icon={Users}         value={mothers}                 label="Mothers"       colorCls="text-rose-mid"  />
              <Stat icon={Users}         value={psychs}                  label="Specialists"   colorCls="text-sage"      />
              <Stat icon={MessageCircle} value={stats?.totalMessages??'—'} label="Messages"  colorCls="text-gold"      />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Stat icon={Activity}    value={activePosts} label="Active posts"  colorCls="text-gold"          />
              <Stat icon={ShieldAlert} value={flaggedCnt}  label="Flagged posts" colorCls="text-red-600"       />
            </div>
          </div>
        )}

        {/* USERS */}
        {tab === 'users' && (
          <div className="bg-cream border border-border-gold rounded-sm overflow-hidden overflow-x-auto">
            <table className="w-full border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-border-gold bg-ivory">
                  {['Nickname', 'Role', 'Status', 'Joined', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-left font-jost text-[10px] tracking-[0.16em] uppercase text-ink-mid font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((u: any) => (
                  <tr key={u.id} className="border-b border-border-gold hover:bg-ivory transition-colors">
                    <td className="px-4 py-3 font-jost text-[13px] text-charcoal font-medium">{u.nickname}</td>
                    <td className="px-4 py-3">
                      <span className={`font-jost text-[9px] tracking-widest uppercase font-medium px-2.5 py-0.5 rounded-sm ${roleCls(u.role)}`}>{u.role}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`font-jost text-[11px] font-medium ${u.is_active ? 'text-sage' : 'text-red-600'}`}>{u.is_active ? 'Active' : 'Disabled'}</span>
                    </td>
                    <td className="px-4 py-3 font-jost text-xs text-ink-soft">{fmt(u.created_at)}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button title={u.is_active ? 'Disable' : 'Enable'} onClick={() => toggleUser(u.id)} className="bg-transparent border-none cursor-pointer p-1">
                          {u.is_active ? <ToggleRight size={18} className="text-sage" /> : <ToggleLeft size={18} className="text-red-600" />}
                        </button>
                        {u.role !== 'admin' && (
                          <button title="Delete" onClick={() => deleteUser(u.id, u.nickname)} className="bg-transparent border-none cursor-pointer p-1">
                            <Trash2 size={15} className="text-red-600" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {users.length === 0 && <div className="text-center py-10 font-jost text-[13px] text-ink-soft">Loading users…</div>}
          </div>
        )}

        {/* CREATE */}
        {tab === 'create' && (
          <div className="max-w-[480px]">
            <div className="mb-7">
              <h2 className="font-serif text-[24px] font-bold text-charcoal mb-2">
                Create a <em className="text-rose-deep italic">Specialist Account</em>
              </h2>
              <p className="font-jost text-[13px] text-ink-soft leading-[1.7]">
                Psychologist accounts can moderate content, respond in group chat rooms, and have private conversations with mothers.
              </p>
            </div>
            <form onSubmit={createPsych} className="flex flex-col gap-4 bg-cream border border-border-gold rounded-sm p-8">
              <div>
                <label className={labelCls}>Nickname</label>
                <input type="text" required placeholder="e.g. Dr. Amara" className={inputCls} value={newNick} onChange={e => setNewNick(e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Password</label>
                <input type="password" required placeholder="Secure password" className={inputCls} value={newPass} onChange={e => setNewPass(e.target.value)} />
              </div>
              <button type="submit" disabled={loading}
                className={`py-3.5 font-jost text-[11px] tracking-widest uppercase font-medium text-white rounded-sm border-none transition-opacity ${loading ? 'bg-rose-light cursor-not-allowed opacity-65' : 'bg-rose-deep cursor-pointer hover:opacity-90'}`}>
                {loading ? 'Creating…' : 'Create Specialist Account'}
              </button>
            </form>
            <div className="mt-4 p-4 bg-gold-pale border border-border-gold rounded-sm">
              <p className="font-jost text-[11px] text-gold leading-[1.7]">Only admins can create psychologist accounts. Share the login credentials with the specialist securely.</p>
            </div>
          </div>
        )}

        {/* FLAGGED */}
        {tab === 'flagged' && (
          <div>
            {flagged.length === 0 && (
              <div className="text-center py-16 bg-cream border border-border-gold rounded-sm">
                <ShieldAlert size={32} className="text-border-gold mx-auto mb-3" />
                <p className="font-jost text-[13px] text-ink-soft">No flagged posts at the moment.</p>
              </div>
            )}
            <div className="flex flex-col gap-px bg-border-gold border border-border-gold rounded-sm overflow-hidden">
              {flagged.map((p: any) => (
                <div key={p.id} className="bg-cream p-5 lg:p-6">
                  <div className="flex justify-between items-start flex-wrap gap-2 mb-2">
                    <div>
                      <div className="font-serif text-[15px] font-bold text-charcoal mb-1">{p.title}</div>
                      <div className="font-jost text-[11px] text-ink-soft">by {p.author_nickname ?? 'Anonymous'} · {fmt(p.created_at)} · {p.reports} report{p.reports !== 1 ? 's' : ''}</div>
                    </div>
                    <span className={`font-jost text-[9px] tracking-widest uppercase px-2.5 py-0.5 rounded-sm font-medium border border-red-200 ${p.status === 'flagged' ? 'bg-red-50 text-red-700' : 'bg-red-100 text-red-800'}`}>{p.status}</span>
                  </div>
                  <p className="font-jost text-[13px] text-ink-mid leading-[1.7] mb-4">{p.content}</p>
                  <div className="flex gap-2.5">
                    <button onClick={() => moderatePost(p.id, 'active')} className="px-4 py-1.5 bg-sage-light text-sage border border-sage/20 rounded-sm cursor-pointer font-jost text-[10px] tracking-widest uppercase font-medium hover:opacity-85 transition-opacity">Approve</button>
                    <button onClick={() => moderatePost(p.id, 'removed')} className="px-4 py-1.5 bg-red-50 text-red-700 border border-red-200 rounded-sm cursor-pointer font-jost text-[10px] tracking-widest uppercase font-medium hover:opacity-85 transition-opacity">Remove</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ACTIVITY */}
        {tab === 'activity' && (
          <div className="bg-cream border border-border-gold rounded-sm overflow-hidden">
            <div className="px-5 py-3.5 border-b border-border-gold bg-ivory flex items-center gap-2">
              <Activity size={14} className="text-gold" />
              <span className="font-jost text-[11px] tracking-[0.14em] uppercase text-gold font-medium">Last 200 messages across all rooms</span>
            </div>
            <div className="max-h-[600px] overflow-y-auto">
              {activity.map((m: any) => (
                <div key={m.id} className="px-5 py-3 border-b border-border-gold flex gap-3.5 items-start hover:bg-ivory transition-colors">
                  <div className={`w-8 h-8 rounded-full ${roleCls(m.sender_role ?? 'mother')} flex items-center justify-center font-serif text-xs font-bold shrink-0`}>
                    {(m.sender_nickname ?? '?')[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap gap-2 items-baseline mb-1">
                      <span className="font-jost text-[13px] font-medium text-charcoal">{m.sender_nickname ?? 'Anonymous'}</span>
                      <span className={`font-jost text-[9px] tracking-[0.08em] uppercase font-medium px-1.5 py-0.5 rounded-sm ${roleCls(m.sender_role ?? 'mother')}`}>{m.sender_role ?? 'mother'}</span>
                      <span className="font-jost text-[10px] text-ink-soft">in {m.room_name ?? m.room_type}</span>
                      <span className="font-jost text-[10px] text-ink-soft ml-auto">{fmt(m.created_at)}</span>
                    </div>
                    <p className="font-jost text-[13px] text-ink-mid leading-relaxed truncate">{m.content}</p>
                  </div>
                </div>
              ))}
              {activity.length === 0 && <div className="text-center py-10 font-jost text-[13px] text-ink-soft">No activity yet.</div>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
