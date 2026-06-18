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
  const [errorMsg, setErrorMsg] = useState('');

  async function handleFileSelect(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setErrorMsg('');

    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.type)) {
      const msg = 'Please upload JPG, PNG, or WebP.';
      setErrorMsg(msg); toast.error(msg); return;
    }
    if (file.size > 5 * 1024 * 1024) {
      const msg = 'Image must be under 5MB.';
      setErrorMsg(msg); toast.error(msg); return;
    }

    const reader = new FileReader();
    reader.onload = (event) => setPreview(event.target.result);
    reader.readAsDataURL(file);

    try {
      setUploading(true);

      if (!user?.id) throw new Error('Not logged in.');

      const ext = file.name.split('.').pop();
      const filePath = `${user.id}/avatar.${ext}`;

      // Use supabase client (sends user session token automatically)
      const { error: uploadError } = await supabase.storage
        .from('profile-photos')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw new Error(`Upload: ${uploadError.message}`);

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('profile-photos')
        .getPublicUrl(filePath);

      const url = `${publicUrl}?t=${Date.now()}`;

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ profile_photo_url: url })
        .eq('id', user.id);

      if (updateError) throw new Error(`Profile: ${updateError.message}`);

      setPreview(url);
      setErrorMsg('');
      onUpload?.();
      toast.success('Photo uploaded!');
    } catch (err) {
      setErrorMsg(err.message);
      toast.error(err.message);
      setPreview(currentUrl || null);
    } finally {
      setUploading(false);
    }
  }

  async function handleRemove() {
    try {
      setUploading(true);
      setErrorMsg('');
      const { error } = await supabase
        .from('profiles')
        .update({ profile_photo_url: null })
        .eq('id', user.id);
      if (error) throw error;
      setPreview(null);
      setErrorMsg('');
      onUpload?.();
      toast.success('Photo removed.');
    } catch (err) {
      setErrorMsg(err.message);
      toast.error(err.message);
    } finally {
      setUploading(false);
    }
  }

  async function testStorage() {
    setErrorMsg('');
    if (!user?.id) { setErrorMsg('Not logged in'); return; }
    try {
      const blob = new Blob(['test'], { type: 'text/plain' });
      const path = `${user.id}/_test.txt`;
      const { error } = await supabase.storage
        .from('profile-photos')
        .upload(path, blob, { upsert: true });
      if (error) throw error;
      setErrorMsg('Storage works!');
      toast.success('Storage OK');
    } catch (err) {
      setErrorMsg(`Storage error: ${err.message}`);
      toast.error(err.message);
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className="relative w-28 h-28 rounded-full bg-gradient-to-br from-pink/20 to-lavender/20 border-2 border-dashed border-white/20 flex items-center justify-center overflow-hidden cursor-pointer group"
        onClick={() => fileRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') fileRef.current?.click(); }}
      >
        {preview ? (
          <img src={preview} alt="Profile" className="w-full h-full object-cover" />
        ) : (
          <div className="text-center">
            <span className="text-2xl block mb-1">📷</span>
            <span className="text-[10px] text-white/40 font-body">Click to add photo</span>
          </div>
        )}

        <div className="absolute inset-0 bg-[#0F0A1E]/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-full">
          <span className="text-white text-xs font-semibold">
            {preview ? 'Change' : 'Upload'}
          </span>
        </div>

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

      {errorMsg && (
        <p className="text-xs text-red-400 font-body text-center max-w-[300px] break-words bg-red-900/20 px-3 py-2 rounded-lg">
          {errorMsg}
        </p>
      )}

      {preview && !uploading && (
        <button
          onClick={handleRemove}
          className="text-xs text-white/40 hover:text-coral transition-colors font-body"
        >
          Remove photo
        </button>
      )}

      <p className="text-xs text-white/30 font-body text-center">
        JPG, PNG or WebP · Max 5MB — Click the circle to upload
      </p>
    </div>
  );
}
