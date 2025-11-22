import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface ToastContextType {
  showToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-md">
        {toasts.map((toast, index) => (
          <div
            key={toast.id}
            className={`flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl min-w-[320px] backdrop-blur-xl border transform transition-all duration-500 ${
              toast.type === 'success' ? 'bg-green-50/95 border-slate-300/40 text-green-800' :
              toast.type === 'error' ? 'bg-red-50/95 border-red-300/40 text-red-800' :
              'bg-slate-50/95 border-slate-300/40 text-slate-800'
            }`}
            style={{
              animation: 'slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
              animationDelay: `${index * 0.1}s`,
              opacity: 0,
              transform: 'translateX(100%)',
            }}
          >
            {toast.type === 'success' && (
              <div className="relative">
                <CheckCircle className="w-6 h-6 flex-shrink-0 text-slate-600" />
                <div className="absolute inset-0 animate-ping opacity-75">
                  <CheckCircle className="w-6 h-6 text-slate-400" />
                </div>
              </div>
            )}
            {toast.type === 'error' && <XCircle className="w-6 h-6 flex-shrink-0" />}
            {toast.type === 'info' && <AlertCircle className="w-6 h-6 flex-shrink-0 text-slate-600" />}
            <p className="flex-1 font-semibold tracking-wide">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="flex-shrink-0 hover:opacity-70 transition-all hover:scale-110 p-1 rounded-lg hover:bg-white/50"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}
