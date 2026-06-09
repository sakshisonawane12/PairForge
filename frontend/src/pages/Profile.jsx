import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyProfile, updateProfile } from '../services/api';

export default function Profile() {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [username, setUsername] = useState('');
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({
        displayName: '',
        bio: '',
        avatarUrl: ''
    });
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    useEffect(() => {
        getMyProfile()
            .then((res) => {
                setProfile(res.data);
                setUsername(res.data.username);  // get username from API
                setForm({
                    displayName: res.data.displayName || '',
                    bio: res.data.bio || '',
                    avatarUrl: res.data.avatarUrl || ''
                });
            })
            .catch(() => navigate('/login'));  // if cookie expired → redirect to login
    }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await updateProfile(form);
            setProfile(res.data);
            setEditing(false);
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
        } catch (err) {
            alert('Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    const getAvatar = () => {
        if (profile?.avatarUrl) return profile.avatarUrl;
        return `https://api.dicebear.com/7.x/initials/svg?seed=${username}`;
    };

    if (!profile) return (
        <div className="min-h-screen bg-[#0d1117] flex items-center justify-center">
            <p className="text-gray-400">Loading...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#0d1117] p-6">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                    <button onClick={() => navigate('/home')}
                            className="text-gray-400 hover:text-white text-sm">
                        ← Back
                    </button>
                    <h1 className="text-white font-bold text-xl">👤 Profile</h1>
                </div>

                {/* Profile Card */}
                <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-6 mb-6">
                    <div className="flex items-start gap-6">
                        {/* Avatar */}
                        <div className="flex-shrink-0">
                            <img
                                src={getAvatar()}
                                alt={username}
                                className="w-20 h-20 rounded-full border-2 border-[#238636]"
                                onError={(e) => {
                                    e.target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${username}`;
                                }}
                            />
                        </div>

                        {/* Info */}
                        <div className="flex-1">
                            <h2 className="text-white text-xl font-semibold">
                                {profile.displayName || profile.username}
                            </h2>
                            <p className="text-gray-400 text-sm">@{profile.username}</p>
                            <p className="text-gray-400 text-sm">{profile.email}</p>
                            {profile.bio && (
                                <p className="text-gray-300 text-sm mt-2">{profile.bio}</p>
                            )}
                        </div>

                        <button
                            onClick={() => setEditing(!editing)}
                            className="text-xs border border-[#30363d] text-gray-400 hover:text-white px-3 py-1 rounded">
                            {editing ? 'Cancel' : '✏️ Edit'}
                        </button>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-[#30363d]">
                        <div className="text-center">
                            <div className="text-white font-bold text-xl">
                                {profile.roomsCreated}
                            </div>
                            <div className="text-gray-500 text-xs">Rooms Created</div>
                        </div>
                        <div className="text-center">
                            <div className="text-white font-bold text-xl">🔥</div>
                            <div className="text-gray-500 text-xs">Active</div>
                        </div>
                        <div className="text-center">
                            <div className="text-white font-bold text-xl">⭐</div>
                            <div className="text-gray-500 text-xs">Member</div>
                        </div>
                    </div>
                </div>

                {/* Edit Form */}
                {editing && (
                    <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-6">
                        <h3 className="text-white font-medium mb-4">Edit Profile</h3>
                        <form onSubmit={handleSave} className="space-y-4">
                            <div>
                                <label className="text-gray-400 text-xs mb-1 block">
                                    Display Name
                                </label>
                                <input
                                    type="text"
                                    value={form.displayName}
                                    onChange={(e) => setForm({
                                        ...form, displayName: e.target.value
                                    })}
                                    placeholder="Your display name"
                                    className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#238636]"
                                />
                            </div>
                            <div>
                                <label className="text-gray-400 text-xs mb-1 block">
                                    Bio
                                </label>
                                <textarea
                                    value={form.bio}
                                    onChange={(e) => setForm({
                                        ...form, bio: e.target.value
                                    })}
                                    placeholder="Tell something about yourself..."
                                    rows={3}
                                    className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#238636] resize-none"
                                />
                            </div>
                            <div>
                                <label className="text-gray-400 text-xs mb-1 block">
                                    Avatar URL
                                </label>
                                <input
                                    type="text"
                                    value={form.avatarUrl}
                                    onChange={(e) => setForm({
                                        ...form, avatarUrl: e.target.value
                                    })}
                                    placeholder="https://example.com/avatar.png"
                                    className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#238636]"
                                />
                            </div>
                            <div className="flex gap-3">
                                <button type="submit" disabled={saving}
                                        className="flex-1 bg-[#238636] hover:bg-[#2ea043] text-white py-2 rounded-lg text-sm disabled:opacity-50">
                                    {saving ? 'Saving...' : 'Save Changes'}
                                </button>
                                <button type="button" onClick={() => setEditing(false)}
                                        className="flex-1 border border-[#30363d] text-gray-400 py-2 rounded-lg text-sm">
                                    Cancel
                                </button>
                            </div>
                            {saved && (
                                <p className="text-green-400 text-xs text-center">
                                    ✓ Profile updated successfully!
                                </p>
                            )}
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}