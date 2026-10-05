import React, { useRef, useEffect, useState } from 'react';
import { Paperclip, Smile, Send, X, Mic, StopCircle } from 'lucide-react';
import { Button } from '../common/Button';
import { MessageReply } from '../../types';
import { EmojiPicker } from './EmojiPicker';

interface ChatInputProps {
  onSend: (text: string) => void;
  onSendVoice?: (duration: string) => void;
  replyTarget: MessageReply | null;
  onCancelReply: () => void;
  onOpenAttach: () => void;
  enterToSend?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSend,
  onSendVoice,
  replyTarget,
  onCancelReply,
  onOpenAttach,
  enterToSend = true,
}) => {
  const [text, setText] = useState('');
  const [isEmojiOpen, setIsEmojiOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Focus textarea when replying
  useEffect(() => {
    if (replyTarget) {
      textareaRef.current?.focus();
    }
  }, [replyTarget]);

  // Voice recording timer simulation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordSeconds((s) => s + 1);
      }, 1000);
    } else {
      setRecordSeconds(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setText('');
    setIsEmojiOpen(false);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && enterToSend) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    // Auto-adjust height
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 140)}px`;
  };

  const handleSelectEmoji = (emoji: string) => {
    setText((prev) => prev + emoji);
    textareaRef.current?.focus();
  };

  const handleToggleVoice = () => {
    if (isRecording) {
      // finish recording and send
      const mins = Math.floor(recordSeconds / 60);
      const secs = (recordSeconds % 60).toString().padStart(2, '0');
      onSendVoice?.(`${mins}:${secs}`);
      setIsRecording(false);
    } else {
      setIsRecording(true);
    }
  };

  return (
    <footer className="relative shrink-0 px-3 md:px-5 pb-3 pt-1 bg-[#0b0c0e]">
      <div className="max-w-4xl mx-auto flex flex-col">
        {/* Reply Quoted Preview */}
        {replyTarget && (
          <div className="flex items-center justify-between gap-3 mb-2 px-3 py-2 rounded-xl bg-[#171922] border-l-3 border-[#6956e5] text-xs text-white/80 animate-in fade-in slide-in-from-bottom-1 duration-150">
            <div className="min-w-0">
              <span className="font-semibold text-[#caa6fc] block">
                Replying to {replyTarget.who}
              </span>
              <p className="truncate text-white/60 text-[11px] mt-0.5">
                {replyTarget.text}
              </p>
            </div>
            <button
              type="button"
              onClick={onCancelReply}
              className="p-1 rounded-lg hover:bg-[#232534] text-white/60 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Input Bar */}
        <div className="relative flex items-end gap-1.5 rounded-2xl bg-[#12131a] border border-[#242636] p-1.5 focus-within:border-[#6956e5]/60 focus-within:ring-1 focus-within:ring-[#6956e5]/30 transition-all shadow-md">
          {/* Emoji Picker Popover */}
          <EmojiPicker
            isOpen={isEmojiOpen}
            onSelect={handleSelectEmoji}
            onClose={() => setIsEmojiOpen(false)}
          />

          {isRecording ? (
            <div className="flex-1 flex items-center justify-between px-3 h-10 animate-pulse">
              <div className="flex items-center gap-2 text-red-400">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                <span className="text-xs font-semibold">Recording voice memo…</span>
                <span className="text-xs font-mono text-white/70 ml-2">
                  0:{recordSeconds.toString().padStart(2, '0')}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsRecording(false)}
                className="text-xs text-white/50 hover:text-white cursor-pointer"
              >
                Cancel
              </button>
            </div>
          ) : (
            <>
              {/* Attachment Button */}
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-white/50 hover:text-white rounded-xl"
                title="Attach photo, document, or link"
                onClick={onOpenAttach}
              >
                <Paperclip className="w-4 h-4" />
              </Button>

              {/* Emoji Button */}
              <Button
                variant="ghost"
                size="icon"
                className={`h-9 w-9 rounded-xl transition-colors ${
                  isEmojiOpen
                    ? 'text-white bg-[#242636]'
                    : 'text-white/50 hover:text-white'
                }`}
                title="Insert emoji"
                onClick={() => setIsEmojiOpen(!isEmojiOpen)}
              >
                <Smile className="w-4 h-4" />
              </Button>

              {/* Message Textarea */}
              <textarea
                ref={textareaRef}
                rows={1}
                value={text}
                onChange={handleInput}
                onKeyDown={handleKeyDown}
                placeholder="Start Typing…"
                className="flex-1 min-w-0 resize-none bg-transparent px-2 py-2 text-sm md:text-[14.5px] max-h-36 text-white placeholder:text-white/40 focus:outline-none scr leading-normal"
                style={{ minHeight: '36px' }}
              />
            </>
          )}

          {/* Action Button: Voice Memo or Send */}
          {text.trim() ? (
            <Button
              size="icon"
              className="h-9 w-9 rounded-xl bg-[#6956e5] hover:bg-[#5b48d6] text-white shrink-0 font-bold shadow-sm border border-transparent"
              onClick={handleSend}
              title="Send message (Enter)"
            >
              <Send className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              className={`h-9 w-9 rounded-xl shrink-0 transition-colors ${
                isRecording
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'text-white/50 hover:text-white'
              }`}
              onClick={handleToggleVoice}
              title={isRecording ? 'Finish & send voice note' : 'Record voice note'}
            >
              {isRecording ? (
                <StopCircle className="w-4 h-4" />
              ) : (
                <Mic className="w-4 h-4" />
              )}
            </Button>
          )}
        </div>
      </div>
    </footer>
  );
};
