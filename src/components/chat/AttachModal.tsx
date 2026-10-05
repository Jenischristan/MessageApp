import React, { useState } from 'react';
import { Dialog } from '../common/Dialog';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Image, FileText, Link2, Upload, Check } from 'lucide-react';
import { FileAttachment, LinkAttachment } from '../../types';

interface AttachModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAttachImage: (v: number, caption: string) => void;
  onAttachFile: (file: FileAttachment, caption?: string) => void;
  onAttachLink: (link: LinkAttachment) => void;
}

const SAMPLE_FILES: FileAttachment[] = [
  { name: 'design-tokens-v2.json', size: '142 KB', type: 'json' },
  { name: 'nook-brand-guidelines.pdf', size: '2.4 MB', type: 'pdf' },
  { name: 'sprint-retro-notes.docx', size: '88 KB', type: 'docx' },
  { name: 'app-architecture.drawio', size: '310 KB', type: 'drawio' },
];

export const AttachModal: React.FC<AttachModalProps> = ({
  isOpen,
  onClose,
  onAttachImage,
  onAttachFile,
  onAttachLink,
}) => {
  const [tab, setTab] = useState<'photo' | 'file' | 'link'>('photo');

  // Photo tab state
  const [selectedPhotoVariant, setSelectedPhotoVariant] = useState(0);
  const [photoCaption, setPhotoCaption] = useState('');

  // File tab state
  const [selectedFile, setSelectedFile] = useState<FileAttachment>(SAMPLE_FILES[0]);
  const [fileCaption, setFileCaption] = useState('');

  // Link tab state
  const [linkUrl, setLinkUrl] = useState('https://github.com/nook-messaging/core');
  const [linkTitle, setLinkTitle] = useState('Nook Core — Reactive Messaging Client');
  const [linkDesc, setLinkDesc] = useState('Zero-latency, end-to-end encrypted messaging engine.');

  const handleSendPhoto = () => {
    onAttachImage(selectedPhotoVariant, photoCaption.trim());
    onClose();
  };

  const handleSendFile = () => {
    onAttachFile(selectedFile, fileCaption.trim());
    onClose();
  };

  const handleSendLink = () => {
    if (!linkUrl.trim()) return;
    onAttachLink({
      url: linkUrl.trim().replace(/^https?:\/\//, ''),
      title: linkTitle.trim() || linkUrl,
      desc: linkDesc.trim(),
    });
    onClose();
  };

  const handleFileUploadSimulated = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const sizeStr = file.size > 1024 * 1024 
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
        : `${Math.max(1, Math.round(file.size / 1024))} KB`;
      const newFile: FileAttachment = {
        name: file.name,
        size: sizeStr,
        type: file.name.split('.').pop() || 'file',
      };
      setSelectedFile(newFile);
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      title="Add Attachment"
      description="Share images, documents, or previewable links"
      onClose={onClose}
      maxWidth="max-w-md"
    >
      <div className="space-y-4">
        {/* Attachment Mode Selector */}
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#101114] rounded-xl border border-white/5">
          <button
            type="button"
            onClick={() => setTab('photo')}
            className={`flex items-center justify-center gap-2 py-2 text-xs font-medium rounded-lg transition-all ${
              tab === 'photo'
                ? 'bg-[#21232a] text-white shadow-sm'
                : 'text-white/50 hover:text-white'
            }`}
          >
            <Image className="w-3.5 h-3.5" />
            Photo
          </button>
          <button
            type="button"
            onClick={() => setTab('file')}
            className={`flex items-center justify-center gap-2 py-2 text-xs font-medium rounded-lg transition-all ${
              tab === 'file'
                ? 'bg-[#21232a] text-white shadow-sm'
                : 'text-white/50 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Document
          </button>
          <button
            type="button"
            onClick={() => setTab('link')}
            className={`flex items-center justify-center gap-2 py-2 text-xs font-medium rounded-lg transition-all ${
              tab === 'link'
                ? 'bg-[#21232a] text-white shadow-sm'
                : 'text-white/50 hover:text-white'
            }`}
          >
            <Link2 className="w-3.5 h-3.5" />
            Web Link
          </button>
        </div>

        {/* Tab 1: Photo */}
        {tab === 'photo' && (
          <div className="space-y-3.5">
            <div>
              <label className="block text-xs font-medium text-white/60 mb-2">
                Choose a visual template or upload
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[0, 1, 2, 3].map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setSelectedPhotoVariant(v)}
                    className={`relative aspect-[4/3] rounded-lg overflow-hidden border-2 transition-all ${
                      selectedPhotoVariant === v
                        ? 'border-[#0b69c7] ring-2 ring-[#0b69c7]/30 scale-[1.02]'
                        : 'border-white/10 hover:border-white/30'
                    }`}
                    style={{
                      background: `linear-gradient(${120 + v * 40}deg, #1f2229 0%, #3a3f4d 100%)`,
                    }}
                  >
                    <svg viewBox="0 0 120 90" className="w-full h-full opacity-60">
                      <circle cx={30 + v * 20} cy="26" r="9" fill="#ffffff" />
                      <path
                        d={
                          v % 2
                            ? 'M0 90V55l30-22 30 24 25-14 35 30v17z'
                            : 'M0 90V62l25-18 28 22 32-30 35 34v20z'
                        }
                        fill="#0b0c0e"
                      />
                    </svg>
                    {selectedPhotoVariant === v && (
                      <div className="absolute top-1 right-1 bg-[#0b69c7] rounded-full p-0.5 text-white">
                        <Check className="w-2.5 h-2.5" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="photo-caption" className="block text-xs font-medium text-white/60 mb-1.5">
                Caption (optional)
              </label>
              <Input
                id="photo-caption"
                placeholder="Add a caption..."
                value={photoCaption}
                onChange={(e) => setPhotoCaption(e.target.value)}
              />
            </div>

            <div className="flex gap-2 pt-2">
              <Button variant="outline" className="flex-1" onClick={onClose}>
                Cancel
              </Button>
              <Button className="flex-1" onClick={handleSendPhoto}>
                Send Photo
              </Button>
            </div>
          </div>
        )}

        {/* Tab 2: Document */}
        {tab === 'file' && (
          <div className="space-y-3.5">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-medium text-white/60">
                  Select a document
                </label>
                <label className="text-xs text-[#3b9bff] hover:underline cursor-pointer inline-flex items-center gap-1">
                  <Upload className="w-3 h-3" />
                  Choose file
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleFileUploadSimulated}
                  />
                </label>
              </div>

              <div className="space-y-1.5 max-h-44 scr">
                {SAMPLE_FILES.map((file) => {
                  const isSelected = selectedFile.name === file.name;
                  return (
                    <button
                      key={file.name}
                      type="button"
                      onClick={() => setSelectedFile(file)}
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'bg-[#0b69c7]/10 border-[#0b69c7] text-white'
                          : 'bg-[#121316] border-white/5 hover:border-white/15 text-white/80'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="w-8 h-8 rounded-lg bg-white/10 grid place-items-center shrink-0 text-white/70">
                          <FileText className="w-4 h-4" />
                        </span>
                        <div className="min-w-0">
                          <p className="text-xs font-medium truncate">{file.name}</p>
                          <p className="text-[11px] text-white/40">{file.size}</p>
                        </div>
                      </div>
                      {isSelected && (
                        <span className="text-[#3b9bff] mr-1">
                          <Check className="w-4 h-4" />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label htmlFor="file-comment" className="block text-xs font-medium text-white/60 mb-1.5">
                Note (optional)
              </label>
              <Input
                id="file-comment"
                placeholder="Add a comment with this document..."
                value={fileCaption}
                onChange={(e) => setFileCaption(e.target.value)}
              />
            </div>

            <div className="flex gap-2 pt-2">
              <Button variant="outline" className="flex-1" onClick={onClose}>
                Cancel
              </Button>
              <Button className="flex-1" onClick={handleSendFile}>
                Send Document
              </Button>
            </div>
          </div>
        )}

        {/* Tab 3: Link */}
        {tab === 'link' && (
          <div className="space-y-3.5">
            <div>
              <label htmlFor="link-url" className="block text-xs font-medium text-white/60 mb-1.5">
                URL Address
              </label>
              <Input
                id="link-url"
                placeholder="https://example.com"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="link-title" className="block text-xs font-medium text-white/60 mb-1.5">
                Preview Title
              </label>
              <Input
                id="link-title"
                placeholder="Page Title"
                value={linkTitle}
                onChange={(e) => setLinkTitle(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="link-desc" className="block text-xs font-medium text-white/60 mb-1.5">
                Description
              </label>
              <Input
                id="link-desc"
                placeholder="Brief summary..."
                value={linkDesc}
                onChange={(e) => setLinkDesc(e.target.value)}
              />
            </div>

            <div className="flex gap-2 pt-2">
              <Button variant="outline" className="flex-1" onClick={onClose}>
                Cancel
              </Button>
              <Button className="flex-1" onClick={handleSendLink}>
                Share Link
              </Button>
            </div>
          </div>
        )}
      </div>
    </Dialog>
  );
};
