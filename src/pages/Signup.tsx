import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Armchair } from 'lucide-react';
import PasswordStrengthMeter from '../components/PasswordStrengthMeter';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error } = await signUp(email, password, fullName);

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      navigate('/');
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 via-white to-cream-100 flex items-center justify-center px-4 relative texture-paper">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(209,178,127,0.03),transparent_50%)] pointer-events-none"></div>
      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 text-oak-900 hover:text-oak-700 transition-all duration-500">
            <div className="bg-gradient-to-br from-oak-700 via-oak-600 to-oak-800 rounded-2xl p-3 shadow-elevation-2">
              <Armchair className="w-10 h-10 text-cream-50" />
            </div>
            <span className="text-3xl font-serif font-semibold">Harts</span>
          </Link>
          <h2 className="mt-6 text-2xl font-serif font-semibold text-oak-900">Create your account</h2>
          <p className="mt-2 text-oak-600">Start shopping for beautiful furniture</p>
        </div>

        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-elevation-4 p-8 border border-slate-200/40">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-oak-700 mb-2">
                Full name
              </label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-oak-300 focus:ring-2 focus:ring-oak-700 focus:border-transparent transition-all duration-300 shadow-inset-soft"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-oak-700 mb-2">
                Email address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-oak-300 focus:ring-2 focus:ring-oak-700 focus:border-transparent transition-all duration-300 shadow-inset-soft"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-oak-700 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-oak-300 focus:ring-2 focus:ring-oak-700 focus:border-transparent transition-all duration-300 shadow-inset-soft"
                placeholder="••••••••"
                minLength={8}
              />
              <PasswordStrengthMeter password={password} />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-oak-700 via-oak-600 to-oak-800 text-cream-50 py-3 px-4 rounded-lg font-semibold hover:from-oak-800 hover:via-oak-700 hover:to-oak-900 transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
            >
              {loading ? 'Creating account...' : 'Sign up'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-oak-600">
            Already have an account?{' '}
            <Link to="/login" className="text-oak-900 font-semibold hover:text-oak-700 transition-colors duration-300">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
