import React from "react";
import { Lock, Mail, Building2, ChevronRight, ShieldCheck, MapPin } from "lucide-react";
import { motion } from "motion/react";
import { api } from "../lib/api";

interface LoginPageProps {
  onLogin: (user: { name: string; email: string; role: string }) => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [isRegistering, setIsRegistering] = React.useState(false);
  const [name, setName] = React.useState("");
  const [error, setError] = React.useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const response = isRegistering ? await api.register(name, email, password) : await api.login(email, password);
      onLogin(response.user);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed.");
    } finally { setIsLoading(false); }
  };

  return (
    <div className="h-screen w-full flex bg-[#0c0c0c] text-[#f5f2ed] selection:bg-[#d4af37] selection:text-[#1a1a1a] overflow-hidden">
      {/* Visual Side (Left) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[#080808]">
        {/* Animated Background Mesh */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_50%_50%,#d4af37_0%,transparent_50%)]" />
        
        {/* Navi Mumbai Inspired Architectural Backdrop */}
        <motion.div 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.5 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="absolute inset-0 grayscale-[0.2]"
        >
          <img 
            src="https://images.unsplash.com/photo-1524230572899-a752b3835840?q=80&w=2072&auto=format&fit=crop" 
            alt="Navi Mumbai Modern Architecture"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0c0c0c] via-transparent to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0c] via-transparent to-transparent" />
        </motion.div>
        
        <div className="relative z-10 p-20 flex flex-col justify-between h-full w-full">
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center gap-4"
          >
            <div className="p-3 bg-[#d4af37] text-[#1a1a1a] rounded-2xl shadow-[0_0_30px_rgba(212,175,55,0.3)]">
              <Building2 className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-serif font-bold tracking-tighter leading-none">UPTOWN <span className="text-[#d4af37]">CRM</span></h1>
              <div className="flex items-center gap-1.5 mt-1">
                <MapPin className="w-3 h-3 text-[#d4af37]" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#f5f2ed]/40">Navi Mumbai HQ</span>
              </div>
            </div>
          </motion.div>

          <div className="space-y-8">
            <motion.div
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="space-y-4"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/20 text-[#d4af37] text-[10px] font-bold uppercase tracking-[0.3em] backdrop-blur-md">
                Premier Asset Management
              </div>
              <h2 className="text-6xl font-serif font-bold leading-[1.1] tracking-tight">
                The Standard of <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d4af37] to-[#f5f2ed]">Coastal Luxury</span>
              </h2>
            </motion.div>
            
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.1 }}
              className="grid grid-cols-2 gap-12"
            >
              <div>
                <p className="text-3xl font-serif font-bold text-[#d4af37]">450+</p>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#f5f2ed]/30 mt-1">Exclusive Listings</p>
              </div>
              <div>
                <p className="text-3xl font-serif font-bold text-[#d4af37]">₹12B+</p>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#f5f2ed]/30 mt-1">Portfolio Value</p>
              </div>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
            className="flex items-center gap-8 text-[10px] font-bold uppercase tracking-[0.3em] text-[#f5f2ed]/20"
          >
            {["Kharghar", "Belapur", "Panvel"].map((loc, i) => (
              <React.Fragment key={loc}>
                <motion.span 
                  whileHover={{ 
                    color: "#d4af37", 
                    scale: 1.1, 
                    textShadow: "0 0 8px rgba(212,175,55,0.4)" 
                  }}
                  className="cursor-default pointer-events-auto transition-colors"
                >
                  {loc}
                </motion.span>
                {i < 2 && <div className="w-1.5 h-1.5 rounded-full bg-[#d4af37]/40" />}
              </React.Fragment>
            ))}
          </motion.div>
        </div>

        {/* 3D Floating Element Overlay */}
        <div className="absolute top-1/4 right-10 w-64 h-64 bg-[#d4af37]/5 rounded-full blur-[100px] animate-pulse" />
      </div>

      {/* Form Side (Right) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative bg-[#0c0c0c]">
        {/* Subtle 3D background grid */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(#f5f2ed 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        
        <motion.div 
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          whileHover={{ 
            rotateX: 2, 
            rotateY: -2,
            transition: { duration: 0.5 }
          }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{ perspective: 1000 }}
          className="w-full max-w-md space-y-12 relative z-10"
        >
          <div className="space-y-4">
            <div className="lg:hidden flex items-center gap-3 mb-10">
              <div className="p-2.5 bg-[#d4af37] rounded-xl">
                <Building2 className="w-6 h-6 text-[#1a1a1a]" />
              </div>
              <h1 className="text-xl font-serif font-bold tracking-tighter">UPTOWN CRM</h1>
            </div>
            
            <div className="flex items-center gap-2 text-[#d4af37]">
              <ShieldCheck className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Administrative Control Point</span>
            </div>
            <h3 className="text-5xl font-serif font-bold tracking-tight">{isRegistering ? "Create Account" : "System Login"}</h3>
            <p className="text-sm text-[#f5f2ed]/40 font-medium leading-relaxed">
              Login to access the Navi Mumbai lead distribution terminal and portfolio analytics.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-5">
              {isRegistering && <motion.div whileHover={{ scale: 1.01 }} className="space-y-2 group"><label className="text-[10px] uppercase font-bold text-[#f5f2ed]/30 tracking-widest ml-1">Full Name</label><input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Aarav Mehta" className="w-full bg-[#161616] border border-white/5 rounded-2xl py-5 px-5 text-sm font-medium outline-none focus:border-[#d4af37]/30" /></motion.div>}
              <motion.div 
                whileHover={{ scale: 1.01 }}
                className="space-y-2 group"
              >
                <label className="text-[10px] uppercase font-bold text-[#f5f2ed]/30 tracking-widest ml-1 group-focus-within:text-[#d4af37] transition-colors">Credential Email</label>
                <div className="relative">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#f5f2ed]/20 group-focus-within:text-[#d4af37] transition-colors" />
                  <input 
                    required
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@uptown.realestate"
                    className="w-full bg-[#161616] border border-white/5 rounded-2xl py-5 pl-14 pr-4 text-sm font-medium outline-none focus:border-[#d4af37]/30 focus:ring-4 focus:ring-[#d4af37]/5 transition-all placeholder:text-white/5"
                  />
                </div>
              </motion.div>

              <motion.div 
                whileHover={{ scale: 1.01 }}
                className="space-y-2 group"
              >
                <div className="flex justify-between items-center px-1">
                  <label className="text-[10px] uppercase font-bold text-[#f5f2ed]/30 tracking-widest group-focus-within:text-[#d4af37] transition-colors">Access Key</label>
                </div>
                <div className="relative">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#f5f2ed]/20 group-focus-within:text-[#d4af37] transition-colors" />
                  <input 
                    required
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#161616] border border-white/5 rounded-2xl py-5 pl-14 pr-4 text-sm font-medium outline-none focus:border-[#d4af37]/30 focus:ring-4 focus:ring-[#d4af37]/5 transition-all placeholder:text-white/5"
                  />
                </div>
              </motion.div>
            </div>

            {error && <p className="text-sm text-red-400" role="alert">{error}</p>}

            <motion.button 
              disabled={isLoading}
              whileHover={{ scale: 1.02, backgroundColor: "#d4af37" }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-[#f5f2ed] text-[#1a1a1a] font-black uppercase tracking-[0.3em] text-[11px] py-5 rounded-2xl transition-all shadow-[0_20px_40px_rgba(0,0,0,0.4)] flex items-center justify-center gap-3 group disabled:opacity-50 disabled:scale-100"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-[#1a1a1a]/20 border-t-[#1a1a1a] rounded-full animate-spin" />
              ) : (
                <>
                  Enter Dashboard
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                </>
              )}
            </motion.button>
          </form>

          <button type="button" onClick={() => { setIsRegistering(!isRegistering); setError(""); }} className="w-full text-xs text-[#d4af37] hover:underline">
            {isRegistering ? "Already have an account? Sign in" : "Need an account? Register"}
          </button>

          <div className="pt-12 border-t border-white/5">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-[1px] flex-1 bg-white/5" />
              <span className="text-[8px] font-black uppercase tracking-[0.4em] text-[#f5f2ed]/20">Agency Protocol</span>
              <div className="h-[1px] flex-1 bg-white/5" />
            </div>
            <p className="text-[10px] text-[#f5f2ed]/30 leading-loose text-center">
              Restricted to authorize Uptown Realty personnel of <span className="text-[#f5f2ed]/60 font-bold">Navi Mumbai District</span>. <br />
              All synchronization is encrypted via AES-256 standards.
            </p>
          </div>
        </motion.div>
        
        {/* Subtle bottom shadow decoration */}
        <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-[#d4af37]/5 blur-[120px] rounded-full translate-x-1/4 translate-y-1/4 pointer-events-none" />
      </div>
    </div>
  );
}
