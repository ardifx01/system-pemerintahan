import { Head, Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import type { PageProps } from '@/types';
import AppLogoIcon from '@/components/app-logo-icon';

// Enhanced AuthButtons with better spacing and responsive design
const AuthButtons = ({ isCompact = false }: { isCompact?: boolean }) => {
    const baseButtonStyles = "text-sm font-semibold transition-all duration-200 flex items-center justify-center";
    const primaryButtonStyles = `${baseButtonStyles} px-5 py-2.5 border border-transparent rounded-lg shadow-md text-white bg-blue-600 hover:bg-blue-700 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`;
    const secondaryButtonStyles = isCompact 
        ? `${baseButtonStyles} text-gray-700 hover:text-gray-900 px-4 py-2.5 rounded-lg hover:bg-gray-100 dark:text-gray-200 dark:hover:text-white dark:hover:bg-gray-800`
        : `${baseButtonStyles} px-5 py-2.5 border border-gray-300 rounded-lg shadow-md text-gray-700 bg-white hover:bg-gray-50 hover:scale-105 sm:px-8 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-700`;

    return (
        <div className={`flex ${isCompact ? 'space-x-3' : 'space-x-4 sm:space-x-6'}`}>
            <Link href={route('login')} className={secondaryButtonStyles}>
                Masuk
            </Link>
            <Link href={route('register')} className={primaryButtonStyles}>
                {isCompact ? 'Daftar' : 'Daftar Sekarang'}
            </Link>
        </div>
    );
};

// Animation variants for consistent animations
const fadeInUp = {
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
};

export default function Welcome() {
    const { auth } = usePage<PageProps>().props;

    return (
        <>
            <Head title="Sistem Pemerintahan">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=plus-jakarta-sans:400,500,600,700" rel="stylesheet" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            </Head>
            <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
                {/* Enhanced Navigation with better mobile support */}
                <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-lg shadow-lg z-50 dark:bg-gray-900/90 transition-all duration-300">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center h-16 sm:h-20">
                            <div className="flex items-center">
                                <Link href="/" className="flex items-center space-x-3 group">
                                    <AppLogoIcon className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg shadow-md transition-transform group-hover:scale-105" />
                                    <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                                        SIPEM
                                    </span>
                                </Link>
                            </div>
                            <div className="flex items-center">
                                {auth.user ? (
                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <Link
                                            href={route('dashboard')}
                                            className="inline-flex items-center px-4 sm:px-5 py-2 sm:py-2.5 border border-transparent rounded-lg shadow-md text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                                        >
                                            Dashboard
                                        </Link>
                                    </motion.div>
                                ) : (
                                    <AuthButtons isCompact />
                                )}
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Enhanced Hero Section with better spacing and animations */}
                <main className="pt-16 sm:pt-20">
                    <div className="relative overflow-hidden">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="relative px-4 py-12 sm:py-16 md:py-24 lg:py-32 lg:px-8">
                                <motion.div
                                    initial="hidden"
                                    animate="visible"
                                    className="text-center"
                                >
                                    <motion.h1 
                                        variants={fadeInUp}
                                        custom={0}
                                        className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight"
                                    >
                                        <span className="block text-gray-900 dark:text-white mb-2 sm:mb-4">
                                            Sistem Informasi
                                        </span>
                                        <span className="block bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                                            Pemerintahan Digital
                                        </span>
                                    </motion.h1>
                                    
                                    <motion.p
                                        variants={fadeInUp}
                                        custom={0.2}
                                        className="mt-6 sm:mt-8 max-w-lg mx-auto text-center text-base sm:text-lg md:text-xl text-gray-600 sm:max-w-3xl dark:text-gray-300"
                                    >
                                        Layanan administrasi kependudukan online yang aman, cepat, dan mudah untuk semua warga.
                                    </motion.p>
                                    
                                    {!auth.user && (
                                        <motion.div
                                            variants={fadeInUp}
                                            custom={0.4}
                                            className="mt-8 sm:mt-12 max-w-sm mx-auto sm:max-w-none"
                                        >
                                            <div className="flex flex-col sm:flex-row justify-center sm:space-x-6 space-y-4 sm:space-y-0">
                                                <AuthButtons />
                                            </div>
                                        </motion.div>
                                    )}
                                    
                                    {/* Added feature highlights section */}
                                    <motion.div
                                        variants={fadeInUp}
                                        custom={0.6}
                                        className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
                                    >
                                        {[
                                            { title: "Cepat", description: "Proses administrasi yang lebih cepat dan efisien" },
                                            { title: "Aman", description: "Data terlindungi dengan sistem keamanan terkini" },
                                            { title: "Mudah", description: "Antarmuka yang sederhana dan mudah digunakan" }
                                        ].map((feature, index) => (
                                            <div key={index} className="bg-white/80 dark:bg-gray-800/80 p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
                                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                                                <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
                                            </div>
                                        ))}
                                    </motion.div>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}
