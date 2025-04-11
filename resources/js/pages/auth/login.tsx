import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle, Lock, Mail, GanttChartSquare, AlertCircle, CheckCircle2 } from 'lucide-react';
import { FormEventHandler, useState, useEffect } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
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
        <AuthLayout title="Masuk ke Sistem Pemerintahan" description="Masukkan email dan password Anda untuk mengakses layanan pemerintahan">
            <Head title="Login Sistem Pemerintahan" />

            <div className="w-full rounded-lg border border-border/40 bg-card p-6 shadow-sm transition-all duration-200 hover:shadow-md">
                <div className="mb-6 flex items-center justify-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <GanttChartSquare className="h-6 w-6" />
                    </div>
                </div>
                
                {status && (
                    <Alert variant="success" className="mb-6">
                        <CheckCircle2 className="h-4 w-4" />
                        <AlertDescription>{status}</AlertDescription>
                    </Alert>
                )}

                <form className="flex flex-col gap-5" onSubmit={submit}>
                    <div className="grid gap-5">
                        <div className="grid gap-2">
                            <Label htmlFor="email" className="flex items-center gap-1 text-sm font-medium">
                                <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                                Alamat Email
                            </Label>
                            <div className="relative">
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
                                    className="pl-9"
                                />
                                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            </div>
                            <InputError message={errors.email} />
                        </div>

                        <div className="grid gap-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password" className="flex items-center gap-1 text-sm font-medium">
                                    <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                                    Kata Sandi
                                </Label>
                                {canResetPassword && (
                                    <TextLink href={route('password.request')} className="text-xs font-medium" tabIndex={5}>
                                        Lupa kata sandi?
                                    </TextLink>
                                )}
                            </div>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type="password"
                                    required
                                    tabIndex={2}
                                    autoComplete="current-password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="Kata sandi Anda"
                                    className="pl-9"
                                />
                                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            </div>
                            <InputError message={errors.password} />
                        </div>

                        <div className="flex items-center space-x-3">
                            <Checkbox
                                id="remember"
                                name="remember"
                                checked={data.remember}
                                onClick={() => setData('remember', !data.remember)}
                                tabIndex={3}
                            />
                            <Label htmlFor="remember" className="text-sm font-normal">Ingat saya</Label>
                        </div>

                        <Button 
                            type="submit" 
                            className="mt-2 w-full transition-all duration-200" 
                            tabIndex={4} 
                            disabled={processing || !formValid}
                        >
                            {processing ? (
                                <div className="flex items-center gap-2">
                                    <LoaderCircle className="h-4 w-4 animate-spin" />
                                    <span>Memproses...</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <span>Masuk</span>
                                </div>
                            )}
                        </Button>
                    </div>

                    <div className="text-muted-foreground text-center text-sm">
                        Belum memiliki akun?{' '}
                        <TextLink href={route('register')} tabIndex={5} className="font-medium">
                            Daftar sekarang
                        </TextLink>
                    </div>
                </form>
            </div>
            
            <div className="mt-4 text-center">
                <p className="text-xs text-muted-foreground">
                    &copy; {new Date().getFullYear()} Sistem Pemerintahan Indonesia
                </p>
            </div>
        </AuthLayout>
    );
}
