<?php

namespace App\Http\Controllers;

use App\Models\Berita;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class BeritaController extends Controller
{
    /**
     * Display a listing of the news for admin.
     */
    public function adminIndex()
    {
        $beritas = Berita::with('user')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($berita) {
                return [
                    'id' => $berita->id,
                    'judul' => $berita->judul,
                    'konten' => $berita->konten,
                    'gambar' => $berita->gambar ? asset('storage/' . $berita->gambar) : null,
                    'penulis' => $berita->penulis,
                    'status' => $berita->status,
                    'tanggal_publikasi' => $berita->tanggal_publikasi,
                    'created_at' => $berita->created_at,
                ];
            });

        return Inertia::render('admin/berita', [
            'beritas' => $beritas,
        ]);
    }

    /**
     * Display a listing of the news for penduduk.
     */
    public function pendudukIndex()
    {
        $beritas = Berita::where('status', 'Dipublikasi')
            ->orderBy('tanggal_publikasi', 'desc')
            ->get()
            ->map(function ($berita) {
                return [
                    'id' => $berita->id,
                    'judul' => $berita->judul,
                    'konten' => $berita->konten,
                    'gambar' => $berita->gambar ? asset('storage/' . $berita->gambar) : null,
                    'penulis' => $berita->penulis,
                    'tanggal_publikasi' => $berita->tanggal_publikasi,
                ];
            });

        return Inertia::render('penduduk/berita', [
            'beritas' => $beritas,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('admin/berita/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'judul' => 'required|string|max:255',
            'konten' => 'required|string',
            'gambar' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'status' => 'required|in:Dipublikasi,Draf',
        ]);

        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }

        $gambarPath = null;
        if ($request->hasFile('gambar')) {
            $gambarPath = $request->file('gambar')->store('berita', 'public');
        }

        $berita = new Berita([
            'judul' => $request->judul,
            'konten' => $request->konten,
            'gambar' => $gambarPath,
            'penulis' => Auth::user()->name,
            'status' => $request->status,
            'user_id' => Auth::id(),
        ]);

        if ($request->status === 'Dipublikasi') {
            $berita->tanggal_publikasi = now();
        }

        $berita->save();

        return redirect()->route('admin.berita')->with('success', 'Berita berhasil ditambahkan!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Berita $berita)
    {
        $berita->gambar = $berita->gambar ? asset('storage/' . $berita->gambar) : null;
        
        return Inertia::render('admin/berita/show', [
            'berita' => $berita,
        ]);
    }

    /**
     * Display the specified resource for penduduk.
     */
    public function pendudukShow(Berita $berita)
    {
        // Make sure the berita is published
        if ($berita->status !== 'Dipublikasi') {
            abort(404);
        }

        $berita->gambar = $berita->gambar ? asset('storage/' . $berita->gambar) : null;
        
        return Inertia::render('penduduk/berita/show', [
            'berita' => $berita,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Berita $berita)
    {
        return Inertia::render('admin/berita/edit', [
            'berita' => $berita,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Berita $berita)
    {
        $validator = Validator::make($request->all(), [
            'judul' => 'required|string|max:255',
            'konten' => 'required|string',
            'status' => 'required|in:Dipublikasi,Draf',
        ]);

        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }

        $berita->judul = $request->judul;
        $berita->konten = $request->konten;
        $berita->status = $request->status;

        // Update tanggal_publikasi if publishing for the first time
        if ($berita->status !== 'Dipublikasi' && $request->status === 'Dipublikasi') {
            $berita->tanggal_publikasi = now();
        }

        $berita->save();

        return redirect()->route('admin.berita')->with('success', 'Berita berhasil diperbarui!');
    }

    /**
     * Update the berita image.
     */
    public function updateImage(Request $request, Berita $berita)
    {
        $validator = Validator::make($request->all(), [
            'gambar' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }

        // Delete old image if exists
        if ($berita->gambar) {
            Storage::disk('public')->delete($berita->gambar);
        }

        // Upload new image
        $gambarPath = $request->file('gambar')->store('berita', 'public');
        $berita->gambar = $gambarPath;
        $berita->save();

        return redirect()->route('admin.berita')->with('success', 'Gambar berita berhasil diperbarui!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Berita $berita)
    {
        // Delete image if exists
        if ($berita->gambar) {
            Storage::disk('public')->delete($berita->gambar);
        }

        $berita->delete();

        return redirect()->route('admin.berita')->with('success', 'Berita berhasil dihapus!');
    }
}
