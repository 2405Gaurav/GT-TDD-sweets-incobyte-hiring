import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Package, Minus, Plus, AlertCircle } from 'lucide-react';
import type { Sweet } from '../types';

interface SweetCardProps {
  sweet: Sweet;
  onPurchase?: (id: string, quantity: number) => void;
  onAddToCart?: (id: string, quantity: number) => void;
  isAdmin: boolean;
}

export const SweetCard = ({ sweet, onPurchase, onAddToCart, isAdmin }: SweetCardProps) => {
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const handleIncrement = () => {
    if (quantity < sweet.quantity) {
      setQuantity(quantity + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = async () => {
    if (onAddToCart && !isAdmin) {
      setIsAdding(true);
      await onAddToCart(sweet._id, quantity);
      setIsAdding(false);
      setQuantity(1); // Reset quantity after adding
    }
  };

  const handlePurchase = () => {
    if (onPurchase) {
      onPurchase(sweet._id, quantity);
      setQuantity(1);
    }
  };

  // Helper to determine stock badge color/style
  const getStockStatus = () => {
    if (sweet.quantity === 0) return { color: 'bg-red-500 text-white', text: 'Sold Out' };
    if (sweet.quantity < 10) return { color: 'bg-yellow-400 text-black', text: `Only ${sweet.quantity} Left!` };
    return { color: 'bg-green-400 text-black', text: 'In Stock' };
  };

  const stockInfo = getStockStatus();

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white rounded-2xl overflow-hidden border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] h-full flex flex-col relative group"
    >
      {/* Image Section */}
      <div className="relative h-56 bg-gray-50 border-b-2 border-black flex items-center justify-center overflow-hidden group-hover:bg-yellow-50 transition-colors">
        {sweet.imageUrl ? (
          <img
            src={sweet.imageUrl}
            alt={sweet.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <motion.span 
            className="text-7xl select-none"
            whileHover={{ rotate: [0, 10, -10, 0] }}
          >
            🍬
          </motion.span>
        )}
        
        {/* Stock Badge (Sticker Style) */}
        <div className={`absolute top-3 right-3 px-3 py-1 rounded-lg border-2 border-black text-xs font-black uppercase tracking-wide shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${stockInfo.color}`}>
          {stockInfo.text}
        </div>

        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="px-3 py-1 bg-white border-2 border-black rounded-full text-xs font-black text-black uppercase tracking-wide shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            {sweet.category}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex-grow">
          <div className="flex justify-between items-start gap-2 mb-2">
            <h3 className="text-xl font-black text-black uppercase leading-tight line-clamp-2">
              {sweet.name}
            </h3>
            <span className="shrink-0 bg-pink-500 text-white px-2 py-1 rounded-md border-2 border-black text-sm font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              ₹{sweet.price.toFixed(2)}
            </span>
          </div>

          {sweet.description && (
            <p className="text-sm text-gray-600 font-medium mb-4 line-clamp-2 border-l-4 border-gray-200 pl-3">
              {sweet.description}
            </p>
          )}
        </div>

        {/* Action Area */}
        <div className="mt-4 pt-4 border-t-2 border-dashed border-gray-300">
          
          {/* Quantity Controls */}
          {!isAdmin && sweet.quantity > 0 && (
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-black uppercase text-gray-500">Quantity</span>
              <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg border-2 border-black">
                <button
                  onClick={handleDecrement}
                  disabled={quantity <= 1}
                  className="w-8 h-8 flex items-center justify-center bg-white rounded-md border-2 border-black hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors active:scale-95"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center font-black text-lg">
                  {quantity}
                </span>
                <button
                  onClick={handleIncrement}
                  disabled={quantity >= sweet.quantity}
                  className="w-8 h-8 flex items-center justify-center bg-white rounded-md border-2 border-black hover:bg-green-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {!isAdmin ? (
            <div className="flex gap-2">
              {/* Add to Cart */}
              {onAddToCart && (
                <button
                  onClick={handleAddToCart}
                  disabled={sweet.quantity === 0 || isAdding}
                  className="flex-1 flex items-center justify-center gap-2 bg-yellow-400 text-black border-2 border-black font-black uppercase tracking-tight py-3 rounded-xl hover:bg-yellow-500 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:transform-none"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {isAdding ? 'Adding...' : 'Add Cart'}
                </button>
              )}

              {/* Quick Purchase */}
              {onPurchase && (
                <button
                  onClick={handlePurchase}
                  disabled={sweet.quantity === 0}
                  className="w-14 flex items-center justify-center bg-purple-500 text-white border-2 border-black rounded-xl hover:bg-purple-600 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:transform-none"
                  title="Buy Now"
                >
                  <Package className="w-6 h-6" />
                </button>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2 py-3 bg-gray-100 rounded-lg border-2 border-gray-300 border-dashed">
              <AlertCircle className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-bold text-gray-500 uppercase">
                Admin View
              </span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};