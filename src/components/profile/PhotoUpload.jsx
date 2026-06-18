import { useState, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';

function sanitizeAndResizeImage(file, maxDimension = 1200) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Scale down if any dimension exceeds the maximum threshold
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to initialize canvas context'));
          return;
        }

        // Drawing the image onto canvas strips EXIF metadata (e.g., GPS location tags)
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to a clean JPEG blob
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to generate image blob'));
            }
          },
          'image/jpeg',
          0.85
        );
      };
      img.onerror = () => reject(new Error('Failed to process image file'));
      img.src = event.target.result;
    };
    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.readAsDataURL(file);
  });
}

export default function PhotoUpload({ currentUrl, onUpload }) {
  const { user } = useAuth();
  const toast = useToast();
  const fileRef = useRef(null);
  const [preview, setPreview] = useState(currentUrl || null);
  const [prevUrl, setPrevUrl] = useState(currentUrl);
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (currentUrl !== prevUrl) {
    setPreview(currentUrl || null);
    setPrevUrl(currentUrl);
  }

  async function handleFileSelect(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setErrorMsg('');

    const ext = file.name.split('.').pop()?.toLowerCase();
    const allowedExts = ['jpg', 'jpeg', 'png', 'webp'];
    const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/pjpeg', 'image/x-png'];

    const isValidType = allowedMimeTypes.includes(file.type) || allowedExts.includes(ext);
    if (!isValidType) {
      const msg = 'Please upload JPG, PNG, or WebP.';
      setErrorMsg(msg);
      toast.error(msg);
      e.target.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      const msg = 'Image must be under 5MB.';
      setErrorMsg(msg);
      toast.error(msg);
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => setPreview(event.target.result);
    reader.readAsDataURL(file);

    try {
      setUploading(true);

      if (!user?.id) throw new Error('Not logged in.');

      // Client-side image sanitization to strip metadata and compress file
      const sanitizedBlob = await sanitizeAndResizeImage(file);
      const filePath = `${user.id}/avatar.jpg`;

      // Use supabase client (sends user session token automatically)
      const { error: uploadError } = await supabase.storage
        .from('profile-photos')
        .upload(filePath, sanitizedBlob, { upsert: true });

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
      e.target.value = '';
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
