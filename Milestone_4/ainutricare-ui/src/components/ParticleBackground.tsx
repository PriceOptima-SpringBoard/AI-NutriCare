// src/components/ParticleBackground.tsx
import React, { useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';

const ParticleBackground: React.FC = () => {
    const { isDarkMode } = useTheme();
    const sphere1Ref = useRef<HTMLDivElement>(null);
    const sphere2Ref = useRef<HTMLDivElement>(null);
    const sphere3Ref = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const particleCount = 60;

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        // Clear existing particles
        container.innerHTML = '';

        // Create initial particles
        for (let i = 0; i < particleCount; i++) {
            createParticle(container, isDarkMode);
        }

        // Mouse interaction handler
        const handleMouseMove = (e: MouseEvent) => {
            const mouseX = (e.clientX / window.innerWidth) * 100;
            const mouseY = (e.clientY / window.innerHeight) * 100;

            const particle = document.createElement('div');
            particle.className = 'particle';
            const size = Math.random() * 3 + 1;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${mouseX}%`;
            particle.style.top = `${mouseY}%`;
            particle.style.opacity = isDarkMode ? '0.5' : '0.7';
            particle.style.background = isDarkMode ? 'white' : 'hsl(138, 82%, 69%)';

            container.appendChild(particle);

            setTimeout(() => {
                particle.style.transition = 'all 2s ease-out';
                particle.style.left = `${mouseX + (Math.random() * 10 - 5)}%`;
                particle.style.top = `${mouseY + (Math.random() * 10 - 5)}%`;
                particle.style.opacity = '0';

                setTimeout(() => particle.remove(), 2000);
            }, 10);
        };

        document.addEventListener('mousemove', handleMouseMove);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
        };
    }, [isDarkMode]);

    // Parallax Scroll Effect (separate useEffect)
    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;

            // Adjust these multipliers to control speed/direction
            const speed1 = 0.05;  // slow drift (top-left sphere)
            const speed2 = -0.03; // opposite direction (bottom-right)
            const speed3 = 0.08;  // faster movement (center)

            if (sphere1Ref.current) {
                sphere1Ref.current.style.transform = `translate(${scrollY * speed1}px, ${scrollY * speed1}px)`;
            }
            if (sphere2Ref.current) {
                sphere2Ref.current.style.transform = `translate(${-scrollY * speed2}px, ${scrollY * speed2}px)`;
            }
            if (sphere3Ref.current) {
                sphere3Ref.current.style.transform = `translate(${scrollY * speed3}px, ${-scrollY * speed3}px)`;
            }
        };

        // Set initial position
        handleScroll();

        // Listen to scroll (passive = high performance)
        window.addEventListener('scroll', handleScroll, { passive: true });

        // Cleanup
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const createParticle = (container: HTMLDivElement, darkMode: boolean) => {
        const particle = document.createElement('div');
        particle.className = 'particle';

        const size = Math.random() * 2 + 1;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.background = darkMode ? 'white' : 'hsl(138, 82%, 69%)';

        resetAndAnimate(particle, darkMode);
        container.appendChild(particle);
    };

    const resetAndAnimate = (particle: HTMLElement, darkMode: boolean) => {
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;

        particle.style.left = `${posX}%`;
        particle.style.top = `${posY}%`;
        particle.style.opacity = '0';

        const duration = Math.random() * 10 + 10;
        const delay = Math.random() * 5;

        setTimeout(() => {
            particle.style.transition = `opacity ${duration}s linear, left ${duration}s linear, top ${duration}s linear`;
            particle.style.opacity = darkMode ? '0.2' : '0.4';

            const moveX = posX + (Math.random() * 20 - 10);
            const moveY = posY - Math.random() * 30;

            particle.style.left = `${moveX}%`;
            particle.style.top = `${moveY}%`;

            setTimeout(() => resetAndAnimate(particle, darkMode), duration * 1000);
        }, delay * 1000);
    };

    // Inside ParticleBackground.tsx return statement:

    return (
        <>
            {/* Base Gradient Layer (-z-10) */}
            <div className="fixed inset-0 -z-10 overflow-hidden">
                <div className={`absolute inset-0 transition-colors duration-500 ${isDarkMode
                    ? 'bg-gradient-to-br from-slate-950 via-[#0d1424] to-slate-900'
                    : 'bg-gradient-to-br from-blue-50 via-emerald-50 to-cyan-50'
                    }`} />
                {/* ... (Keep your blobs, grain, and grid here) ... */}
            </div>

            {/* Floating Spheres Layer (z-0) */}
            <div className="gradient-background">

                {/* Sphere 1: Wrapper handles Scroll (Ref), Inner handles Float/Color */}
                <div ref={sphere1Ref} className="sphere-pos-1">
                    <div className={`gradient-sphere-visual sphere-anim-1 ${isDarkMode ? 'dark-sphere-1' : 'light-sphere-1'
                        }`} />
                </div>

                {/* Sphere 2 */}
                <div ref={sphere2Ref} className="sphere-pos-2">
                    <div className={`gradient-sphere-visual sphere-anim-2 ${isDarkMode ? 'dark-sphere-2' : 'light-sphere-2'
                        }`} />
                </div>

                {/* Sphere 3 */}
                <div ref={sphere3Ref} className="sphere-pos-3">
                    <div className={`gradient-sphere-visual sphere-anim-3 ${isDarkMode ? 'dark-sphere-3' : 'light-sphere-3'
                        }`} />
                </div>

                {/* Overlays */}
                <div className={`grid-overlay ${isDarkMode ? 'dark-grid' : 'light-grid'}`} />
                <div className={`glow ${isDarkMode ? 'dark-glow' : 'light-glow'}`} />
                <div className={`noise-overlay ${isDarkMode ? 'dark-noise' : 'light-noise'}`} />
            </div>

            {/* Particles Container */}
            <div ref={containerRef} className="particles-container" id="particles-container" />
        </>
    );
};

export default ParticleBackground;
