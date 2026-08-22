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
  ThumbsUp,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

export const Community: React.FC = () => {
  const navigate = useNavigate();

  const [posts, setPosts] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [loading, setLoading] = useState(true);

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
      alert('Trip successfully copied to your profile! Redirecting to your itinerary builder...');
      navigate(`/trips/${res.data.id}`);
    } catch (err) {
      alert('Failed to copy trip.');
    }
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
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white flex items-center space-x-3">
            <Users className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
            <span>Community Tab</span>
          </h1>
          <p className="text-xs font-medium text-gray-600 dark:text-slate-400 mt-1 max-w-xl">
            Screen 10: Community section where users share their travel experiences. Use search, filter, and sort to find inspiration or copy trips!
          </p>
        </div>
      </div>

      {/* Screen 10 Control Bar: Search bar, Group by, Filter, Sort by */}
      <div className="bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-gray-400 dark:text-slate-500 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search bar...... (e.g. Europe romance, Tokyo ramen, Bali budget)"
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-xl text-sm text-gray-900 dark:text-slate-100 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3.5 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-xl text-xs font-extrabold text-gray-900 dark:text-slate-100"
          >
            <option value="newest" className="bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100">Sort By: Newest First</option>
            <option value="likes" className="bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100">Sort By: Most Popular (Likes)</option>
            <option value="clones" className="bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100">Sort By: Most Copied (Clones)</option>
          </select>
        </div>
      </div>

      {/* Public Itinerary Posts List (Screen 10 Wireframe) */}
      <div className="space-y-6">
        {loading ? (
          <div className="text-center py-12 text-gray-500 dark:text-slate-400 font-semibold">Loading community posts...</div>
        ) : filteredPosts.length === 0 ? (
          <div className="p-10 bg-white dark:bg-slate-900 rounded-3xl text-center text-xs font-semibold text-gray-500 dark:text-slate-400 border border-gray-100 dark:border-slate-800">
            No public community itineraries found. Be the first to share your trip!
          </div>
        ) : (
          filteredPosts.map((post) => {
            const author = post.author;
            const trip = post.trip;

            return (
              <div
                key={post.id}
                className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 dark:border-slate-800 space-y-5 hover:shadow-md transition-all"
              >
                {/* Author Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={author?.profilePic || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'}
                      alt={author?.name}
                      className="w-10 h-10 rounded-full object-cover border border-emerald-500"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-gray-900 dark:text-white">{author?.name}</h4>
                      <p className="text-[11px] font-medium text-gray-500 dark:text-slate-400">
                        {author?.city ? `${author.city}, ${author.country}` : 'GlobeTrotter Explorer'} • Shared {new Date(post.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 text-xs font-extrabold rounded-full border border-emerald-200 dark:border-emerald-800">
                    Shared Itinerary
                  </span>
                </div>

                {/* Post Content */}
                <div className="space-y-2">
                  <h3 className="text-xl font-black text-gray-900 dark:text-white">{post.title}</h3>
                  <p className="text-xs font-medium text-gray-700 dark:text-slate-300 leading-relaxed">{post.description}</p>
                </div>

                {/* Trip Preview Banner & Stop Badges */}
                {trip && (
                  <div className="bg-gray-50 dark:bg-slate-800/80 p-4 rounded-2xl border border-gray-200 dark:border-slate-700 space-y-3">
                    <div className="flex flex-wrap items-center justify-between text-xs font-semibold text-gray-800 dark:text-slate-200 gap-2">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        <span>
                          {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2 font-bold text-gray-900 dark:text-slate-100">
                        <DollarSign className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                        <span>${trip.totalBudget} Budget</span>
                      </div>
                    </div>

                    {trip.stops?.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-1">
                        {trip.stops.map((stop: any) => (
                          <span
                            key={stop.id}
                            className="px-2.5 py-1 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg text-xs font-bold text-gray-800 dark:text-slate-200 flex items-center space-x-1"
                          >
                            <MapPin className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                            <span>{stop.city ? stop.city.name : stop.title}</span>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Interactive Action Bar: Likes + "Copy Trip" Button (Wireframe Screen 10 & 11) */}
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => handleLike(post.id)}
                      className="flex items-center space-x-1.5 px-3 py-1.5 bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900 text-rose-700 dark:text-rose-300 rounded-xl text-xs font-extrabold transition"
                    >
                      <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
                      <span>{post.likesCount} Likes</span>
                    </button>

                    <span className="text-xs font-bold text-gray-600 dark:text-slate-300 flex items-center space-x-1">
                      <Copy className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                      <span>{post.clonesCount} Times Copied</span>
                    </span>
                  </div>

                  {trip && (
                    <button
                      onClick={() => handleCopyTrip(trip.id)}
                      className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition hover:scale-105 flex items-center space-x-1.5"
                    >
                      <Copy className="w-4 h-4" />
                      <span>Copy Trip to My Profile</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
