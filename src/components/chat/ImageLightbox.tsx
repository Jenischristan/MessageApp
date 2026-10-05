import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Download, ZoomIn, ZoomOut } from 'lucide-react';
import { Button } from '../common/Button';

interface ImageLightboxProps {
  isOpen: boolean;
  src?: string;
  v?: number;
  caption?: string;
  onClose: () => void;
}

export const ImageLightbox: React.FC<ImageLightboxProps> = ({
  isOpen,
  src,
  v = 0,
  caption,
  onClose,
}) => {
  const [scale, setScale] = React.useState(1);

  React.useEffect(() => {
    if (!isOpen) {
      setScale(1);
    }
  }, [isOpen]);

  const handleDownload = () => {
    // Generate a simple download trigger
    const link = document.createElement('a');
    link.download = `nook-image-${Date.now()}.png`;
    link.href = src || 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg"/>';
    link.click();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-md"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="relative z-10 max-w-4xl w-full flex flex-col items-center"
          >
            {/* Action Bar */}
            <div className="w-full flex items-center justify-between pb-3 text-white/80">
              <span className="text-sm font-medium truncate max-w-md">
                {caption || 'Shared Photo'}
              </span>
              <div className="flex items-center gap-1.5">
                <Button
                  variant="secondary"
                  size="icon"
                  className="h-8 w-8 rounded-lg"
                  title="Zoom Out"
                  onClick={() => setScale((s) => Math.max(0.7, s - 0.2))}
                >
                  <ZoomOut className="w-4 h-4" />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  className="h-8 w-8 rounded-lg"
                  title="Zoom In"
                  onClick={() => setScale((s) => Math.min(2.5, s + 0.2))}
                >
                  <ZoomIn className="w-4 h-4" />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  className="h-8 w-8 rounded-lg"
                  title="Download"
                  onClick={handleDownload}
                >
                  <Download className="w-4 h-4" />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  className="h-8 w-8 rounded-lg hover:bg-white/20"
                  onClick={onClose}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Media Canvas */}
            <div className="relative overflow-hidden rounded-2xl border border-white/10 shadow-2xl max-h-[75vh] max-w-full flex items-center justify-center bg-[#15171b]">
              {src ? (
                <img
                  src={src}
                  alt={caption || 'Preview'}
                  style={{ transform: `scale(${scale})` }}
                  className="max-h-[75vh] w-auto object-contain transition-transform duration-150"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div
                  className="w-[600px] max-w-full aspect-[4/3] flex items-center justify-center transition-transform duration-150"
                  style={{
                    transform: `scale(${scale})`,
                    background: `linear-gradient(${120 + v * 40}deg, #18191c 0%, #2f323a 100%)`,
                  }}
                >
                  <svg viewBox="0 0 120 90" className="w-full h-full p-8 opacity-75">
                    <circle cx={30 + v * 20} cy="26" r="10" fill="#ffffff" />
                    <path
                      d={
                        v % 2
                          ? 'M0 90V55l30-22 30 24 25-14 35 30v17z'
                          : 'M0 90V62l25-18 28 22 32-30 35 34v20z'
                      }
                      fill="#0b0c0e"
                    />
                  </svg>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
