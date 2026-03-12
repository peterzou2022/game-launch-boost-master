import React from 'react';
import { Icon } from '@iconify/react';

interface Comment {
  id: number;
  author: string;
  content: string;
  time: string;
  likes: number;
  dislikes: number;
}

interface CommentsSectionProps {
  title?: string;
}

export function CommentsSection({ title = 'Comments' }: CommentsSectionProps) {
  const [comments, setComments] = React.useState<Comment[]>([
    {
      id: 1,
      author: 'Domenic',
      content: 'Super good',
      time: '18 hrs ago',
      likes: 0,
      dislikes: 0,
    },
    {
      id: 2,
      author: 'NPT',
      content:
        'Endless world record. 507000m over 15 hours. I got a bug where it just became Timeless by Cyrillic',
      time: 'yesterday',
      likes: 0,
      dislikes: 0,
    },
  ]);

  const [newComment, setNewComment] = React.useState('');
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [agree, setAgree] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !name.trim()) return;

    const next: Comment = {
      id: Date.now(),
      author: name.trim(),
      content: newComment.trim(),
      time: 'just now',
      likes: 0,
      dislikes: 0,
    };

    setComments((prev) => [next, ...prev]);
    setNewComment('');
    setName('');
    setEmail('');
    setAgree(false);
  };

  const handleVote = (id: number, type: 'like' | 'dislike') => {
    setComments((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              likes: type === 'like' ? c.likes + 1 : c.likes,
              dislikes: type === 'dislike' ? c.dislikes + 1 : c.dislikes,
            }
          : c,
      ),
    );
  };

  return (
    <section className="mt-8">
      <div className="bg-theme-bg-primary dark:bg-dark-secondary text-theme-text-primary rounded-2xl shadow-lg overflow-hidden">
        <div className="px-6 pt-6 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon icon="mdi:comment-text-multiple-outline" className="w-5 h-5 text-theme-text-secondary" />
            <h2 className="text-base font-semibold text-theme-text-primary">
              {title} ({comments.length})
            </h2>
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-1 rounded-full bg-primary-500 px-4 py-1.5 text-xs font-medium text-white hover:bg-primary-400 transition-colors"
          >
            <span>Back to game</span>
          </button>
        </div>

        <div className="px-6 pb-6 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="sr-only" htmlFor="comment">
                Add comment
              </label>
              <textarea
                id="comment"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add comment"
                rows={3}
                className="w-full rounded-lg border border-theme-border bg-theme-bg-secondary px-3 py-2 text-sm text-theme-text-primary placeholder-theme-text-secondary/70 focus:outline-none focus:ring-1 focus:ring-primary-500/70 focus:border-primary-500 resize-none"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name"
                className="w-full rounded-lg border border-theme-border bg-theme-bg-secondary px-3 py-2 text-sm text-theme-text-primary placeholder-theme-text-secondary/70 focus:outline-none focus:ring-1 focus:ring-primary-500/70 focus:border-primary-500"
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full rounded-lg border border-theme-border bg-theme-bg-secondary px-3 py-2 text-sm text-theme-text-primary placeholder-theme-text-secondary/70 focus:outline-none focus:ring-1 focus:ring-primary-500/70 focus:border-primary-500"
              />
            </div>
            <div className="flex items-center justify-between gap-4">
              <label className="inline-flex items-center gap-2 text-xs text-theme-text-secondary">
                <input
                  type="checkbox"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                  className="h-4 w-4 rounded border-theme-border bg-transparent text-primary-500 focus:ring-primary-500"
                />
                <span>I'd read and agree to the terms and conditions.</span>
              </label>
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-full bg-primary-500 px-4 py-2 text-xs font-semibold text-white hover:bg-primary-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                disabled={!newComment.trim() || !name.trim()}
              >
                <span className="mr-1">Send</span>
                <Icon icon="mdi:send" className="w-4 h-4" />
              </button>
            </div>
          </form>

          <div className="space-y-4 max-h-[420px] overflow-y-auto pr-1">
            {comments.map((comment) => (
              <div
                key={comment.id}
                className="rounded-xl bg-theme-bg-secondary/70 border border-theme-border px-4 py-3 flex gap-3"
              >
                <div className="flex-shrink-0">
                  <div className="h-9 w-9 rounded-full bg-primary-500 flex items-center justify-center text-sm font-semibold text-white">
                    {comment.author.charAt(0).toUpperCase()}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div>
                      <p className="text-sm font-medium text-theme-text-primary">{comment.author}</p>
                      <p className="text-[11px] text-theme-text-secondary">{comment.time}</p>
                    </div>
                    <button
                      type="button"
                      className="text-[11px] text-theme-text-secondary hover:text-theme-text-primary inline-flex items-center gap-1"
                    >
                      <Icon icon="mdi:reply" className="w-3.5 h-3.5" />
                      <span>Reply</span>
                    </button>
                  </div>
                  <p className="text-sm text-theme-text-primary whitespace-pre-line mb-2">{comment.content}</p>
                  <div className="flex items-center gap-4 text-[11px] text-theme-text-secondary">
                    <button
                      type="button"
                      onClick={() => handleVote(comment.id, 'like')}
                      className="inline-flex items-center gap-1 hover:text-theme-text-primary"
                    >
                      <Icon icon="mdi:thumb-up-outline" className="w-3.5 h-3.5" />
                      <span>{comment.likes}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleVote(comment.id, 'dislike')}
                      className="inline-flex items-center gap-1 hover:text-theme-text-primary"
                    >
                      <Icon icon="mdi:thumb-down-outline" className="w-3.5 h-3.5" />
                      <span>{comment.dislikes}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

