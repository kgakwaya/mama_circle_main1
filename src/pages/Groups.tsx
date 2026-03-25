import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGroups, joinGroup } from '../store/slices/groupsSlice';
import type { RootState, AppDispatch } from '../store';
import { Users, UserPlus, ShieldCheck } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const Groups = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { groupsList, loading } = useSelector((s: RootState) => s.groups);
  const { user } = useSelector((s: RootState) => s.auth) as any;

  useEffect(() => { dispatch(fetchGroups()); }, [dispatch]);

  const handleJoin = async (groupId: string) => {
    try {
      await dispatch(joinGroup(groupId)).unwrap();
      toast.success('You have joined the support group.');
      dispatch(fetchGroups());
    } catch (err: any) { toast.error(err || 'Failed to join'); }
  };

  const pct = (g: any) => Math.round(((g.member_count ?? g.members?.length ?? 0) / (g.max_size ?? g.maxSize ?? 50)) * 100);

  return (
    <div className="bg-ivory min-h-[calc(100vh-62px)]">
      <Toaster position="top-center" toastOptions={{ style: { fontFamily: 'Jost, sans-serif', fontSize: '13px' } }} />

      {/* Header */}
      <div className="bg-cream border-b border-border-gold px-4 py-8 lg:py-10">
        <div className="max-w-[960px] mx-auto px-0 lg:px-4">
          <div className="flex items-center gap-2.5 mb-2.5">
            <div className="h-px w-6 bg-gold-light" />
            <span className="font-jost text-[10px] tracking-[0.2em] uppercase text-gold font-medium">Connection</span>
          </div>
          <h1 className="font-serif font-bold text-charcoal leading-[1.2] mb-1.5 text-[clamp(24px,4vw,36px)]">
            Peer Support <em className="text-rose-deep italic">Groups</em>
          </h1>
          <p className="font-jost text-[13px] text-ink-soft leading-relaxed max-w-[540px]">
            Join moderated circles of mothers who share your circumstances. Each group is monitored for safety and compassion.
          </p>
        </div>
      </div>

      <div className="max-w-[960px] mx-auto px-4 py-10 lg:py-12">

        {/* Moderation note */}
        <div className="flex items-start gap-2.5 mb-7 p-3.5 bg-gold-pale border border-border-gold rounded-sm">
          <ShieldCheck size={14} className="text-gold shrink-0 mt-0.5" />
          <p className="font-jost text-xs text-gold leading-[1.65]">
            All groups are moderated by trained volunteer counsellors. Group size is limited to ensure every voice is heard.
          </p>
        </div>

        {/* Label */}
        <div className="flex items-center gap-4 mb-5">
          <div className="h-px flex-1 bg-border-gold" />
          <span className="font-jost text-[10px] tracking-[0.18em] uppercase text-gold font-medium">Available groups</span>
          <div className="h-px flex-1 bg-border-gold" />
        </div>

        {loading ? (
          <div className="text-center py-16 font-jost text-[13px] text-ink-soft">Loading groups…</div>
        ) : groupsList.length === 0 ? (
          <div className="bg-cream border border-border-gold rounded-sm text-center p-12 mb-10">
            <p className="font-cormorant italic text-[18px] text-ink-mid">No support groups available at the moment. Please check back soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border-gold border border-border-gold rounded-sm overflow-hidden mb-10">
            {groupsList.map((group: any) => {
              const memberCount = group.member_count ?? group.members?.length ?? 0;
              const maxSize     = group.max_size ?? group.maxSize ?? 50;
              const joined      = group.is_member ?? group.members?.some((m: any) => m._id === user?._id || m === user?._id);
              const p           = pct(group);
              const barColor    = p >= 90 ? 'bg-rose-deep' : p >= 60 ? 'bg-gold' : 'bg-sage';

              return (
                <div key={group.id ?? group._id} className="bg-cream hover:bg-ivory transition-colors p-7 lg:p-8 flex flex-col">
                  <div className="flex justify-between items-start mb-3 gap-2">
                    <div className={`w-[38px] h-[38px] ${joined ? 'bg-sage-light' : 'bg-rose-pale'} rounded-sm flex items-center justify-center shrink-0`}>
                      <Users size={17} className={joined ? 'text-sage' : 'text-rose-deep'} />
                    </div>
                    <span className={`font-jost text-[9px] tracking-widest uppercase px-2.5 py-0.5 rounded-sm font-medium ${joined ? 'bg-sage-light text-sage' : 'bg-ivory-dark text-ink-soft border border-border-gold'}`}>
                      {joined ? 'Member' : `${memberCount} / ${maxSize}`}
                    </span>
                  </div>

                  <span className={`font-jost text-[9px] tracking-[0.18em] uppercase font-medium mb-2 ${joined ? 'text-sage' : 'text-rose-mid'}`}>Support group</span>
                  <h2 className="font-serif font-bold text-charcoal leading-[1.25] mb-2 text-[clamp(15px,2.5vw,19px)]">{group.name}</h2>
                  <p className="font-jost text-[13px] text-ink-mid leading-[1.8] flex-1 mb-5">{group.description}</p>

                  {/* Capacity bar */}
                  <div className="mb-4">
                    <div className="flex justify-between mb-1">
                      <span className="font-jost text-[10px] text-ink-soft">Capacity</span>
                      <span className="font-jost text-[10px] text-ink-soft">{p}% full</span>
                    </div>
                    <div className="h-[3px] bg-ivory-dark rounded-sm">
                      <div className={`h-full ${barColor} rounded-sm transition-all duration-300`} style={{ width: `${p}%` }} />
                    </div>
                  </div>

                  <div className="border-t border-border-gold pt-3.5 flex justify-between items-center gap-2">
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck size={12} className="text-sage" />
                      <span className="font-jost text-[10px] text-ink-soft tracking-[0.06em]">Moderated</span>
                    </div>
                    {joined ? (
                      <span className="font-jost text-[10px] tracking-widest uppercase px-3.5 py-1.5 rounded-sm bg-sage-light text-sage font-medium">Joined</span>
                    ) : (
                      <button onClick={() => handleJoin(group.id ?? group._id)}
                        className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-sm bg-rose-deep text-white border-none cursor-pointer font-jost text-[10px] tracking-widest uppercase font-medium hover:opacity-85 transition-opacity">
                        <UserPlus size={11} /> Join
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Groups;
