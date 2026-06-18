import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';

function sanitizeAndResizeImage(file, addLog, maxDimension = 1200) {
  return new Promise((resolve, reject) => {
    addLog(`Starting sanitization for: ${file.name} (type: ${file.type}, size: ${file.size})`);
    const reader = new FileReader();
    reader.onload = (event) => {
      addLog('FileReader loaded image data');
      const img = new Image();
      img.onload = () => {
        addLog(`Image loaded, dimensions: ${img.width}x${img.height}`);
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
          addLog(`Rescaling image to: ${width}x${height}`);
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
        addLog('Image drawn to canvas. Converting to JPEG blob...');

        // Convert to a clean JPEG blob
        canvas.toBlob(
          (blob) => {
            if (blob) {
              addLog(`Blob generated, size: ${blob.size} bytes, type: ${blob.type}`);
              resolve(blob);
            } else {
              reject(new Error('Failed to generate image blob'));
            }
          },
          'image/jpeg',
          0.85
        );
      };
      img.onerror = () => {
        addLog('Image loading failed', 'error');
        reject(new Error('Failed to process image file'));
      };
      img.src = event.target.result;
    };
    reader.onerror = () => {
      addLog('FileReader failed', 'error');
      reject(new Error('Failed to read image file'));
    };
    reader.readAsDataURL(file);
  });
}

export default function PhotoUpload({ currentUrl, onUpload }) {
  const { user } = useAuth();
  const toast = useToast();
  const [preview, setPreview] = useState(currentUrl || null);
  const [prevUrl, setPrevUrl] = useState(currentUrl);
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [logs, setLogs] = useState(() => {
    try {
      const saved = sessionStorage.getItem('photo_upload_logs');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  function addLog(msg, type = 'info') {
    const formatted = `[${new Date().toLocaleTimeString()}] [${type.toUpperCase()}] ${msg}`;
    console.log(formatted);
    setLogs((prev) => {
      const updated = [...prev, formatted];
      try {
        sessionStorage.setItem('photo_upload_logs', JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save logs to sessionStorage', e);
      }
      return updated;
    });
  }

  function clearLogs() {
    setLogs([]);
    try {
      sessionStorage.removeItem('photo_upload_logs');
    } catch (e) {
      console.error('Failed to clear logs from sessionStorage', e);
    }
  }

  if (currentUrl !== prevUrl) {
    setPreview(currentUrl || null);
    setPrevUrl(currentUrl);
  }

  async function handleFileSelect(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    clearLogs(); // Clear logs on new selection
    addLog(`Selected file: ${file.name} (type: ${file.type}, size: ${file.size})`);
    setErrorMsg('');

    const ext = file.name.split('.').pop()?.toLowerCase();
    const allowedExts = ['jpg', 'jpeg', 'png', 'webp'];
    const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/pjpeg', 'image/x-png'];

    const isValidType = allowedMimeTypes.includes(file.type) || allowedExts.includes(ext);
    if (!isValidType) {
      const msg = 'Please upload JPG, PNG, or WebP.';
      addLog(`Invalid file type: ${file.type} (ext: ${ext})`, 'warn');
      setErrorMsg(msg);
      toast.error(msg);
      e.target.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      const msg = 'Image must be under 5MB.';
      addLog(`File size exceeds 5MB: ${file.size}`, 'warn');
      setErrorMsg(msg);
      toast.error(msg);
      e.target.value = '';
      return;
    }

    addLog('File type and size validated successfully. Setting local preview...');
    const reader = new FileReader();
    reader.onload = (event) => setPreview(event.target.result);
    reader.readAsDataURL(file);

    try {
      setUploading(true);

      if (!user?.id) throw new Error('Not logged in.');

      addLog('Calling image sanitizer...');
      const sanitizedBlob = await sanitizeAndResizeImage(file, addLog);
      const filePath = `${user.id}/avatar.jpg`;

      addLog(`Uploading to Supabase Storage: ${filePath}`);
      // Use supabase client (sends user session token automatically)
      const { error: uploadError } = await supabase.storage
        .from('profile-photos')
        .upload(filePath, sanitizedBlob, { upsert: true });

      if (uploadError) {
        addLog(`Supabase Storage upload error: ${uploadError.message}`, 'error');
        throw new Error(`Upload: ${uploadError.message}`);
      }
      addLog('Supabase Storage upload succeeded.');

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('profile-photos')
        .getPublicUrl(filePath);

      const url = `${publicUrl}?t=${Date.now()}`;
      addLog(`Generated public URL: ${url}`);

      addLog('Updating user profile table...');
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ profile_photo_url: url })
        .eq('id', user.id);

      if (updateError) {
        addLog(`Profile table update error: ${updateError.message}`, 'error');
        throw new Error(`Profile: ${updateError.message}`);
      }
      addLog('Profile table update succeeded!');

      setPreview(url);
      setErrorMsg('');
      onUpload?.();
      toast.success('Photo uploaded!');
    } catch (err) {
      addLog(`Upload flow failed: ${err.message}`, 'error');
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
        className="relative w-28 h-28 rounded-full bg-gradient-to-br from-pink/20 to-lavender/20 border-2 border-dashed border-white/20 flex items-center justify-center overflow-hidden group"
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

        {/* Transparent absolute overlay input makes click handling browser-native and 100% robust */}
        <input
          type="file"
          accept=".jpg,.jpeg,.png,.webp"
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          aria-label="Upload profile photo"
          disabled={uploading}
        />
      </div>

      {errorMsg && (
        <p className="text-xs text-red-400 font-body text-center max-w-[300px] break-words bg-red-900/20 px-3 py-2 rounded-lg">
          {errorMsg}
        </p>
      )}

      {preview && !uploading && (
        <button
          type="button"
          onClick={handleRemove}
          className="text-xs text-white/40 hover:text-coral transition-colors font-body z-20"
        >
          Remove photo
        </button>
      )}

      <p className="text-xs text-white/30 font-body text-center">
        JPG, PNG or WebP · Max 5MB — Click the circle to upload
      </p>

      {/* Visual Debug Panel */}
      <div className="w-full mt-4 p-4 rounded-xl bg-white/5 border border-white/10 text-left">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-bold text-pink uppercase tracking-wider">Upload Debug Logs</span>
          {logs.length > 0 && (
            <button
              onClick={clearLogs}
              type="button"
              className="text-[10px] text-white/40 hover:text-white/80 transition-colors bg-transparent border-0 cursor-pointer"
            >
              Clear Logs
            </button>
          )}
        </div>
        <div className="max-h-40 overflow-y-auto font-mono text-[10px] text-white/60 space-y-1 bg-[#0F0A1E]/40 p-2 rounded border border-white/5">
          {logs.length === 0 ? (
            <span className="text-white/20 italic">No logs yet. Select a photo to begin.</span>
          ) : (
            logs.map((log, idx) => (
              <div key={idx} className={`break-all ${log.includes('[ERROR]') ? 'text-red-400 font-semibold' : log.includes('[WARN]') ? 'text-yellow-400' : ''}`}>
                {log}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
