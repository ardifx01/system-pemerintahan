import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

const AuthButtons = ({ isCompact = false }: { isCompact?: boolean }) => {
    const baseButtonStyles = "text-sm font-medium transition-colors";
    const primaryButtonStyles = `${baseButtonStyles} inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`;
    const secondaryButtonStyles = isCompact 
        ? `${baseButtonStyles} text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md dark:text-gray-200 dark:hover:text-white`
        : `${baseButtonStyles} flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 sm:px-8 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-700`;

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
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Sistem Pemerintahan">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
                {/* Navigation */}
                <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md shadow-sm z-50 dark:bg-gray-900/80">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between h-16">
                            <div className="flex items-center">
                                <Link href="/" className="flex items-center space-x-3">
                                    <img src="/logo.png" alt="Logo" className="h-8 w-auto" />
                                    <span className="text-xl font-semibold text-gray-900 dark:text-white">
                                        SIPEM
                                    </span>
                                </Link>
                            </div>
                            <div className="flex items-center space-x-4">
                                {auth.user ? (
                                    <Link
                                        href={route('dashboard')}
                                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                                    >
                                        Dashboard
                                    </Link>
                                ) : (
                                    <AuthButtons isCompact />
                                )}
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Hero Section */}
                <main className="pt-16">
                    <div className="relative">
                        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                            <div className="px-4 py-16 sm:px-6 sm:py-24 lg:py-32 lg:px-8">
                                <h1 className="text-center text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
                                    <span className="block text-gray-900 dark:text-white">
                                        Sistem Informasi
                                    </span>
                                    <span className="block text-blue-600">
                                        Pemerintahan Digital
                                    </span>
                                </h1>
                                <p className="mt-6 max-w-lg mx-auto text-center text-xl text-gray-500 sm:max-w-3xl dark:text-gray-300">
                                    Layanan administrasi kependudukan online yang aman, cepat, dan mudah untuk semua warga.
                                </p>
                                {!auth.user && (
                                    <div className="mt-10 max-w-sm mx-auto sm:max-w-none">
                                        <div className="space-y-4 sm:space-y-0 sm:mx-auto sm:inline-grid sm:grid-cols-2 sm:gap-5">
                                            <AuthButtons />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}
