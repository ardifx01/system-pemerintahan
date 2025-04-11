import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle, Mail, User, Lock, GanttChartSquare, AlertCircle } from 'lucide-react';
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
    
    // Validate form whenever data changes
    useEffect(() => {
        const isValid = data.name && data.email && data.password && data.password_confirmation;
        setFormValid(!!isValid);
    }, [data]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <AuthLayout title="Pendaftaran Akun Baru" description="Masukkan data diri Anda untuk membuat akun di Sistem Pemerintahan">
            <Head title="Pendaftaran Sistem Pemerintahan" />
            
            <div className="w-full rounded-lg border border-border/40 bg-card p-6 shadow-sm transition-all duration-200 hover:shadow-md">
                <div className="mb-6 flex items-center justify-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <GanttChartSquare className="h-6 w-6" />
                    </div>
                </div>
                
                <form className="flex flex-col gap-5" onSubmit={submit}>
                    <div className="grid gap-5">
                        <div className="grid gap-2">
                            <Label htmlFor="name" className="flex items-center gap-1 text-sm font-medium">
                                <User className="h-3.5 w-3.5 text-muted-foreground" />
                                Nama Lengkap
                            </Label>
                            <div className="relative">
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
                                    className="pl-9"
                                />
                                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            </div>
                            <InputError message={errors.name} className="mt-1 text-xs" />
                        </div>

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
                                    tabIndex={2}
                                    autoComplete="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    disabled={processing}
                                    placeholder="email@example.com"
                                    className="pl-9"
                                />
                                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            </div>
                            <InputError message={errors.email} className="mt-1 text-xs" />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password" className="flex items-center gap-1 text-sm font-medium">
                                <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                                Kata Sandi
                            </Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type="password"
                                    required
                                    tabIndex={3}
                                    autoComplete="new-password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    disabled={processing}
                                    placeholder="Minimal 8 karakter"
                                    className="pl-9"
                                />
                                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            </div>
                            <InputError message={errors.password} className="mt-1 text-xs" />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password_confirmation" className="flex items-center gap-1 text-sm font-medium">
                                <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                                Konfirmasi Kata Sandi
                            </Label>
                            <div className="relative">
                                <Input
                                    id="password_confirmation"
                                    type="password"
                                    required
                                    tabIndex={4}
                                    autoComplete="new-password"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    disabled={processing}
                                    placeholder="Masukkan kembali kata sandi"
                                    className="pl-9"
                                />
                                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            </div>
                            <InputError message={errors.password_confirmation} className="mt-1 text-xs" />
                        </div>

                        <Button 
                            type="submit" 
                            className="mt-2 w-full transition-all duration-200" 
                            tabIndex={5} 
                            disabled={processing || !formValid}
                        >
                            {processing ? (
                                <div className="flex items-center gap-2">
                                    <LoaderCircle className="h-4 w-4 animate-spin" />
                                    <span>Memproses...</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <span>Daftar Akun</span>
                                </div>
                            )}
                        </Button>
                    </div>

                    <div className="text-muted-foreground text-center text-sm">
                        Sudah memiliki akun?{' '}
                        <TextLink href={route('login')} tabIndex={6} className="font-medium">
                            Masuk sekarang
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
