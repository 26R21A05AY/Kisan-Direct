import { useState } from 'react';
import { Leaf, Eye, EyeOff, Mail, Lock, AlertCircle, ImageIcon, ArrowRight, Sprout, ShieldCheck, KeyRound, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';

interface LoginPageProps {
  onNavigate: (page: 'home' | 'login' | 'signup') => void;
}

interface FormErrors {
  email?: string;
  password?: string;
}

const sideImg = 'https://images.pexels.com/photos/35559229/pexels-photo-35559229.jpeg?auto=compress&cs=tinysrgb&w=940&h=1600&fit=crop';

function FloatingLeaf({ className, delay }: { className: string; delay: string }) {
  return (
    <div
      className={`pointer-events-none absolute opacity-10 ${className}`}
      style={{ animation: `floatSway 7s ease-in-out ${delay} infinite` }}
    >
      <Leaf className="h-full w-full text-forest-700" />
    </div>
  );
}

export function LoginPage({ onNavigate }: LoginPageProps) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [sendingReset, setSendingReset] = useState(false);
  const [resetMessage, setResetMessage] = useState<string | null>(null);

  const validate = (): boolean => {
    const next: FormErrors = {};
    if (!email.trim()) {
      next.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      next.email = 'Please enter a valid email address';
    }
    if (!password) {
      next.password = 'Password is required';
    } else if (password.length < 6) {
      next.password = 'Password must be at least 6 characters';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    if (!validate()) return;
    setSubmitting(true);
    try {
      await login(email.trim(), password);
      onNavigate('home');
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : 'Unable to sign in. Please check your email and password.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      setAuthError('Enter your email above first, then click Forgot password.');
      return;
    }
    setAuthError(null);
    setResetMessage(null);
    setSendingReset(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim());
      if (error) throw error;
      setResetMessage('Password reset email sent — check your inbox.');
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : 'Could not send reset email.');
    } finally {
      setSendingReset(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-ivory-50">
      {/* Left: Agricultural photo with quote — hidden on mobile */}
      <div className="relative hidden lg:block lg:w-5/12 xl:w-2/5 bg-forest-950">
        <div className="absolute inset-0 flex items-center justify-center">
          <ImageIcon className="h-12 w-12 text-forest-800" />
        </div>
        <img
          src={sideImg}
          alt="Serene sunrise over a vibrant green rice field with distant hills"
          onError={(e) => { e.currentTarget.style.display = 'none'; }}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-950/95 via-forest-900/50 to-forest-950/25" />
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-1 w-24 gold-gradient rounded-b-full" />

        <div className="relative flex h-full flex-col justify-end p-10 xl:p-14">
          {/* Branding */}
          <div className="absolute top-8 left-10 xl:left-14 flex items-center gap-2.5">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl forest-gradient shadow-lg">
              <Sprout className="h-6 w-6 text-ivory-100" />
            </div>
            <div>
              <span className="block text-lg font-bold text-white leading-tight" style={{ fontFamily: '"Playfair Display", serif' }}>Kisan Direct</span>
              <span className="block text-xs text-gold-300 font-medium tracking-wide">From Our Farms to Your Family.</span>
            </div>
            <div className="ml-2 flex h-8 w-8 items-center justify-center rounded-full border border-gold-300/40 text-gold-300">
              <Leaf className="h-4 w-4" />
            </div>
          </div>

          <blockquote className="mt-auto text-3xl xl:text-4xl font-bold leading-snug text-white text-shadow-lg animate-slideUp" style={{ fontFamily: '"Playfair Display", serif' }}>
            "Every fresh beginning starts with a seed of trust."
          </blockquote>
          <div className="mt-4 h-px w-16 gold-gradient" />
          <p className="mt-4 text-sm sm:text-base text-ivory-100/85 leading-relaxed max-w-md">
            Discover nature's finest harvest, delivered fresh from local farmers to your doorstep.
          </p>
          <div className="mt-6 flex items-center gap-2 text-xs text-gold-300">
            <ShieldCheck className="h-4 w-4" />
            Trusted by 50+ partner farms across India
          </div>
        </div>
      </div>

      {/* Right: Form */}
      <div className="relative flex flex-1 flex-col bg-gradient-to-br from-forest-50 via-ivory-50 to-emerald2-50 overflow-hidden">
        {/* Decorative glows */}
        <div className="absolute top-10 right-10 h-56 w-56 rounded-full bg-gold-200/30 blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-10 h-48 w-48 rounded-full bg-emerald2-200/30 blur-3xl pointer-events-none" />
        {/* Soft dot pattern */}
        <div
          className="absolute inset-0 opacity-[0.035] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='2' cy='2' r='1.5' fill='%232d6243'/%3E%3C/svg%3E")`,
          }}
        />
        {/* Floating leaves (desktop) */}
        <FloatingLeaf className="top-24 left-12 h-10 w-10" delay="0s" />
        <FloatingLeaf className="top-1/2 right-16 h-8 w-8" delay="1.5s" />
        <FloatingLeaf className="bottom-24 left-1/4 h-7 w-7" delay="3s" />

        <div className="relative flex flex-1 items-center justify-center px-4 sm:px-6 py-10">
          <div className="w-full max-w-md animate-slideUp">
            {/* Logo — mobile only */}
            <div className="mb-8 text-center lg:hidden">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl forest-gradient shadow-lg">
                <Sprout className="h-8 w-8 text-ivory-100" />
              </div>
              <span className="mt-3 block text-xl font-bold text-forest-900" style={{ fontFamily: '"Playfair Display", serif' }}>Kisan Direct</span>
              <span className="block text-xs text-gold-600 font-medium tracking-wide">From Our Farms to Your Family.</span>
            </div>

            {/* Heading */}
            <div className="mb-7 text-center">
              <h1 className="text-3xl sm:text-4xl font-bold text-forest-900" style={{ fontFamily: '"Playfair Display", serif' }}>Welcome back</h1>
              <div className="mx-auto mt-3 flex items-center justify-center gap-2">
                <span className="h-px w-8 gold-gradient" />
                <Leaf className="h-3.5 w-3.5 text-gold-500" />
                <span className="h-px w-8 gold-gradient" />
              </div>
              <p className="mt-3 text-sm text-gray-500">Sign in to your Kisan Direct account</p>
            </div>

            {/* Glass card form */}
            <div className="rounded-3xl bg-white/80 backdrop-blur-md border border-white/60 shadow-2xl shadow-forest-900/10 p-6 sm:p-8">
              {/* Auth error */}
              {authError && (
                <div className="mb-5 flex items-start gap-2 rounded-xl bg-red-50 border border-red-200 px-4 py-3">
                  <AlertCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-red-800">{authError}</p>
                </div>
              )}

              {/* Demo notice */}
              <div className="mb-6 flex items-start gap-2 rounded-xl bg-gold-50/90 border border-gold-200 px-4 py-3">
                <AlertCircle className="h-4 w-4 text-gold-600 shrink-0 mt-0.5" />
                <p className="text-xs text-gold-800">
                  Accounts are real and stored securely. Email confirmation is off, so you can sign in immediately after signing up.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email */}
                <div>
                  <label htmlFor="login-email" className="block text-sm font-medium text-forest-800 mb-1.5">
                    Email address
                  </label>
                  <div className="relative group">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-forest-300 group-focus-within:text-forest-600 transition-colors" />
                    <input
                      id="login-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className={`w-full rounded-xl border bg-white/80 py-3 pl-11 pr-4 text-sm text-forest-900 transition-all focus:bg-white focus:outline-none focus:ring-2 ${
                        errors.email
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
                          : 'border-forest-200 focus:border-forest-500 focus:ring-forest-500/20'
                      }`}
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1.5 text-xs text-red-600">{errors.email}</p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="login-password" className="block text-sm font-medium text-forest-800 mb-1.5">
                    Password
                  </label>
                  <div className="relative group">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-forest-300 group-focus-within:text-forest-600 transition-colors" />
                    <input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className={`w-full rounded-xl border bg-white/80 py-3 pl-11 pr-11 text-sm text-forest-900 transition-all focus:bg-white focus:outline-none focus:ring-2 ${
                        errors.password
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
                          : 'border-forest-200 focus:border-forest-500 focus:ring-forest-500/20'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-forest-300 hover:text-forest-600 transition-colors"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1.5 text-xs text-red-600">{errors.password}</p>
                  )}
                </div>

                {/* Forgot password */}
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    disabled={sendingReset}
                    className="inline-flex items-center gap-1 text-xs font-medium text-forest-600 hover:text-forest-800 transition-colors disabled:opacity-60"
                  >
                    {sendingReset ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <KeyRound className="h-3.5 w-3.5" />
                    )}
                    {sendingReset ? 'Sending…' : 'Forgot password?'}
                  </button>
                </div>

                {resetMessage && (
                  <p className="text-xs font-medium text-emerald2-700 bg-emerald2-50 border border-emerald2-200 rounded-lg px-3 py-2">{resetMessage}</p>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="group flex w-full items-center justify-center gap-2 rounded-xl forest-gradient py-3.5 text-base font-semibold text-ivory-100 shadow-lg shadow-forest-600/25 transition-all hover:shadow-xl hover:shadow-forest-600/30 hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Signing in…
                    </>
                  ) : (
                    <>
                      Sign In
                      <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Switch to signup */}
            <p className="mt-6 text-center text-sm text-gray-500">
              Don't have an account?{' '}
              <button
                onClick={() => onNavigate('signup')}
                className="inline-flex items-center gap-1 font-semibold text-forest-700 hover:text-forest-900 transition-colors"
              >
                <Sprout className="h-4 w-4" />
                Create one
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
