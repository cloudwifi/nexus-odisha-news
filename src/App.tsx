import React, { useState, useEffect } from 'react';
import { 
  Home, 
  Info, 
  Video as VideoIcon, 
  UserCheck, 
  Share2, 
  Trash2, 
  Edit, 
  Plus, 
  X, 
  Menu,
  ChevronRight,
  Facebook,
  Twitter,
  Youtube,
  Instagram,
  MessageCircle,
  ExternalLink,
  Zap,
  Link as LinkIcon,
  Check,
  Settings,
  Lock,
  BarChart as BarChartIcon,
  TrendingUp,
  Users,
  MousePointer2
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import { News, Video, Reporter } from './types';

const LOGO_URL = "logo2.jpeg"; // Official Nexus Odisha News Logo

// --- Components ---

const Navbar = ({ activePage, setActivePage, isAdmin }: { activePage: string, setActivePage: (p: string) => void, isAdmin: boolean }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'videos', label: 'Videos', icon: VideoIcon },
    { id: 'about', label: 'About Us', icon: Info },
    { id: 'verification', label: 'Reporter Verification', icon: UserCheck },
  ];

  if (isAdmin) {
    navItems.push({ id: 'admin', label: 'Admin Panel', icon: Lock });
  }

  return (
    <nav className="bg-black text-white sticky top-0 z-50 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActivePage('home')}>
            <img src={LOGO_URL} alt="Nexus Odisha News" className="h-12 w-auto object-contain" referrerPolicy="no-referrer" />
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tighter text-orange-500 leading-none">NEXUS</span>
              <span className="text-sm font-medium text-white tracking-widest">ODISHA NEWS</span>
            </div>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-orange-500 ${activePage === item.id ? 'text-orange-500' : 'text-gray-300'}`}
              >
                <item.icon size={18} />
                {item.label}
              </button>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-gray-300">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-zinc-900 border-t border-white/10"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActivePage(item.id);
                    setIsMenuOpen(false);
                  }}
                  className={`flex items-center gap-3 w-full px-3 py-4 text-base font-medium rounded-lg ${activePage === item.id ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-white/5'}`}
                >
                  <item.icon size={20} />
                  {item.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const BreakingNews = ({ news, onReadMore }: { news: News[], onReadMore: (item: News) => void }) => {
  // Show both "Marked as Breaking" (1) and "Only Breaking" (2) in the ticker
  const breakingNews = news.filter(n => n.is_breaking === 1 || n.is_breaking === 2);
  if (breakingNews.length === 0) return null;

  return (
    <div className="bg-red-600 text-white py-2 overflow-hidden flex items-center">
      <div className="bg-red-800 px-4 py-1 font-bold text-sm uppercase tracking-wider z-10 shadow-lg flex items-center gap-2">
        <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
        Breaking
      </div>
      <div className="flex-1 relative overflow-hidden h-6">
        <div className="absolute whitespace-nowrap animate-scroll flex gap-12 items-center">
          {breakingNews.map((n) => (
            <span 
              key={n.id} 
              className="text-sm font-semibold flex items-center gap-2 cursor-pointer hover:underline"
              onClick={() => onReadMore(n)}
            >
              <span className="w-2 h-2 bg-white rounded-full"></span>
              {n.title}
            </span>
          ))}
          {/* Duplicate for seamless loop */}
          {breakingNews.map((n) => (
            <span 
              key={`dup-${n.id}`} 
              className="text-sm font-semibold flex items-center gap-2 cursor-pointer hover:underline"
              onClick={() => onReadMore(n)}
            >
              <span className="w-2 h-2 bg-white rounded-full"></span>
              {n.title}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

const NewsCard = ({ item, onReadMore }: { item: News, onReadMore: (item: News) => void, key?: React.Key }) => {
  const [copied, setCopied] = useState(false);

  const shareNews = (platform: string) => {
    const url = window.location.href;
    const text = `Check out this news: ${item.title}`;
    let shareUrl = '';

    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text + ' ' + url)}`;
        break;
      case 'copy':
        navigator.clipboard.writeText(url).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        });
        return;
    }

    if (shareUrl) window.open(shareUrl, '_blank');
  };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all group"
    >
      <div className="relative aspect-video overflow-hidden cursor-pointer" onClick={() => onReadMore(item)}>
        <img 
          src={item.image_url || "https://picsum.photos/seed/news/800/450"} 
          alt={item.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
        {item.is_breaking === 1 && (
          <div className="absolute top-4 left-4 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-widest">
            Breaking
          </div>
        )}
      </div>
      <div className="p-6">
        <div className="text-xs text-gray-400 mb-2 font-medium">
          {new Date(item.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
        </div>
        <h3 
          className="text-xl font-bold text-gray-900 mb-3 leading-tight group-hover:text-orange-600 transition-colors cursor-pointer"
          onClick={() => onReadMore(item)}
        >
          {item.title}
        </h3>
        <p className="text-gray-600 text-sm line-clamp-3 mb-6 leading-relaxed">
          {item.content}
        </p>
        <div className="flex items-center justify-between pt-4 border-t border-gray-50">
          <button 
            onClick={() => onReadMore(item)}
            className="text-orange-600 text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all"
          >
            Read Full Story <ChevronRight size={16} />
          </button>
          <div className="flex items-center gap-3">
            <button onClick={() => shareNews('facebook')} className="text-gray-400 hover:text-blue-600 transition-colors" title="Share on Facebook"><Facebook size={18} /></button>
            <button onClick={() => shareNews('twitter')} className="text-gray-400 hover:text-sky-500 transition-colors" title="Share on Twitter"><Twitter size={18} /></button>
            <button onClick={() => shareNews('whatsapp')} className="text-gray-400 hover:text-green-500 transition-colors" title="Share on WhatsApp"><MessageCircle size={18} /></button>
            <button onClick={() => shareNews('copy')} className="text-gray-400 hover:text-orange-600 transition-colors relative" title="Copy Link">
              {copied ? <Check size={18} className="text-green-500" /> : <LinkIcon size={18} />}
              {copied && (
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] py-1 px-2 rounded whitespace-nowrap">
                  Copied!
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const VideoCard = ({ video, onClick }: { video: Video, onClick?: () => void, key?: React.Key }) => {
  const getYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const videoId = getYoutubeId(video.youtube_url);
  const thumbnailUrl = videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : "https://picsum.photos/seed/video/800/450";

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-zinc-900 rounded-2xl overflow-hidden group cursor-pointer"
      onClick={() => {
        if (onClick) onClick();
        window.open(video.youtube_url, '_blank');
      }}
    >
      <div className="relative aspect-video">
        <img src={thumbnailUrl} alt={video.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" referrerPolicy="no-referrer" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center text-white shadow-2xl group-hover:scale-110 transition-transform">
            <VideoIcon size={32} fill="currentColor" />
          </div>
        </div>
      </div>
      <div className="p-5">
        <h3 className="text-white font-bold text-lg line-clamp-2 group-hover:text-orange-500 transition-colors">
          {video.title}
        </h3>
        <div className="mt-2 text-zinc-500 text-xs flex items-center gap-2">
          <ExternalLink size={12} /> Watch on YouTube
        </div>
      </div>
    </motion.div>
  );
};

// --- Pages ---

const HomePage = ({ news, videos, onReadMore, onVideoClick }: { news: News[], videos: Video[], onReadMore: (item: News) => void, onVideoClick?: (video: Video) => void }) => {
  // Show both Normal News (0) and Marked as Breaking (1) in the latest news grid
  // Only Breaking (2) remains Ticker-only
  const latestNews = news.filter(n => n.is_breaking === 0 || n.is_breaking === 1);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <Helmet>
        <title>Nexus Odisha News | Latest News, Ground Reports & Analysis</title>
        <meta name="description" content="Your trusted source for the latest news, ground reports, and in-depth analysis from across Odisha. Stay updated with Nexus Odisha News." />
        <meta property="og:title" content="Nexus Odisha News | Latest News from Odisha" />
        <meta property="og:description" content="Trusted news and ground reports from every corner of Odisha." />
        <meta property="og:image" content={LOGO_URL} />
      </Helmet>
      <div className="mb-12">
        <h2 className="text-4xl font-bold text-gray-900 mb-2">Latest News</h2>
        <div className="h-1.5 w-24 bg-orange-500 rounded-full"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
        {latestNews.map((item) => (
          <NewsCard key={item.id} item={item} onReadMore={onReadMore} />
        ))}
      </div>

    <div id="videos-section" className="pt-12 border-t border-gray-100">
      <div className="mb-12 text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">Video Reports</h2>
        <p className="text-gray-500">Watch our latest ground reports and interviews</p>
        <div className="h-1.5 w-24 bg-orange-500 rounded-full mx-auto mt-4"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {videos.map((video) => (
          <VideoCard key={video.id} video={video} onClick={() => onVideoClick?.(video)} />
        ))}
      </div>
    </div>
  </div>
);
};

const AboutPage = () => (
  <div className="max-w-4xl mx-auto px-4 py-20">
    <Helmet>
      <title>About Us | Nexus Odisha News</title>
      <meta name="description" content="Learn more about Nexus Odisha News, our mission to empower the people of Odisha with truthful journalism and deep local insights." />
    </Helmet>
    <div className="text-center mb-16">
      <h2 className="text-5xl font-bold text-gray-900 mb-6 font-serif italic">About Nexus Odisha News</h2>
      <p className="text-xl text-gray-600 max-w-2xl mx-auto">
        Dedicated to bringing you the most accurate and timely news from every corner of Odisha.
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <h3 className="text-2xl font-bold mb-6 flex items-center gap-3 text-orange-600">
          <Home size={24} /> Office Details
        </h3>
        <div className="space-y-4 text-gray-600">
          <p className="font-semibold text-gray-900">Nexus Odisha News HQ</p>
          <p>Plot No. 123, Mahakalpada</p>
          <p>Kendrapara, Odisha - 754224</p>
          <p>India</p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <h3 className="text-2xl font-bold mb-6 flex items-center gap-3 text-orange-600">
          <MessageCircle size={24} /> Contact Us
        </h3>
        <div className="space-y-4 text-gray-600">
          <div className="flex flex-col">
            <span className="text-xs font-bold u8ppercase tracking-widest text-gray-400 mb-1">Email</span>
            <span className="text-gray-900 font-medium">nexusodishanews@gmail.com</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Phone</span>
            <span className="text-gray-900 font-medium">+91 7846924983</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">WhatsApp</span>
            <span className="text-gray-900 font-medium">+91 7846924983</span>
          </div>
        </div>
      </div>
    </div>

    <div className="mt-16 bg-zinc-900 text-white p-12 rounded-3xl text-center">
      <h3 className="text-3xl font-bold mb-6">Our Mission</h3>
      <p className="text-zinc-400 text-lg leading-relaxed max-w-2xl mx-auto">
        To empower the people of Odisha with truthful journalism, fostering a more informed and engaged society through unbiased reporting and deep local insights.
      </p>
    </div>
  </div>
);

const VideosPage = ({ videos, onVideoClick }: { videos: Video[], onVideoClick?: (video: Video) => void }) => (
  <div className="max-w-7xl mx-auto px-4 py-12">
    <Helmet>
      <title>Video Reports | Nexus Odisha News</title>
      <meta name="description" content="Watch the latest ground reports, interviews, and video news from across Odisha by Nexus Odisha News." />
    </Helmet>
    <div className="mb-12 text-center">
      <h2 className="text-4xl font-bold text-gray-900 mb-4">Video Reports</h2>
      <p className="text-gray-500">Watch our latest ground reports and interviews</p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {videos.map((video) => (
        <VideoCard key={video.id} video={video} onClick={() => onVideoClick?.(video)} />
      ))}
    </div>
  </div>
);

const VerificationPage = ({ onVerify }: { onVerify?: (id: string) => void }) => {
  const [id, setId] = useState('');
  const [reporter, setReporter] = useState<Reporter | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setLoading(true);
    setError('');
    setReporter(null);
    if (onVerify) onVerify(id);
    try {
      const res = await fetch(`/api/reporters/${id}`);
      if (res.ok) {
        const data = await res.json();
        setReporter(data);
      } else {
        setError('Invalid Reporter ID. Please check and try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-20">
      <Helmet>
        <title>Reporter Verification | Nexus Odisha News</title>
        <meta name="description" content="Verify the credentials of Nexus Odisha News reporters using their unique ID." />
      </Helmet>
      <div className="bg-white p-10 rounded-3xl shadow-xl border border-gray-100">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <UserCheck size={40} />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Reporter Verification</h2>
          <p className="text-gray-500 mt-2">Enter the unique ID to verify reporter credentials</p>
        </div>

        <form onSubmit={handleVerify} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Reporter ID</label>
            <input
              type="text"
              value={id}
              onChange={(e) => setId(e.target.value)}
              placeholder="e.g. NEXUS-001"
              className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all text-lg font-medium"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-orange-700 transition-colors shadow-lg shadow-orange-600/20 disabled:opacity-50"
          >
            {loading ? 'Verifying...' : 'Verify Identity'}
          </button>
        </form>

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 p-4 bg-red-50 text-red-600 rounded-2xl text-center font-medium"
          >
            {error}
          </motion.div>
        )}

        {reporter && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-10 p-8 bg-zinc-900 text-white rounded-3xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <UserCheck size={120} />
            </div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-8">
                <span className="bg-green-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">Verified Reporter</span>
                <span className="text-zinc-500 font-mono text-sm">{reporter.id}</span>
              </div>
              <div className="flex flex-col md:flex-row gap-8 items-start">
                {reporter.image_url && (
                  <div className="w-32 h-40 rounded-2xl overflow-hidden border-2 border-zinc-800 shadow-xl flex-shrink-0">
                    <img src={reporter.image_url} alt={reporter.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                )}
                <div className="space-y-6 flex-grow">
                  <div>
                    <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-1">Full Name</p>
                    <p className="text-2xl font-bold">{reporter.name}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-1">Joining Date</p>
                      <p className="font-semibold">{reporter.joining_date}</p>
                    </div>
                    <div>
                      <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-1">ID Validity</p>
                      <p className="font-semibold text-orange-400">{reporter.validity}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-1">Reporting Area</p>
                    <p className="font-semibold">{reporter.area}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

const AdminPanel = ({ news, videos, reporters, refreshData }: { news: News[], videos: Video[], reporters: Reporter[], refreshData: () => void }) => {
  const [tab, setTab] = useState<'analytics' | 'news' | 'breaking' | 'videos' | 'reporters' | 'settings'>('analytics');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  const handleDelete = async (type: string, id: any) => {
    if (!confirm('Are you sure you want to delete this?')) return;
    try {
      const res = await fetch(`/api/${type}/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to delete');
      }
      const result = await res.json();
      if (result.changes === 0) {
        console.warn('No changes made during deletion. Item might not exist.');
      }
      refreshData();
    } catch (error: any) {
      console.error('Delete failed:', error);
      alert(`Delete failed: ${error.message}`);
    }
  };

  const BreakingNewsForm = ({ item }: { item?: News }) => {
    const [title, setTitle] = useState(item?.title || '');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setSubmitting(true);
      
      const method = item ? 'PUT' : 'POST';
      const url = item ? `/api/news/${item.id}` : '/api/news';
      
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content: item?.content || 'Breaking News Headline',
          image_url: item?.image_url || '',
          is_breaking: 2 // 2 = Only Breaking (Ticker Only)
        })
      });
      
      setIsModalOpen(false);
      setSubmitting(false);
      refreshData();
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Breaking News Headline</label>
          <input 
            placeholder="Enter headline for the ticker..." 
            value={title} 
            onChange={e => setTitle(e.target.value)} 
            className="w-full p-4 border rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none"
            required
          />
        </div>
        <button 
          type="submit" 
          disabled={submitting}
          className="w-full bg-red-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-red-700 transition-colors shadow-lg shadow-red-600/20 disabled:opacity-50"
        >
          {submitting ? 'Saving...' : (item ? 'Update Headline' : 'Add to Ticker')}
        </button>
      </form>
    );
  };

  const NewsForm = ({ item }: { item?: News }) => {
    const [formData, setFormData] = useState({
      title: item?.title || '',
      content: item?.content || '',
      image_url: item?.image_url || '',
      is_breaking: item?.is_breaking === 1
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setUploading(true);
      
      let finalImageUrl = formData.image_url;

      if (imageFile) {
        const uploadData = new FormData();
        uploadData.append('image', imageFile);
        
        try {
          const uploadRes = await fetch('/api/upload', {
            method: 'POST',
            body: uploadData
          });
          if (!uploadRes.ok) {
            const errorText = await uploadRes.text();
            throw new Error(`Upload failed: ${uploadRes.status} ${errorText}`);
          }
          const uploadResult = await uploadRes.json();
          finalImageUrl = uploadResult.imageUrl;
        } catch (error: any) {
          console.error('Upload failed', error);
          alert(`Image upload failed: ${error.message}`);
          setUploading(false);
          return;
        }
      }

      const method = item ? 'PUT' : 'POST';
      const url = item ? `/api/news/${item.id}` : '/api/news';
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ...formData, 
          image_url: finalImageUrl,
          is_breaking: formData.is_breaking ? 1 : 0 // 1 = Marked as Breaking (Home + Ticker), 0 = Normal
        })
      });
      setIsModalOpen(false);
      setUploading(false);
      refreshData();
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <input 
          placeholder="News Title" 
          value={formData.title} 
          onChange={e => setFormData({...formData, title: e.target.value})} 
          className="w-full p-3 border rounded-xl"
          required
        />
        <textarea 
          placeholder="Content" 
          value={formData.content} 
          onChange={e => setFormData({...formData, content: e.target.value})} 
          className="w-full p-3 border rounded-xl h-32"
          required
        />
        <div className="space-y-2">
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest">News Photo</label>
          <input 
            type="file"
            accept="image/*"
            onChange={e => setImageFile(e.target.files?.[0] || null)}
            className="w-full p-2 border rounded-xl text-sm"
          />
          {formData.image_url && !imageFile && (
            <p className="text-xs text-gray-500">Current image: {formData.image_url}</p>
          )}
        </div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input 
            type="checkbox" 
            checked={formData.is_breaking} 
            onChange={e => setFormData({...formData, is_breaking: e.target.checked})} 
          />
          <span className="text-sm font-medium">Mark as Breaking News</span>
        </label>
        <button 
          type="submit" 
          disabled={uploading}
          className="w-full bg-orange-600 text-white py-3 rounded-xl font-bold disabled:opacity-50"
        >
          {uploading ? 'Uploading...' : (item ? 'Update News' : 'Publish News')}
        </button>
      </form>
    );
  };

  const VideoForm = () => {
    const [formData, setFormData] = useState({ title: '', youtube_url: '' });
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      await fetch('/api/videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      setIsModalOpen(false);
      refreshData();
    };
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <input 
          placeholder="Video Title" 
          value={formData.title} 
          onChange={e => setFormData({...formData, title: e.target.value})} 
          className="w-full p-3 border rounded-xl"
          required
        />
        <input 
          placeholder="YouTube URL" 
          value={formData.youtube_url} 
          onChange={e => setFormData({...formData, youtube_url: e.target.value})} 
          className="w-full p-3 border rounded-xl"
          required
        />
        <button type="submit" className="w-full bg-orange-600 text-white py-3 rounded-xl font-bold">Add Video</button>
      </form>
    );
  };

  const ReporterForm = ({ item }: { item?: Reporter }) => {
    const [formData, setFormData] = useState({ 
      id: item?.id || '', 
      name: item?.name || '', 
      joining_date: item?.joining_date || '', 
      validity: item?.validity || '', 
      area: item?.area || '',
      image_url: item?.image_url || ''
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setUploading(true);

      let finalImageUrl = formData.image_url;
      if (imageFile) {
        const uploadData = new FormData();
        uploadData.append('image', imageFile);
        try {
          const uploadRes = await fetch('/api/upload', {
            method: 'POST',
            body: uploadData
          });
          if (!uploadRes.ok) {
            const errorText = await uploadRes.text();
            throw new Error(`Upload failed: ${uploadRes.status} ${errorText}`);
          }
          const uploadResult = await uploadRes.json();
          finalImageUrl = uploadResult.imageUrl;
        } catch (error: any) {
          console.error('Upload failed', error);
          alert(`Image upload failed: ${error.message}`);
          setUploading(false);
          return;
        }
      }

      const method = item ? 'PUT' : 'POST';
      const url = item ? `/api/reporters/${item.id}` : '/api/reporters';
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, image_url: finalImageUrl })
      });
      setIsModalOpen(false);
      setUploading(false);
      refreshData();
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <input placeholder="Reporter ID" value={formData.id} onChange={e => setFormData({...formData, id: e.target.value})} className="w-full p-3 border rounded-xl" required disabled={!!item} />
        <input placeholder="Full Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-3 border rounded-xl" required />
        <input placeholder="Joining Date" value={formData.joining_date} onChange={e => setFormData({...formData, joining_date: e.target.value})} className="w-full p-3 border rounded-xl" required />
        <input placeholder="Validity" value={formData.validity} onChange={e => setFormData({...formData, validity: e.target.value})} className="w-full p-3 border rounded-xl" required />
        <input placeholder="Area" value={formData.area} onChange={e => setFormData({...formData, area: e.target.value})} className="w-full p-3 border rounded-xl" required />
        <div className="space-y-2">
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest">Reporter Photo</label>
          <input 
            type="file"
            accept="image/*"
            onChange={e => setImageFile(e.target.files?.[0] || null)}
            className="w-full p-2 border rounded-xl text-sm"
          />
        </div>
        <button 
          type="submit" 
          disabled={uploading}
          className="w-full bg-orange-600 text-white py-3 rounded-xl font-bold disabled:opacity-50"
        >
          {uploading ? 'Uploading...' : (item ? 'Update Reporter' : 'Add Reporter')}
        </button>
      </form>
    );
  };

  const SettingsForm = () => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (newPassword !== confirmPassword) {
        setStatus({ type: 'error', message: 'New passwords do not match' });
        return;
      }
      setLoading(true);
      try {
        const res = await fetch('/api/change-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: 'admin', oldPassword, newPassword })
        });
        if (res.ok) {
          setStatus({ type: 'success', message: 'Password changed successfully!' });
          setOldPassword('');
          setNewPassword('');
          setConfirmPassword('');
        } else {
          const data = await res.json();
          setStatus({ type: 'error', message: data.error || 'Failed to change password' });
        }
      } catch (err) {
        setStatus({ type: 'error', message: 'Something went wrong' });
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="p-8 max-w-md mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-orange-100 text-orange-600 rounded-2xl">
            <Lock size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold">Change Password</h3>
            <p className="text-sm text-gray-500">Update your admin access credentials</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Current Password</label>
            <input 
              type="password" 
              value={oldPassword} 
              onChange={e => setOldPassword(e.target.value)} 
              className="w-full p-4 bg-gray-50 border rounded-2xl outline-none focus:ring-2 focus:ring-orange-500" 
              required 
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">New Password</label>
            <input 
              type="password" 
              value={newPassword} 
              onChange={e => setNewPassword(e.target.value)} 
              className="w-full p-4 bg-gray-50 border rounded-2xl outline-none focus:ring-2 focus:ring-orange-500" 
              required 
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Confirm New Password</label>
            <input 
              type="password" 
              value={confirmPassword} 
              onChange={e => setConfirmPassword(e.target.value)} 
              className="w-full p-4 bg-gray-50 border rounded-2xl outline-none focus:ring-2 focus:ring-orange-500" 
              required 
            />
          </div>

          {status && (
            <p className={`text-sm font-bold text-center p-3 rounded-xl ${status.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
              {status.message}
            </p>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-black text-white py-4 rounded-2xl font-bold hover:bg-zinc-800 transition-all disabled:opacity-50"
          >
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    );
  };

  const AnalyticsDashboard = () => {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const fetchStats = async () => {
        try {
          const res = await fetch('/api/analytics/stats');
          const data = await res.json();
          setStats(data);
        } catch (err) {
          console.error('Failed to fetch stats', err);
        } finally {
          setLoading(false);
        }
      };
      fetchStats();
    }, []);

    if (loading) return <div className="p-20 text-center text-gray-400">Loading analytics...</div>;
    if (!stats) return <div className="p-20 text-center text-red-500">Failed to load analytics</div>;

    const COLORS = ['#f97316', '#ef4444', '#3b82f6', '#10b981', '#8b5cf6'];

    return (
      <div className="p-8 space-y-12">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-orange-50 p-6 rounded-3xl border border-orange-100">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-2 bg-orange-500 text-white rounded-xl"><Users size={20} /></div>
              <span className="text-xs font-bold text-orange-900 uppercase tracking-widest">Total Visitors</span>
            </div>
            <p className="text-4xl font-bold text-orange-600">{stats.totalVisits.toLocaleString()}</p>
          </div>
          <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-2 bg-blue-500 text-white rounded-xl"><MousePointer2 size={20} /></div>
              <span className="text-xs font-bold text-blue-900 uppercase tracking-widest">Interactions</span>
            </div>
            <p className="text-4xl font-bold text-blue-600">{stats.totalInteractions.toLocaleString()}</p>
          </div>
          <div className="bg-red-50 p-6 rounded-3xl border border-red-100">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-2 bg-red-500 text-white rounded-xl"><Zap size={20} /></div>
              <span className="text-xs font-bold text-red-900 uppercase tracking-widest">Breaking News Views</span>
            </div>
            <p className="text-4xl font-bold text-red-600">
              {stats.interactionsByType.find((i: any) => i.type === 'breaking_view')?.count || 0}
            </p>
          </div>
          <div className="bg-green-50 p-6 rounded-3xl border border-green-100">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-2 bg-green-500 text-white rounded-xl"><TrendingUp size={20} /></div>
              <span className="text-xs font-bold text-green-900 uppercase tracking-widest">Avg Daily Visits</span>
            </div>
            <p className="text-4xl font-bold text-green-600">
              {Math.round(stats.totalVisits / (stats.visitsByDay.length || 1))}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Daily Visits Chart */}
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <h4 className="text-lg font-bold mb-6 flex items-center gap-2">
              <TrendingUp size={20} className="text-orange-500" /> Daily Visitors (Last 7 Days)
            </h4>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats.visitsByDay}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#9ca3af'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#9ca3af'}} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Line type="monotone" dataKey="count" stroke="#f97316" strokeWidth={4} dot={{ r: 6, fill: '#f97316', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Interaction Types Chart */}
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <h4 className="text-lg font-bold mb-6 flex items-center gap-2">
              <MousePointer2 size={20} className="text-blue-500" /> Interaction Distribution
            </h4>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.interactionsByType}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="count"
                    nameKey="type"
                  >
                    {stats.interactionsByType.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Top News Table */}
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <h4 className="text-lg font-bold mb-6 flex items-center gap-2">
            <Zap size={20} className="text-red-500" /> Most Viewed News Stories
          </h4>
          <div className="space-y-4">
            {stats.topNews.map((news: any, idx: number) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                <div className="flex items-center gap-4">
                  <span className="text-2xl font-black text-gray-200">{idx + 1}</span>
                  <p className="font-bold text-gray-900">{news.title}</p>
                </div>
                <div className="flex items-center gap-2 text-orange-600 font-bold">
                  <Users size={16} />
                  {news.views} views
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <h2 className="text-3xl font-bold">Admin Dashboard</h2>
        <div className="flex bg-gray-100 p-1 rounded-2xl overflow-x-auto">
          <button onClick={() => setTab('analytics')} className={`px-6 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${tab === 'analytics' ? 'bg-white shadow-sm text-orange-600' : 'text-gray-500'}`}>Dashboard</button>
          <button onClick={() => setTab('news')} className={`px-6 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${tab === 'news' ? 'bg-white shadow-sm text-orange-600' : 'text-gray-500'}`}>News</button>
          <button onClick={() => setTab('breaking')} className={`px-6 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${tab === 'breaking' ? 'bg-white shadow-sm text-red-600' : 'text-gray-500'}`}>Breaking</button>
          <button onClick={() => setTab('videos')} className={`px-6 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${tab === 'videos' ? 'bg-white shadow-sm text-orange-600' : 'text-gray-500'}`}>Videos</button>
          <button onClick={() => setTab('reporters')} className={`px-6 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${tab === 'reporters' ? 'bg-white shadow-sm text-orange-600' : 'text-gray-500'}`}>Reporters</button>
          <button onClick={() => setTab('settings')} className={`px-6 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${tab === 'settings' ? 'bg-white shadow-sm text-orange-600' : 'text-gray-500'}`}>Settings</button>
        </div>
        {tab !== 'settings' && tab !== 'analytics' && (
          <button 
            onClick={() => { setEditingItem(null); setIsModalOpen(true); }}
            className={`flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-bold transition-colors ${tab === 'breaking' ? 'bg-red-600 hover:bg-red-700' : 'bg-black hover:bg-zinc-800'} text-white`}
          >
            <Plus size={20} /> Add {tab === 'breaking' ? 'Headline' : `New ${tab.slice(0, -1)}`}
          </button>
        )}
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        {tab === 'settings' ? (
          <SettingsForm />
        ) : tab === 'analytics' ? (
          <AnalyticsDashboard />
        ) : (
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Details</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {tab === 'news' && news.filter(n => n.is_breaking !== 2).map(item => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <img src={item.image_url || "https://picsum.photos/seed/news/100/100"} className="w-12 h-12 rounded-lg object-cover" referrerPolicy="no-referrer" />
                      <div>
                        <p className="font-bold text-gray-900">{item.title}</p>
                        <div className="flex items-center gap-2">
                          <p className="text-xs text-gray-400">{new Date(item.created_at).toLocaleDateString()}</p>
                          {item.is_breaking === 1 && <span className="text-[8px] font-bold text-red-600 uppercase tracking-tighter border border-red-200 px-1 rounded">Ticker</span>}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => { setEditingItem(item); setIsModalOpen(true); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit size={18} /></button>
                      <button onClick={() => handleDelete('news', item.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {tab === 'breaking' && news.filter(n => n.is_breaking === 2).map(item => (
                <tr key={item.id} className="hover:bg-red-50/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
                      <div>
                        <p className="font-bold text-gray-900">{item.title}</p>
                        <p className="text-xs text-gray-400">Active in scrolling ticker (Trigger Only)</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => { setEditingItem(item); setIsModalOpen(true); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit size={18} /></button>
                      <button onClick={() => handleDelete('news', item.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {tab === 'videos' && videos.map(video => (
                <tr key={video.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-bold text-gray-900">{video.title}</p>
                    <p className="text-xs text-gray-400 truncate max-w-xs">{video.youtube_url}</p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => handleDelete('videos', video.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={18} /></button>
                  </td>
                </tr>
              ))}
              {tab === 'reporters' && reporters.map(reporter => (
                <tr key={reporter.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <img src={reporter.image_url || "https://picsum.photos/seed/reporter/100/100"} className="w-12 h-12 rounded-lg object-cover" referrerPolicy="no-referrer" />
                      <div>
                        <p className="font-bold text-gray-900">{reporter.name}</p>
                        <p className="text-xs text-gray-400">{reporter.id} • {reporter.area}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => { setEditingItem(reporter); setIsModalOpen(true); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit size={18} /></button>
                      <button onClick={() => handleDelete('reporters', reporter.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white w-full max-w-lg rounded-3xl p-8 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold">
                  {editingItem ? 'Edit' : 'Add New'} {tab === 'breaking' ? 'Headline' : tab.slice(0, -1)}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full"><X size={24} /></button>
              </div>
              {tab === 'news' && <NewsForm item={editingItem} />}
              {tab === 'breaking' && <BreakingNewsForm item={editingItem} />}
              {tab === 'videos' && <VideoForm />}
              {tab === 'reporters' && <ReporterForm item={editingItem} />}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const LoginPage = ({ onLogin }: { onLogin: () => void }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    if (res.ok) {
      onLogin();
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-20">
      <div className="bg-white p-10 rounded-3xl shadow-xl border border-gray-100">
        <h2 className="text-3xl font-bold text-center mb-8">Admin Access</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <input 
            placeholder="Username" 
            value={username} 
            onChange={e => setUsername(e.target.value)} 
            className="w-full p-4 bg-gray-50 border rounded-2xl outline-none focus:ring-2 focus:ring-orange-500"
            required
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            className="w-full p-4 bg-gray-50 border rounded-2xl outline-none focus:ring-2 focus:ring-orange-500"
            required
          />
          {error && <p className="text-red-500 text-sm text-center font-medium">{error}</p>}
          <button type="submit" className="w-full bg-black text-white py-4 rounded-2xl font-bold text-lg hover:bg-zinc-800 transition-colors">Login</button>
        </form>
      </div>
    </div>
  );
};

const NewsDetailModal = ({ item, onClose }: { item: News, onClose: () => void }) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const shareNews = (platform: string) => {
    const url = window.location.origin + '/news/' + item.id; // Fallback URL
    const text = `Check out this news: ${item.title}`;
    let shareUrl = '';

    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text + ' ' + url)}`;
        break;
    }

    if (shareUrl) window.open(shareUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <Helmet>
        <title>{item.title} | Nexus Odisha News</title>
        <meta name="description" content={item.content?.substring(0, 160) + '...'} />
        <meta property="og:title" content={item.title} />
        <meta property="og:description" content={item.content?.substring(0, 160) + '...'} />
        <meta property="og:image" content={item.image_url || LOGO_URL} />
        <meta property="og:type" content="article" />
      </Helmet>
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col"
      >
        <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full backdrop-blur-md z-20 transition-colors">
          <X size={24} />
        </button>
        
        <div className="overflow-y-auto">
          <div className="relative aspect-video">
            <img 
              src={item.image_url || "https://picsum.photos/seed/news/1200/675"} 
              alt={item.title} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-6 md:p-10 w-full">
              <div className="flex items-center gap-4 mb-4">
                <span className="bg-orange-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                  {item.is_breaking === 1 ? 'Breaking News' : 'Latest News'}
                </span>
                <span className="text-white/70 text-xs font-medium">
                  {new Date(item.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
              </div>
              <h2 className="text-2xl md:text-4xl font-bold text-white leading-tight">
                {item.title}
              </h2>
            </div>
          </div>
          
          <div className="p-6 md:p-12">
            <div className="prose prose-lg max-w-none">
              {(item.content || '').split('\n').map((paragraph, idx) => (
                paragraph.trim() && <p key={idx} className="text-gray-700 leading-relaxed mb-6 text-lg">{paragraph}</p>
              ))}
            </div>
            
            <div className="mt-12 pt-8 border-t border-gray-100 flex flex-wrap items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Share this story</span>
                <div className="flex gap-3">
                  <button onClick={() => shareNews('facebook')} className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all"><Facebook size={20} /></button>
                  <button onClick={() => shareNews('twitter')} className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-sky-500 hover:text-white transition-all"><Twitter size={20} /></button>
                  <button onClick={() => shareNews('whatsapp')} className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-green-500 hover:text-white transition-all"><MessageCircle size={20} /></button>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="px-8 py-3 bg-zinc-900 text-white font-bold rounded-xl hover:bg-orange-600 transition-all shadow-lg"
              >
                Close Story
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [activePage, setActivePage] = useState('home');
  const [news, setNews] = useState<News[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [reporters, setReporters] = useState<Reporter[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedNews, setSelectedNews] = useState<News | null>(null);

  const fetchData = async () => {
    const [newsRes, videosRes, reportersRes] = await Promise.all([
      fetch('/api/news'),
      fetch('/api/videos'),
      fetch('/api/reporters')
    ]);
    setNews(await newsRes.json());
    setVideos(await videosRes.json());
    setReporters(await reportersRes.json());
  };

  const trackVisit = async () => {
    try {
      await fetch('/api/analytics/visit', { method: 'POST' });
    } catch (err) {
      console.error('Failed to track visit', err);
    }
  };

  const trackInteraction = async (type: string, targetId?: any) => {
    try {
      await fetch('/api/analytics/interaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, target_id: targetId?.toString() })
      });
    } catch (err) {
      console.error('Failed to track interaction', err);
    }
  };

  useEffect(() => {
    fetchData();
    trackVisit();
    
    // Check for /admin in URL on load
    if (window.location.pathname === '/admin') {
      setActivePage('admin');
    }

    // Handle back/forward buttons
    const handleLocationChange = () => {
      if (window.location.pathname === '/admin') {
        setActivePage('admin');
      } else if (window.location.pathname === '/') {
        setActivePage('home');
      }
    };

    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  // Update URL when activePage changes to admin or home
  useEffect(() => {
    if (activePage === 'admin' && window.location.pathname !== '/admin') {
      window.history.pushState({}, '', '/admin');
    } else if (activePage === 'home' && window.location.pathname === '/admin') {
      window.history.pushState({}, '', '/');
    }
  }, [activePage]);

  const renderPage = () => {
    switch (activePage) {
      case 'home': return (
        <HomePage 
          news={news} 
          videos={videos} 
          onReadMore={(item) => {
            trackInteraction('news_view', item.id);
            setSelectedNews(item);
          }} 
        />
      );
      case 'about': return <AboutPage />;
      case 'videos': return (
        <VideosPage 
          videos={videos} 
          onVideoClick={(video) => {
            trackInteraction('video_play', video.id);
          }}
        />
      );
      case 'verification': return (
        <VerificationPage 
          onVerify={(id) => {
            trackInteraction('reporter_verify', id);
          }}
        />
      );
      case 'admin': return isAdmin ? <AdminPanel news={news} videos={videos} reporters={reporters} refreshData={fetchData} /> : <LoginPage onLogin={() => { setIsAdmin(true); setActivePage('admin'); }} />;
      default: return (
        <HomePage 
          news={news} 
          videos={videos} 
          onReadMore={(item) => {
            trackInteraction('news_view', item.id);
            setSelectedNews(item);
          }} 
        />
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 selection:bg-orange-100 selection:text-orange-900">
      <BreakingNews 
        news={news} 
        onReadMore={(item) => {
          trackInteraction('breaking_view', item.id);
          setSelectedNews(item);
        }} 
      />
      <Navbar activePage={activePage} setActivePage={setActivePage} isAdmin={isAdmin} />
      
      <main className="pb-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={activePage}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>

      <AnimatePresence>
        {selectedNews && (
          <NewsDetailModal item={selectedNews} onClose={() => setSelectedNews(null)} />
        )}
      </AnimatePresence>

      <footer className="bg-zinc-900 text-white py-16 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <img src={LOGO_URL} alt="Nexus Logo" className="h-10 w-auto object-contain" referrerPolicy="no-referrer" />
                <span className="text-2xl font-bold tracking-tighter text-orange-500">NEXUS ODISHA NEWS</span>
              </div>
              <p className="text-zinc-400 max-w-md leading-relaxed">
                Your trusted source for the latest news, ground reports, and in-depth analysis from across Odisha. We are committed to delivering news that matters to you.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-bold uppercase tracking-widest mb-6 text-white">Quick Links</h4>
              <ul className="space-y-4 text-zinc-400">
                <li><button onClick={() => setActivePage('home')} className="hover:text-orange-500 transition-colors">Home</button></li>
                <li><button onClick={() => setActivePage('about')} className="hover:text-orange-500 transition-colors">About Us</button></li>
                <li><button onClick={() => setActivePage('videos')} className="hover:text-orange-500 transition-colors">Videos</button></li>
                <li><button onClick={() => setActivePage('verification')} className="hover:text-orange-500 transition-colors">Verification</button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-bold uppercase tracking-widest mb-6 text-white">Social Media</h4>
              <div className="flex gap-4">
                <a href="https://www.facebook.com/share/18MWiysCYj/" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-orange-600 transition-all" title="Facebook"><Facebook size={20} /></a>
                <a href="https://x.com/NexusOdisha" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-orange-600 transition-all" title="Twitter"><Twitter size={20} /></a>
                <a href="https://www.instagram.com/nexusodishanews/" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-orange-600 transition-all" title="Instagram"><Instagram size={20} /></a>
                <a href="https://www.youtube.com/@NexusOdishaNews" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-orange-600 transition-all" title="YouTube"><Youtube size={20} /></a>
              </div>
            </div>
          </div>
          <div className="pt-12 border-t border-white/5 text-center text-zinc-500 text-sm">
            <p>&copy; {new Date().getFullYear()} Nexus Odisha News. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
