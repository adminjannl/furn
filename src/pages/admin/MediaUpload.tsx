import { useState } from 'react';
import { Upload, Image, FileImage, Trash2, Copy, CheckCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import Button from '../../components/Button';
import { useToast } from '../../components/Toast';

export default function MediaUpload() {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentFileName, setCurrentFileName] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<Array<{
    name: string;
    url: string;
    size: number;
    type: string;
  }>>([]);
  const { showToast } = useToast();
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setUploadProgress(0);
    const newFiles: typeof uploadedFiles = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setCurrentFileName(file.name);

        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `promotional/${fileName}`;

        const { data: { session } } = await supabase.auth.getSession();
        const token = session?.access_token || import.meta.env.VITE_SUPABASE_ANON_KEY;

        const uploadPromise = new Promise<string>((resolve, reject) => {
          const xhr = new XMLHttpRequest();

          xhr.upload.addEventListener('progress', (e) => {
            if (e.lengthComputable) {
              const percentComplete = Math.round((e.loaded / e.total) * 90);
              setUploadProgress(5 + percentComplete);
            }
          });

          xhr.addEventListener('load', () => {
            if (xhr.status === 200) {
              const { data: { publicUrl } } = supabase.storage
                .from('product-images')
                .getPublicUrl(filePath);
              resolve(publicUrl);
            } else {
              reject(new Error(`Upload failed with status ${xhr.status}: ${xhr.responseText}`));
            }
          });

          xhr.addEventListener('error', () => reject(new Error('Upload failed')));
          xhr.addEventListener('abort', () => reject(new Error('Upload cancelled')));

          xhr.open('POST', `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/product-images/${filePath}`);
          xhr.setRequestHeader('Authorization', `Bearer ${token}`);
          xhr.setRequestHeader('x-upsert', 'false');
          xhr.send(file);
        });

        const publicUrl = await uploadPromise;

        newFiles.push({
          name: file.name,
          url: publicUrl,
          size: file.size,
          type: file.type
        });

        setUploadProgress(Math.round(((i + 1) / files.length) * 100));
      }

      setUploadedFiles([...newFiles, ...uploadedFiles]);
      showToast(`Successfully uploaded ${newFiles.length} file(s)`, 'success');

      if (event.target) {
        event.target.value = '';
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      showToast(error.message || 'Failed to upload file. Please try again.', 'error');
    } finally {
      setUploading(false);
      setUploadProgress(0);
      setCurrentFileName('');
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    showToast('URL copied to clipboard!', 'success');
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const deleteFile = async (url: string) => {
    try {
      const path = url.split('/product-images/')[1];
      if (!path) throw new Error('Invalid file URL');

      const { error } = await supabase.storage
        .from('product-images')
        .remove([path]);

      if (error) throw error;

      setUploadedFiles(uploadedFiles.filter(f => f.url !== url));
      showToast('File deleted successfully', 'success');
    } catch (error: any) {
      console.error('Delete error:', error);
      showToast('Failed to delete file', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Media Upload</h1>
          <p className="text-slate-600 mt-2">Upload images, GIFs, and other media files</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
        <div className="border-2 border-dashed border-slate-300 rounded-lg p-12 text-center hover:border-slate-400 transition-colors">
          <input
            type="file"
            id="file-upload"
            className="hidden"
            onChange={handleFileUpload}
            accept="image/*,.gif"
            multiple
            disabled={uploading}
          />
          <label
            htmlFor="file-upload"
            className="cursor-pointer flex flex-col items-center"
          >
            <Upload className="w-16 h-16 text-slate-400 mb-4" />
            <p className="text-lg font-medium text-slate-700 mb-2">
              {uploading ? 'Uploading...' : 'Drop files here or click to upload'}
            </p>
            <p className="text-sm text-slate-500">
              Supports: JPG, PNG, GIF, WebP (Max 50MB per file)
            </p>
          </label>
        </div>

        {uploading && (
          <div className="mt-4">
            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="text-sm text-slate-600 mt-2 text-center">
              {currentFileName && `Uploading ${currentFileName}... `}
              {uploadProgress}%
            </p>
          </div>
        )}
      </div>

      {uploadedFiles.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <FileImage className="w-6 h-6" />
              Uploaded Files ({uploadedFiles.length})
            </h2>
          </div>

          <div className="divide-y divide-slate-200">
            {uploadedFiles.map((file, index) => (
              <div key={index} className="p-6 hover:bg-slate-50 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    {file.type.startsWith('image/') ? (
                      <img
                        src={file.url}
                        alt={file.name}
                        className="w-24 h-24 object-cover rounded-lg border border-slate-200"
                      />
                    ) : (
                      <div className="w-24 h-24 bg-slate-100 rounded-lg border border-slate-200 flex items-center justify-center">
                        <Image className="w-12 h-12 text-slate-400" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-900 mb-1 truncate">
                      {file.name}
                    </h3>
                    <p className="text-sm text-slate-500 mb-3">
                      {formatFileSize(file.size)} • {file.type}
                    </p>

                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={file.url}
                        readOnly
                        className="flex-1 px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg font-mono"
                      />
                      <Button
                        variant="outline"
                        onClick={() => copyToClipboard(file.url)}
                        className="flex items-center gap-2"
                      >
                        {copiedUrl === file.url ? (
                          <>
                            <CheckCircle className="w-4 h-4" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            Copy
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => deleteFile(file.url)}
                        className="flex items-center gap-2 text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">Usage Tips:</h3>
        <ul className="text-sm text-blue-800 space-y-1 ml-4 list-disc">
          <li>Files are stored in the <code className="bg-blue-100 px-1 rounded">promotional/</code> folder</li>
          <li>Copy the URL and use it in hero slides, banners, or anywhere in your site</li>
          <li>GIF files are supported for animations</li>
          <li>For product images, use the Image Ordering page instead</li>
        </ul>
      </div>
    </div>
  );
}
