import { useEffect, useRef, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { fetchRooms, fetchMessages, fetchPsychologists, openDirectRoom, setActiveRoom } from '../store/slices/chatSlice';
import { useWebSocket } from '../hooks/useWebSocket';
import { MessageCircle, Users, Search, Send, Lock, Phone } from 'lucide-react';

const fmt = (iso: string) => {
  const d = new Date(iso), now = new Date();
  if (d.toDateString() === now.toDateString()) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return d.toLocaleDateString([], { day: 'numeric', month: 'short' });
};
const initial = (n: string) => n?.[0]?.toUpperCase() ?? '?';
const roleStyle = (r: string) =>
  r === 'psychologist' ? 'bg-sage-light text-sage' :
  r === 'admin'        ? 'bg-gold-pale text-gold'  :
                         'bg-rose-pale text-rose-deep';

const Chat = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, token }                              = useSelector((s: RootState) => s.auth) as any;
  const { rooms, messages, psychologists, activeRoomId } = useSelector((s: RootState) => s.chat);

  const [input, setInput]             = useState('');
  const [isAnon, setIsAnon]           = useState(false);
  const [search, setSearch]           = useState('');
  const [tab, setTab]                 = useState<'rooms' | 'psychologists'>('rooms');
  const [typingUsers, setTypingUsers] = useState<Record<string, string>>({});
  const bottomRef = useRef<HTMLDivElement>(null);
  const { send, on } = useWebSocket(token);

  useEffect(() => { dispatch(fetchRooms()); dispatch(fetchPsychologists()); }, [dispatch]);
  useEffect(() => {
    if (activeRoomId) { send({ type: 'join_room', roomId: activeRoomId }); dispatch(fetchMessages(activeRoomId)); }
  }, [activeRoomId, send, dispatch]);
  useEffect(() => on('typing', (d: any) => {
    if (d.roomId !== activeRoomId) return;
    setTypingUsers(p => ({ ...p, [d.userId]: d.nickname }));
    setTimeout(() => setTypingUsers(p => { const n = { ...p }; delete n[d.userId]; return n; }), 2500);
  }), [on, activeRoomId]);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, activeRoomId]);

  const activeMessages = activeRoomId ? (messages[activeRoomId] ?? []) : [];
  const activeRoom     = rooms.find((r: any) => r.id === activeRoomId) as any;

  const handleSend = useCallback(() => {
    if (!input.trim() || !activeRoomId) return;
    send({ type: 'message', roomId: activeRoomId, content: input.trim(), isAnonymous: isAnon });
    setInput('');
  }, [input, activeRoomId, isAnon, send]);

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
    else if (activeRoomId) send({ type: 'typing', roomId: activeRoomId });
  };

  const selectRoom = (id: string) => dispatch(setActiveRoom(id));

  const openDirect = async (uid: string) => {
    const r = await dispatch(openDirectRoom(uid));
    if (r.payload) { dispatch(fetchRooms()); dispatch(setActiveRoom(r.payload as string)); send({ type: 'join_room', roomId: r.payload }); }
  };

  const filteredRooms  = rooms.filter((r: any) => (r.name ?? r.type)?.toLowerCase().includes(search.toLowerCase()));
  const filteredPsychs = psychologists.filter((p: any) => p.nickname.toLowerCase().includes(search.toLowerCase()));
  const typingList     = Object.values(typingUsers).filter(n => n !== user?.nickname);

  const rName    = (r: any) => r?.name ?? (r?.type === 'direct' ? 'Private conversation' : 'General Circle');
  const rTypeLbl = (r: any) => r?.type === 'direct' ? 'End-to-end private' : r?.type === 'general' ? 'Community channel' : 'Support group';
  const rBg      = (type: string) => type === 'direct' ? 'bg-sage-light' : type === 'general' ? 'bg-rose-pale' : 'bg-gold-pale';
  const rIcon    = (type: string, sz = 15) =>
    type === 'direct'  ? <Phone size={sz} className="text-sage" />         :
    type === 'general' ? <MessageCircle size={sz} className="text-rose-deep" /> :
                         <Users size={sz} className="text-gold" />;

  return (
    <div className="flex h-[calc(100vh-62px)] bg-ivory overflow-hidden font-jost">

      {/* SIDEBAR */}
      <div className="w-[290px] shrink-0 bg-cream border-r border-border-gold flex flex-col hidden md:flex">
        <div className="px-4 pt-4 pb-0 border-b border-border-gold">
          <div className="flex items-center gap-2 mb-3">
            <MessageCircle size={15} className="text-rose-deep" />
            <span className="font-serif text-[16px] font-bold text-charcoal">Messages</span>
          </div>
          <div className="flex gap-px mb-2.5">
            {(['rooms', 'psychologists'] as const).map(k => (
              <button key={k} onClick={() => setTab(k)}
                className={`flex-1 py-[7px] border-none rounded-sm font-jost text-[10px] tracking-widest uppercase font-medium cursor-pointer transition-colors ${
                  tab === k ? 'bg-rose-deep text-white' : 'bg-transparent text-ink-soft hover:bg-rose-pale'
                }`}>
                {k === 'rooms' ? 'My Rooms' : 'Specialists'}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 bg-ivory border border-border-gold rounded-sm px-2.5 py-2 mb-2.5">
            <Search size={12} className="text-ink-soft" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search…"
              className="border-none outline-none bg-transparent text-xs text-charcoal flex-1 font-jost" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {tab === 'rooms' && filteredRooms.map((room: any) => (
            <div key={room.id} onClick={() => selectRoom(room.id)}
              className={`flex items-center gap-2.5 px-4 py-2.5 cursor-pointer border-l-[3px] transition-colors ${
                room.id === activeRoomId ? 'bg-rose-pale border-rose-deep' : 'bg-transparent border-transparent hover:bg-ivory'
              }`}>
              <div className={`w-[34px] h-[34px] rounded-full ${rBg(room.type)} flex items-center justify-center shrink-0`}>
                {rIcon(room.type, 14)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline gap-1">
                  <span className="font-jost text-xs font-medium text-charcoal truncate max-w-[130px]">
                    {room.name ?? (room.type === 'direct' ? 'Private' : 'General Circle')}
                  </span>
                  {room.last_message_at && <span className="font-jost text-[10px] text-ink-soft shrink-0">{fmt(room.last_message_at)}</span>}
                </div>
                {room.last_message && <div className="font-jost text-[11px] text-ink-soft truncate mt-0.5">{room.last_message}</div>}
              </div>
            </div>
          ))}

          {tab === 'psychologists' && (
            <div className="p-3.5">
              <p className="font-jost text-[11px] text-ink-soft mb-3 leading-relaxed">Our trained specialists are here to support you. Start a private conversation.</p>
              {filteredPsychs.length === 0 && <p className="font-jost text-xs text-ink-soft text-center py-4">No specialists available</p>}
              {filteredPsychs.map((p: any) => (
                <div key={p.id} className="flex items-center gap-2.5 py-2.5 border-b border-border-gold">
                  <div className="w-[34px] h-[34px] rounded-full bg-sage-light text-sage flex items-center justify-center font-serif text-xs font-bold shrink-0">{p.nickname[0].toUpperCase()}</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-jost text-xs font-medium text-charcoal truncate">{p.nickname}</div>
                    <div className="font-jost text-[9px] text-sage uppercase tracking-[0.08em]">Psychologist</div>
                  </div>
                  <button onClick={() => openDirect(p.id)}
                    className="bg-sage-light text-sage px-2.5 py-1 rounded-sm border-none cursor-pointer font-jost text-[9px] tracking-widest uppercase font-medium hover:opacity-85 transition-opacity shrink-0">
                    Chat
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* MAIN */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {!activeRoomId ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 p-10 text-center">
            <div className="w-[58px] h-[58px] rounded-full bg-rose-pale flex items-center justify-center">
              <MessageCircle size={24} className="text-rose-deep" />
            </div>
            <h2 className="font-serif text-[clamp(18px,3vw,22px)] font-bold text-charcoal">Select a conversation</h2>
            <p className="font-jost text-[13px] text-ink-soft max-w-[300px] leading-relaxed">Choose a room from the sidebar or open a private conversation with a specialist.</p>
          </div>
        ) : (
          <>
            {/* Chat header */}
            <div className="px-4 lg:px-6 py-4 bg-cream border-b border-border-gold flex items-center gap-3">
              <div className={`w-9 h-9 rounded-full ${rBg(activeRoom?.type)} flex items-center justify-center shrink-0`}>
                {rIcon(activeRoom?.type, 15)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-serif font-bold text-charcoal truncate text-[clamp(14px,2.5vw,17px)]">{rName(activeRoom)}</div>
                <div className="font-jost text-[10px] text-ink-soft tracking-widest uppercase mt-0.5">{rTypeLbl(activeRoom)}</div>
              </div>
              {activeRoom?.type === 'direct' && (
                <div className="flex items-center gap-1.5 bg-sage-light px-2.5 py-1 rounded-sm shrink-0">
                  <Lock size={10} className="text-sage" />
                  <span className="font-jost text-[9px] text-sage font-medium tracking-[0.08em]">Private</span>
                </div>
              )}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 lg:px-6 py-5 flex flex-col gap-1">
              {activeMessages.length === 0 && (
                <div className="text-center py-10 font-jost text-[13px] text-ink-soft">No messages yet. Be the first to say something.</div>
              )}
              {activeMessages.map((msg: any, i: number) => {
                const isMe       = msg.senderId === user?.id || msg.senderNickname === user?.nickname;
                const showAvatar = !isMe && (i === 0 || activeMessages[i - 1]?.senderId !== msg.senderId);
                return (
                  <div key={msg.id} className={`flex ${isMe ? 'flex-row-reverse' : 'flex-row'} gap-2 items-end mb-0.5`}>
                    <div className="w-7 shrink-0">
                      {showAvatar && !isMe && (
                        <div className={`w-7 h-7 rounded-full ${roleStyle(msg.senderRole)} flex items-center justify-center font-serif text-[10px] font-bold`}>
                          {initial(msg.senderNickname)}
                        </div>
                      )}
                    </div>
                    <div className={`max-w-[min(65%,380px)] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                      {showAvatar && !isMe && (
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="font-jost text-[11px] font-medium text-charcoal">{msg.senderNickname}</span>
                          {msg.senderRole === 'psychologist' && <span className="font-jost text-[8px] bg-sage-light text-sage px-1.5 py-0.5 rounded-sm font-medium tracking-[0.08em] uppercase">Specialist</span>}
                          {msg.isAnonymous && <span className="font-jost text-[8px] bg-ivory-dark text-ink-soft px-1.5 py-0.5 rounded-sm tracking-[0.08em] uppercase">Anon</span>}
                        </div>
                      )}
                      <div className={`px-3.5 py-2.5 text-[13px] leading-relaxed break-words font-jost ${
                        isMe
                          ? 'bg-rose-deep text-white rounded-[14px_14px_4px_14px]'
                          : 'bg-cream text-charcoal border border-border-gold rounded-[14px_14px_14px_4px]'
                      }`}>
                        {msg.content}
                      </div>
                      <span className="font-jost text-[10px] text-ink-soft mt-1">{fmt(msg.createdAt)}</span>
                    </div>
                  </div>
                );
              })}

              {typingList.length > 0 && (
                <div className="flex items-center gap-2 py-1">
                  <div className="flex gap-1">
                    {[0, 1, 2].map(i => (
                      <div key={i} className="w-[5px] h-[5px] rounded-full bg-rose-light animate-bounce-dot"
                        style={{ animationDelay: `${i * 0.15}s` }} />
                    ))}
                  </div>
                  <span className="font-jost text-[11px] text-ink-soft">
                    {typingList.join(', ')} {typingList.length === 1 ? 'is' : 'are'} typing…
                  </span>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="px-4 lg:px-5 py-3.5 bg-cream border-t border-border-gold flex flex-col gap-2">
              <div className="flex gap-2 items-end">
                <div className="flex-1 border border-border-gold rounded-sm bg-ivory overflow-hidden">
                  <textarea rows={2} placeholder="Write a message…" value={input}
                    onChange={e => setInput(e.target.value)} onKeyDown={handleKey}
                    className="w-full px-3.5 py-2.5 border-none outline-none resize-none bg-transparent text-[13px] text-charcoal font-jost leading-relaxed" />
                </div>
                <button onClick={handleSend} disabled={!input.trim()}
                  className={`w-10 h-10 rounded-full border-none flex items-center justify-center shrink-0 transition-colors ${
                    input.trim() ? 'bg-rose-deep cursor-pointer hover:opacity-90' : 'bg-ivory-dark cursor-default'
                  }`}>
                  <Send size={14} className={input.trim() ? 'text-white' : 'text-ink-soft'} />
                </button>
              </div>
              <div className="flex items-center justify-between flex-wrap gap-2">
                <label className="flex items-center gap-1.5 cursor-pointer font-jost text-[11px] text-ink-soft">
                  <input type="checkbox" checked={isAnon} onChange={e => setIsAnon(e.target.checked)}
                    className="w-3 h-3 accent-rose-deep" />
                  Send anonymously
                </label>
                <span className="font-jost text-[10px] text-ink-soft hidden sm:block">Enter to send · Shift+Enter for new line</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Chat;
