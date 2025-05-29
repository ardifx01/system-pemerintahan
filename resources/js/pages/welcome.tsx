/**
 * Copyright (c) 2025 vickymosafan. All Rights Reserved.
 * 
 * This source code is protected under international copyright law.
 * Unauthorized reproduction, distribution, or modification of this file is prohibited.
 * This code contains proprietary security measures that prevent modification.
 * Any attempt to modify by unauthorized parties will be subject to legal action.
 */

import { Head, Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import type { PageProps } from '@/types';
import AppLogoIcon from '@/components/app-logo-icon';
import { useIsMobile } from '@/hooks/use-mobile';

// Animation variants for consistent animations throughout the application
const animations = {
    fadeInUp: {
        hidden: { opacity: 0, y: 20 },
        visible: (delay = 0) => ({
            opacity: 1, 
            y: 0,
            transition: { 
                duration: 0.6, 
                ease: "easeOut",
                delay 
            }
        })
    },
    fadeIn: {
        hidden: { opacity: 0 },
        visible: (delay = 0) => ({
            opacity: 1,
            transition: { 
                duration: 0.8, 
                ease: "easeOut",
                delay 
            }
        })
    },
    scale: {
        hover: { scale: 1.05 },
        tap: { scale: 0.95 }
    },
    float: {
        initial: { y: 0 },
        animate: { 
            y: [0, -10, 0], 
            transition: { 
                duration: 4, 
                repeat: Infinity, 
                ease: "easeInOut" 
            } 
        }
    },
    pulse: {
        initial: { opacity: 0.4, scale: 1 },
        animate: { 
            opacity: [0.4, 0.6, 0.4], 
            scale: [1, 1.03, 1],
            transition: { 
                duration: 3, 
                repeat: Infinity, 
                ease: "easeInOut" 
            } 
        }
    }
};

// Reusable button component to reduce code duplication
type ButtonVariant = 'primary' | 'secondary' | 'outline';
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';

interface ButtonProps {
    href: string;
    variant: ButtonVariant;
    size?: ButtonSize;
    children: React.ReactNode;
    className?: string;
    icon?: React.ReactNode;
}

const Button = ({ href, variant, size = 'md', children, className = '', icon }: ButtonProps) => {
    // Base styles
    const baseStyles = "font-semibold transition-all duration-200 flex items-center justify-center rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2";
    
    // Size styles
    const sizeStyles = {
        xs: "text-sm px-3 py-2",
        sm: "text-sm px-4 py-2",
        md: "text-base px-5 py-2.5",
        lg: "text-lg px-6 py-3"
    };
    
    // Variant styles
    const variantStyles = {
        primary: "shadow-md text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 hover:scale-105 focus:ring-blue-500 border border-transparent",
        secondary: "border text-gray-700 hover:text-gray-900 bg-white hover:bg-gray-50 active:bg-gray-100 hover:scale-105 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-700 dark:active:bg-gray-600 focus:ring-gray-500 border-gray-300 shadow-sm",
        outline: "border border-blue-300 text-blue-600 hover:bg-blue-50 active:bg-blue-100 hover:border-blue-400 dark:border-blue-700 dark:text-blue-400 dark:hover:bg-blue-900/30 dark:active:bg-blue-800/40 focus:ring-blue-500"
    };
    
    return (
        <motion.div whileHover={animations.scale.hover} whileTap={animations.scale.tap} className="touch-manipulation">
            <Link 
                href={href} 
                className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
            >
                {icon && <span className="mr-2">{icon}</span>}
                {children}
            </Link>
        </motion.div>
    );
};

// Button with notification badge for authenticated users
interface DashboardButtonProps {
    notificationCount?: number;
}

const DashboardButton: React.FC<DashboardButtonProps> = ({ notificationCount = 0 }) => {
    return (
        <Button 
            href={route('dashboard')} 
            variant="primary" 
            size="xs" 
            className="text-xs sm:text-sm relative"
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>}
        >
            Dashboard
            {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-[9px] flex items-center justify-center text-white font-semibold">
                        {notificationCount > 9 ? '9+' : notificationCount}
                    </span>
                </span>
            )}
        </Button>
    );
};

// Feature card component to reduce duplication
interface FeatureProps {
    title: string;
    description: string;
    icon?: React.ReactNode;
    delay?: number;
}

const FeatureCard = ({ title, description, icon, delay = 0 }: FeatureProps) => {
    return (
        <motion.div
            variants={animations.fadeInUp}
            custom={delay}
            className="bg-blue-900/30 backdrop-blur-sm p-5 sm:p-5 md:p-6 rounded-xl border border-blue-500/20 group hover:bg-blue-800/30 transition-colors duration-300 flex flex-col items-center sm:items-start touch-manipulation"
        >
            {icon && (
                <div className="mb-3 text-blue-300 group-hover:text-blue-200 transition-colors">
                    {icon}
                </div>
            )}
            <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-2 text-white group-hover:text-blue-100 transition-colors text-center sm:text-left">{title}</h3>
            <p className="text-sm sm:text-sm text-blue-200/80 leading-relaxed text-center sm:text-left">{description}</p>
        </motion.div>
    );
};

// Stat card component
interface StatProps {
    value: string;
    label: string;
    icon?: React.ReactNode;
    delay?: number;
}

const StatCard = ({ value, label, icon, delay = 0 }: StatProps) => {
    return (
        <motion.div
            variants={animations.fadeInUp}
            custom={delay}
            className="bg-blue-900/20 backdrop-blur-sm p-3 sm:p-4 rounded-lg border border-blue-500/10 flex flex-col items-center group hover:bg-blue-800/30 transition-all duration-300 touch-manipulation"
        >
            {icon && (
                <div className="mb-1 sm:mb-2 text-blue-300 group-hover:text-blue-200 transition-colors">
                    {icon}
                </div>
            )}
            <span className="text-xl sm:text-xl md:text-2xl font-bold text-white">{value}</span>
            <p className="text-sm sm:text-sm md:text-base text-blue-200/80 leading-tight">{label}</p>
        </motion.div>
    );
};

export default function Welcome() {
    const { auth } = usePage<PageProps>().props;
    const isAuthenticated = auth.user !== null;
    const isMobile = useIsMobile();

    // Random notification count for authenticated users (for demo purposes)
    const notificationCount = isAuthenticated ? Math.floor(Math.random() * 5) : 0;

    // Features data
    const features = [
        { 
            title: "Proses Cepat", 
            description: "Proses administrasi yang lebih cepat dan efisien dengan sistem digital", 
            icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
        },
        { 
            title: "Data Aman", 
            description: "Data terlindungi dengan sistem keamanan terkini dan terenkripsi", 
            icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
        },
        { 
            title: "Mudah Digunakan", 
            description: "Antarmuka yang sederhana dan intuitif untuk semua kalangan masyarakat", 
            icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
            </svg> 
        }
    ];

    // Stats data
    const stats = [
        { 
            value: "99%", 
            label: "Kepuasan",
            icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        },
        { 
            value: "24/7", 
            label: "Layanan",
            icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        },
        { 
            value: "5 mnt", 
            label: "Proses",
            icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
        },
        { 
            value: "100%", 
            label: "Digital",
            icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
        }
    ];

    return (
        <>
            <Head title="Sistem Pemerintahan">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=plus-jakarta-sans:400,500,600,700" rel="stylesheet" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
                <style>{`
                    html, body { overflow: hidden; height: 100vh; }
                    .mobile-content {
                        height: ${isMobile ? 'calc(100vh - 56px - 50px)' : '100%'};
                        overflow-y: auto;
                        -webkit-overflow-scrolling: touch;
                        padding-bottom: calc(env(safe-area-inset-bottom, 16px) + 60px);
                    }
                    .content-wrapper {
                        min-height: ${isMobile ? 'auto' : '100vh'};
                    }
                    @supports (-webkit-touch-callout: none) {
                        .mobile-content {
                            height: -webkit-fill-available;
                        }
                    }
                    @media (max-width: 360px) {
                        .xs-text-center {
                            text-align: center;
                        }
                        .xs-full-width {
                            width: 100%;
                        }
                        .xs-stack {
                            flex-direction: column;
                        }
                        .xs-stack > * {
                            margin-top: 0.5rem;
                            margin-left: 0 !important;
                        }
                        .xs-stack > *:first-child {
                            margin-top: 0;
                        }
                    }
                `}</style>
            </Head>
            
            <div className="h-screen flex flex-col bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white overflow-hidden overscroll-none">
                {/* Enhanced Navigation with subtle blur effect */}
                <nav className="sticky top-0 bg-slate-900/90 backdrop-blur-lg shadow-lg shadow-blue-900/10 z-50 transition-all duration-300 border-b border-blue-800/40 safe-top">
                    <div className="container mx-auto px-3 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center h-16 sm:h-16 md:h-20">
                            <div className="flex items-center">
                                <Link href="/" className="flex items-center space-x-2 sm:space-x-3 group">
                                    <div className="relative">
                                        <AppLogoIcon className="h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 rounded-lg shadow-md transition-transform group-hover:scale-105" />
                                        <div className="absolute -top-1 -right-1 w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full animate-pulse"></div>
                                    </div>
                                    <span className="text-lg sm:text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                                        SIPEM
                                    </span>
                                </Link>
                            </div>
                            
                            <div className="flex items-center space-x-3 sm:space-x-4">
                                {isAuthenticated ? (
                                    <DashboardButton notificationCount={notificationCount} />
                                ) : (
                                    <>
                                        <Button href={route('login')} variant="outline" size="xs" className="text-sm sm:text-sm min-w-[80px] sm:min-w-[100px]">
                                            Masuk
                                        </Button>
                                        <Button href={route('register')} variant="primary" size="xs" className="text-sm sm:text-sm min-w-[80px] sm:min-w-[100px]">
                                            Daftar
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Main content - truly fullscreen */}
                <main className="flex-1 flex flex-col relative">
                    {/* Enhanced background decorative elements */}
                    {!isMobile && (
                        <>
                            <div className="absolute top-0 right-0 -mt-20 -mr-20 opacity-10 pointer-events-none">
                                <svg width="404" height="384" fill="none" viewBox="0 0 404 384">
                                    <defs>
                                        <pattern id="de316486-4a29-4312-bdfc-fbce2132a2c1" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                                            <rect x="0" y="0" width="4" height="4" className="text-blue-500" fill="currentColor" />
                                        </pattern>
                                    </defs>
                                    <rect width="404" height="384" fill="url(#de316486-4a29-4312-bdfc-fbce2132a2c1)" />
                                </svg>
                            </div>
                            <div className="absolute bottom-0 left-0 -mb-20 -ml-20 opacity-10 pointer-events-none">
                                <svg width="404" height="384" fill="none" viewBox="0 0 404 384">
                                    <defs>
                                        <pattern id="de316486-4a29-4312-bdfc-fbce2132a2c2" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                                            <rect x="0" y="0" width="4" height="4" className="text-blue-500" fill="currentColor" />
                                        </pattern>
                                    </defs>
                                    <rect width="404" height="384" fill="url(#de316486-4a29-4312-bdfc-fbce2132a2c2)" />
                                </svg>
                            </div>
                            
                            {/* Animated floating decorative elements */}
                            <motion.div 
                                variants={animations.float}
                                initial="initial"
                                animate="animate"
                                className="absolute top-1/4 right-10 z-0 opacity-10 pointer-events-none"
                            >
                                <svg width="120" height="120" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 17.75L5.828 20.995L7.01 14.122L2.02 9.25495L8.914 8.26995L12 2.04395L15.086 8.26995L21.98 9.25495L16.99 14.122L18.172 20.995L12 17.75Z" stroke="#60A5FA" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </motion.div>
                            
                            <motion.div 
                                variants={animations.float}
                                initial="initial"
                                animate="animate"
                                className="absolute bottom-1/3 left-20 z-0 opacity-10 pointer-events-none"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="#60A5FA" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                </svg>
                            </motion.div>
                        </>
                    )}

                    {/* Content area with flexible sizing to fit viewport */}
                    <div className="content-wrapper flex-1 flex flex-col justify-between">
                        {/* Center content area with mobile optimization */}
                        <div className="mobile-content flex-1 flex flex-col justify-center relative z-10">
                            <div className="container mx-auto px-3 sm:px-6 lg:px-8 flex flex-col items-center py-4 sm:py-6 md:py-8">
                                <motion.div
                                    initial="hidden"
                                    animate="visible"
                                    className="text-center w-full"
                                >
                                    {/* Hero Title - Responsive sizing */}
                                    <motion.h1 
                                        variants={animations.fadeInUp}
                                        custom={0}
                                        className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight"
                                    >
                                        <span className="block text-white mb-0 sm:mb-2">
                                            Sistem Informasi
                                        </span>
                                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                                            Pemerintahan Digital
                                        </span>
                                    </motion.h1>
                                    
                                    {/* Description - Mobile optimized */}
                                    <motion.p
                                        variants={animations.fadeInUp}
                                        custom={0.2}
                                        className="mt-3 sm:mt-4 max-w-xs sm:max-w-lg md:max-w-2xl mx-auto text-center text-sm sm:text-base md:text-lg lg:text-xl text-blue-100"
                                    >
                                        <span className="block sm:hidden">
                                            Layanan administrasi kependudukan online yang aman, cepat, dan mudah.
                                        </span>
                                        <span className="hidden sm:block">
                                            Layanan administrasi kependudukan online yang aman, cepat, dan mudah untuk semua warga.
                                            <span className="block mt-2 text-sm md:text-base text-blue-200/70">
                                                Akses <span className="text-blue-300 font-medium">KTP</span>, <span className="text-blue-300 font-medium">KK</span>, <span className="text-blue-300 font-medium">Akta Kelahiran</span>, dan <span className="text-blue-300 font-medium">Akta Kematian</span> dalam satu platform.
                                            </span>
                                        </span>
                                    </motion.p>
                                    
                                    {/* Auth buttons with call to action box */}
                                    {!isAuthenticated && (
                                        <motion.div
                                            variants={animations.fadeInUp}
                                            custom={0.4}
                                            className="mt-3 sm:mt-6 md:mt-8 flex flex-col items-center"
                                        >
                                            <div className="mb-3 sm:mb-3 md:mb-4 p-3 sm:p-3 md:p-4 bg-blue-600/10 backdrop-blur-sm rounded-lg border border-blue-500/20 max-w-xs sm:max-w-md">
                                                <p className="text-xs sm:text-xs md:text-sm text-blue-200">
                                                    <span className="text-yellow-300">*</span> Untuk mengajukan dokumen, Anda perlu <span className="text-white font-semibold">Masuk</span> atau <span className="text-white font-semibold">Daftar</span> terlebih dahulu
                                                </p>
                                            </div>
                                            
                                            <div className="flex flex-row justify-center space-x-3 sm:space-x-4 xs-stack">
                                                <Button 
                                                    href={route('login')} 
                                                    variant="secondary" 
                                                    size="xs"
                                                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>}
                                                    className="text-sm sm:text-sm md:text-base"
                                                >
                                                    Masuk
                                                </Button>
                                                <Button 
                                                    href={route('register')} 
                                                    variant="primary" 
                                                    size="xs"
                                                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4" viewBox="0 0 20 20" fill="currentColor">
                                                        <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                                                    </svg>}
                                                    className="text-sm sm:text-sm md:text-base"
                                                >
                                                    Daftar
                                                </Button>
                                            </div>
                                        </motion.div>
                                    )}
                                    
                                    {/* Stats row - responsive for all devices */}
                                    <motion.div
                                        variants={animations.fadeInUp}
                                        custom={0.5}
                                        className="mt-5 sm:mt-8 md:mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-3 md:gap-5 max-w-xs sm:max-w-2xl md:max-w-4xl mx-auto"
                                    >
                                        {stats.map((stat, index) => (
                                            <StatCard 
                                                key={index}
                                                value={stat.value}
                                                label={stat.label}
                                                icon={!isMobile ? stat.icon : undefined}
                                                delay={0.6 + (index * 0.1)}
                                            />
                                        ))}
                                    </motion.div>
                                    
                                    {/* Features section - optimized for all devices */}
                                    <motion.div
                                        variants={animations.fadeInUp}
                                        custom={0.6}
                                        className="mt-5 sm:mt-8 md:mt-10 mb-8 sm:mb-12 md:mb-16 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-4 md:gap-6 max-w-xs sm:max-w-4xl md:max-w-6xl mx-auto"
                                    >
                                        {features.map((feature, index) => (
                                            <FeatureCard 
                                                key={index}
                                                title={feature.title}
                                                description={feature.description}
                                                icon={!isMobile ? feature.icon : undefined}
                                                delay={0.9 + (index * 0.1)}
                                            />
                                        ))}
                                    </motion.div>
                                </motion.div>
                            </div>
                        </div>
                        
                        {/* Footer section - responsive for all devices */}
                        <footer className="sticky bottom-0 py-3 sm:py-3 md:py-4 border-t border-blue-800/30 relative z-10 bg-blue-950/50 backdrop-blur-sm mt-auto">
                            <div className="container mx-auto px-3 sm:px-6">
                                <div className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0">
                                    <div className="flex items-center space-x-1 sm:space-x-2 mb-1 sm:mb-0">
                                        <AppLogoIcon className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 rounded-md" />
                                        <span className="text-xs sm:text-xs md:text-sm font-medium text-blue-200">
                                            &copy; {new Date().getFullYear()} SIPEM | <span className="text-blue-300">Pemerintah Republik Indonesia</span>
                                        </span>
                                    </div>
                                    <div className="flex space-x-3 sm:space-x-5 md:space-x-8">
                                        <Link href="#" className="text-[10px] sm:text-xs md:text-sm text-blue-300 hover:text-white transition-colors">
                                            <span className="block sm:hidden">Tentang</span>
                                            <span className="hidden sm:block">Tentang Kami</span>
                                        </Link>
                                        <Link href="#" className="text-[10px] sm:text-xs md:text-sm text-blue-300 hover:text-white transition-colors">
                                            <span className="block sm:hidden">Privasi</span>
                                            <span className="hidden sm:block">Kebijakan Privasi</span>
                                        </Link>
                                        <Link href="#" className="text-[10px] sm:text-xs md:text-sm text-blue-300 hover:text-white transition-colors">
                                            Kontak
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </footer>
                    </div>
                </main>
            </div>
        </>
    );
}
