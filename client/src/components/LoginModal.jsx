import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppContext } from '../context/AppContext';

const LoginModal = () => {

  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const {
    login,
    registerUser,
    googleLogin,
    setShowLogin
  } = useAppContext();

  const handleSubmit = async (e) => {

    e.preventDefault();

    setLoading(true);

    if (isLogin) {

      await login(email, password);

    } else {

      await registerUser(name, email, password);

    }

    setLoading(false);
  };

  return (

    <AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        onClick={() => setShowLogin(false)}
      >

        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-md glass-strong rounded-2xl p-8 shadow-2xl shadow-black/30"
          onClick={(e) => e.stopPropagation()}
        >

          {/* Close button */}
          <button
            onClick={() => setShowLogin(false)}
            className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/10 transition-colors text-slate-400 hover:text-white"
          >

            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >

              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />

            </svg>

          </button>

          {/* Header */}
          <div className="text-center mb-8">

            <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/25">

              <svg
                className="w-7 h-7 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >

                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />

              </svg>

            </div>

            <h2 className="text-2xl font-bold">

              {isLogin ? 'Welcome Back' : 'Create Account'}

            </h2>

            <p className="text-slate-400 text-sm mt-1">

              {
                isLogin
                  ? 'Sign in to continue to DriveEase'
                  : 'Start your journey with DriveEase'
              }

            </p>

          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >

            {!isLogin && (

              <div>

                <label className="block text-sm font-medium text-slate-300 mb-1.5">

                  Full Name

                </label>

                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className="input-field"
                  required={!isLogin}
                />

              </div>
            )}

            <div>

              <label className="block text-sm font-medium text-slate-300 mb-1.5">

                Email

              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="input-field"
                required
              />

            </div>

            <div>

              <label className="block text-sm font-medium text-slate-300 mb-1.5">

                Password

              </label>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="input-field"
                required
                minLength={6}
              />

            </div>

            {/* Email Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary !py-3 !text-base mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >

              {loading ? (

                <span className="flex items-center justify-center gap-2">

                  <svg
                    className="animate-spin h-5 w-5"
                    viewBox="0 0 24 24"
                  >

                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />

                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />

                  </svg>

                  Processing...

                </span>

              ) : (

                isLogin ? 'Sign In' : 'Create Account'

              )}

            </button>

            {/* Google Login Button */}
            <button
              onClick={googleLogin}
              type="button"
              className="w-full mt-4 border border-slate-600 rounded-xl py-3 flex items-center justify-center gap-3 hover:bg-white/10 transition"
            >

              <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="google"
                className="w-5 h-5"
              />

              Continue with Google

            </button>

          </form>

          {/* Toggle */}
          <p className="text-center text-sm text-slate-400 mt-6">

            {
              isLogin
                ? "Don't have an account?"
                : 'Already have an account?'
            }

            {' '}

            <button
              onClick={() => {

                setIsLogin(!isLogin);

                setName('');
                setEmail('');
                setPassword('');

              }}
              className="text-primary hover:text-primary-light font-semibold transition-colors"
            >

              {isLogin ? 'Sign Up' : 'Sign In'}

            </button>

          </p>

        </motion.div>

      </motion.div>

    </AnimatePresence>
  );
};

export default LoginModal;