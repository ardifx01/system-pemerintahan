import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle, Lock, Mail, Shield, AlertCircle, CheckCircle2, HelpCircle } from 'lucide-react';
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

            <div className="relative w-full max-w-md mx-auto rounded-lg border border-border/40 bg-gradient-to-br from-card via-card/95 to-card/90 p-8 shadow-lg transition-all duration-300 hover:shadow-xl animate-fade-in">
                {/* Subtle light effects */}
                <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-primary/10 blur-[50px] opacity-70"></div>
                <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-blue-500/10 blur-[50px] opacity-70"></div>
                
                <div className="relative z-10">
                    <div className="mb-7 flex items-center justify-center">
                        <div 
                            className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-primary to-blue-600 text-white shadow-md transition-transform duration-300 hover:scale-105 hover:shadow-lg"
                        >
                            <Shield className="h-8 w-8" />
                        </div>
                    </div>
                    
                    <h2 className="mb-6 text-center text-2xl font-bold tracking-tight text-foreground">Selamat Datang Kembali</h2>
                    
                    {status && (
                        <Alert variant="success" className="mb-6 animate-slide-down">
                            <CheckCircle2 className="h-4 w-4" />
                            <AlertDescription>{status}</AlertDescription>
                        </Alert>
                    )}

                    <form className="flex flex-col gap-6" onSubmit={submit}>
                        <div className="grid gap-6">
                            <div className="grid gap-3">
                                <Label htmlFor="email" className="flex items-center gap-1.5 text-sm font-medium">
                                    <Mail className="h-3.5 w-3.5 text-primary/90" />
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
                                        className="pl-10 h-11 transition-all duration-200 border-border/60 focus:border-primary/80 group-hover:border-primary/50 shadow-sm"
                                    />
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors duration-200 group-hover:text-primary">
                                        <Mail className="h-5 w-5" />
                                    </span>
                                </div>
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-3">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password" className="flex items-center gap-1.5 text-sm font-medium">
                                        <Lock className="h-3.5 w-3.5 text-primary/90" />
                                        Kata Sandi
                                    </Label>
                                    {canResetPassword && (
                                        <TextLink 
                                            href={route('password.request')} 
                                            className="text-xs font-medium flex items-center gap-1 transition-colors duration-200 hover:text-primary"
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
                                        className="pl-10 h-11 transition-all duration-200 border-border/60 focus:border-primary/80 group-hover:border-primary/50 shadow-sm"
                                    />
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors duration-200 group-hover:text-primary">
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
                                    className="text-primary border-border/60 hover:border-primary/70 data-[state=checked]:bg-primary/90 data-[state=checked]:text-white transition-colors duration-200"
                                />
                                <Label htmlFor="remember" className="text-sm font-normal cursor-pointer hover:text-foreground/90 transition-colors duration-200">Ingat saya</Label>
                            </div>

                            <Button 
                                type="submit" 
                                className="mt-3 w-full h-12 text-base font-medium bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-700 transition-all duration-300 transform hover:-translate-y-[2px] active:translate-y-[1px] shadow-[0_4px_12px_rgba(59,130,246,0.25)] hover:shadow-[0_6px_16px_rgba(59,130,246,0.35)]" 
                                tabIndex={4} 
                                disabled={processing || !formValid}
                            >
                                {processing ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <LoaderCircle className="h-5 w-5 animate-spin" />
                                        <span>Memproses...</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center gap-2">
                                        <span>Masuk</span>
                                    </div>
                                )}
                            </Button>
                        </div>

                        <div className="text-muted-foreground text-center text-sm">
                            Belum memiliki akun?{' '}
                            <TextLink href={route('register')} tabIndex={5} className="font-medium text-primary hover:text-primary/80 transition-colors duration-200">
                                Daftar sekarang
                            </TextLink>
                        </div>
                    </form>
                </div>
            </div>
            
            <div className="mt-6 text-center space-y-2 animate-fade-in-delayed">
                <p className="text-sm text-muted-foreground">
                    &copy; {new Date().getFullYear()} Sistem Pemerintahan Indonesia
                </p>
                <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground/80">
                    <TextLink href="#" className="hover:text-primary transition-colors duration-200">Kebijakan Privasi</TextLink>
                    <span>•</span>
                    <TextLink href="#" className="hover:text-primary transition-colors duration-200">Syarat & Ketentuan</TextLink>
                    <span>•</span>
                    <TextLink href="#" className="hover:text-primary transition-colors duration-200">Bantuan</TextLink>
                </div>
            </div>
        </LoginLayout>
    );
}
