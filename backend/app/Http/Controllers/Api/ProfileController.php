<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class ProfileController extends Controller
{
    /**
     * Get user profile
     */
    public function show($username = null)
    {
        $user = $username ? User::where('username', $username)->firstOrFail() : Auth::user();
        
        $user->loadCount(['followers', 'following', 'posts']);
        
        return response()->json([
            'user' => $user,
            'is_following' => Auth::check() ? Auth::user()->follows($user) : false,
            'is_own_profile' => Auth::check() && Auth::id() === $user->id,
        ]);
    }

    /**
     * Update user profile
     */
    public function update(Request $request)
    {
        $user = Auth::user();

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'username' => 'required|string|max:255|unique:users,username,' . $user->id,
            'bio' => 'nullable|string|max:500',
            'location' => 'nullable|string|max:255',
            'website' => 'nullable|url|max:255',
            'birth_date' => 'nullable|date|before:today',
            'avatar' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'cover_photo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:5120',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $request->only(['name', 'username', 'bio', 'location', 'website', 'birth_date']);

        // Handle avatar upload
        if ($request->hasFile('avatar')) {
            // Delete old avatar if exists
            if ($user->avatar) {
                Storage::disk('public')->delete($user->avatar);
            }
            
            $avatarPath = $request->file('avatar')->store('avatars', 'public');
            $data['avatar'] = $avatarPath;
        }

        // Handle cover photo upload
        if ($request->hasFile('cover_photo')) {
            // Delete old cover photo if exists
            if ($user->cover_photo) {
                Storage::disk('public')->delete($user->cover_photo);
            }
            
            $coverPath = $request->file('cover_photo')->store('covers', 'public');
            $data['cover_photo'] = $coverPath;
        }

        $user->update($data);

        return response()->json([
            'message' => 'Profile updated successfully',
            'user' => $user->fresh()
        ]);
    }

    /**
     * Delete avatar
     */
    public function deleteAvatar()
    {
        $user = Auth::user();

        if ($user->avatar) {
            Storage::disk('public')->delete($user->avatar);
            $user->update(['avatar' => null]);
        }

        return response()->json([
            'message' => 'Avatar deleted successfully',
            'user' => $user->fresh()
        ]);
    }

    /**
     * Delete cover photo
     */
    public function deleteCoverPhoto()
    {
        $user = Auth::user();

        if ($user->cover_photo) {
            Storage::disk('public')->delete($user->cover_photo);
            $user->update(['cover_photo' => null]);
        }

        return response()->json([
            'message' => 'Cover photo deleted successfully',
            'user' => $user->fresh()
        ]);
    }

    /**
     * Get user's posts
     */
    public function posts($username = null)
    {
        $user = $username ? User::where('username', $username)->firstOrFail() : Auth::user();
        
        $posts = $user->posts()
            ->with('user')
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return response()->json($posts);
    }
}
