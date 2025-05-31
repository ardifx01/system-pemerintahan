import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle, Lock, Mail, Shield, AlertCircle, CheckCircle2, HelpCircle, Sparkles, LogIn } from 'lucide-react';
import { FormEventHandler, useState, useEffect } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import LoginLayout from '@/layouts/auth/login-layout';
import { Alert, AlertDescription } from '@/components/ui/alert';

type LoginForm = {
    email: string;
    password: string;
    remember: boolean;
};

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const { data, setData, post, processing, errors, reset } = useForm<Required<LoginForm>>({
        email: '',
        password: '',
        remember: false,
    });
    
    const [formValid, setFormValid] = useState(false);
    
    // Validate form whenever data changes
    useEffect(() => {
        const isValid = data.email && data.password;
        setFormValid(!!isValid);
    }, [data]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <LoginLayout>
            <Head title="Login | Sistem Pemerintahan" />

            <div className="relative w-full max-w-md mx-auto rounded-2xl border border-border/20 bg-gradient-to-br from-[#121212] via-[#151515] to-[#0f0f0f] p-8 shadow-[0_20px_50px_rgba(8,112,184,0.15)] transition-all duration-300 hover:shadow-[0_25px_60px_rgba(8,112,184,0.25)] animate-fade-in backdrop-blur-sm backdrop-filter">
                {/* Modern glow effects */}
                <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-[#4f46e5]/20 blur-[60px] opacity-80"></div>
                <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-[#06b6d4]/20 blur-[60px] opacity-80"></div>
                <div className="absolute top-40 left-0 h-40 w-40 rounded-full bg-[#ec4899]/10 blur-[50px] opacity-70"></div>
                
                <div className="relative z-10">
                    <div className="mb-7 flex items-center justify-center">
                        <div 
                            className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#4f46e5] via-[#06b6d4] to-[#ec4899] text-white shadow-[0_10px_20px_rgba(79,70,229,0.3)] transition-all duration-500 hover:shadow-[0_15px_30px_rgba(79,70,229,0.4)] hover:scale-110 group"
                        >
                            <div className="absolute inset-0 rounded-2xl bg-black opacity-0 transition-opacity duration-500 group-hover:opacity-10"></div>
                            <Shield className="h-8 w-8 transition-transform duration-500 group-hover:rotate-12" />
                            <Sparkles className="absolute h-6 w-6 text-white/80 opacity-0 transition-all duration-500 -right-1 -top-1 group-hover:opacity-100" />
                        </div>
                    </div>
                    
                    <h2 className="mb-6 text-center text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#4f46e5] to-[#06b6d4]">Selamat Datang Kembali</h2>
                    
                    {status && (
                        <Alert variant="success" className="mb-6 animate-slide-down">
                            <CheckCircle2 className="h-4 w-4" />
                            <AlertDescription>{status}</AlertDescription>
                        </Alert>
                    )}

                    <form className="flex flex-col gap-6" onSubmit={submit}>
                        <div className="grid gap-6">
                            <div className="grid gap-3">
                                <Label htmlFor="email" className="flex items-center gap-1.5 text-sm font-medium text-[#f5f5f5]">
                                    <Mail className="h-3.5 w-3.5 text-[#4f46e5]" />
                                    Alamat Email
                                </Label>
                                <div className="relative group">
                                    <Input
                                        id="email"
                                        type="email"
                                        required
                                        autoFocus
                                        tabIndex={1}
                                        autoComplete="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="nama@example.com"
                                        className="pl-10 h-12 transition-all duration-300 rounded-xl bg-[#1c1c1c] border-[#2a2a2a] focus:border-[#4f46e5] group-hover:border-[#4f46e5]/50 shadow-[0_2px_10px_rgba(0,0,0,0.2)] text-[#f5f5f5] placeholder:text-[#6b7280] focus:ring-2 focus:ring-[#4f46e5]/20"
                                    />
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6b7280] transition-all duration-300 group-hover:text-[#4f46e5]">
                                        <Mail className="h-5 w-5" />
                                    </span>
                                </div>
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-3">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password" className="flex items-center gap-1.5 text-sm font-medium text-[#f5f5f5]">
                                        <Lock className="h-3.5 w-3.5 text-[#4f46e5]" />
                                        Kata Sandi
                                    </Label>
                                    {canResetPassword && (
                                        <TextLink 
                                            href={route('password.request')} 
                                            className="text-xs font-medium flex items-center gap-1 transition-all duration-300 text-[#06b6d4] hover:text-[#4f46e5] hover:translate-x-0.5"
                                            tabIndex={5}
                                        >
                                            <HelpCircle className="h-3 w-3" />
                                            Lupa kata sandi?
                                        </TextLink>
                                    )}
                                </div>
                                <div className="relative group">
                                    <Input
                                        id="password"
                                        type="password"
                                        required
                                        tabIndex={2}
                                        autoComplete="current-password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        placeholder="Kata sandi Anda" 
                                        className="pl-10 h-12 transition-all duration-300 rounded-xl bg-[#1c1c1c] border-[#2a2a2a] focus:border-[#4f46e5] group-hover:border-[#4f46e5]/50 shadow-[0_2px_10px_rgba(0,0,0,0.2)] text-[#f5f5f5] placeholder:text-[#6b7280] focus:ring-2 focus:ring-[#4f46e5]/20"
                                    />
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6b7280] transition-all duration-300 group-hover:text-[#4f46e5]">
                                        <Lock className="h-5 w-5" />
                                    </span>
                                </div>
                                <InputError message={errors.password} />
                            </div>

                            <div className="flex items-center space-x-3 py-1">
                                <Checkbox
                                    id="remember"
                                    name="remember"
                                    checked={data.remember}
                                    onClick={() => setData('remember', !data.remember)}
                                    tabIndex={3}
                                    className="text-[#4f46e5] border-[#2a2a2a] hover:border-[#4f46e5]/70 data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-[#4f46e5] data-[state=checked]:to-[#06b6d4] data-[state=checked]:text-white transition-all duration-300 rounded-md"
                                />
                                <Label htmlFor="remember" className="text-sm font-normal cursor-pointer text-[#a1a1aa] hover:text-[#f5f5f5] transition-all duration-300">Ingat saya</Label>
                            </div>

                            <Button 
                                type="submit" 
                                className="mt-6 w-full h-14 text-base font-medium bg-gradient-to-r from-[#4f46e5] via-[#06b6d4] to-[#ec4899] hover:from-[#4338ca] hover:via-[#0891b2] hover:to-[#db2777] transition-all duration-500 transform hover:-translate-y-[3px] active:translate-y-[1px] shadow-[0_10px_25px_rgba(79,70,229,0.4)] hover:shadow-[0_15px_30px_rgba(79,70,229,0.6)] rounded-xl" 
                                tabIndex={4} 
                                disabled={processing || !formValid}
                            >
                                {processing ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <LoaderCircle className="h-5 w-5 animate-spin" />
                                        <span>Memproses...</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center gap-2 group relative overflow-hidden">
                                        <span className="relative z-10 flex items-center gap-2">
                                            <LogIn className="h-5 w-5 transition-transform duration-500 group-hover:rotate-12" />
                                            <span className="font-semibold">Masuk</span>
                                        </span>
                                        <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                                    </div>
                                )}
                            </Button>
                        </div>

                        <div className="text-[#a1a1aa] text-center text-sm mt-2">
                            Belum memiliki akun?{' '}
                            <TextLink href={route('register')} tabIndex={5} className="font-medium text-transparent bg-clip-text bg-gradient-to-r from-[#4f46e5] to-[#06b6d4] hover:from-[#ec4899] hover:to-[#06b6d4] transition-all duration-500 hover:translate-x-0.5 inline-block">
                                Daftar sekarang
                            </TextLink>
                        </div>
                    </form>
                </div>
            </div>
            
            <div className="mt-8 text-center space-y-3 animate-fade-in-delayed">
                <p className="text-sm text-[#a1a1aa] font-medium">
                    &copy; {new Date().getFullYear()} Sistem Pemerintahan Indonesia
                </p>
                <div className="flex items-center justify-center gap-4 text-xs text-[#a1a1aa]/70">
                    <TextLink href="#" className="hover:text-[#4f46e5] transition-all duration-300 hover:translate-y-[-2px] inline-block">Kebijakan Privasi</TextLink>
                    <span className="text-[#a1a1aa]/50">•</span>
                    <TextLink href="#" className="hover:text-[#06b6d4] transition-all duration-300 hover:translate-y-[-2px] inline-block">Syarat & Ketentuan</TextLink>
                    <span className="text-[#a1a1aa]/50">•</span>
                    <TextLink href="#" className="hover:text-[#ec4899] transition-all duration-300 hover:translate-y-[-2px] inline-block">Bantuan</TextLink>
                </div>
            </div>
        </LoginLayout>
    );
}
