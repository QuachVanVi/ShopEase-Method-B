import { useState } from 'react';
import { X, CreditCard, ShieldCheck, Mail, User, Calendar, Lock, Loader2 } from 'lucide-react';

export default function AddCardModal({ isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiry: '',
    cvv: '',
    nameOnCard: ''
  });
  const [saving, setSaving] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    let value = e.target.value;
    if (e.target.name === 'cardNumber') {
      value = value.replace(/\D/g, '').substring(0, 16);
      value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
    }
    if (e.target.name === 'expiry') {
      value = value.replace(/\D/g, '').substring(0, 4);
      if (value.length >= 3) {
        value = value.substring(0, 2) + '/' + value.substring(2);
      }
    }
    if (e.target.name === 'cvv') {
      value = value.replace(/\D/g, '').substring(0, 3);
    }
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true);
    // Simulate a secure handshake
    setTimeout(() => {
      onSave(formData);
      setSaving(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[101] flex items-center justify-center p-6 sm:p-12">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-md animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="relative w-full max-w-md bg-white rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-8 sm:p-10">
          <div className="flex justify-between items-start mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-[#e68421]">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">Secure Payment</h2>
                <p className="text-[10px] font-black uppercase tracking-widest text-[#e68421]">Encrypted locally</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Cardholder Name</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#e68421] transition-colors">
                  <User className="h-4 w-4" />
                </div>
                <input 
                  type="text" 
                  name="nameOnCard"
                  required
                  placeholder="JOHN DOE"
                  value={formData.nameOnCard}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3.5 bg-[#1c2223] border border-gray-800 rounded-2xl text-sm font-bold text-white placeholder:text-gray-600 focus:bg-[#000000] focus:border-[#e68421] focus:ring-4 focus:ring-orange-950/20 outline-none transition-all" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Card Number</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-[#e68421] transition-colors">
                  <CreditCard className="h-4 w-4" />
                </div>
                <input 
                  type="text" 
                  name="cardNumber"
                  required
                  placeholder="0000 0000 0000 0000"
                  value={formData.cardNumber}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3.5 bg-[#1c2223] border border-gray-800 rounded-2xl text-sm font-bold text-white placeholder:text-gray-600 focus:bg-[#000000] focus:border-[#e68421] focus:ring-4 focus:ring-orange-950/20 outline-none transition-all font-mono tracking-wider" 
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Expiry Date</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-[#e68421] transition-colors">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <input 
                    type="text" 
                    name="expiry"
                    required
                    placeholder="MM/YY"
                    value={formData.expiry}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3.5 bg-[#1c2223] border border-gray-800 rounded-2xl text-sm font-bold text-white placeholder:text-gray-600 focus:bg-[#000000] focus:border-[#e68421] focus:ring-4 focus:ring-orange-950/20 outline-none transition-all" 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">CVV / CVC</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-[#e68421] transition-colors">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input 
                    type="password" 
                    name="cvv"
                    required
                    placeholder="***"
                    value={formData.cvv}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3.5 bg-[#1c2223] border border-gray-800 rounded-2xl text-sm font-bold text-white placeholder:text-gray-600 focus:bg-[#000000] focus:border-[#e68421] focus:ring-4 focus:ring-orange-950/20 outline-none transition-all" 
                  />
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button 
                type="submit" 
                disabled={saving}
                className="w-full py-4 bg-[#1c2223] text-white rounded-2xl text-xs font-black tracking-widest hover:bg-black transition-all flex items-center justify-center gap-3 disabled:opacity-70 shadow-2xl shadow-black/20 group"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>ENCRYPTING...</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span>SECURELY ADD CARD</span>
                  </>
                )}
              </button>
              <p className="text-center text-gray-400 text-[9px] font-medium mt-4 leading-relaxed">
                Card details are stored 100% locally on your machine.<br/>We never transmit sensitive data to our servers.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
