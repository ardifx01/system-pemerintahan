<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Penduduk;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Show the registration page.
     */
    public function create(): Response
    {
        return Inertia::render('auth/register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => User::ROLE_PENDUDUK, // Use the constant instead of hardcoded string
        ]);

        // Create a basic penduduk record linked to this user
        Penduduk::create([
            'user_id' => $user->id,
            'nama' => $request->name,
            'jenis_kelamin' => 'Laki-laki', // Default value
            'kewarganegaraan' => 'Indonesia', // Default value
            'tanggal_lahir' => now(), // Default value, can be updated later
            'tempat_lahir' => '', // Empty default
            'alamat' => '', // Empty default
        ]);

        event(new Registered($user));

        Auth::login($user);

        return to_route('penduduk.dashboard');
    }
}
