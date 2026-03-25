import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPosts, createPost } from '../store/slices/forumsSlice';
import { RootState, AppDispatch } from '../store';
import { MessageCircle, Send } from 'lucide-react';

const labelCls = 'block font-jost text-[10px] tracking-[0.16em] uppercase text-ink-mid font-medium mb-1.5';
const inputCls = 'w-full px-4 py-3 text-[13px] border border-border-gold rounded-sm bg-ivory text-charcoal font-jost outline-none focus:border-rose-mid transition-colors';

const Forums = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { posts, loading } = useSelector((s: RootState) => s.forums);
  const [title, setTitle]         = useState('');
  const [content, setContent]     = useState('');
  const [isAnonymous, setIsAnon]  = useState(false);

  useEffect(() => { dispatch(fetchPosts()); }, [dispatch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;
    dispatch(createPost({ title, content, isAnonymous }));
    setTitle(''); setContent(''); setIsAnon(false);
  };

  return (
    <div className="bg-ivory min-h-[calc(100vh-62px)]">

      {/* Page header */}
      <div className="bg-cream border-b border-border-gold px-4 lg:px-0 py-8 lg:py-10">
        <div className="max-w-[840px] mx-auto px-4 lg:px-0">
          <div className="flex items-center gap-2.5 mb-2.5">
            <div className="h-px w-6 bg-gold-light" />
            <span className="font-jost text-[10px] tracking-[0.2em] uppercase text-gold font-medium">Community</span>
          </div>
          <h1 className="font-serif font-bold text-charcoal leading-[1.2] mb-1.5 text-[clamp(24px,4vw,36px)]">
            Discussion <em className="text-rose-deep italic">Forums</em>
          </h1>
          <p className="font-jost text-[13px] text-ink-soft leading-relaxed">Share your story, ask a question, or simply listen. Every voice here matters.</p>
        </div>
      </div>

      <div className="max-w-[840px] mx-auto px-4 py-10 lg:py-12">

        {/* Create post */}
        <div className="bg-cream border border-border-gold rounded-sm p-6 lg:p-9 mb-10">
          <div className="flex items-center gap-3 mb-5">
            <div className="h-px flex-1 bg-border-gold" />
            <span className="font-jost text-[10px] tracking-[0.18em] uppercase text-gold font-medium">Share what's on your mind</span>
            <div className="h-px flex-1 bg-border-gold" />
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div>
              <label className={labelCls}>Post title</label>
              <input type="text" placeholder="A brief title for your post" className={inputCls}
                value={title} onChange={e => setTitle(e.target.value)} required />
            </div>
            <div>
              <label className={labelCls}>Your message</label>
              <textarea placeholder="Write your story, ask a question, or share your experience…" className={`${inputCls} h-[120px] resize-none`}
                value={content} onChange={e => setContent(e.target.value)} required />
            </div>
            <div className="flex items-center justify-between flex-wrap gap-2.5">
              <label className="flex items-center gap-2 cursor-pointer font-jost text-xs text-ink-mid">
                <input type="checkbox" checked={isAnonymous} onChange={e => setIsAnon(e.target.checked)}
                  className="w-3.5 h-3.5 accent-rose-deep cursor-pointer" />
                Post anonymously
              </label>
              <button type="submit" className="flex items-center gap-2 bg-rose-deep text-white border-none px-5 py-2 rounded-sm font-jost text-[11px] tracking-widest uppercase font-medium cursor-pointer hover:opacity-90 transition-opacity">
                <Send size={12} /> Publish
              </button>
            </div>
          </form>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-6">
          <div className="h-px flex-1 bg-border-gold" />
          <span className="font-jost text-[10px] tracking-[0.18em] uppercase text-gold font-medium">Recent conversations</span>
          <div className="h-px flex-1 bg-border-gold" />
        </div>

        {/* Posts */}
        {loading ? (
          <div className="text-center py-16 font-jost text-[13px] text-ink-soft">Loading conversations…</div>
        ) : posts.length === 0 ? (
          <div className="bg-cream border border-border-gold rounded-sm text-center p-12">
            <p className="font-cormorant italic text-[18px] text-ink-mid">No discussions yet. Be the first to share your story.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-px bg-border-gold border border-border-gold rounded-sm overflow-hidden mb-10">
            {posts.map((post: any) => (
              <div key={post.id ?? post._id}
                className="bg-cream hover:bg-ivory transition-colors p-6 lg:p-8">
                <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-[34px] h-[34px] rounded-full flex items-center justify-center text-xs font-bold font-serif border border-border-gold shrink-0 ${post.is_anonymous ? 'bg-ivory-dark text-ink-soft' : 'bg-rose-pale text-rose-deep'}`}>
                      {post.is_anonymous ? '?' : (post.author_nickname?.[0]?.toUpperCase() ?? 'M')}
                    </div>
                    <div>
                      <div className="font-jost text-[13px] font-medium text-charcoal">
                        {post.is_anonymous ? 'Anonymous Mother' : post.author_nickname ?? 'Unknown'}
                      </div>
                      <div className="font-jost text-[10px] text-ink-soft tracking-[0.04em]">
                        {new Date(post.created_at ?? post.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </div>
                    </div>
                  </div>
                  {post.is_anonymous && (
                    <span className="font-jost text-[9px] tracking-widest uppercase px-2 py-0.5 rounded-sm bg-ivory-dark text-ink-soft border border-border-gold font-medium">Anonymous</span>
                  )}
                </div>
                <h4 className="font-serif font-bold text-charcoal leading-[1.3] mb-2 text-[clamp(15px,2.5vw,18px)]">{post.title}</h4>
                <p className="font-jost text-[13px] text-ink-mid leading-[1.8] whitespace-pre-wrap mb-4">{post.content}</p>
                <div className="border-t border-border-gold pt-3 flex items-center gap-1.5">
                  <MessageCircle size={12} className="text-ink-soft" />
                  <span className="font-jost text-[11px] text-ink-soft tracking-[0.05em]">
                    {post.comment_count ?? post.comments?.length ?? 0} {(post.comment_count ?? post.comments?.length ?? 0) === 1 ? 'reply' : 'replies'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Forums;
