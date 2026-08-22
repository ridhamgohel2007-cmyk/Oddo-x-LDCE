import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import {
  Users,
  Search,
  Heart,
  Copy,
  Calendar,
  MapPin,
  Share2,
  Sparkles,
  MessageSquare,
  CheckCircle2,
  Tag,
  Clock,
  ExternalLink,
  Globe,
  Filter,
  Flame,
  Globe2,
} from 'lucide-react';

export const Community: React.FC = () => {
  const navigate = useNavigate();

  const [posts, setPosts] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
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
      setCopyToast('✨ Trip itinerary successfully cloned to your account!');
      setTimeout(() => {
        setCopyToast('');
        navigate(`/trips/${res.data.id}`);
      }, 1200);
    } catch (err) {
      alert('Failed to clone trip.');
    }
  };

  const handleShareLink = (tripId: string) => {
    const publicUrl = `${window.location.origin}/trips/${tripId}`;
    navigator.clipboard.writeText(publicUrl);
    setCopyToast('✓ Public itinerary share link copied to clipboard!');
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

  // Filter posts by Search and Category Pills (Request Item 5)
  const filteredPosts = posts.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()));

    let matchesCat = true;
    const titleLower = (p.title || '').toLowerCase();
    const descLower = (p.description || '').toLowerCase();

    if (selectedCategory === 'EUROPE') {
      matchesCat = titleLower.includes('europe') || descLower.includes('paris') || descLower.includes('rome') || descLower.includes('barcelona');
    } else if (selectedCategory === 'INDIA') {
      matchesCat = titleLower.includes('india') || descLower.includes('delhi') || descLower.includes('agra') || descLower.includes('rajasthan') || descLower.includes('ladakh');
    } else if (selectedCategory === 'ROAD_TRIP') {
      matchesCat = titleLower.includes('overland') || titleLower.includes('expedition') || descLower.includes('car') || descLower.includes('bike') || descLower.includes('route');
    } else if (selectedCategory === 'HONEYMOON') {
      matchesCat = titleLower.includes('romance') || descLower.includes('romance') || descLower.includes('honeymoon');
    } else if (selectedCategory === 'SOLO') {
      matchesCat = titleLower.includes('overland') || descLower.includes('expert') || descLower.includes('mountain');
    }

    return matchesSearch && matchesCat;
  });

  const categoryPills = [
    { id: 'ALL', label: '🌍 All Public Trips' },
    { id: 'EUROPE', label: '🇪🇺 Europe' },
    { id: 'INDIA', label: '🇮🇳 India' },
    { id: 'ROAD_TRIP', label: '🚗 Road Trips' },
    { id: 'HONEYMOON', label: '💍 Honeymoon & Romance' },
    { id: 'SOLO', label: '🎒 Solo Travel' },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* Production Header Banner (Request Item 1) */}
      <div className="bg-white dark:bg-[#1E293B] p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center space-x-3">
            <Users className="w-8 h-8 text-[#7C3AED]" />
            <span>Community Hub & Public Trips</span>
          </h1>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
            Explore public itineraries, clone community trips to your account, and discover multi-city travel guides
          </p>
        </div>
      </div>

      {copyToast && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold rounded-2xl flex items-center space-x-2 shadow-md">
          <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
          <span>{copyToast}</span>
        </div>
      )}

      {/* Control Bar & Category Filter Tabs (Request Item 5) */}
      <div className="bg-white dark:bg-[#1E293B] p-4 sm:p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-white/10 space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search public itineraries (e.g. Rajasthan, Golden Triangle, Paris, Europe)..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-white/10 rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
            />
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full sm:w-auto px-3.5 py-2.5 bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-white/10 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none"
            >
              <option value="newest">Sort By: Newest First</option>
              <option value="likes">Sort By: Most Popular (Likes)</option>
              <option value="clones">Sort By: Most Copied / Forked</option>
            </select>
          </div>
        </div>

        {/* Quick Filter Pills (Request Item 5) */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-white/10">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 shrink-0 mr-1 flex items-center space-x-1">
            <Filter className="w-3.5 h-3.5 text-[#00A09D]" />
            <span>Category:</span>
          </span>
          {categoryPills.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all border shrink-0 ${
                  isSelected
                    ? 'bg-[#714B67] dark:bg-[#7C3AED] text-white border-purple-400 shadow-sm scale-105'
                    : 'bg-slate-50 dark:bg-[#0F172A] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-[#334155]'
                }`}
              >
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Public Posts Feed */}
      <div className="space-y-6">
        {loading ? (
          <div className="text-center py-12 text-slate-500 font-semibold">Loading community feed...</div>
        ) : filteredPosts.length === 0 ? (
          <div className="p-10 bg-white dark:bg-[#1E293B] rounded-3xl text-center text-xs font-semibold text-slate-400 border border-slate-200 dark:border-white/10">
            No public community itineraries found matching active category. Be the first to publish your trip!
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
                className="bg-white dark:bg-[#1E293B] rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 dark:border-white/10 space-y-5 hover:shadow-md transition-all"
              >
                {/* Author Avatar & Diverse Profiles (Request Item 7) */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={author?.profilePic || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'}
                      alt={author?.name}
                      className="w-11 h-11 rounded-full object-cover ring-2 ring-[#7C3AED]/80"
                    />
                    <div>
                      <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">{author?.name}</h4>
                      <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                        {author?.city ? `${author.city}, ${author.country}` : 'Explorer'} • Shared {new Date(post.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="px-3 py-1 bg-purple-50 dark:bg-purple-950/60 text-[#7C3AED] dark:text-purple-300 text-xs font-bold rounded-full border border-purple-200 dark:border-purple-800 flex items-center space-x-1">
                      <Globe className="w-3 h-3" />
                      <span>Public Itinerary</span>
                    </span>
                  </div>
                </div>

                {/* Post Title & Description */}
                <div className="space-y-2">
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">{post.title}</h3>
                  <p className="text-xs font-medium text-slate-700 dark:text-slate-300 leading-relaxed">{post.description}</p>
                </div>

                {/* Clean Single Currency & Full Unclipped Multi-City Tags (Request Items 2, 3, 4) */}
                {trip && (
                  <div className="bg-slate-50 dark:bg-[#0F172A] p-5 rounded-2xl border border-slate-200 dark:border-white/10 space-y-3">
                    <div className="flex flex-wrap items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-200 gap-2">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-[#7C3AED] shrink-0" />
                        <span>
                          {new Date(trip.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} -{' '}
                          {new Date(trip.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>

                      {/* Single Clean Rupee Symbol Formatting (Request Item 2) */}
                      <div className="flex items-center space-x-1.5 font-bold text-slate-900 dark:text-white">
                        <span className="text-[#10B981] font-black">₹{trip.totalBudget?.toLocaleString('en-IN')}</span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400">Total Budget</span>
                      </div>
                    </div>

                    {/* Unclipped Multi-City Destination Pills (Request Items 3 & 4) */}
                    {trip.stops?.length > 0 && (
                      <div className="flex flex-wrap items-center gap-2 pt-1 overflow-visible">
                        {trip.stops.map((stop: any) => (
                          <span
                            key={stop.id}
                            className="px-3 py-1 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-white/10 rounded-xl text-xs font-extrabold text-slate-800 dark:text-slate-200 flex items-center space-x-1.5 shadow-xs shrink-0"
                          >
                            <MapPin className="w-3.5 h-3.5 text-[#00A09D] shrink-0" />
                            <span>{stop.city ? stop.city.name : stop.title.replace('Stop: ', '')}</span>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Action Bar with Primary vs. Secondary CTA Hierarchy (Request Item 6) */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-white/10">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleLike(post.id)}
                      className="flex items-center space-x-1.5 px-3.5 py-2 bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 text-rose-700 dark:text-rose-300 rounded-xl text-xs font-extrabold transition"
                      title="Like this itinerary"
                    >
                      <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
                      <span>{post.likesCount} Likes</span>
                    </button>

                    <span className="text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center space-x-1 px-3.5 py-2 bg-slate-100 dark:bg-[#0F172A] rounded-xl">
                      <Copy className="w-3.5 h-3.5 text-[#06B6D4]" />
                      <span>{post.clonesCount} Copies / Forks</span>
                    </span>

                    <button
                      onClick={() =>
                        setActiveCommentPostId(activeCommentPostId === post.id ? null : post.id)
                      }
                      className="text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-[#7C3AED] flex items-center space-x-1 px-3.5 py-2 bg-slate-100 dark:bg-[#0F172A] rounded-xl transition"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-[#00A09D]" />
                      <span>{commentsList.length} Comments</span>
                    </button>
                  </div>

                  {/* Primary vs. Secondary Button Hierarchy (Request Item 6) */}
                  <div className="flex items-center space-x-2">
                    {trip && (
                      <button
                        onClick={() => handleShareLink(trip.id)}
                        className="px-3.5 py-2 bg-slate-100 dark:bg-[#0F172A] hover:bg-slate-200 dark:hover:bg-[#334155] text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 border border-slate-200 dark:border-white/10 shrink-0"
                        title="Copy share link"
                      >
                        <Share2 className="w-3.5 h-3.5 text-[#00A09D]" />
                        <span>Share Link</span>
                      </button>
                    )}

                    {trip && (
                      <button
                        onClick={() => handleCopyTrip(trip.id)}
                        className="px-5 py-2 bg-[#714B67] hover:bg-[#613E57] dark:bg-[#7C3AED] dark:hover:bg-[#6D28D9] text-white rounded-xl text-xs font-black shadow-md shadow-purple-500/20 transition hover:scale-105 flex items-center space-x-1.5 shrink-0"
                      >
                        <Sparkles className="w-4 h-4 text-[#E2A03F]" />
                        <span>✨ Clone Trip to My Account</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Comments Section Drawer */}
                {activeCommentPostId === post.id && (
                  <div className="pt-4 border-t border-slate-100 dark:border-white/10 space-y-3">
                    <h5 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                      Discussion & Traveler Feedback ({commentsList.length})
                    </h5>

                    <div className="space-y-2">
                      {commentsList.map((cText, idx) => (
                        <div key={idx} className="p-3 bg-slate-50 dark:bg-[#0F172A] rounded-xl text-xs text-slate-700 dark:text-slate-300 border border-slate-100 dark:border-white/5">
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
                        className="flex-1 px-3 py-2 bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-white/10 rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
                      />
                      <button
                        onClick={() => handleAddComment(post.id)}
                        className="px-4 py-2 bg-[#714B67] hover:bg-[#613E57] text-white rounded-xl text-xs font-bold"
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
