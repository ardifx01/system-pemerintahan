<?php

use App\Models\User;

uses(\Illuminate\Foundation\Testing\RefreshDatabase::class);

test('guests are redirected to the login page for penduduk dashboard', function () {
    $this->get('/penduduk/dashboard')->assertRedirect('/login');
});

test('guests are redirected to the login page for admin dashboard', function () {
    $this->get('/admin/dashboard')->assertRedirect('/login');
});

test('penduduk users can visit their dashboard', function () {
    $user = User::factory()->create([
        'role' => 'penduduk'
    ]);
    
    $this->actingAs($user);

    $this->get('/penduduk/dashboard')->assertOk();
});

test('admin users can visit their dashboard', function () {
    $user = User::factory()->create([
        'role' => 'admin'
    ]);
    
    $this->actingAs($user);

    $this->get('/admin/dashboard')->assertOk();
});

test('penduduk users cannot access admin dashboard', function () {
    $user = User::factory()->create([
        'role' => 'penduduk'
    ]);
    
    $this->actingAs($user);

    $this->get('/admin/dashboard')->assertStatus(403);
});

test('admin users cannot access penduduk dashboard', function () {
    $user = User::factory()->create([
        'role' => 'admin'
    ]);
    
    $this->actingAs($user);

    $this->get('/penduduk/dashboard')->assertStatus(403);
});