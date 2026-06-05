import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Register = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to register");
            }

            toast.success("Account created! Please log in.");
            navigate('/login');
        } catch (error: any) {
            toast.error(error.message || "Failed to register");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-black">
            <div className="max-w-md w-full p-8 bg-[#111] rounded-2xl shadow-lg border border-[#333]">
                <h2 className="text-3xl font-bold mb-6 text-center text-white">Join ProDO</h2>
                <form className="space-y-4" onSubmit={handleRegister}>
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
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </button>
                </form>
                <div className="mt-6 text-center text-sm text-zinc-500">
                    Already have an account? <span onClick={() => navigate('/login')} className="text-white font-medium cursor-pointer hover:underline">Log in</span>
                </div>
            </div>
        </div>
    );
};

export default Register;
