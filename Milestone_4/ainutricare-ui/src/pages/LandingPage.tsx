// src/pages/LandingPage.tsx
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Sparkles, Brain, Salad, Shield, ArrowRight, CheckCircle,
    Upload, Activity, Heart, Zap, ChevronRight, Clock, Info
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import ThemeToggle from '../components/ThemeToggle';
import ParticleBackground from '../components/ParticleBackground';

const LandingPage: React.FC = () => {
    const { isDarkMode } = useTheme();

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            const blob1 = document.getElementById('parallax-blob-1');
            const blob2 = document.getElementById('parallax-blob-2');

            if (blob1) blob1.style.transform = `translateY(${scrollY * 0.1}px)`;
            if (blob2) blob2.style.transform = `translateY(${-scrollY * 0.08}px)`;
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

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

    const features = [
        {
            icon: Brain,
            title: 'AI-Powered Analysis',
            description: 'Know exactly which foods lower your creatinine or stabilize glucose — no guesswork.',
            gradient: 'from-violet-500 to-indigo-600'
        },
        {
            icon: Salad,
            title: 'Personalized Nutrition',
            description: 'Eat what your body needs — not what influencers say. Tailored to your biomarkers.',
            gradient: 'from-emerald-500 to-teal-600'
        },
        {
            icon: Shield,
            title: 'Clinical Insights',
            description: 'Evidence-based recommendations reviewed by healthcare professionals.',
            gradient: 'from-cyan-500 to-blue-600'
        }
    ];

    const steps = [
        { number: '01', title: 'Upload Report', description: 'Simply upload your lab report PDF', icon: Upload },
        { number: '02', title: 'AI Analysis', description: 'Our AI extracts and analyzes biomarkers', icon: Activity },
        { number: '03', title: 'Get Your Plan', description: 'Receive personalized nutrition guidance', icon: Heart }
    ];

    const stats = [
        { value: '98%', label: 'of users improved biomarkers in 2 weeks', icon: CheckCircle },
        { value: '24/7', label: 'AI nutritionist always ready', icon: Clock }
    ];

    return (
        // Change: Removed bg-[#0a0f1a] and bg-slate-50. Added bg-transparent.
        <div className={`min-h-screen transition-colors duration-300 bg-transparent ${isDarkMode ? 'text-white' : 'text-slate-900'} overflow-hidden relative selection:bg-cyan-500/30 font-sans`}>
            {/* Theme-Aware Animated Background */}
            <ParticleBackground />

            {/* Navigation */}
            <nav className="relative z-50 px-6 py-5">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
                            <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <span className={`text-xl font-black bg-clip-text text-transparent ${isDarkMode ? 'bg-gradient-to-r from-cyan-400 to-emerald-400' : 'text-gradient-primary'}`}>
                            AI-NutriCare
                        </span>
                    </div>
                    <div className="hidden md:flex items-center gap-6">
                        <a href="#features" className={`transition-colors ${isDarkMode ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}>Features</a>
                        <a href="#how-it-works" className={`transition-colors ${isDarkMode ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}>How it Works</a>
                        <Link to="/auth" className={`transition-colors ${isDarkMode ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}>Login</Link>
                        <ThemeToggle />
                        <Link
                            to="/auth"
                            className="group px-5 py-2.5 bg-gradient-primary
                rounded-xl font-bold text-white
                hover:bg-gradient-warm
                hover:shadow-lg hover:shadow-cyan-500/20 transition-all
                active:scale-[0.98] active:opacity-90"
                        >
                            Get Started
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative px-6 pt-20 pb-32">
                <div className="max-w-7xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-[hsla(358,85%,68%,0.1)] border border-[hsla(358,85%,68%,0.2)] rounded-full mb-8">
                        <Zap className="w-4 h-4 text-[hsl(358,85%,68%)]" />
                        <span className="text-sm text-[hsl(358,85%,68%)]">Powered by Clinical AI</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight tracking-tight">
                        <span className={`bg-clip-text text-transparent bg-gradient-to-r ${isDarkMode ? 'from-white via-slate-200 to-slate-400' : 'from-slate-900 via-slate-800 to-slate-700'}`}>
                            Your Lab Report.
                        </span>
                        <br />
                        <span className={`bg-clip-text text-transparent ${isDarkMode ? 'bg-gradient-to-r from-teal-400 via-emerald-400 to-cyan-400' : 'text-gradient-primary'}`}>
                            Your Personal Nutritionist.
                        </span>
                    </h1>
                    <p className={`text-xl max-w-2xl mx-auto mb-10 leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                        No guesswork. Just science-backed meals tailored to your lab results.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            to="/auth"
                            className="group flex items-center gap-2 px-8 py-4 bg-gradient-primary
                rounded-2xl font-bold text-lg text-white
                hover:bg-gradient-warm
                hover:shadow-2xl hover:shadow-amber-500/40 transition-all transform hover:-translate-y-1
                active:scale-[0.98] active:opacity-90"
                        >
                            Start Free Analysis
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <a
                            href="#how-it-works"
                            className={`flex items-center gap-2 px-8 py-4 rounded-2xl font-semibold border transition-all ${isDarkMode
                                ? 'bg-slate-800/50 border-slate-700 text-white hover:bg-slate-800'
                                : 'bg-white/50 border-slate-200 text-slate-700 hover:bg-white hover:border-amber-500/30'}`}
                        >
                            See How It Works
                        </a>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-20 max-w-2xl mx-auto">
                        {stats.map((stat, idx) => (
                            <div key={idx} className={`p-6 backdrop-blur-xl rounded-2xl border transition-all ${isDarkMode
                                ? 'bg-slate-800/30 border-slate-700/50'
                                : 'bg-white/40 border-slate-200 shadow-sm'}`}>
                                <div className={`text-3xl font-black mb-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{stat.value}</div>
                                <div className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="relative px-6 py-24">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-black mb-4">
                            <span className={`${isDarkMode ? 'bg-gradient-to-r from-cyan-400 to-emerald-400' : 'text-gradient-primary'} bg-clip-text text-transparent`}>
                                Powerful. Personal. Proven.
                            </span>
                        </h2>
                        <p className={`text-lg max-w-2xl mx-auto ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                            Everything you need to understand and optimize your health through nutrition.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-6">
                        {features.map((feature, idx) => {
                            const Icon = feature.icon;
                            return (
                                <div
                                    key={idx}
                                    className={`group relative p-8 backdrop-blur-xl rounded-3xl border transition-all duration-500 overflow-hidden hover:shadow-xl hover:shadow-cyan-500/10 ${isDarkMode
                                        ? 'bg-slate-900/50 border-slate-700/50 hover:border-cyan-500/30'
                                        : 'bg-white border-slate-200 hover:shadow-xl hover:border-cyan-400/30'
                                        }`}
                                >
                                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                        <Icon className="w-7 h-7 text-white" />
                                    </div>
                                    <h3 className={`text-xl font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{feature.title}</h3>
                                    <p className={`leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>{feature.description}</p>
                                    <div className="mt-6 flex items-center gap-2 text-[hsl(358,85%,68%)] opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="text-sm font-semibold">Learn more</span>
                                        <ChevronRight className="w-4 h-4" />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section id="how-it-works" className={`relative px-6 py-24 ${isDarkMode ? 'bg-slate-900/30' : 'bg-slate-50/50'}`}>
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-black mb-4">
                            <span className={`${isDarkMode ? 'bg-gradient-to-r from-cyan-400 to-emerald-400' : 'text-gradient-primary'} bg-clip-text text-transparent`}>
                                How It Works
                            </span>
                        </h2>
                        <p className={`text-lg ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>Three simple steps to better health</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {steps.map((step, idx) => {
                            const Icon = step.icon;
                            return (
                                <div key={idx} className="relative">
                                    <div className="text-center">
                                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-primary/20 border border-cyan-500/30 mb-6">
                                            <Icon className="w-10 h-10 text-cyan-400" />
                                        </div>
                                        <div className="text-6xl font-black text-slate-600 absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 select-none opacity-10">
                                            {step.number}
                                        </div>
                                        <h3 className={`text-xl font-bold mb-2 relative z-10 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{step.title}</h3>
                                        <p className={`relative z-10 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>{step.description}</p>
                                    </div>
                                    {idx < steps.length - 1 && (
                                        <div className="hidden md:block absolute top-10 left-[60%] w-[80%] border-t-2 border-dashed border-slate-700" />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                    <div className="text-center mt-16">
                        <Link
                            to="/auth"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-primary
                rounded-2xl font-bold text-lg text-white
                hover:bg-gradient-warm
                hover:shadow-2xl hover:shadow-amber-500/40 transition-all"
                        >
                            Get Started Now
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Testimonial / Health Fact */}
            <section className={`relative px-6 py-20 ${isDarkMode ? 'bg-gradient-to-r from-amber-900/10 to-orange-900/10' : 'bg-[hsla(358,85%,68%,0.05)]'}`}>
                <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[hsla(358,85%,68%,0.1)] mb-6 mx-auto">
                        <Info className="w-8 h-8 text-[hsl(358,85%,68%)]" />
                    </div>
                    <blockquote className={`text-2xl italic font-light mb-6 ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                        “My doctor was shocked — my HbA1c dropped from 8.2 to 6.1 in just 6 weeks!”
                    </blockquote>
                    <p className={`text-lg ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                        — Priya R., 42 • Type 2 Diabetes Patient
                    </p>
                </div>
            </section>

            {/* Footer */}
            <footer className="relative px-6 py-12 border-t border-slate-800">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                            <Sparkles className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-black text-slate-400">AI-NutriCare</span>
                    </div>
                    <div className="flex items-center gap-6 text-sm text-slate-500">
                        <a href="#" className="hover:text-warm transition-colors">Privacy</a>
                        <a href="#" className="hover:text-warm transition-colors">Terms</a>
                        <a href="#" className="hover:text-warm transition-colors">Contact</a>
                    </div>
                    <p className="text-sm text-slate-600">© 2026 AI-NutriCare. All rights reserved.</p>
                </div>
            </footer>

        </div>
    );
};

export default LandingPage;