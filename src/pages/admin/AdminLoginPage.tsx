import React, { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useRouter, Link } from '../../router/Router';
import { authService } from '../../services/authService';
import { Lock, User, ArrowLeft, Eye, EyeOff, AlertCircle, Shield } from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
  const { language, t } = useLanguage();
  const { navigate } = useRouter();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!username.trim() || !password.trim()) {
      setError(language === 'ar' ? 'يرجى إدخال اسم المستخدم وكلمة المرور' : 'Veuillez saisir votre nom d\'utilisateur et mot de passe.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const res = authService.login(username.trim(), password.trim());
      if (res.success) {
        if (res.role === 'inventory_clerk') {
          navigate('/stock');
        } else {
          navigate('/admin');
        }
      } else {
        setError(res.error || (language === 'ar' ? 'بيانات الدخول غير صحيحة.' : 'Identifiants invalides.'));
      }
      setLoading(false);
    }, 200);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A1128] via-[#0D1B3E] to-[#080E22] flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Animated Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#0075FF]/15 blur-[130px] rounded-full pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#00E5FF]/10 blur-[120px] rounded-full pointer-events-none animate-float" />
      <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-cyan-500/8 blur-[100px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        
        {/* Login Card */}
        <div className="bg-white/95 backdrop-blur-xl border border-slate-200/80 rounded-3xl shadow-2xl shadow-cyan-900/30 p-7 sm:p-9 space-y-7">
          
          {/* Brand Lockup */}
          <div className="text-center space-y-3">
            <div className="relative mx-auto w-16 h-16">
              <div className="absolute inset-0 bg-gradient-to-br from-[#0075FF] to-[#00A3FF] rounded-2xl blur-lg opacity-40" />
              <div className="relative w-16 h-16 rounded-2xl bg-[#0A1128] border border-blue-400/30 overflow-hidden flex items-center justify-center shadow-xl shadow-blue-500/20">
                <img src="/logo-emblem-transparent.png" alt="YOUPPI INFO" className="w-full h-full object-cover" />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 tracking-tight">
                {t('admin.loginTitle')}
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                {t('admin.loginSubtitle')}
              </p>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} autoComplete="off" className="space-y-4 text-xs">
            
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">{t('admin.username')}</label>
              <div className="relative">
                <div className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center">
                  <User className="w-3.5 h-3.5 text-slate-500" />
                </div>
                <input
                  type="text"
                  required
                  autoComplete="off"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={language === 'ar' ? 'اسم المستخدم (admin أو stock)' : 'Nom d\'utilisateur (ex: admin ou stock)'}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl ps-11 pe-3 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#0075FF] focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">{t('admin.password')}</label>
              <div className="relative">
                <div className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center">
                  <Lock className="w-3.5 h-3.5 text-slate-500" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl ps-11 pe-11 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#0075FF] focus:ring-2 focus:ring-blue-100 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 rtl:right-auto rtl:left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 focus:outline-none p-1 rounded-lg hover:bg-slate-100 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-[#0075FF] to-[#0060DF] hover:from-[#0060DF] hover:to-[#004DB3] text-white text-xs font-black rounded-xl shadow-xl shadow-blue-500/35 hover:shadow-cyan-400/35 transition-all hover:scale-[1.02] active:scale-100 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>{language === 'ar' ? 'جاري التحقق...' : 'Connexion en cours...'}</span>
              ) : (
                <>
                  <Shield className="w-4 h-4" />
                  <span>{t('admin.signIn')}</span>
                </>
              )}
            </button>
          </form>

          {/* Security Notice */}
          <div className="text-center space-y-3 pt-1 border-t border-slate-100">
            <p className="text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              Connexion sécurisée · Zone réservée au personnel YOUPPI INFO
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-[#0075FF] transition-colors font-semibold"
            >
              <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-180" />
              <span>Retourner au site public</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
