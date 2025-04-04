import { Head, Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import type { PageProps } from '@/types';
import AppLogoIcon from '@/components/app-logo-icon';

const AuthButtons = ({ isCompact = false }: { isCompact?: boolean }) => {
    const baseButtonStyles = "text-sm font-semibold transition-all duration-200";
    const primaryButtonStyles = `${baseButtonStyles} inline-flex items-center px-5 py-2.5 border border-transparent rounded-lg shadow-md text-white bg-blue-600 hover:bg-blue-700 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`;
    const secondaryButtonStyles = isCompact 
        ? `${baseButtonStyles} text-gray-700 hover:text-gray-900 px-4 py-2.5 rounded-lg hover:bg-gray-100 dark:text-gray-200 dark:hover:text-white dark:hover:bg-gray-800`
        : `${baseButtonStyles} flex items-center justify-center px-5 py-2.5 border border-gray-300 rounded-lg shadow-md text-gray-700 bg-white hover:bg-gray-50 hover:scale-105 sm:px-8 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-700`;

    return (
        <>
            <Link href={route('login')} className={secondaryButtonStyles}>
                Masuk
            </Link>
            <Link href={route('register')} className={primaryButtonStyles}>
                {isCompact ? 'Daftar' : 'Daftar Sekarang'}
            </Link>
        </>
    );
};

export default function Welcome() {
    const { auth } = usePage<PageProps>().props;

    return (
        <>
            <Head title="Sistem Pemerintahan">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=plus-jakarta-sans:400,500,600,700" rel="stylesheet" />
            </Head>
            <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
                {/* Navigation */}
                <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-lg shadow-lg z-50 dark:bg-gray-900/90 transition-all duration-300">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between h-20">
                            <div className="flex items-center">
                                <Link href="/" className="flex items-center space-x-3 group">
                                    <AppLogoIcon className="h-10 w-10 rounded-lg shadow-md transition-transform group-hover:scale-105" />
                                    <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                                        SIPEM
                                    </span>
                                </Link>
                            </div>
                            <div className="flex items-center space-x-4">
                                {auth.user ? (
                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <Link
                                            href={route('dashboard')}
                                            className="inline-flex items-center px-5 py-2.5 border border-transparent rounded-lg shadow-md text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
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

                {/* Hero Section */}
                <main className="pt-20">
                    <div className="relative overflow-hidden">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="relative px-4 py-16 sm:px-6 sm:py-24 lg:py-32 lg:px-8">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8 }}
                                    className="text-center"
                                >
                                    <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                                        <span className="block text-gray-900 dark:text-white mb-4">
                                            Sistem Informasi
                                        </span>
                                        <span className="block bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                                            Pemerintahan Digital
                                        </span>
                                    </h1>
                                    <motion.p
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.8, delay: 0.2 }}
                                        className="mt-8 max-w-lg mx-auto text-center text-xl text-gray-600 sm:max-w-3xl dark:text-gray-300"
                                    >
                                        Layanan administrasi kependudukan online yang aman, cepat, dan mudah untuk semua warga.
                                    </motion.p>
                                    {!auth.user && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.8, delay: 0.4 }}
                                            className="mt-12 max-w-sm mx-auto sm:max-w-none"
                                        >
                                            <div className="space-y-4 sm:space-y-0 sm:mx-auto sm:inline-grid sm:grid-cols-2 sm:gap-6">
                                                <AuthButtons />
                                            </div>
                                        </motion.div>
                                    )}
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}
