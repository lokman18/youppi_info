import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { useRouter, Link } from '../router/Router';
import { 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  Zap 
} from 'lucide-react';

interface AuthPageProps {
  initialMode?: 'login' | 'register';
}

export const AuthPage: React.FC<AuthPageProps> = ({ initialMode = 'login' }) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const { user, login, register, loginDemo, logout } = useAuth();
  const { navigate } = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (mode === 'login') {
        const success = await login(email, password);
        if (success) {
          navigate('/');
        }
      } else {
        const success = await register(name, email, password);
        if (success) {
          navigate('/');
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoClient = () => {
    loginDemo('customer');
    navigate('/');
  };

  const handleDemoAdmin = () => {
    loginDemo('admin');
    navigate('/admin');
  };

  if (user) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-6">
        <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm space-y-6">
          <div className="w-20 h-20 rounded-full bg-blue-100 text-[#0075FF] mx-auto flex items-center justify-center font-bold text-2xl">
            {user.name.charAt(0).toUpperCase()}
          </div>

          <div className="space-y-1">
            <h1 className="text-xl font-black text-slate-900">
              Connecté en tant que {user.name}
            </h1>
            <p className="text-xs text-slate-500 font-mono">{user.email}</p>
            <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 uppercase tracking-wide">
              Rôle : {user.role === 'admin' ? 'Administrateur' : 'Client VIP'}
            </span>
          </div>

          <div className="pt-2 space-y-2">
            <button
              onClick={() => navigate('/products')}
              className="w-full py-3 bg-gradient-to-r from-[#0075FF] to-[#0060DF] hover:from-[#0066E0] hover:to-[#004EC2] text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-md shadow-blue-500/25"
            >
              Accéder à la boutique
            </button>

            {user.role === 'admin' && (
              <button
                onClick={() => navigate('/admin')}
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                Tableau de Bord Admin
              </button>
            )}

            <button
              onClick={logout}
              className="w-full py-2.5 text-xs text-slate-500 hover:text-red-600 transition-colors cursor-pointer"
            >
              Se déconnecter
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-12 sm:py-16">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-3xl border border-slate-200/80 shadow-md p-6 sm:p-8 space-y-6"
      >
        {/* Brand Wordmark */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-[#0A1128] border border-blue-400/30 overflow-hidden mx-auto flex items-center justify-center shadow-lg shadow-blue-500/20">
            <img src="/logo-emblem-transparent.png" alt="YOUPPI INFO" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {mode === 'login' ? 'Bienvenue sur YOUPPI INFO' : 'Créer votre compte client'}
          </h1>
          <p className="text-xs text-slate-500">
            {mode === 'login' 
              ? 'Connectez-vous pour suivre vos commandes et favoris'
              : 'Rejoignez la communauté gamer numéro 1 en Algérie'}
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex bg-slate-100 p-1 rounded-2xl">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              mode === 'login'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Connexion
          </button>
          <button
            type="button"
            onClick={() => setMode('register')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              mode === 'register'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Inscription
          </button>
        </div>

        {/* Quick Demo Logins Strip */}
        <div className="p-3 bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-blue-500/5 rounded-2xl border border-blue-200/60 space-y-2">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-cyan-500 fill-cyan-500" />
            Accès Démo 1-Clic
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleDemoClient}
              className="px-2.5 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-[11px] font-bold rounded-lg transition-colors shadow-2xs cursor-pointer text-center"
            >
              Compte Client Démo
            </button>
            <button
              type="button"
              onClick={handleDemoAdmin}
              className="px-2.5 py-1.5 bg-[#0A1128] hover:bg-slate-800 text-cyan-300 text-[11px] font-bold rounded-lg transition-colors shadow-2xs cursor-pointer text-center border border-cyan-500/30"
            >
              Accès Admin Démo
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Nom complet</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Ex: Yacine Benali"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#0075FF] focus:bg-white transition-colors"
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Adresse email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="votre.email@domaine.com"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#0075FF] focus:bg-white transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700">Mot de passe</label>
              {mode === 'login' && (
                <button
                  type="button"
                  onClick={() => alert('Veuillez utiliser les accès 1-Clic démo ci-dessus ou saisir votre adresse email.')}
                  className="text-[11px] text-slate-400 hover:text-[#0075FF] transition-colors"
                >
                  Mot de passe oublié ?
                </button>
              )}
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#0075FF] focus:bg-white transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-gradient-to-r from-[#0075FF] to-[#0060DF] hover:from-[#0066E0] hover:to-[#004EC2] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-cyan-500/35 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>{mode === 'login' ? 'Se connecter' : 'Créer mon compte'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <p className="text-[11px] text-center text-slate-400">
          En continuant, vous acceptez les{' '}
          <Link to="/terms" className="text-slate-700 underline">Conditions générales</Link> et la{' '}
          <Link to="/privacy" className="text-slate-700 underline">Politique de confidentialité</Link>.
        </p>
      </motion.div>
    </div>
  );
};
