import { useState, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';

export default function PhotoUpload({ currentUrl, onUpload }) {
  const { user } = useAuth();
  const toast = useToast();
  const fileRef = useRef(null);
  const [preview, setPreview] = useState(currentUrl || null);
  const [uploading, setUploading] = useState(false);

  async function handleFileSelect(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast.error('Please upload a JPG, PNG, or WebP image.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be under 5MB.');
      return;
    }

    // Preview
    const reader = new FileReader();
    reader.onload = (event) => setPreview(event.target.result);
    reader.readAsDataURL(file);

    // Upload
    try {
      setUploading(true);
      const ext = file.name.split('.').pop();
      const filePath = `${user.id}/avatar.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from('profile-photos')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('profile-photos')
        .getPublicUrl(filePath);

      // Add cache-buster
      const url = `${publicUrl}?t=${Date.now()}`;

      // Update profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ profile_photo_url: url })
        .eq('id', user.id);

      if (updateError) throw updateError;

      setPreview(url);
      onUpload?.(url);
      toast.success('Photo uploaded! 📸');
    } catch (err) {
      console.error('Upload error:', err);
      toast.error(err.message || 'Failed to upload photo');
      setPreview(currentUrl || null);
    } finally {
      setUploading(false);
    }
  }

  async function handleRemove() {
    try {
      setUploading(true);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ profile_photo_url: null })
        .eq('id', user.id);

      if (updateError) throw updateError;

      setPreview(null);
      onUpload?.(null);
      toast.success('Photo removed.');
    } catch (err) {
      toast.error(err.message || 'Failed to remove photo');
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className="relative w-28 h-28 rounded-full bg-gradient-to-br from-pink/20 to-lavender/20 border-2 border-dashed border-white/20 flex items-center justify-center overflow-hidden cursor-pointer group"
        onClick={() => fileRef.current?.click()}
      >
        {preview ? (
          <img src={preview} alt="Profile" className="w-full h-full object-cover" />
        ) : (
          <div className="text-center">
            <span className="text-2xl block mb-1">📷</span>
            <span className="text-[10px] text-white/40 font-body">Add Photo</span>
          </div>
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-[#0F0A1E]/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-full">
          <span className="text-white text-xs font-semibold">
            {preview ? 'Change' : 'Upload'}
          </span>
        </div>

        {/* Loading overlay */}
        {uploading && (
          <div className="absolute inset-0 bg-[#0F0A1E]/80 flex items-center justify-center rounded-full">
            <div className="w-6 h-6 border-2 border-pink border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      <input
        ref={fileRef}
        type="file"
        accept=".jpg,.jpeg,.png,.webp"
        onChange={handleFileSelect}
        className="hidden"
        aria-label="Upload profile photo"
      />

      {preview && !uploading && (
        <button
          onClick={handleRemove}
          className="text-xs text-white/40 hover:text-coral transition-colors font-body"
        >
          Remove photo
        </button>
      )}

      <p className="text-xs text-white/30 font-body text-center">
        JPG, PNG or WebP · Max 5MB
      </p>
    </div>
  );
}
