import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, CheckCircle, Package } from 'lucide-react';
import { LoadingSpinner } from '../components/LoadingSpinner';

export const CartPage = () => {
  const { cart, cartSummary, loading, updateQuantity, removeItem, clearCart, checkout } = useCart();
  const navigate = useNavigate();
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [processingCheckout, setProcessingCheckout] = useState(false);

  const handleQuantityChange = async (itemId: string, currentQuantity: number, change: number) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity < 1) return;
    await updateQuantity(itemId, newQuantity);
  };

  const handleRemoveItem = async (itemId: string) => {
    if (confirm('Remove this sweet treat?')) {
      await removeItem(itemId);
    }
  };

  const handleClearCart = async () => {
    if (confirm('Are you sure you want to empty your cart?')) {
      await clearCart();
    }
  };

  const handleCheckout = async () => {
    setProcessingCheckout(true);
    const result = await checkout();
    setProcessingCheckout(false);
    
    if (result.success) {
      setCheckoutSuccess(true);
      setTimeout(() => {
        navigate('/shop');
      }, 3000);
    } else {
      alert(result.error || 'Checkout failed');
    }
  };

  if (checkoutSuccess) {
    return (
      <div className="min-h-screen bg-[#FFFBF0] flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="bg-white border-4 border-black rounded-3xl p-12 text-center shadow-[10px_10px_0px_0px_#22c55e]"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-6 inline-block"
          >
            <div className="w-24 h-24 bg-green-500 rounded-full border-4 border-black flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
          </motion.div>
          <h1 className="text-4xl font-black text-black uppercase mb-4">Order Placed!</h1>
          <p className="text-xl font-bold text-gray-600 mb-6">Sugar rush incoming... 🎉</p>
          <div className="inline-block px-4 py-2 bg-black text-white font-bold rounded-lg animate-pulse">
            Redirecting to shop...
          </div>
        </motion.div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-[#FFFBF0] py-20 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-xl mx-auto text-center bg-white border-4 border-black rounded-3xl p-12 shadow-[10px_10px_0px_0px_#A855F7]"
          >
            <div className="w-24 h-24 bg-purple-100 rounded-full border-4 border-black flex items-center justify-center mx-auto mb-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
               <ShoppingBag className="w-10 h-10 text-black" />
            </div>
            <h2 className="text-4xl font-black text-black uppercase mb-4 tracking-tighter">Cart Empty</h2>
            <p className="text-xl text-gray-600 font-bold mb-10">You haven't added any sugar yet!</p>
            <button
              onClick={() => navigate('/shop')}
              className="w-full bg-yellow-400 text-black font-black uppercase text-xl py-4 rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
            >
              Start Shopping
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFBF0] py-12 px-4 font-sans text-gray-900">
      <div className="container mx-auto max-w-6xl">
        
        <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/shop')}
              className="p-3 bg-white border-2 border-black rounded-xl hover:bg-gray-100 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">Your Stash</h1>
          </div>
          {cart.items.length > 0 && (
            <button
              onClick={handleClearCart}
              className="px-4 py-2 bg-red-100 text-red-600 font-bold uppercase text-sm border-2 border-red-200 rounded-lg hover:bg-red-200 hover:border-red-400 transition-colors flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" /> Clear All
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          <div className="lg:col-span-2 space-y-6">
            <AnimatePresence>
              {cart.items.map((item) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 100 }}
                  layout
                  className="bg-white rounded-2xl p-4 md:p-6 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
                >
                  <div className="flex flex-col md:flex-row items-center gap-6">
                    
                    <div className="w-full md:w-24 h-24 shrink-0 bg-gray-50 border-2 border-black rounded-xl flex items-center justify-center overflow-hidden">
                      {item.sweetId.imageUrl ? (
                        <img
                          src={item.sweetId.imageUrl}
                          alt={item.sweetId.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-4xl">🍬</span>
                      )}
                    </div>

                    <div className="flex-1 text-center md:text-left w-full">
                      <div className="flex flex-col md:flex-row md:items-start justify-between mb-2">
                        <div>
                           <h3 className="text-xl font-black text-black uppercase leading-tight mb-1">
                            {item.sweetId.name}
                          </h3>
                          <div className="inline-block px-2 py-0.5 bg-gray-100 border border-gray-300 rounded text-xs font-bold uppercase text-gray-500">
                            {item.sweetId.category}
                          </div>
                        </div>
                        <div className="mt-2 md:mt-0 text-2xl font-black text-purple-600">
                          ₹{(item.priceAtTime * item.quantity).toFixed(2)}
                        </div>
                      </div>

                      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-4">
                         <div className="text-sm font-bold text-gray-500">
                            Unit Price: ₹{item.priceAtTime.toFixed(2)}
                         </div>

                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg border-2 border-black">
                            <button
                              onClick={() => handleQuantityChange(item._id, item.quantity, -1)}
                              disabled={loading || item.quantity <= 1}
                              className="w-8 h-8 flex items-center justify-center bg-white rounded-md border-2 border-black hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors active:scale-95"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-10 text-center font-black text-lg">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleQuantityChange(item._id, item.quantity, 1)}
                              disabled={loading}
                              className="w-8 h-8 flex items-center justify-center bg-white rounded-md border-2 border-black hover:bg-green-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors active:scale-95"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>

                          <button
                            onClick={() => handleRemoveItem(item._id)}
                            disabled={loading}
                            className="p-2 text-red-500 hover:bg-red-100 hover:text-red-700 rounded-lg border-2 border-transparent hover:border-red-200 transition-colors disabled:opacity-50"
                            title="Remove Item"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="lg:col-span-1 sticky top-24">
            <div className="bg-yellow-50 rounded-2xl p-6 border-4 border-black shadow-[8px_8px_0px_0px_#000]">
              <div className="flex items-center gap-2 mb-6 border-b-2 border-black pb-4">
                <Package className="w-6 h-6" />
                <h2 className="text-2xl font-black uppercase">Order Summary</h2>
              </div>
              
              <div className="space-y-4 mb-8 font-bold text-gray-700">
                <div className="flex justify-between">
                  <span>Items ({cartSummary.itemCount})</span>
                  <span>₹{cartSummary.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (18% GST)</span>
                  <span>₹{cartSummary.tax.toFixed(2)}</span>
                </div>
                <div className="border-t-2 border-black border-dashed pt-4 flex justify-between text-2xl font-black text-black">
                  <span>Total</span>
                  <span>₹{cartSummary.total.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={loading || processingCheckout || cart.items.length === 0}
                className="w-full bg-black text-white font-black uppercase text-lg py-4 rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_#A855F7] hover:bg-gray-900 hover:shadow-[6px_6px_0px_0px_#A855F7] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed mb-4"
              >
                {processingCheckout ? (
                   <span className="flex items-center justify-center gap-2"><LoadingSpinner /> Processing</span>
                ) : (
                   'Checkout Now'
                )}
              </button>

              <button
                onClick={() => navigate('/shop')}
                className="w-full bg-white text-black font-black uppercase text-sm py-3 rounded-xl border-2 border-black hover:bg-gray-50 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
            
            <div className="mt-4 text-center">
               <p className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center justify-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span> Secure Checkout
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};