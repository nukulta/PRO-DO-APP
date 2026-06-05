import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg(null);
        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to login");
            }

            // Manually set Supabase session so other components work
            // Note: This works only if the Backend signed the token with the correct SUPABASE_JWT_SECRET
            const { error: sessionError } = await supabase.auth.setSession({
                access_token: data.token,
                refresh_token: data.refreshToken || data.token,
            });

            if (sessionError) {
                console.warn("Supabase session set failed (Check JWT Secret):", sessionError);
                const msg = `Session Error: ${sessionError.message} (Name: ${sessionError.name}). Check Backend JWT Secret.`;
                setErrorMsg(msg);
                toast.error(msg);
                return;
            }

            toast.success("Welcome back!");

            // Short delay to allow App.tsx to update state
            setTimeout(() => {
                navigate('/dashboard');
            }, 500);

        } catch (error: any) {
            const msg = error.message || "Failed to login";
            setErrorMsg(msg);
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-black">
            <div className="max-w-md w-full p-8 bg-[#111] rounded-2xl shadow-lg border border-[#333]">
                <h2 className="text-3xl font-bold mb-6 text-center text-white">Welcome Back</h2>
                <form className="space-y-4" onSubmit={handleLogin}>
                    <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-[#333] bg-[#222] text-white focus:ring-2 focus:ring-white outline-none transition-all placeholder:text-zinc-600"
                            placeholder="you@example.com"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-[#333] bg-[#222] text-white focus:ring-2 focus:ring-white outline-none transition-all placeholder:text-zinc-600"
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-white text-black rounded-lg font-medium hover:bg-zinc-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                    {errorMsg && (
                        <div className="mt-4 p-3 bg-red-900/50 border border-red-800 rounded text-red-200 text-sm">
                            {errorMsg}
                        </div>
                    )}
                </form>
                <div className="mt-6 text-center text-sm text-zinc-500">
                    Don't have an account? <span onClick={() => navigate('/register')} className="text-white font-medium cursor-pointer hover:underline">Sign up</span>
                </div>
            </div>
        </div>
    );
};

export default Login;
