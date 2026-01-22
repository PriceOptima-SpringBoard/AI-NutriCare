// src/pages/AuthPage.tsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Sparkles, Mail, Lock, User, Eye, EyeOff, ArrowRight, Chrome, Apple, ArrowLeft
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import ParticleBackground from '../components/ParticleBackground';

const AuthPage: React.FC = () => {
    const { isDarkMode } = useTheme();
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setTimeout(() => {
            if (isLogin) {
                localStorage.setItem('userEmail', formData.email);
                if (!localStorage.getItem('userName')) {
                    const inferredName = formData.email.split('@')[0];
                    localStorage.setItem('userName', inferredName.charAt(0).toUpperCase() + inferredName.slice(1));
                }
            } else {
                localStorage.setItem('userName', formData.name);
                localStorage.setItem('userEmail', formData.email);
            }
            setIsLoading(false);
            navigate('/dashboard');
        }, 1500);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Toggle body class for theme-aware background
    useEffect(() => {
        if (isDarkMode) {
            document.body.classList.remove('light-mode');
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
            document.body.classList.add('light-mode');
        }
    }, [isDarkMode]);

    return (
        <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-[#0a0f1a] text-white' : 'bg-slate-50 text-slate-900'} flex font-sans`}>

            {/* Theme-Aware Animated Background */}
            <ParticleBackground />

            {/* Left Panel - Branding */}
            <div className="hidden lg:flex flex-1 flex-col justify-between p-12 relative z-10">
                <Link to="/" className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center shadow-lg shadow-cyan-500/30">
                        <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <span className={`text-2xl font-black bg-gradient-to-r bg-clip-text text-transparent ${isDarkMode ? 'from-cyan-400 to-emerald-400' : 'text-gradient-primary'}`}>
                        AI-NutriCare
                    </span>
                </Link>
                <div className="max-w-md">
                    <h1 className="text-4xl font-black mb-6 leading-tight">
                        Transform your health with{' '}
                        <span className={`bg-gradient-to-r bg-clip-text text-transparent ${isDarkMode ? 'from-teal-400 via-emerald-400 to-cyan-400' : 'text-gradient-primary'}`}>
                            AI-powered nutrition
                        </span>
                    </h1>
                    <p className={`text-lg leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                        Upload your lab reports and receive personalized meal plans backed by clinical research.
                    </p>
                </div>
                <div className="mt-8 p-5 bg-[hsla(358,85%,68%,0.1)] border border-[hsla(358,85%,68%,0.2)] rounded-2xl backdrop-blur-sm">
                    <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-4 h-4 text-[hsl(358,85%,68%)]" />
                        <span className="text-xs font-semibold text-[hsl(358,85%,68%)] uppercase tracking-wider">Health Tip</span>
                    </div>
                    <p className={`italic text-sm ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                        “Just 1 extra serving of leafy greens daily can reduce kidney strain by 18%.”
                    </p>
                </div>
            </div>

            {/* Right Panel - Auth Form */}
            <div className="flex-1 flex items-center justify-center p-6 relative z-10">
                <div className="w-full max-w-md">
                    <Link
                        to="/"
                        className={`lg:hidden flex items-center gap-2 mb-8 transition-colors ${isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`}
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to home
                    </Link>

                    <div className={`backdrop-blur-xl rounded-3xl border p-8 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/10 ${isDarkMode
                        ? 'bg-slate-900/50 border-slate-700/50 hover:border-cyan-500/30'
                        : 'bg-white border-slate-200 shadow-xl hover:border-cyan-400/30'
                        }`}>
                        <div className={`flex rounded-xl p-1 mb-8 ${isDarkMode ? 'bg-slate-800/50' : 'bg-slate-100'}`}>
                            <button
                                onClick={() => setIsLogin(true)}
                                className={`flex-1 py-3 rounded-lg font-bold transition-all ${isLogin
                                    ? 'bg-gradient-primary text-white shadow-md'
                                    : `${isDarkMode ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`
                                    }`}
                            >
                                👤 Login
                            </button>
                            <button
                                onClick={() => setIsLogin(false)}
                                className={`flex-1 py-3 rounded-lg font-bold transition-all ${!isLogin
                                    ? 'bg-gradient-primary text-white shadow-md'
                                    : `${isDarkMode ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`
                                    }`}
                            >
                                ✍️ Sign Up
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {!isLogin && (
                                <div>
                                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>Full Name</label>
                                    <div className="relative">
                                        <User className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`} />
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            placeholder="John Doe"
                                            className={`w-full pl-12 pr-4 py-4 border rounded-xl focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 focus:ring-offset-0 transition-colors ${isDarkMode
                                                ? 'bg-slate-800/50 border-slate-700 text-white placeholder-slate-500'
                                                : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white'
                                                }`}
                                            required={!isLogin}
                                        />
                                    </div>
                                </div>
                            )}

                            <div>
                                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>Email Address</label>
                                <div className="relative">
                                    <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`} />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder="you@example.com"
                                        className={`w-full pl-12 pr-4 py-4 border rounded-xl focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 focus:ring-offset-0 transition-colors ${isDarkMode
                                            ? 'bg-slate-800/50 border-slate-700 text-white placeholder-slate-500'
                                            : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white'
                                            }`}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>Password</label>
                                <div className="relative">
                                    <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`} />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        placeholder="••••••••"
                                        className={`w-full pl-12 pr-12 py-4 border rounded-xl focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 focus:ring-offset-0 transition-colors ${isDarkMode
                                            ? 'bg-slate-800/50 border-slate-700 text-white placeholder-slate-500'
                                            : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white'
                                            }`}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className={`absolute right-4 top-1/2 -translate-y-1/2 transition-colors ${isDarkMode ? 'text-slate-500 hover:text-white' : 'text-slate-400 hover:text-slate-600'}`}
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            {isLogin && (
                                <div className="text-right">
                                    <a href="#" className={`text-sm hover:text-warm transition-colors ${isDarkMode ? 'text-amber-400' : 'text-warm'}`}>
                                        Forgot password?
                                    </a>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-4 bg-gradient-primary
                  rounded-xl font-bold text-lg text-white
                  hover:bg-gradient-warm
                   hover:shadow-lg hover:shadow-cyan-500/20
                   transition-all active:scale-[0.98] active:opacity-90 flex items-center justify-center gap-2 disabled:opacity-70"
                            >
                                {isLoading ? (
                                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        {isLogin ? 'Login to Your Account' : 'Create My Account'}
                                        <ArrowRight className="w-5 h-5" />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="flex items-center gap-4 my-8">
                            <div className={`flex-1 h-px ${isDarkMode ? 'bg-slate-700' : 'bg-slate-200'}`} />
                            <span className={`text-sm ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>or continue with</span>
                            <div className={`flex-1 h-px ${isDarkMode ? 'bg-slate-700' : 'bg-slate-200'}`} />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <button className={`flex items-center justify-center gap-2 py-3 border rounded-xl transition-all active:scale-[0.98] active:opacity-90 ${isDarkMode
                                ? 'bg-slate-800/50 border-slate-700 hover:bg-slate-800 text-white'
                                : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                                }`}>
                                <Chrome className="w-5 h-5" />
                                <span className="font-medium">Google</span>
                            </button>
                            <button className={`flex items-center justify-center gap-2 py-3 border rounded-xl transition-all active:scale-[0.98] active:opacity-90 ${isDarkMode
                                ? 'bg-slate-800/50 border-slate-700 hover:bg-slate-800 text-white'
                                : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                                }`}>
                                <Apple className="w-5 h-5" />
                                <span className="font-medium">Apple</span>
                            </button>
                        </div>
                    </div>

                    <p className={`text-center text-sm mt-6 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                        By continuing, you agree to our{' '}
                        <a href="#" className={`hover:underline ${isDarkMode ? 'text-amber-400' : 'text-warm'}`}>Terms</a> and{' '}
                        <a href="#" className={`hover:underline ${isDarkMode ? 'text-amber-400' : 'text-warm'}`}>Privacy Policy</a>
                    </p>
                </div>
            </div>

        </div>
    );
};

export default AuthPage;