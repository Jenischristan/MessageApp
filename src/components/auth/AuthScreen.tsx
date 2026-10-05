import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Eye, EyeOff, ShieldCheck, Zap, Lock, ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { Logo } from '../common/Logo';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Avatar } from '../common/Avatar';

interface AuthScreenProps {
  onSuccess: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3>(1);

  const [formData, setFormData] = useState({
    name: 'Jordan Reyes',
    user: 'jordan',
    email: 'jordan@nook.app',
    password: 'password123',
    rememberMe: true,
    agreedTerms: true,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [avatarIndex, setAvatarIndex] = useState(1);

  const calculatePasswordStrength = (pw: string) => {
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/\d/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    return score;
  };

  const passwordScore = calculatePasswordStrength(formData.password);

  const handleNextStep = () => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.name.trim()) newErrors.name = 'Full name is required';
      if (!formData.user.trim()) newErrors.user = 'Username is required';
      if (formData.user.length < 3) newErrors.user = 'Username must be at least 3 characters';
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }
      setErrors({});
      setStep(2);
    } else if (step === 2) {
      if (!formData.email.trim()) {
        newErrors.email = 'Email address is required';
      } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
        newErrors.email = 'Enter a valid email address';
      }
      if (!formData.password || formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      }
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }
      setErrors({});
      setStep(3);
    } else if (step === 3) {
      if (!formData.agreedTerms) {
        setErrors({ terms: 'You must accept the terms to proceed' });
        return;
      }
      setErrors({});
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        onSuccess();
      }, 500);
    }
  };

  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!formData.email.trim()) newErrors.email = 'Email or username is required';
    if (!formData.password) newErrors.password = 'Password is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onSuccess();
    }, 500);
  };

  return (
    <main className="h-[100dvh] max-h-[100dvh] grid lg:grid-cols-2 bg-[#08090a] text-[#eeeff1] p-3 sm:p-5 select-none overflow-hidden">
      {/* Left Hero Panel (Desktop) */}
      <section className="hidden lg:flex flex-col justify-between bg-[#101114] rounded-3xl p-12 border border-white/8 relative overflow-hidden shadow-xl">
        <div className="relative z-10">
          <Logo size={34} />
        </div>

        <div className="relative z-10 max-w-lg space-y-6">
          <div className="space-y-3">
            <h1 className="text-4xl xl:text-5xl font-extrabold tracking-tight leading-[1.08] text-white">
              Messaging, without the noise.
            </h1>
            <p className="text-sm text-white/60 leading-relaxed max-w-md">
              Fast, focused, encrypted conversations built for teams that demand
              clarity, speed, and discretion.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/8 space-y-1">
              <div className="flex items-center gap-2 text-white text-xs font-semibold">
                <Lock className="w-3.5 h-3.5 text-white/70" />
                End-to-End Encrypted
              </div>
              <p className="text-[11px] text-white/50 leading-relaxed">
                Zero surveillance, no targeted ads. Data stays strictly on your verified devices.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/8 space-y-1">
              <div className="flex items-center gap-2 text-white text-xs font-semibold">
                <Zap className="w-3.5 h-3.5 text-white/70" />
                Sub-50ms Reactive Engine
              </div>
              <p className="text-[11px] text-white/50 leading-relaxed">
                Hardware-accelerated layout, smooth micro-interactions, and instant search.
              </p>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-2 text-xs text-white/40">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Verified Cryptographic Invariants · Version 1.4.0</span>
        </div>
      </section>

      {/* Right Interactive Panel */}
      <section className="h-full flex flex-col justify-between p-4 sm:p-8 max-w-md mx-auto w-full overflow-hidden">
        {/* Top Bar on Mobile */}
        <div className="flex items-center justify-between shrink-0 pb-2">
          <Logo size={28} />
          {isSignUp && (
            <span className="text-[11px] font-mono text-white/50 bg-white/[0.06] border border-white/8 px-2.5 py-1 rounded-full">
              Step {step} of 3
            </span>
          )}
        </div>

        {/* Multi-Step Signup Form */}
        {isSignUp ? (
          <div className="flex-1 flex flex-col justify-center min-h-0 py-2">
            {/* Step Progress Line */}
            <div className="flex items-center gap-1.5 mb-5">
              <div
                className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                  step >= 1 ? 'bg-white' : 'bg-white/10'
                }`}
              />
              <div
                className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                  step >= 2 ? 'bg-white' : 'bg-white/10'
                }`}
              />
              <div
                className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                  step >= 3 ? 'bg-white' : 'bg-white/10'
                }`}
              />
            </div>

            <AnimatePresence mode="wait">
              {/* STEP 1: Identity */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.18 }}
                  className="space-y-4"
                >
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                      What should we call you?
                    </h2>
                    <p className="text-xs sm:text-sm text-white/50 mt-1">
                      Choose your display name and public username handle.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-xs font-semibold text-white/70 mb-1"
                      >
                        Full Name
                      </label>
                      <Input
                        id="name"
                        placeholder="Jordan Reyes"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="bg-[#121316]"
                      />
                      {errors.name && (
                        <p className="text-[11px] text-red-400 mt-1">{errors.name}</p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="user"
                        className="block text-xs font-semibold text-white/70 mb-1"
                      >
                        Username Handle
                      </label>
                      <Input
                        id="user"
                        placeholder="jordan"
                        value={formData.user}
                        onChange={(e) =>
                          setFormData({ ...formData, user: e.target.value })
                        }
                        className="bg-[#121316]"
                      />
                      {errors.user && (
                        <p className="text-[11px] text-red-400 mt-1">{errors.user}</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: Credentials */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.18 }}
                  className="space-y-4"
                >
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                      Security & Vault Access
                    </h2>
                    <p className="text-xs sm:text-sm text-white/50 mt-1">
                      Your credentials are used to derive your private vault keys.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-xs font-semibold text-white/70 mb-1"
                      >
                        Email Address
                      </label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="jordan@nook.app"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="bg-[#121316]"
                      />
                      {errors.email && (
                        <p className="text-[11px] text-red-400 mt-1">{errors.email}</p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="password"
                        className="block text-xs font-semibold text-white/70 mb-1"
                      >
                        Password
                      </label>
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={(e) =>
                          setFormData({ ...formData, password: e.target.value })
                        }
                        className="bg-[#121316]"
                        rightElement={
                          <button
                            type="button"
                            className="p-2 text-white/50 hover:text-white"
                            onClick={() => setShowPassword(!showPassword)}
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                          >
                            {showPassword ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                        }
                      />
                      {errors.password && (
                        <p className="text-[11px] text-red-400 mt-1">
                          {errors.password}
                        </p>
                      )}
                    </div>

                    {/* Password Strength Indicator */}
                    <div className="space-y-1 pt-0.5">
                      <div className="flex gap-1 h-1.5">
                        {[1, 2, 3, 4].map((s) => (
                          <div
                            key={s}
                            className={`flex-1 rounded-full transition-colors ${
                              passwordScore >= s ? 'bg-white' : 'bg-white/10'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-[11px] text-white/40">
                        Strength:{' '}
                        {['Too weak', 'Weak', 'Fair', 'Good', 'Strong'][passwordScore]}
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: Avatar & Terms */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.18 }}
                  className="space-y-4"
                >
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                      Profile Appearance
                    </h2>
                    <p className="text-xs sm:text-sm text-white/50 mt-1">
                      Pick a theme for your avatar and confirm account terms.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#121316] border border-white/8 space-y-3">
                    <div className="flex items-center gap-3">
                      <Avatar
                        name={formData.name || 'You'}
                        size={52}
                        index={avatarIndex}
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-white truncate">
                          {formData.name || 'Your Name'}
                        </p>
                        <p className="text-xs text-white/40 font-mono">
                          @{formData.user || 'username'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-white/5">
                      <span className="text-xs text-white/60">Color scheme</span>
                      <div className="flex items-center gap-1.5">
                        {[0, 1, 2, 3, 4].map((i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => setAvatarIndex(i)}
                            className={`w-6 h-6 rounded-full transition-transform ${
                              avatarIndex === i
                                ? 'ring-2 ring-white scale-110'
                                : 'opacity-65 hover:scale-105'
                            }`}
                          >
                            <Avatar name={formData.name || 'You'} size={24} index={i} />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <label className="flex items-start gap-2.5 text-xs text-white/70 cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      checked={formData.agreedTerms}
                      onChange={(e) =>
                        setFormData({ ...formData, agreedTerms: e.target.checked })
                      }
                      className="mt-0.5 rounded accent-white cursor-pointer"
                    />
                    <span>
                      I agree to the{' '}
                      <span className="text-white underline">Terms of Service</span>{' '}
                      and{' '}
                      <span className="text-white underline">Privacy Policy</span>.
                    </span>
                  </label>
                  {errors.terms && (
                    <p className="text-[11px] text-red-400">{errors.terms}</p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation buttons: Always visible at bottom */}
            <div className="flex items-center gap-2 pt-6">
              {step > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  className="h-10 px-4"
                  onClick={() => setStep((s) => (s - 1) as 1 | 2)}
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Back
                </Button>
              )}
              <Button
                type="button"
                className="flex-1 h-10 font-semibold"
                disabled={isSubmitting}
                onClick={handleNextStep}
              >
                {isSubmitting ? (
                  'Creating Vault…'
                ) : step === 3 ? (
                  'Create Account'
                ) : (
                  <>
                    Continue
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </>
                )}
              </Button>
            </div>
          </div>
        ) : (
          /* Sign In Form (Compact, fits perfectly without scrolling) */
          <div className="flex-1 flex flex-col justify-center min-h-0 py-2">
            <div className="mb-5">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                Welcome back
              </h2>
              <p className="text-xs sm:text-sm text-white/50 mt-1">
                Enter your credentials to unlock your messages.
              </p>
            </div>

            <form onSubmit={handleSignInSubmit} className="space-y-3.5" noValidate>
              <div>
                <label
                  htmlFor="signin-email"
                  className="block text-xs font-semibold text-white/70 mb-1"
                >
                  Email or Username
                </label>
                <Input
                  id="signin-email"
                  placeholder="jordan@nook.app"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="bg-[#121316]"
                />
                {errors.email && (
                  <p className="text-[11px] text-red-400 mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label
                    htmlFor="signin-password"
                    className="text-xs font-semibold text-white/70"
                  >
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => alert('Password reset link sent to registered email.')}
                    className="text-xs text-white/50 hover:text-white hover:underline cursor-pointer"
                  >
                    Forgot?
                  </button>
                </div>
                <Input
                  id="signin-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="bg-[#121316]"
                  rightElement={
                    <button
                      type="button"
                      className="p-2 text-white/50 hover:text-white"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  }
                />
                {errors.password && (
                  <p className="text-[11px] text-red-400 mt-1">{errors.password}</p>
                )}
              </div>

              <div className="flex items-center justify-between py-1">
                <label className="flex items-center gap-2 text-xs text-white/60 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.rememberMe}
                    onChange={(e) =>
                      setFormData({ ...formData, rememberMe: e.target.checked })
                    }
                    className="rounded accent-white cursor-pointer"
                  />
                  <span>Remember this device</span>
                </label>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-10 font-semibold"
              >
                {isSubmitting ? 'Unlocking Vault…' : 'Sign In'}
              </Button>
            </form>
          </div>
        )}

        {/* Bottom Switch between Sign In / Sign Up */}
        <div className="shrink-0 pt-2 pb-1 text-center">
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setStep(1);
              setErrors({});
            }}
            className="text-xs text-white/60 hover:text-white transition-colors cursor-pointer"
          >
            {isSignUp ? (
              <>
                Already have an account?{' '}
                <span className="text-white font-semibold underline underline-offset-2">
                  Sign In
                </span>
              </>
            ) : (
              <>
                Don&apos;t have an account yet?{' '}
                <span className="text-white font-semibold underline underline-offset-2">
                  Create one
                </span>
              </>
            )}
          </button>
        </div>
      </section>
    </main>
  );
};
