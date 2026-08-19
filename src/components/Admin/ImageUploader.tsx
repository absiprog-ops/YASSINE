import React, { useRef, useState } from 'react';
import { Upload, Image as ImageIcon, X, Check, Link, Sparkles } from 'lucide-react';

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  description?: string;
  compact?: boolean;
  className?: string;
  accept?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  value,
  onChange,
  label,
  description,
  compact = false,
  className = '',
  accept = 'image/*',
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlText, setUrlText] = useState(value || '');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('يرجى رفع ملف صورة صالح (PNG, JPG, WebP, إلخ)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        onChange(dataUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleApplyUrl = () => {
    if (urlText.trim()) {
      onChange(urlText.trim());
      setShowUrlInput(false);
    }
  };

  if (compact) {
    return (
      <div className={`space-y-1.5 ${className}`}>
        {label && <label className="block text-xs font-bold text-slate-700">{label}</label>}
        <div className="flex items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept={accept}
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow transition-all cursor-pointer shrink-0"
          >
            <Upload className="w-3.5 h-3.5 text-amber-300" />
            <span>رفع صورة</span>
          </button>

          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="أو أدخل رابط الصورة..."
            className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-[11px] font-mono text-slate-800"
          />

          {value && (
            <img
              src={value}
              alt="Preview"
              className="w-9 h-9 object-cover rounded-md border border-slate-300 shrink-0 shadow-sm"
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <div className="flex items-center justify-between">
          <label className="block text-xs font-bold text-slate-800">{label}</label>
          {value && (
            <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              ✓ تم تعيين الصورة
            </span>
          )}
        </div>
      )}

      {description && <p className="text-[11px] text-slate-500 leading-tight">{description}</p>}

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={accept}
        className="hidden"
      />

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-2xl p-4 transition-all duration-200 text-center ${
          isDragging
            ? 'border-emerald-500 bg-emerald-50/80 scale-[1.01]'
            : value
            ? 'border-emerald-300/70 bg-emerald-50/30'
            : 'border-slate-300 hover:border-emerald-500 bg-slate-50/70 hover:bg-slate-50'
        }`}
      >
        {value ? (
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative group shrink-0">
              <img
                src={value}
                alt="Uploaded apartment"
                className="w-28 h-20 object-cover rounded-xl border border-slate-300 shadow-md"
              />
              <button
                type="button"
                onClick={() => onChange('')}
                className="absolute -top-2 -right-2 p-1 bg-rose-600 text-white rounded-full shadow hover:bg-rose-700 transition-all cursor-pointer"
                title="حذف الصورة"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex-1 text-right space-y-2 w-full">
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow transition-all cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5 text-amber-300" />
                  <span>تغيير/رفع صورة أخرى من الجهاز</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setUrlText(value);
                    setShowUrlInput(!showUrlInput);
                  }}
                  className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
                >
                  <Link className="w-3.5 h-3.5 text-slate-600" />
                  <span>تعديل الرابط</span>
                </button>
              </div>

              {showUrlInput && (
                <div className="flex items-center gap-1.5 mt-2">
                  <input
                    type="text"
                    value={urlText}
                    onChange={(e) => setUrlText(e.target.value)}
                    placeholder="https://..."
                    className="flex-1 px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-mono"
                  />
                  <button
                    type="button"
                    onClick={handleApplyUrl}
                    className="px-3 py-1.5 bg-emerald-800 text-white rounded-xl text-xs font-bold cursor-pointer"
                  >
                    تطبيق
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-2 py-3">
            <div className="p-3 bg-emerald-100 text-emerald-800 rounded-2xl shadow-sm">
              <Upload className="w-6 h-6 text-emerald-700" />
            </div>

            <div className="space-y-1">
              <p className="font-extrabold text-xs text-slate-800">
                انقر لرفع صورة من الجهاز أو اسحب الصورة وأفلتها هنا
              </p>
              <p className="text-[11px] text-slate-500">
                يدعم صيغ JPG, PNG, WebP عالية الجودة
              </p>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-md cursor-pointer transition-all hover:scale-105"
              >
                <Upload className="w-4 h-4 text-amber-300" />
                <span>اختر صورة من جهازك</span>
              </button>

              <button
                type="button"
                onClick={() => setShowUrlInput(!showUrlInput)}
                className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer transition-all"
              >
                <Link className="w-3.5 h-3.5 text-slate-600" />
                <span>إدخال رابط URL</span>
              </button>
            </div>

            {showUrlInput && (
              <div className="flex items-center gap-1.5 w-full max-w-md pt-2">
                <input
                  type="text"
                  value={urlText}
                  onChange={(e) => setUrlText(e.target.value)}
                  placeholder="https://..."
                  className="flex-1 px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-mono"
                />
                <button
                  type="button"
                  onClick={handleApplyUrl}
                  className="px-3 py-1.5 bg-emerald-800 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  تطبيق
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
