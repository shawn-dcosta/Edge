import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
}

const ConfirmationModal = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDestructive = true
}: ConfirmationModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="absolute inset-0 bg-edge-black/80 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-200"
          >
            {/* Header / Accent */}
            <div className={`h-2 w-full ${isDestructive ? 'bg-edge-red' : 'bg-edge-black'}`} />
            
            <div className="p-8">
              <button 
                onClick={onCancel}
                className="absolute top-6 right-6 text-slate-400 hover:text-edge-black transition-colors"
              >
                <X size={20} />
              </button>

              <div className="flex flex-col items-center text-center space-y-4">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${isDestructive ? 'bg-edge-red/10 text-edge-red' : 'bg-slate-100 text-slate-900'}`}>
                  <AlertTriangle size={32} />
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl font-black uppercase tracking-tighter text-edge-black">
                    {title}
                  </h3>
                  <p className="text-slate-500 font-medium text-sm leading-relaxed">
                    {message}
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mt-10">
                <button
                  onClick={onCancel}
                  className="flex-1 px-6 py-4 rounded-xl text-[11px] font-black uppercase tracking-widest text-slate-500 bg-slate-100 hover:bg-slate-200 transition-all active:scale-95"
                >
                  {cancelText}
                </button>
                <button
                  onClick={onConfirm}
                  className={`flex-1 px-6 py-4 rounded-xl text-[11px] font-black uppercase tracking-widest text-white transition-all active:scale-95 shadow-lg ${isDestructive ? 'bg-edge-red shadow-edge-red/20 hover:shadow-edge-red/40' : 'bg-edge-black shadow-black/20 hover:shadow-black/40'}`}
                >
                  {confirmText}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmationModal;
