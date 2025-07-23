import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Button } from './ui/button';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

export function AuthHeader({
  onAuthChange,
}: {
  onAuthChange?: (user: any) => void;
}) {
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showLogin, setShowLogin] = useState(true);
  const popoverTriggerRef = useRef<HTMLButtonElement>(null);
  const signupPopoverRef = useRef<HTMLButtonElement>(null);

  // Sets up the initial user state and listens for auth state changes
  // If onAuthChange is provided, it will be called with the user object whenever the auth state changes
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      if (onAuthChange) onAuthChange(data.session?.user ?? null);
    });
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        if (onAuthChange) onAuthChange(session?.user ?? null);
      }
    );
    return () => {
      listener.subscription.unsubscribe();
    };
  }, [onAuthChange]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    if (error) setError(error.message);
    else {
      setEmail('');
      setPassword('');
      setTimeout(() => popoverTriggerRef.current?.click(), 100); // close popover
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (user) {
    return (
      <div className="flex items-center gap-2 font-regular">
        <span className="text-sm text-slate-200">{user.email}</span>
        <Button
          variant="outline"
          className="text-slate-700"
          onClick={handleLogout}
        >
          Logout
        </Button>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            ref={popoverTriggerRef}
            variant="outline"
            className="text-slate-700 font-regular"
            onClick={() => setShowLogin(true)}
          >
            Login
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-64">
          <form className="flex flex-col gap-2" onSubmit={handleLogin}>
            <input
              className="border border-slate-400 rounded px-2 py-1 text-slate-900"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              className="border border-slate-400 rounded px-2 py-1 text-slate-900"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {error && showLogin && (
              <div className="text-red-500 text-xs">{error}</div>
            )}
            <Button
              type="submit"
              variant="outline"
              className="text-slate-700"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </form>
        </PopoverContent>
      </Popover>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            ref={signupPopoverRef}
            variant="outline"
            className="text-slate-700 font-regular"
            onClick={() => setShowLogin(false)}
          >
            Sign Up
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-64">
          <form
            className="flex flex-col gap-2"
            onSubmit={async (e) => {
              e.preventDefault();
              setLoading(true);
              setError('');
              const { error } = await supabase.auth.signUp({
                email,
                password,
              });
              setLoading(false);
              if (error) setError(error.message);
              else {
                setEmail('');
                setPassword('');
                setTimeout(() => signupPopoverRef.current?.click(), 100);
                setTimeout(() => {
                  alert(
                    'Check your email for a confirmation link before logging in.'
                  );
                }, 200);
              }
            }}
          >
            <input
              className="border border-slate-400 rounded px-2 py-1 text-slate-900"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              className="border border-slate-400 rounded px-2 py-1 text-slate-900"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {error && !showLogin && (
              <div className="text-red-500 text-xs">{error}</div>
            )}
            <Button
              type="submit"
              variant="outline"
              className="text-slate-700"
              disabled={loading}
            >
              {loading ? 'Signing up...' : 'Sign Up'}
            </Button>
          </form>
        </PopoverContent>
      </Popover>
    </div>
  );
}
