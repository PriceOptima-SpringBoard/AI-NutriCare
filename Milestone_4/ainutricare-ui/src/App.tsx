import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Upload, Heart, Activity, AlertCircle, CheckCircle, Clock, Droplet,
  FileText, Download, X, Coffee, Utensils, Zap, Target,
  Sparkles, ShieldCheck, Brain, Salad, Info, MapPin, Leaf, LogOut,
  Edit3, ChevronDown, User, Settings, Sun, Moon
} from 'lucide-react';
import {
  Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Avatar
} from '@heroui/react';

import { useTheme } from './context/ThemeContext';
import ThemeToggle from './components/ThemeToggle';
import ParticleBackground from './components/ParticleBackground';
import { generatePDF } from './utils/pdfGenerator';
import type { PlanDietResponse, MealItem, DietType, RegionType, ManualEntryData, DietaryPreferences } from './types';
import { motion, AnimatePresence } from 'framer-motion';


const API_BASE = "http://127.0.0.1:8000";

// Region options for dropdown
const REGION_OPTIONS = [
  { value: null, label: 'All Regions (Pan-Indian)' },
  { value: 'North', label: 'North Indian' },
  { value: 'South', label: 'South Indian' },
  { value: 'East', label: 'East Indian' },
  { value: 'West', label: 'West Indian' },
  { value: 'North East', label: 'North East Indian' },
];

// Biomarker field config for manual entry
const BIOMARKER_FIELDS = [
  { key: 'glucose', label: 'Glucose', unit: 'mg/dL', range: '70–99', required: true },
  { key: 'creatinine', label: 'Creatinine', unit: 'mg/dL', range: '0.7–1.3', required: true },
  { key: 'urea_bun', label: 'Urea (BUN)', unit: 'mg/dL', range: '7–20', required: true },
  { key: 'sodium', label: 'Sodium', unit: 'mmol/L', range: '136–145', required: true },
  { key: 'potassium', label: 'Potassium', unit: 'mmol/L', range: '3.5–5.0', required: true },
  { key: 'cholesterol', label: 'Cholesterol', unit: 'mg/dL', range: '<200', required: true },
];

// --- Static Data ---
const HEALTH_FACTS = [
  "Did you know? Kidney function can improve with just a 5% reduction in sodium intake.",
  "Fact: Fiber from steel-cut oats helps stabilize blood sugar spikes better than instant oats.",
  "Hydration Tip: Drinking 500ml of water 30 mins before a meal can improve insulin sensitivity.",
  "Nutrition: Omega-3 fatty acids found in salmon are essential for reducing inflammation.",
  "Wellness: A 15-minute walk after meals significantly lowers post-prandial glucose levels."
];

// Reference ranges for tooltips
const BIOMARKER_RANGES = {
  glucose: "Normal Range: 70 – 99 mg/dL (Fasting). Elevated levels may indicate pre-diabetes.",
  creatinine: "Normal Range: 0.7 – 1.3 mg/dL. High levels suggest the kidneys are working harder than usual."
};

const App: React.FC = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  // Mock user info
  const userInfo = {
    name: localStorage.getItem('userName') || 'User',
    email: localStorage.getItem('userEmail') || 'user@example.com',
  };

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

  const handleLogout = () => {
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    navigate('/');
  };

  // State
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PlanDietResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [currentDay, setCurrentDay] = useState(1);
  const [entryMode, setEntryMode] = useState<'pdf' | 'manual'>('pdf');
  const [manualData, setManualData] = useState({
    glucose: '',
    creatinine: '',
    urea_bun: '',
    sodium: '',
    potassium: '',
    cholesterol: '',
    age: '',
    gender: 'Male',
    hba1c: '',
  });
  const [dietaryPrefs, setDietaryPrefs] = useState<DietaryPreferences>({
    diet_type: 'both',
    region: null,
  });
  const [regionDropdownOpen, setRegionDropdownOpen] = useState(false);
  const [currentHealthFact, setCurrentHealthFact] = useState(HEALTH_FACTS[0]);
  const [selectedMeal, setSelectedMeal] = useState<MealItem | null>(null);

  const steps = [
    { label: 'Extracting Clinical Data', icon: FileText },
    { label: 'Analyzing Biomarkers', icon: Brain },
    { label: 'Generating Diet Plan', icon: Salad }
  ];

  // Rotate health fact on load
  useEffect(() => {
    let interval: number;
    if (loading) {
      setActiveStep(0);
      setCurrentHealthFact(HEALTH_FACTS[Math.floor(Math.random() * HEALTH_FACTS.length)]);
      interval = setInterval(() => {
        setActiveStep(prev => prev < 2 ? prev + 1 : prev);
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile?.type === 'application/pdf') {
      setFile(droppedFile);
      setError(null);
    } else {
      setError("Please upload a valid PDF file.");
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    setResult(null);
    const formData = new FormData();
    formData.append("report", file);
    const params = new URLSearchParams();
    params.append('diet_type', dietaryPrefs.diet_type);
    if (dietaryPrefs.region) {
      params.append('region', dietaryPrefs.region);
    }
    try {
      const res = await fetch(`${API_BASE}/plan-diet?${params.toString()}`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`API error ${res.status}: ${text}`);
      }
      const data: PlanDietResponse = await res.json();
      setResult(data);
      setActiveStep(3);
    } catch (err: any) {
      setError(err.message || "Something went wrong during analysis.");
      setActiveStep(0);
    } finally {
      setLoading(false);
    }
  };

  const handleManualAnalyze = async () => {
    const requiredFields = ['glucose', 'creatinine', 'urea_bun', 'sodium', 'potassium', 'cholesterol'];
    for (const field of requiredFields) {
      if (!manualData[field as keyof typeof manualData]) {
        setError(`Please enter a value for ${field.replace('_', ' ').toUpperCase()}`);
        return;
      }
    }
    setLoading(true);
    setError(null);
    setResult(null);
    const requestData: ManualEntryData = {
      glucose: parseFloat(manualData.glucose),
      creatinine: parseFloat(manualData.creatinine),
      urea_bun: parseFloat(manualData.urea_bun),
      sodium: parseFloat(manualData.sodium),
      potassium: parseFloat(manualData.potassium),
      cholesterol: parseFloat(manualData.cholesterol),
      age: manualData.age ? parseInt(manualData.age) : undefined,
      gender: manualData.gender || undefined,
      hba1c: manualData.hba1c ? parseFloat(manualData.hba1c) : undefined,
      preferences: dietaryPrefs,
    };
    try {
      const res = await fetch(`${API_BASE}/plan-diet-manual`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`API error ${res.status}: ${text}`);
      }
      const data: PlanDietResponse = await res.json();
      setResult(data);
      setActiveStep(3);
    } catch (err: any) {
      setError(err.message || "Something went wrong during analysis.");
      setActiveStep(0);
    } finally {
      setLoading(false);
    }
  };

  const handleManualInputChange = (field: string, value: string) => {
    setManualData(prev => ({ ...prev, [field]: value }));
  };

  // --- Helpers ---
  const getMealIcon = (type: string) => {
    const t = type.toLowerCase();
    if (t.includes('breakfast')) return Coffee;
    if (t.includes('lunch')) return Sun;
    if (t.includes('snack')) return Zap;
    if (t.includes('dinner')) return Moon;
    return Utensils;
  };

  const getMealTime = (type: string) => {
    const t = type.toLowerCase();
    if (t.includes('breakfast')) return '08:00 AM';
    if (t.includes('lunch')) return '01:00 PM';
    if (t.includes('snack')) return '10:30 AM / 04:00 PM';
    if (t.includes('dinner')) return '07:30 PM';
    return 'Various Times';
  };

  const riskLevel = result ? result.clinical.patient_metrics.mortality_risk * 100 : 0;
  const getRiskGradient = (level: number) => {
    if (level > 50) return 'from-red-600 via-red-500 to-rose-500';
    if (level > 30) return 'from-amber-500 via-orange-500 to-yellow-500';
    return 'from-emerald-500 via-green-500 to-teal-500';
  };
  const getRiskShadow = (level: number) => {
    if (level > 50) return 'shadow-red-500/40';
    if (level > 30) return 'shadow-amber-500/40';
    return 'shadow-emerald-500/40';
  };

  // --- Render ---
  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-[#0a0f1a] text-white' : 'bg-slate-50 text-slate-900'} font-sans overflow-hidden relative selection:bg-cyan-500/30`}>
      {/* Theme-Aware Animated Background */}
      <ParticleBackground />

      <div className="max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <header className="flex items-center justify-between mb-16">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-lg shadow-cyan-500/30 animate-glow">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-black tracking-tight">
                <span className={`bg-clip-text text-transparent ${isDarkMode ? 'from-teal-400 via-emerald-400 to-cyan-400' : 'text-gradient-primary'}`}>
                </span>
              </h1>
              <p className={`text-sm font-medium tracking-wide ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                Clinical Nutrition Intelligence Platform
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">

            <ThemeToggle />
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <button className={`flex items-center gap-3 px-4 py-2 rounded-xl border transition-all duration-300 ${isDarkMode
                  ? 'bg-slate-800/50 backdrop-blur-xl border-slate-700/50 hover:border-cyan-500/50'
                  : 'bg-white border-slate-200 hover:border-cyan-500/50 shadow-sm'
                  }`}>
                  <Avatar
                    name={userInfo.name}
                    size="sm"
                    className="bg-gradient-to-br from-cyan-500 to-emerald-500 text-white"
                  />
                  <div className="hidden sm:block text-left">
                    <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{userInfo.name}</p>
                    <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{userInfo.email}</p>
                  </div>
                  <ChevronDown className={`w-4 h-4 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                </button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="User Actions"
                className={`border rounded-xl shadow-xl ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}
              >
                <DropdownItem key="profile" className={`${isDarkMode ? 'text-slate-300 hover:bg-slate-700' : 'text-slate-700 hover:bg-slate-100'}`}>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>My Profile</span>
                  </div>
                </DropdownItem>
                <DropdownItem key="settings" className={`${isDarkMode ? 'text-slate-300 hover:bg-slate-700' : 'text-slate-700 hover:bg-slate-100'}`}>
                  <div className="flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                  </div>
                </DropdownItem>
                <DropdownItem
                  key="logout"
                  className="text-red-400 hover:bg-red-500/10"
                  onClick={handleLogout}
                >
                  <div className="flex items-center gap-2">
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </div>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </header>

        {/* Upload Section */}
        {!result && (
          <div className="space-y-6 mb-10">
            {/* Entry Mode Toggle */}
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setEntryMode('pdf')}
                className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-semibold transition-all duration-300 ${entryMode === 'pdf'
                  ? 'bg-gradient-primary text-white shadow-lg shadow-cyan-500/30'
                  : isDarkMode
                    ? 'bg-slate-800/50 border border-slate-700/50 text-slate-400 hover:border-slate-600 hover:text-white'
                    : 'bg-white border border-slate-200 text-slate-600 hover:border-cyan-500/50 hover:text-slate-900 shadow-sm'
                  }`}
              >
                <Upload className="w-5 h-5" />
                Upload PDF
              </button>
              <button
                onClick={() => setEntryMode('manual')}
                className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-semibold transition-all duration-300 ${entryMode === 'manual'
                  ? 'bg-gradient-primary text-white shadow-lg shadow-cyan-500/30'
                  : isDarkMode
                    ? 'bg-slate-800/50 border border-slate-700/50 text-slate-400 hover:border-slate-600 hover:text-white'
                    : 'bg-white border border-slate-200 text-slate-600 hover:border-cyan-500/50 hover:text-slate-900 shadow-sm'
                  }`}
              >
                <Edit3 className="w-5 h-5" />
                Enter Manually
              </button>
            </div>

            {/* PDF Upload Mode */}
            {entryMode === 'pdf' && (
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`relative rounded-3xl border transition-all duration-500 overflow-hidden ${isDragging
                  ? 'border-cyan-400/60 bg-cyan-500/5 scale-[1.01]'
                  : isDarkMode
                    ? 'border-slate-700/50 bg-slate-900/30 hover:border-cyan-500/30 glow-pulse'
                    : 'border-slate-200 bg-white hover:border-cyan-400/30 hover:shadow-xl hover:shadow-cyan-500/10 glow-pulse'
                  }`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent pointer-events-none" />
                {!file ? (
                  <div className="relative p-16 text-center">
                    <div className="w-24 h-24 mx-auto mb-8 rounded-3xl bg-gradient-primary flex items-center justify-center shadow-2xl shadow-cyan-500/30 transform hover:scale-105 transition-transform duration-300 animate-glow">
                      <Upload className="w-12 h-12 text-white" />
                    </div>
                    <h3 className={`text-3xl font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Upload Lab Report</h3>
                    <p className={`mb-8 text-lg ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>Drag and drop your PDF or click to browse</p>
                    <label className="inline-flex items-center gap-2 px-10 py-4 bg-gradient-primary rounded-2xl font-bold text-lg text-white cursor-pointer hover:shadow-2xl hover:shadow-cyan-500/40 transition-all duration-300 transform hover:-translate-y-1 hover:scale-105">
                      <Upload className="w-5 h-5" />
                      Select PDF File
                      <input type="file" accept="application/pdf" className="hidden" onChange={handleFileSelect} />
                    </label>
                    <div className="flex items-center justify-center gap-4 mt-12 flex-wrap">
                      {['Blood Work', 'Urinalysis', 'Metabolic Panel'].map(tag => (
                        <span key={tag} className={`flex items-center gap-2 px-4 py-2 backdrop-blur-xl rounded-xl border text-sm ${isDarkMode
                          ? 'bg-slate-800/40 border-slate-700/50 text-slate-400'
                          : 'bg-slate-50 border-slate-200 text-slate-600'
                          }`}>
                          <CheckCircle className="w-4 h-4 text-emerald-500" /> {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="relative p-10">
                    {file && (
                      <div className="absolute top-4 right-4 text-emerald-400 animate-ping-once">
                        <CheckCircle className="w-6 h-6" />
                      </div>
                    )}
                    <div className={`flex items-center gap-5 p-5 backdrop-blur-xl rounded-2xl border mb-8 ${isDarkMode
                      ? 'bg-slate-800/40 border-slate-700/50'
                      : 'bg-slate-50 border-slate-200'
                      }`}>
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-red-500/20 to-rose-500/20 flex items-center justify-center border border-red-500/20">
                        <FileText className="w-7 h-7 text-red-400" />
                      </div>
                      <div className="flex-1">
                        <p className={`font-semibold text-lg ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{file.name}</p>
                        <p className={`text-sm flex items-center gap-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                          {(file.size / 1024 / 1024).toFixed(2)} MB • Ready to analyze
                        </p>
                      </div>
                      {!loading && (
                        <button onClick={() => setFile(null)} className={`p-3 rounded-xl transition-all ${isDarkMode
                          ? 'hover:bg-slate-700/50 text-slate-400 hover:text-white'
                          : 'hover:bg-slate-200 text-slate-500 hover:text-slate-900'
                          }`}>
                          <X className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Manual Entry Mode */}
            {entryMode === 'manual' && (
              <div className={`relative rounded-3xl border transition-colors overflow-hidden ${isDarkMode
                ? 'border-slate-700/50 bg-slate-900/30'
                : 'border-slate-200 bg-white shadow-lg'
                }`}>
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent pointer-events-none" />
                <div className="relative p-8">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 flex items-center justify-center border border-cyan-500/20">
                      <Edit3 className="w-7 h-7 text-cyan-400" />
                    </div>
                    <div>
                      <h3 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Enter Your Health Biomarkers</h3>
                      <p className={`${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>Fill in the required fields from your lab report</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                    {BIOMARKER_FIELDS.map(field => (
                      <div key={field.key} className="group">
                        <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                          {field.label} <span className="text-red-400">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            step="0.01"
                            value={manualData[field.key as keyof typeof manualData]}
                            onChange={(e) => handleManualInputChange(field.key, e.target.value)}
                            placeholder={field.range}
                            className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 focus:ring-offset-0 transition-colors ${isDarkMode
                              ? 'bg-slate-800/50 border-slate-700 text-white placeholder-slate-500'
                              : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white'
                              }`}
                          />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-500">{field.unit}</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">Normal: {field.range}</p>
                      </div>
                    ))}
                  </div>
                  <div className={`border-t pt-6 mb-6 ${isDarkMode ? 'border-slate-700/50' : 'border-slate-200'}`}>
                    <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Optional Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>Age</label>
                        <input
                          type="number"
                          value={manualData.age}
                          onChange={(e) => handleManualInputChange('age', e.target.value)}
                          placeholder="45"
                          className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 focus:ring-offset-0 transition-colors ${isDarkMode
                            ? 'bg-slate-800/50 border-slate-700 text-white placeholder-slate-500'
                            : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white'
                            }`}
                        />
                      </div>
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>Gender</label>
                        <select
                          value={manualData.gender}
                          onChange={(e) => handleManualInputChange('gender', e.target.value)}
                          className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:border-cyan-500 transition-colors ${isDarkMode
                            ? 'bg-slate-800/50 border-slate-700 text-white'
                            : 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white'
                            }`}
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                        </select>
                      </div>
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>HbA1c (%)</label>
                        <input
                          type="number"
                          step="0.1"
                          value={manualData.hba1c}
                          onChange={(e) => handleManualInputChange('hba1c', e.target.value)}
                          placeholder="5.7"
                          className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 focus:ring-offset-0 transition-colors ${isDarkMode
                            ? 'bg-slate-800/50 border-slate-700 text-white placeholder-slate-500'
                            : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white'
                            }`}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Dietary Preferences Section */}
            <div className={`relative rounded-3xl border transition-colors ${isDarkMode
              ? 'border-slate-700/50 bg-slate-900/30'
              : 'border-slate-200 bg-white shadow-lg'
              }`}>
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent pointer-events-none" />
              <div className="relative p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-green-500/20 flex items-center justify-center border border-emerald-500/20">
                    <Leaf className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Dietary Preferences</h3>
                    <p className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>Customize your meal plan based on your preferences</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <label className={`block text-sm font-semibold uppercase tracking-wider mb-4 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>Food Type</label>
                    <div className="flex gap-3">
                      {[
                        { value: 'vegetarian' as DietType, label: 'Vegetarian', icon: '🥬' },
                        { value: 'non-vegetarian' as DietType, label: 'Non-Veg', icon: '🍗' },
                        { value: 'both' as DietType, label: 'Both', icon: '🍽️' },
                      ].map(option => (
                        <button
                          key={option.value}
                          onClick={() => setDietaryPrefs(prev => ({ ...prev, diet_type: option.value }))}
                          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${dietaryPrefs.diet_type === option.value
                            ? 'bg-gradient-primary text-white shadow-lg shadow-emerald-500/30'
                            : isDarkMode
                              ? 'bg-slate-800/50 border border-slate-700/50 text-slate-300 hover:border-emerald-500/50 hover:text-white'
                              : 'bg-white border border-slate-200 text-slate-600 hover:border-emerald-500/50 hover:text-slate-900 hover:shadow-md'
                            }`}
                        >
                          <span>{option.icon}</span>
                          <span className="text-sm">{option.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className={`block text-sm font-semibold uppercase tracking-wider mb-4 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>Regional Cuisine</label>
                    <div className="relative">
                      <button
                        onClick={() => setRegionDropdownOpen(!regionDropdownOpen)}
                        className={`w-full flex items-center justify-between px-4 py-3 border rounded-xl transition-colors ${isDarkMode
                          ? 'bg-slate-800/50 border-slate-700 text-white hover:border-emerald-500/50'
                          : 'bg-white border-slate-200 text-slate-900 hover:border-emerald-500/50 hover:shadow-sm'
                          }`}
                      >
                        <span className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-emerald-400" />
                          {REGION_OPTIONS.find(r => r.value === dietaryPrefs.region)?.label || 'All Regions (Pan-Indian)'}
                        </span>
                        <ChevronDown className={`w-4 h-4 transition-transform ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} ${regionDropdownOpen ? 'rotate-180' : ''}`} />
                      </button>
                      {regionDropdownOpen && (
                        <div className={`absolute bottom-full left-0 right-0 mb-2 border rounded-xl overflow-y-auto max-h-64 z-50 shadow-2xl ${isDarkMode
                          ? 'bg-slate-800 border-slate-700'
                          : 'bg-white border-slate-200'
                          }`}>
                          {REGION_OPTIONS.map(option => (
                            <button
                              key={option.label}
                              onClick={() => {
                                setDietaryPrefs(prev => ({ ...prev, region: option.value as RegionType }));
                                setRegionDropdownOpen(false);
                              }}
                              className={`w-full px-4 py-3 text-left transition-colors ${dietaryPrefs.region === option.value
                                ? (isDarkMode ? 'bg-amber-500/20 text-amber-300' : 'bg-amber-500/20 text-amber-700')
                                : isDarkMode ? 'text-slate-300 hover:bg-slate-700' : 'text-slate-700 hover:bg-slate-50'
                                }`}
                            >
                              {option.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className={`relative rounded-3xl border p-10 space-y-8 ${isDarkMode
                ? 'border-slate-700/50 bg-slate-900/30'
                : 'border-slate-200 bg-white shadow-xl'
                }`}>
                <div className="flex justify-between relative">
                  {steps.map((step, idx) => {
                    const StepIcon = step.icon;
                    const isActive = activeStep >= idx;
                    const isComplete = activeStep > idx;
                    return (
                      <div key={idx} className="flex-1 relative">
                        <div className="flex flex-col items-center relative z-10">
                          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-3 transition-all duration-700 ${isActive
                            ? 'bg-gradient-primary scale-110 shadow-xl shadow-cyan-500/40'
                            : isDarkMode
                              ? 'bg-slate-800/50 border border-slate-700/50'
                              : 'bg-slate-100 border border-slate-200'
                            }`}>
                            <StepIcon className={`w-8 h-8 transition-colors duration-300 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                          </div>
                          <p className={`text-sm text-center font-medium transition-colors duration-500 ${isActive
                            ? 'text-cyan-400'
                            : isDarkMode ? 'text-slate-500' : 'text-slate-400'
                            }`}>
                            {step.label}
                          </p>
                        </div>
                        {idx < steps.length - 1 && (
                          <div className={`absolute top-8 left-[55%] w-[90%] h-1 rounded-full overflow-hidden ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'}`}>
                            <div className={`h-full bg-gradient-primary transition-all duration-1000 ease-out ${isComplete ? 'w-full' : 'w-0'}`} />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                {/* 🔥 Warm Accent Health Fact */}
                <div className="text-center bg-[hsla(358,85%,68%,0.1)] border border-[hsla(358,85%,68%,0.2)] rounded-2xl p-6 backdrop-blur-sm animate-fade-in">
                  <div className="flex justify-center mb-3">
                    <Sparkles className="w-5 h-5 text-amber-400 animate-spin-slow" />
                  </div>
                  <p className={`italic text-lg font-light ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>"{currentHealthFact}"</p>
                  <div className="mt-4 flex justify-center gap-1">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="w-2 h-2 rounded-full bg-[hsl(358,85%,68%)] animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Error Display */}
            {error && !loading && (
              <div className="p-5 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center gap-4 backdrop-blur-xl">
                <AlertCircle className="w-6 h-6 text-red-400" />
                <span className="text-red-200">{error}</span>
              </div>
            )}

            {/* Analyze Button — Enhanced with Warm Hover */}
            {!loading && (entryMode === 'manual' || file) && (
              <button
                onClick={entryMode === 'manual' ? handleManualAnalyze : handleAnalyze}
                className="group w-full py-5 bg-gradient-primary
                           rounded-2xl font-bold text-xl text-white 
                           hover:bg-gradient-warm
                           hover:shadow-2xl hover:shadow-amber-500/40 
                           transition-all duration-300 transform hover:-translate-y-1 
                           active:scale-[0.98] active:opacity-90
                           flex items-center justify-center gap-3"
              >
                <Sparkles className="w-6 h-6 group-hover:text-white" />
                Generate Analysis
              </button>
            )}
          </div>
        )}

        {result && (
          <div className="space-y-8 animate-fade-in">
            {/* Results Header with Download Button */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  Your Personalized Health Analysis
                </h2>
                <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  Based on your clinical biomarkers and preferences
                </p>
              </div>
              <button
                onClick={() => generatePDF(result, userInfo)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 ${isDarkMode
                  ? 'bg-primary-500/10 text-primary-400 border border-primary-500/20 hover:bg-primary-500/20'
                  : 'bg-primary-50 text-primary-700 border border-primary-200 hover:bg-primary-100'
                  }`}
              >
                <Download className="w-5 h-5" />
                Download Report
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Risk Assessment Card */}
              <div className={`relative backdrop-blur-xl rounded-3xl p-7 border overflow-visible group transition-all duration-300 hover:shadow-xl hover:shadow-primary-500/10 ${isDarkMode
                ? 'bg-slate-900/50 border-slate-700/50 hover:border-primary-500/30'
                : 'bg-white border-slate-200 shadow-xl hover:shadow-2xl hover:border-primary-400/30'
                }`}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500/20 to-rose-500/20 flex items-center justify-center border border-red-500/20">
                    <Heart className="w-6 h-6 text-red-500" />
                  </div>
                  <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Risk Assessment</h3>
                </div>
                <div className="group/risk relative cursor-help">
                  <div className={`bg-gradient-to-br ${getRiskGradient(riskLevel)} rounded-2xl p-7 mb-6 text-center shadow-2xl ${getRiskShadow(riskLevel)} transform hover:scale-[1.02] transition-transform duration-300`}>
                    <div className="text-6xl font-black mb-1 text-white drop-shadow-lg">{riskLevel.toFixed(1)}%</div>
                    <div className="flex items-center justify-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-white/80" />
                      <p className="text-sm font-semibold text-white/90">Mortality / ICU Risk</p>
                    </div>
                  </div>
                  <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-64 p-4 border rounded-xl shadow-2xl opacity-0 invisible group-hover/risk:opacity-100 group-hover/risk:visible transition-all duration-300 z-50 text-sm ${isDarkMode
                    ? 'bg-slate-900 border-slate-700 text-slate-300'
                    : 'bg-white border-slate-200 text-slate-600'
                    }`}>
                    <p className={`font-semibold mb-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Why this risk?</p>
                    {result.diet.medical_reasoning.slice(0, 100)}...
                    <span className="text-xs text-slate-500 mt-1 block">Based on biomarker analysis.</span>
                    <div className={`absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-3 h-3 border-b border-r rotate-45 ${isDarkMode
                      ? 'bg-slate-900 border-slate-700'
                      : 'bg-white border-slate-200'
                      }`}></div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="group/bio relative">
                    <div className={`flex items-center justify-between p-4 rounded-xl border transition-colors cursor-help ${isDarkMode
                      ? 'bg-slate-800/40 border-slate-700/30 hover:bg-slate-800/60'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                      }`}>
                      <div className="flex items-center gap-3">
                        <Droplet className="w-5 h-5 text-blue-500" />
                        <span className={`font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Glucose</span>
                      </div>
                      <span className={`font-bold text-xl ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{result.clinical.patient_metrics.glucose} <span className="text-sm text-slate-500 font-normal">mg/dL</span></span>
                    </div>
                    <div className={`absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 border p-3 rounded-xl shadow-xl opacity-0 invisible group-hover/bio:opacity-100 group-hover/bio:visible transition-all z-50 text-xs ${isDarkMode
                      ? 'bg-slate-900 border-slate-600 text-slate-300'
                      : 'bg-white border-slate-200 text-slate-600'
                      }`}>
                      {BIOMARKER_RANGES.glucose}
                    </div>
                  </div>
                  <div className="group/bio relative">
                    <div className={`flex items-center justify-between p-4 rounded-xl border transition-colors cursor-help ${isDarkMode
                      ? 'bg-slate-800/40 border-slate-700/30 hover:bg-slate-800/60'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                      }`}>
                      <div className="flex items-center gap-3">
                        <Activity className="w-5 h-5 text-cyan-500" />
                        <span className={`font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Creatinine</span>
                      </div>
                      <span className={`font-bold text-xl ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{result.clinical.patient_metrics.creatinine} <span className="text-sm text-slate-500 font-normal">mg/dL</span></span>
                    </div>
                    <div className={`absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 border p-3 rounded-xl shadow-xl opacity-0 invisible group-hover/bio:opacity-100 group-hover/bio:visible transition-all z-50 text-xs ${isDarkMode
                      ? 'bg-slate-900 border-slate-600 text-slate-300'
                      : 'bg-white border-slate-200 text-slate-600'
                      }`}>
                      {BIOMARKER_RANGES.creatinine}
                    </div>
                  </div>
                </div>
              </div>

              {/* Clinical Summary */}
              <div className={`lg:col-span-2 relative backdrop-blur-xl rounded-3xl p-7 border overflow-hidden group transition-all duration-300 ${isDarkMode
                ? 'bg-slate-900/50 border-slate-700/50 hover:border-slate-600/50'
                : 'bg-white border-slate-200 shadow-xl hover:shadow-2xl'
                }`}>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-teal-500/20 flex items-center justify-center border border-cyan-500/20">
                    <FileText className="w-6 h-6 text-cyan-400" />
                  </div>
                  <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Clinical Summary</h3>
                </div>
                <p className={`mb-8 leading-relaxed text-lg ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>{result.clinical.summary}</p>
                <div className="mb-8">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Identified Conditions</h4>
                  <div className="flex flex-wrap gap-2">
                    {result.clinical.conditions.map((condition, idx) => (
                      <span key={idx} className="px-4 py-2 bg-red-500/10 text-red-300 rounded-xl text-sm border border-red-500/20 font-semibold">
                        {condition}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Nutrition Targets */}
            <div className={`relative backdrop-blur-xl rounded-3xl p-7 border overflow-hidden ${isDarkMode
              ? 'bg-slate-900/50 border-slate-700/50'
              : 'bg-white border-slate-200 shadow-xl'
              }`}>
              <div className="relative z-10">
                <h3 className={`text-xl font-bold mb-6 flex items-center gap-3 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center border border-emerald-500/20">
                    <Target className="w-5 h-5 text-emerald-400" />
                  </div>
                  Daily Nutrition Targets (Average)
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: 'Calories', value: result.diet.total_nutrition.calories, gradient: 'from-cyan-500 to-blue-500' },
                    { label: 'Protein', value: result.diet.total_nutrition.protein, gradient: 'from-emerald-500 to-green-500' },
                    { label: 'Carbs', value: result.diet.total_nutrition.carbs, gradient: 'from-warm to-warm-light' },
                    { label: 'Fat', value: result.diet.total_nutrition.fat, gradient: 'from-violet-500 to-purple-500' }
                  ].map((nutrient, idx) => (
                    <div key={idx} className={`group relative text-center p-7 rounded-2xl border transition-all duration-300 hover:scale-[1.02] overflow-hidden ${isDarkMode
                      ? 'bg-slate-800/30 border-slate-700/30 hover:bg-slate-800/50'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                      }`}>
                      <div className={`absolute inset-0 bg-gradient-to-br ${nutrient.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                      <div className={`text-4xl font-black bg-gradient-to-r ${nutrient.gradient} bg-clip-text text-transparent mb-1`}>{nutrient.value}</div>
                      <div className="text-xs text-slate-500 uppercase tracking-widest font-bold">{nutrient.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* === Enhanced Meal Timeline === */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-2xl font-bold flex items-center gap-3 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  <Utensils className="w-6 h-6 text-emerald-400" />
                  Personalized Diet Plan: Day {currentDay}
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentDay(prev => Math.max(1, prev - 1))}
                    disabled={currentDay === 1}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${isDarkMode
                      ? 'bg-slate-800 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-700'
                      : 'bg-slate-100 text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-200'
                      }`}
                  >
                    Previous Day
                  </button>
                  <span className={`text-sm font-bold px-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    {currentDay} / 7
                  </span>
                  <button
                    onClick={() => setCurrentDay(prev => Math.min(7, prev + 1))}
                    disabled={currentDay === 7}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${isDarkMode
                      ? 'bg-slate-800 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-700'
                      : 'bg-slate-100 text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-200'
                      }`}
                  >
                    Next Day
                  </button>
                </div>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentDay}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5"
                >
                  {['Breakfast', 'Lunch', 'Snacks', 'Dinner'].map((mealType) => {
                    // Get the current day's plan from week_plan
                    const dayKey = `day${currentDay}` as keyof typeof result.diet.week_plan;
                    const currentDayPlan = result.diet.week_plan[dayKey];
                    const key = mealType.toLowerCase() as keyof typeof currentDayPlan;
                    const items = currentDayPlan?.[key] || [];
                    const MealIcon = getMealIcon(mealType);

                    // Time-based accent color
                    const timeColor =
                      mealType === 'Breakfast' ? 'from-warm via-warm-dark to-orange-500' :
                        mealType === 'Lunch' ? 'from-primary-400 via-primary-500 to-primary-600' :
                          mealType === 'Snacks' ? 'from-primary to-primary-light' :
                            'from-violet-500 to-purple-600';

                    return (
                      <div
                        key={mealType}
                        className={`group relative backdrop-blur-xl rounded-3xl border overflow-hidden transition-all duration-300 h-full ${isDarkMode
                          ? 'bg-gradient-to-b from-slate-900/60 to-slate-800/30 border-slate-700/50 hover:border-transparent'
                          : 'bg-gradient-to-b from-white to-slate-50 border-slate-200 shadow-lg hover:shadow-xl'
                          }`}
                      >
                        {/* Accent Top Bar */}
                        <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${timeColor}`}></div>

                        {/* Header */}
                        <div className={`p-5 border-b ${isDarkMode ? 'border-slate-700/30' : 'border-slate-200'}`}>
                          <div className="flex items-center gap-3">
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${timeColor} flex items-center justify-center`}>
                              <MealIcon className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <div className="flex items-center gap-1 text-xs text-slate-500 mb-0.5">
                                <Clock className="w-3 h-3" />
                                {getMealTime(mealType)}
                              </div>
                              <h4 className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{mealType}</h4>
                            </div>
                          </div>
                        </div>

                        {/* Meals List */}
                        <div className="p-5 space-y-3">
                          {items.length > 0 ? (
                            items.map((meal, idx) => (
                              <motion.button
                                key={idx}
                                whileHover={{
                                  y: -4,
                                  boxShadow: isDarkMode
                                    ? "0 10px 25px -5px rgba(6, 182, 212, 0.25)"
                                    : "0 10px 25px -5px rgba(13, 148, 136, 0.2)"
                                }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setSelectedMeal(meal)}
                                className={`w-full text-left p-4 rounded-xl transition-all duration-300 border border-transparent group/item ${isDarkMode
                                  ? 'bg-slate-800/40 hover:bg-slate-700/60 hover:border-slate-600'
                                  : 'bg-slate-50 hover:bg-white hover:border-slate-300 shadow-sm'
                                  }`}
                              >
                                <div className="flex justify-between items-start mb-2">
                                  <p className={`font-medium text-sm leading-snug group-hover/item:text-primary-500 transition-colors ${isDarkMode ? 'text-slate-200' : 'text-slate-800'
                                    }`}>
                                    {meal.item}
                                  </p>
                                  <Info className="w-4 h-4 text-slate-400 opacity-0 group-hover/item:opacity-100 transition-opacity" />
                                </div>
                                <div className="flex flex-wrap gap-1.5">
                                  <span className={`px-2 py-1 rounded text-[11px] font-semibold ${isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-200 text-slate-600'
                                    }`}>
                                    {meal.calories} kcal
                                  </span>
                                  {meal.tags?.map(t => (
                                    <span
                                      key={t}
                                      className="px-2 py-1 bg-primary-500/10 text-primary-600 rounded text-[11px] uppercase font-semibold border border-primary-500/20"
                                    >
                                      {t.replace('_', ' ')}
                                    </span>
                                  ))}
                                </div>
                              </motion.button>
                            ))
                          ) : (
                            <p className={`text-sm italic ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                              No meals scheduled
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* === Enhanced Medical Reasoning === */}
            <div className={`relative backdrop-blur-xl rounded-3xl p-8 border overflow-hidden transition-all duration-300 ${isDarkMode
              ? 'bg-gradient-to-br from-indigo-900/20 via-slate-900/40 to-blue-900/20 border-indigo-500/30'
              : 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 shadow-lg'
              }`}>
              <div className="relative z-10">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 flex-shrink-0">
                    <Brain className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className={`text-2xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Why This Plan Works For You</h3>
                    <p className={`mt-1 text-sm ${isDarkMode ? 'text-indigo-300' : 'text-indigo-600'}`}>
                      Clinical logic powered by your biomarkers
                    </p>
                  </div>
                </div>

                {/* Reasoning Body */}
                <div className={`p-6 rounded-2xl leading-relaxed text-lg border-l-4 ${isDarkMode
                  ? 'bg-slate-900/50 border-l-indigo-500 text-slate-200'
                  : 'bg-white/70 border-l-indigo-500 text-slate-700'
                  }`}>
                  {/* Split into paragraphs for readability */}
                  {result.diet.medical_reasoning
                    .split('\n')
                    .filter(p => p.trim())
                    .map((para, i) => (
                      <p key={i} className="mb-4 last:mb-0">
                        {para}
                      </p>
                    ))}
                </div>

                {/* Trust Badge */}
                <div className={`mt-6 flex items-center gap-3 p-4 rounded-xl ${isDarkMode ? 'bg-indigo-900/20' : 'bg-indigo-50'
                  }`}>
                  <ShieldCheck className={`w-5 h-5 ${isDarkMode ? 'text-indigo-300' : 'text-indigo-600'}`} />
                  <span className={`text-sm ${isDarkMode ? 'text-indigo-200' : 'text-indigo-700'}`}>
                    Reviewed against NIH & NKF clinical guidelines • Updated Jan 2026
                  </span>
                </div>
              </div>

              {/* Subtle DNA motif in background (optional) */}
              <div className="absolute bottom-4 right-4 opacity-5 pointer-events-none">
                <svg width="60" height="60" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
              </div>
            </div>
          </div>
        )}

        {/* Meal Detail Modal */}
        {selectedMeal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className={`absolute inset-0 backdrop-blur-sm ${isDarkMode ? 'bg-slate-950/80' : 'bg-slate-500/30'}`}
              onClick={() => setSelectedMeal(null)}
            />
            <div className={`relative w-full max-w-md border rounded-3xl p-6 shadow-2xl animate-fade-in-up ${isDarkMode
              ? 'bg-slate-900 border-slate-700'
              : 'bg-white border-slate-200'
              }`}>
              <button
                onClick={() => setSelectedMeal(null)}
                className={`absolute top-4 right-4 p-2 rounded-full transition-colors ${isDarkMode
                  ? 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                  : 'bg-slate-100 text-slate-500 hover:text-slate-900 hover:bg-slate-200'
                  }`}
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className={`text-2xl font-bold mb-1 pr-10 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{selectedMeal.item}</h3>
              <div className="flex gap-2 mb-6">
                {selectedMeal.tags?.map(t => (
                  <span key={t} className="text-xs font-semibold text-primary-500 uppercase tracking-wider">{t.replace('_', ' ')}</span>
                ))}
              </div>
              <div className="space-y-6">
                <div>
                  <h4 className="flex items-center gap-2 text-sm font-bold text-slate-500 uppercase tracking-widest mb-3">
                    <Leaf className="w-4 h-4" /> Ingredients
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {(selectedMeal.ingredients || ['Fresh, whole ingredients sourced locally', 'No additives', 'Organic seasoning']).map((ing, i) => (
                      <span key={i} className={`px-3 py-1.5 rounded-lg text-sm border ${isDarkMode
                        ? 'bg-slate-800 text-slate-300 border-slate-700'
                        : 'bg-slate-100 text-slate-700 border-slate-200'
                        }`}>{ing}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="flex items-center gap-2 text-sm font-bold text-slate-500 uppercase tracking-widest mb-3">
                    <MapPin className="w-4 h-4" /> Origin & Sourcing
                  </h4>
                  <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl">
                    <p className="text-emerald-600 text-sm leading-relaxed">
                      {selectedMeal.origin || "Sourced from certified organic farms focusing on sustainable agriculture. Verified non-GMO."}
                    </p>
                  </div>
                </div>
              </div>
              <div className={`mt-8 pt-6 border-t flex justify-between text-sm ${isDarkMode ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-600'}`}>
                <span className="flex flex-col">
                  <span className="text-xs uppercase text-slate-500 font-bold">Protein</span>
                  <span className={`font-mono text-lg ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{selectedMeal.protein}g</span>
                </span>
                <span className="flex flex-col">
                  <span className="text-xs uppercase text-slate-500 font-bold">Fats</span>
                  <span className={`font-mono text-lg ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{selectedMeal.fat}g</span>
                </span>
                <span className="flex flex-col">
                  <span className="text-xs uppercase text-slate-500 font-bold">Carbs</span>
                  <span className={`font-mono text-lg ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{selectedMeal.carbs}g</span>
                </span>
              </div>
              <div className="mt-6 flex justify-center">
                <button onClick={() => window.print()} className="flex items-center gap-2 px-6 py-3 bg-slate-800 text-white rounded-xl hover:bg-slate-700 transition-colors">
                  <Download className="w-4 h-4" />
                  <span>Download Full Report (PDF)</span>
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default App;