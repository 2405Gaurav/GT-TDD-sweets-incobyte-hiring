import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { User, ShoppingBag, Heart, LogOut, Star, Smile, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#FFFBF0] py-12 px-4 font-sans text-gray-900 relative overflow-hidden">
      
      {/* --- Floating Background Elements --- */}
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-10 left-10 text-yellow-400 opacity-30 pointer-events-none hidden lg:block"
      >
        <Star size={120} strokeWidth={2} />
      </motion.div>
      <motion.div 
        animate={{ y: [0, -30, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-10 right-10 text-purple-300 opacity-30 pointer-events-none hidden lg:block"
      >
        <Smile size={140} strokeWidth={2} />
      </motion.div>

      <div className="container mx-auto max-w-6xl relative z-10">
        
        {/* --- Header Section --- */}
        <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-3xl p-8 mb-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <motion.div 
              whileHover={{ rotate: 10, scale: 1.1 }}
              className="w-20 h-20 bg-yellow-400 rounded-full border-4 border-black flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            >
              <span className="text-3xl font-black">{user?.name?.charAt(0).toUpperCase()}</span>
            </motion.div>
            <div>
              <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-none mb-2">
                Hey, {user?.name}!
              </h1>
              <div className="inline-block bg-pink-100 px-3 py-1 rounded-md border-2 border-black transform -rotate-1">
                <p className="text-sm font-bold uppercase tracking-wide">Customer Dashboard</p>
              </div>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05, rotate: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="flex items-center gap-2 px-6 py-3 bg-red-500 text-white font-black uppercase border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-red-600 transition-all"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </motion.button>
        </div>

        {/* --- Grid Section --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
          
          {/* Profile Card */}
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-white p-0 rounded-2xl border-4 border-black shadow-[8px_8px_0px_0px_#EC4899] overflow-hidden flex flex-col"
          >
            <div className="bg-pink-500 p-6 border-b-4 border-black flex items-center justify-between">
              <h3 className="text-2xl font-black text-white uppercase">My Profile</h3>
              <User className="w-8 h-8 text-white" />
            </div>
            <div className="p-6 flex-grow space-y-4">
              <div className="p-3 bg-gray-50 border-2 border-black rounded-xl">
                <span className="block text-xs font-black text-gray-400 uppercase">Full Name</span>
                <span className="block text-lg font-bold">{user?.name}</span>
              </div>
              <div className="p-3 bg-gray-50 border-2 border-black rounded-xl">
                <span className="block text-xs font-black text-gray-400 uppercase">Email Address</span>
                <span className="block text-lg font-bold truncate">{user?.email}</span>
              </div>
              <div className="p-3 bg-gray-50 border-2 border-black rounded-xl">
                 <span className="block text-xs font-black text-gray-400 uppercase">Status</span>
                 <span className="inline-flex items-center gap-2 font-bold text-green-600">
                   <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /> Active Member
                 </span>
              </div>
            </div>
          </motion.div>

          {/* Orders Card */}
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-white p-0 rounded-2xl border-4 border-black shadow-[8px_8px_0px_0px_#A855F7] overflow-hidden flex flex-col"
          >
            <div className="bg-purple-500 p-6 border-b-4 border-black flex items-center justify-between">
              <h3 className="text-2xl font-black text-white uppercase">My Orders</h3>
              <ShoppingBag className="w-8 h-8 text-white" />
            </div>
            <div className="p-6 flex-grow flex flex-col justify-between">
              <p className="text-gray-600 font-bold mb-6">
                Hungry for history? Check out your past sweet hauls here.
              </p>
              
              {/* Placeholder for order list or empty state */}
              <div className="bg-purple-50 border-2 border-dashed border-purple-200 rounded-xl p-4 mb-6 text-center">
                 <p className="text-sm font-bold text-purple-400">No recent orders found</p>
              </div>

              <Link to="/shop" className="w-full">
                <button className="w-full px-4 py-3 bg-purple-100 hover:bg-purple-200 text-purple-900 font-black uppercase border-2 border-black rounded-xl transition-colors flex items-center justify-center gap-2">
                  Shop Now <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
          </motion.div>

          {/* Favorites Card */}
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-white p-0 rounded-2xl border-4 border-black shadow-[8px_8px_0px_0px_#3B82F6] overflow-hidden flex flex-col"
          >
            <div className="bg-blue-500 p-6 border-b-4 border-black flex items-center justify-between">
              <h3 className="text-2xl font-black text-white uppercase">Favorites</h3>
              <Heart className="w-8 h-8 text-white fill-current" />
            </div>
            <div className="p-6 flex-grow flex flex-col justify-between">
              <p className="text-gray-600 font-bold mb-6">
                Your curated collection of top-tier treats.
              </p>
               
               {/* Placeholder */}
              <div className="bg-blue-50 border-2 border-dashed border-blue-200 rounded-xl p-4 mb-6 text-center">
                 <p className="text-sm font-bold text-blue-400">Your list is empty</p>
              </div>

              <Link to="/shop" className="w-full">
                <button className="w-full px-4 py-3 bg-blue-100 hover:bg-blue-200 text-blue-900 font-black uppercase border-2 border-black rounded-xl transition-colors flex items-center justify-center gap-2">
                  Explore Sweets <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* --- Promo Banner --- */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-black text-white rounded-3xl p-8 md:p-12 border-4 border-black shadow-[8px_8px_0px_0px_#FACC15] text-center relative overflow-hidden"
        >
          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-black uppercase mb-4 tracking-tighter">
              Cravings <span className="text-yellow-400">Kickin' In?</span>
            </h2>
            <p className="text-gray-400 text-lg md:text-xl font-bold mb-8 max-w-2xl mx-auto">
              Our shelves are stocked with fresh sugar. Don't let your sweet tooth wait another minute.
            </p>
            <Link to="/shop">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-4 bg-yellow-400 text-black text-xl font-black uppercase rounded-full border-4 border-white shadow-[0px_0px_20px_rgba(250,204,21,0.4)] hover:shadow-[0px_0px_30px_rgba(250,204,21,0.6)] transition-all"
              >
                Go To Shop
              </motion.button>
            </Link>
          </div>
          
          {/* Decorative Pattern */}
          <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-500 via-black to-black pointer-events-none"></div>
        </motion.div>

      </div>
    </div>
  );
};