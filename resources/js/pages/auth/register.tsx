import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle, Mail, User, Lock, Shield, AlertCircle, Info, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { FormEventHandler, useState, useEffect } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

type RegisterForm = {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
};

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm<Required<RegisterForm>>({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });
    
    const [formValid, setFormValid] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);
    
    // Validate form whenever data changes
    useEffect(() => {
        const isValid = 
            data.name.trim().length > 0 && 
            data.email.trim().length > 0 && 
            data.password.length >= 8 && 
            data.password === data.password_confirmation;
        
        setFormValid(isValid);
        
        // Calculate password strength
        if (data.password) {
            let strength = 0;
            
            // Length check
            if (data.password.length >= 8) strength += 1;
            
            // Contains number
            if (/\d/.test(data.password)) strength += 1;
            
            // Contains uppercase and lowercase
            if (/[a-z]/.test(data.password) && /[A-Z]/.test(data.password)) strength += 1;
            
            // Contains special characters
            if (/[^a-zA-Z0-9]/.test(data.password)) strength += 1;
            
            setPasswordStrength(strength);
        } else {
            setPasswordStrength(0);
        }
    }, [data]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    return (
        <AuthLayout title="Pendaftaran Akun Baru" description="Masukkan data diri Anda untuk membuat akun di Sistem Pemerintahan">
            <Head title="Pendaftaran Sistem Pemerintahan" />
            
            <div className="relative w-full max-w-md mx-auto rounded-lg border border-border/40 bg-gradient-to-br from-card via-card/95 to-card/90 p-8 shadow-lg transition-all duration-300 hover:shadow-xl animate-fade-in">
                {/* Subtle background effects */}
                <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-primary/10 blur-[50px] opacity-70"></div>
                <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-blue-500/10 blur-[50px] opacity-70"></div>
                
                <div className="relative z-10">
                    <div className="mb-7 flex items-center justify-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-primary to-blue-600 text-white shadow-md transition-transform duration-300 hover:scale-105 hover:shadow-lg">
                            <Shield className="h-8 w-8" />
                        </div>
                    </div>
                    
                    <h2 className="mb-2 text-center text-2xl font-bold tracking-tight text-foreground">Daftar Akun Baru</h2>
                    <p className="mb-6 text-center text-sm text-muted-foreground">Isi data lengkap untuk bergabung dengan Sistem Pemerintahan</p>
                
                    <form className="flex flex-col gap-5" onSubmit={submit}>
                        <div className="grid gap-5">
                            <div className="grid gap-2">
                                <Label htmlFor="name" className="flex items-center gap-1.5 text-sm font-medium">
                                    <User className="h-3.5 w-3.5 text-primary/90" />
                                    Nama Lengkap
                                </Label>
                                <div className="relative group">
                                    <Input
                                        id="name"
                                        type="text"
                                        required
                                        autoFocus
                                        tabIndex={1}
                                        autoComplete="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        disabled={processing}
                                        placeholder="Nama lengkap Anda"
                                        className="pl-10 h-11 transition-all duration-200 border-border/60 focus:border-primary/80 group-hover:border-primary/50 shadow-sm"
                                    />
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors duration-200 group-hover:text-primary">
                                        <User className="h-5 w-5" />
                                    </span>
                                </div>
                                <InputError message={errors.name} className="mt-1 text-xs" />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email" className="flex items-center gap-1.5 text-sm font-medium">
                                    <Mail className="h-3.5 w-3.5 text-primary/90" />
                                    Alamat Email
                                </Label>
                                <div className="relative group">
                                    <Input
                                        id="email"
                                        type="email"
                                        required
                                        tabIndex={2}
                                        autoComplete="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        disabled={processing}
                                        placeholder="email@example.com"
                                        className="pl-10 h-11 transition-all duration-200 border-border/60 focus:border-primary/80 group-hover:border-primary/50 shadow-sm"
                                    />
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors duration-200 group-hover:text-primary">
                                        <Mail className="h-5 w-5" />
                                    </span>
                                </div>
                                <InputError message={errors.email} className="mt-1 text-xs" />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password" className="flex items-center gap-1.5 text-sm font-medium">
                                    <Lock className="h-3.5 w-3.5 text-primary/90" />
                                    Kata Sandi
                                </Label>
                                <div className="relative group">
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        required
                                        tabIndex={3}
                                        autoComplete="new-password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        disabled={processing}
                                        placeholder="Minimal 8 karakter"
                                        className="pl-10 pr-10 h-11 transition-all duration-200 border-border/60 focus:border-primary/80 group-hover:border-primary/50 shadow-sm"
                                    />
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors duration-200 group-hover:text-primary">
                                        <Lock className="h-5 w-5" />
                                    </span>
                                    <button 
                                        type="button"
                                        onClick={togglePasswordVisibility}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors duration-200"
                                        tabIndex={-1}
                                    >
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                                <InputError message={errors.password} className="mt-1 text-xs" />
                                
                                {data.password && (
                                    <div className="mt-1">
                                        <div className="flex gap-1 mb-1">
                                            {[1, 2, 3, 4].map((i) => (
                                                <div 
                                                    key={i} 
                                                    className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                                                        i <= passwordStrength 
                                                            ? i <= 1 
                                                                ? 'bg-red-500' 
                                                                : i <= 2 
                                                                    ? 'bg-orange-500' 
                                                                    : i <= 3 
                                                                        ? 'bg-yellow-500' 
                                                                        : 'bg-green-500'
                                                            : 'bg-gray-200'
                                                    }`}
                                                />
                                            ))}
                                        </div>
                                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                                            <Info className="h-3 w-3" />
                                            {passwordStrength === 0 && "Kata sandi terlalu lemah"}
                                            {passwordStrength === 1 && "Kata sandi lemah"}
                                            {passwordStrength === 2 && "Kata sandi cukup baik"}
                                            {passwordStrength === 3 && "Kata sandi baik"}
                                            {passwordStrength === 4 && "Kata sandi sangat kuat"}
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password_confirmation" className="flex items-center gap-1.5 text-sm font-medium">
                                    <Lock className="h-3.5 w-3.5 text-primary/90" />
                                    Konfirmasi Kata Sandi
                                </Label>
                                <div className="relative group">
                                    <Input
                                        id="password_confirmation"
                                        type={showConfirmPassword ? "text" : "password"}
                                        required
                                        tabIndex={4}
                                        autoComplete="new-password"
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        disabled={processing}
                                        placeholder="Masukkan kembali kata sandi"
                                        className="pl-10 pr-10 h-11 transition-all duration-200 border-border/60 focus:border-primary/80 group-hover:border-primary/50 shadow-sm"
                                    />
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors duration-200 group-hover:text-primary">
                                        <Lock className="h-5 w-5" />
                                    </span>
                                    <button 
                                        type="button"
                                        onClick={toggleConfirmPasswordVisibility}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors duration-200"
                                        tabIndex={-1}
                                    >
                                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                                <InputError message={errors.password_confirmation} className="mt-1 text-xs" />
                                
                                {data.password && data.password_confirmation && data.password === data.password_confirmation && (
                                    <p className="mt-1 text-xs text-green-600 flex items-center gap-1">
                                        <CheckCircle2 className="h-3 w-3" />
                                        Kata sandi cocok
                                    </p>
                                )}
                            </div>

                            {/* Information panel */}
                            <div className="mt-1 p-3 bg-blue-50 dark:bg-blue-950/40 rounded-md border border-blue-100 dark:border-blue-900/50">
                                <p className="text-xs text-blue-700 dark:text-blue-400 flex items-start gap-2">
                                    <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                    <span>
                                        Daftar sebagai penduduk untuk mengakses layanan pengajuan dokumen seperti KTP, KK, Akta Kelahiran, dan Akta Kematian secara online.
                                    </span>
                                </p>
                            </div>

                            <Button 
                                type="submit" 
                                className="mt-2 w-full h-12 text-base font-medium bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-700 transition-all duration-300 transform hover:-translate-y-[2px] active:translate-y-[1px] shadow-[0_4px_12px_rgba(59,130,246,0.25)] hover:shadow-[0_6px_16px_rgba(59,130,246,0.35)]" 
                                tabIndex={5} 
                                disabled={processing || !formValid}
                            >
                                {processing ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <LoaderCircle className="h-5 w-5 animate-spin" />
                                        <span>Memproses...</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center gap-2">
                                        <Shield className="h-5 w-5" />
                                        <span>Daftar Akun</span>
                                    </div>
                                )}
                            </Button>
                        </div>

                        <div className="text-muted-foreground text-center text-sm">
                            Sudah memiliki akun?{' '}
                            <TextLink href={route('login')} tabIndex={6} className="font-medium text-primary hover:text-primary/80 transition-colors duration-200">
                                Masuk sekarang
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
        </AuthLayout>
    );
}
