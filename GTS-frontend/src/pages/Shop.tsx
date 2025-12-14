import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Filter, ChevronDown, Candy, Sparkles } from 'lucide-react'; // Added icons
import { sweetsApi } from '../services/api';
import type { Sweet, SearchParams } from '../types';
import { SweetCard } from '../components/SweetCard';
import { SearchBar } from '../components/SearchBar';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useToast } from '../contexts/ToastContext';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

const categories = ['all', 'cake', 'candy', 'chocolate','cookie','Halwa','Milk based','Dry fruit Based','Syrup based'];

export const Shop = () => {
  const [sweets, setSweets] = useState<Sweet[]>([]);
  const [filteredSweets, setFilteredSweets] = useState<Sweet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState<'name' | 'price-low' | 'price-high'>('name');
  const { showToast } = useToast();
  const { isAuthenticated, isAdmin } = useAuth();
  const { addToCart } = useCart();

  const fetchSweets = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await sweetsApi.getAll();
      setSweets(data);
    } catch {
      showToast('Failed to load sweets', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  const filterAndSortSweets = useCallback(() => {
    let filtered = selectedCategory === 'all'
      ? sweets
      : sweets.filter((sweet) => sweet.category === selectedCategory);

    filtered = [...filtered].sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      return 0;
    });

    setFilteredSweets(filtered);
  }, [sweets, selectedCategory, sortBy]);

  useEffect(() => {
    fetchSweets();
  }, [fetchSweets]);

  useEffect(() => {
    filterAndSortSweets();
  }, [filterAndSortSweets]);

  const handleSearch = async (params: SearchParams) => {
    if (!params.q && !params.priceMin && !params.priceMax) {
      setFilteredSweets(sweets);
      return;
    }

    try {
      setIsLoading(true);
      const data = await sweetsApi.search(params);
      setFilteredSweets(data.sweets);
    } catch {
      showToast('Search failed', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = async (id: string, quantity: number) => {
    if (!isAuthenticated) {
      showToast('Please login to add items to cart', 'error');
      return;
    }

    if (isAdmin) {
      showToast('Admins cannot add items to cart', 'error');
      return;
    }

    try {
      const result = await addToCart(id, quantity);
      if (result.success) {
        showToast('Added to cart successfully!', 'success');
      } else {
        showToast(result.error || 'Failed to add to cart', 'error');
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      showToast(err.response?.data?.message || 'Failed to add to cart', 'error');
    }
  };

  const handlePurchase = async (id: string, quantity: number) => {
    if (!isAuthenticated) {
      showToast('Please login to purchase', 'error');
      return;
    }

    try {
      await sweetsApi.purchase(id, { quantity });
      showToast('Purchase successful!', 'success');
      fetchSweets();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      showToast(err.response?.data?.message || 'Purchase failed', 'error');
    }
  };

  if (isLoading && sweets.length === 0) {
    return (
      <div className="min-h-screen bg-[#FFFBF0] flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFBF0] font-sans text-gray-900 pb-20 overflow-x-hidden">
      
      {/* --- Header Section --- */}
      <div className="bg-purple-100 border-b-4 border-black py-12 relative overflow-hidden">
        {/* Floating Icons Background */}
        <motion.div 
          animate={{ y: [0, -20, 0], rotate: 10 }} 
          transition={{ duration: 5, repeat: Infinity }}
          className="absolute top-10 right-20 text-purple-300 opacity-50 hidden lg:block"
        >
          <Candy size={100} />
        </motion.div>
        <motion.div 
          animate={{ y: [0, 20, 0], rotate: -10 }} 
          transition={{ duration: 7, repeat: Infinity }}
          className="absolute bottom-5 left-10 text-pink-300 opacity-50 hidden lg:block"
        >
          <Sparkles size={80} />
        </motion.div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-block bg-white px-6 py-2 rounded-full border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-4">
              <span className="font-black uppercase tracking-widest text-sm">Official Store</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-4 text-black">
              Sweet <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">Inventory</span>
            </h1>
            <p className="text-xl font-bold text-gray-600 max-w-2xl mx-auto">
              Warning: Browsing may cause extreme cravings. Proceed with caution.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-8 relative z-20">
        {/* --- Search Section --- */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-2xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-12 max-w-4xl mx-auto"
        >
          <SearchBar onSearch={handleSearch} />
        </motion.div>

        {/* --- Controls Section (Filter & Sort) --- */}
        <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between mb-10">
          
          {/* Categories */}
          <div className="w-full lg:w-auto">
            <div className="flex items-center gap-2 mb-3 text-sm font-black uppercase tracking-wide text-gray-500">
              <Filter className="w-4 h-4" /> Filter by Category
            </div>
            <div className="flex flex-wrap gap-3">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-5 py-2 rounded-xl font-bold border-2 transition-all capitalize ${
                    selectedCategory === category
                      ? 'bg-black text-white border-black shadow-[4px_4px_0px_0px_rgba(236,72,153,1)] transform -translate-y-1'
                      : 'bg-white text-gray-700 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Sort Dropdown */}
          <div className="w-full lg:w-auto min-w-[200px]">
             <div className="flex items-center gap-2 mb-3 text-sm font-black uppercase tracking-wide text-gray-500">
               Sort By
            </div>
            <div className="relative group">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="w-full appearance-none px-5 py-3 bg-white border-2 border-black rounded-xl font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_#A855F7] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer"
              >
                <option value="name">Name (A-Z)</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <ChevronDown className="w-5 h-5 text-black" />
              </div>
            </div>
          </div>
        </div>

        {/* --- Product Grid --- */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <LoadingSpinner />
          </div>
        ) : filteredSweets.length === 0 ? (
          <div className="text-center py-20 bg-white border-2 border-black border-dashed rounded-3xl">
            <Candy className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <p className="text-2xl font-black text-gray-400 uppercase">No sweets found</p>
            <p className="text-gray-500 font-bold">Try adjusting your filters</p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          >
            {filteredSweets.map((sweet, index) => (
              <motion.div
                key={sweet._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="h-full"
              >
                {/* 
                   Note: SweetCard logic is internal, but this wrapper ensures 
                   grid placement is smooth. Ideally, SweetCard should also 
                   be updated to match the Border/Shadow theme.
                */}
                <SweetCard 
                  sweet={sweet} 
                  onPurchase={handlePurchase}
                  onAddToCart={handleAddToCart}
                  isAdmin={isAdmin || false} 
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};