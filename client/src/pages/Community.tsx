import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import {
  Users,
  Search,
  Heart,
  Copy,
  Calendar,
  DollarSign,
  MapPin,
  Share2,
  Sparkles,
  MessageSquare,
  CheckCircle2,
  Tag,
  Clock,
  ExternalLink,
} from 'lucide-react';

export const Community: React.FC = () => {
  const navigate = useNavigate();

  const [posts, setPosts] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [loading, setLoading] = useState(true);
  const [copyToast, setCopyToast] = useState('');

  // Comment Drawer State
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [commentsMap, setCommentsMap] = useState<Record<string, string[]>>({});
  const [newCommentText, setNewCommentText] = useState('');

  useEffect(() => {
    fetchCommunityPosts();
  }, [sortBy]);

  const fetchCommunityPosts = async () => {
    try {
      const res = await api.get(`/community?sortBy=${sortBy}`);
      setPosts(res.data);
    } catch (err) {
      console.error('Error fetching community posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId: string) => {
    try {
      await api.post(`/community/like/${postId}`);
      fetchCommunityPosts();
    } catch (err) {
      console.error('Failed to like post:', err);
    }
  };

  const handleCopyTrip = async (tripId: string) => {
    try {
      const res = await api.post(`/trips/${tripId}/clone`);
      alert('Trip itinerary successfully cloned to your account! Redirecting to your builder...');
      navigate(`/trips/${res.data.id}`);
    } catch (err) {
      alert('Failed to clone trip.');
    }
  };

  const handleShareLink = (tripId: string) => {
    const publicUrl = `${window.location.origin}/trips/${tripId}`;
    navigator.clipboard.writeText(publicUrl);
    setCopyToast('Public itinerary share link copied to clipboard!');
    setTimeout(() => setCopyToast(''), 3000);
  };

  const handleAddComment = (postId: string) => {
    if (!newCommentText.trim()) return;
    const existing = commentsMap[postId] || [
      'Amazing itinerary! Excited to try this route.',
      'Love the day-wise activity structure!',
    ];
    setCommentsMap({
      ...commentsMap,
      [postId]: [...existing, newCommentText.trim()],
    });
    setNewCommentText('');
  };

  const filteredPosts = posts.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSearch;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* Screen 10 Header */}
      <div className="bg-white dark:bg-[#111E2E] p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-[#1E2D42] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center space-x-3">
            <Users className="w-8 h-8 text-emerald-500" />
            <span>Community Hub & Public Trips</span>
          </h1>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
            Screen 10: Explore public itineraries, fork/copy trips to your account, and engage with social validation metrics
          </p>
        </div>
      </div>

      {copyToast && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold rounded-2xl flex items-center space-x-2 shadow-md">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>{copyToast}</span>
        </div>
      )}

      {/* Control Bar: Search & Sort */}
      <div className="bg-white dark:bg-[#111E2E] p-4 sm:p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-[#1E2D42] flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search public itineraries (e.g. Rajasthan, Golden Triangle, Paris, Europe)..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-[#162235] border border-slate-200 dark:border-[#1E2D42] rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3.5 py-2.5 bg-slate-50 dark:bg-[#162235] border border-slate-200 dark:border-[#1E2D42] rounded-xl text-xs font-bold text-slate-900 dark:text-white"
          >
            <option value="newest">Sort By: Newest First</option>
            <option value="likes">Sort By: Most Popular (Likes)</option>
            <option value="clones">Sort By: Most Copied / Forked</option>
          </select>
        </div>
      </div>

      {/* Public Posts Feed */}
      <div className="space-y-6">
        {loading ? (
          <div className="text-center py-12 text-slate-500 font-semibold">Loading community feed...</div>
        ) : filteredPosts.length === 0 ? (
          <div className="p-10 bg-white dark:bg-[#111E2E] rounded-3xl text-center text-xs font-semibold text-slate-400 border border-slate-200 dark:border-[#1E2D42]">
            No public community itineraries found. Be the first to publish your trip!
          </div>
        ) : (
          filteredPosts.map((post) => {
            const author = post.author;
            const trip = post.trip;
            const commentsList = commentsMap[post.id] || [
              'Super helpful itinerary! Cloned it for my trip.',
              'Great selection of city stops.',
            ];

            return (
              <div
                key={post.id}
                className="bg-white dark:bg-[#111E2E] rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 dark:border-[#1E2D42] space-y-5 hover:shadow-md transition-all"
              >
                {/* Author Avatar & Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={author?.profilePic || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'}
                      alt={author?.name}
                      className="w-11 h-11 rounded-full object-cover ring-2 ring-emerald-500/80"
                    />
                    <div>
                      <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">{author?.name}</h4>
                      <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                        {author?.city ? `${author.city}, ${author.country}` : 'Explorer'} • Shared {new Date(post.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 text-xs font-bold rounded-full border border-emerald-200 dark:border-emerald-800">
                      Public Itinerary 🌐
                    </span>
                  </div>
                </div>

                {/* Post Title & Description */}
                <div className="space-y-2">
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">{post.title}</h3>
                  <p className="text-xs font-medium text-slate-700 dark:text-slate-300 leading-relaxed">{post.description}</p>
                </div>

                {/* Social Tags & Trip Metrics Banner */}
                {trip && (
                  <div className="bg-slate-50 dark:bg-[#162235] p-5 rounded-2xl border border-slate-200 dark:border-[#1E2D42] space-y-3">
                    <div className="flex flex-wrap items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-200 gap-2">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>
                          {new Date(trip.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} -{' '}
                          {new Date(trip.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2 font-bold text-slate-900 dark:text-white">
                        <DollarSign className="w-4 h-4 text-amber-500" />
                        <span>${trip.totalBudget.toLocaleString()} Total Budget</span>
                      </div>
                    </div>

                    {/* Destination City Pills */}
                    {trip.stops?.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-1">
                        {trip.stops.map((stop: any) => (
                          <span
                            key={stop.id}
                            className="px-2.5 py-1 bg-white dark:bg-[#111E2E] border border-slate-200 dark:border-[#1E2D42] rounded-lg text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center space-x-1"
                          >
                            <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                            <span>{stop.city ? stop.city.name : stop.title}</span>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Action Bar: Likes, Comments, Share Link, and Clone / Fork Button (PS Requirement) */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-[#1E2D42]">
                  <div className="flex items-center space-x-3">
                    {/* Like / Upvote Button */}
                    <button
                      onClick={() => handleLike(post.id)}
                      className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 text-rose-700 dark:text-rose-300 rounded-xl text-xs font-extrabold transition"
                      title="Like this itinerary"
                    >
                      <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
                      <span>{post.likesCount} Likes</span>
                    </button>

                    {/* Clone Count Badge */}
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center space-x-1 px-3 py-1.5 bg-slate-100 dark:bg-[#162235] rounded-xl">
                      <Copy className="w-3.5 h-3.5 text-cyan-500" />
                      <span>{post.clonesCount} Copies / Forks</span>
                    </span>

                    {/* Comments Toggle */}
                    <button
                      onClick={() =>
                        setActiveCommentPostId(activeCommentPostId === post.id ? null : post.id)
                      }
                      className="text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-emerald-500 flex items-center space-x-1 px-3 py-1.5 bg-slate-100 dark:bg-[#162235] rounded-xl transition"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-emerald-500" />
                      <span>{commentsList.length} Comments</span>
                    </button>
                  </div>

                  <div className="flex items-center space-x-2">
                    {/* Share Link Action Button */}
                    {trip && (
                      <button
                        onClick={() => handleShareLink(trip.id)}
                        className="px-3.5 py-2 bg-slate-100 dark:bg-[#162235] hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition flex items-center space-x-1"
                        title="Copy share link"
                      >
                        <Share2 className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Share Link</span>
                      </button>
                    )}

                    {/* Copy Trip / Fork Button (PS Requirement) */}
                    {trip && (
                      <button
                        onClick={() => handleCopyTrip(trip.id)}
                        className="px-5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-500/20 transition hover:scale-105 flex items-center space-x-1.5"
                      >
                        <Copy className="w-4 h-4" />
                        <span>Clone / Copy Trip to My Account</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Comments Section Drawer */}
                {activeCommentPostId === post.id && (
                  <div className="pt-4 border-t border-slate-100 dark:border-[#1E2D42] space-y-3">
                    <h5 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                      Discussion & Traveler Feedback ({commentsList.length})
                    </h5>

                    <div className="space-y-2">
                      {commentsList.map((cText, idx) => (
                        <div key={idx} className="p-3 bg-slate-50 dark:bg-[#162235] rounded-xl text-xs text-slate-700 dark:text-slate-300">
                          <span className="font-bold text-slate-900 dark:text-white block">Traveler Comment #{idx + 1}</span>
                          <p className="mt-0.5">{cText}</p>
                        </div>
                      ))}
                    </div>

                    <div className="flex space-x-2 pt-1">
                      <input
                        type="text"
                        value={newCommentText}
                        onChange={(e) => setNewCommentText(e.target.value)}
                        placeholder="Write a comment..."
                        className="flex-1 px-3 py-2 bg-slate-50 dark:bg-[#162235] border border-slate-200 dark:border-[#1E2D42] rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                      <button
                        onClick={() => handleAddComment(post.id)}
                        className="px-4 py-2 bg-emerald-500 text-white rounded-xl text-xs font-bold"
                      >
                        Post Comment
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
