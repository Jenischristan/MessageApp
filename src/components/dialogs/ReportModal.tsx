import React, { useState } from 'react';
import { Dialog } from '../common/Dialog';
import { Button } from '../common/Button';
import { ShieldAlert, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface ReportModalProps {
  isOpen: boolean;
  targetName: string;
  isMessageReport?: boolean;
  messageSnippet?: string;
  onClose: () => void;
  onSubmitReport: (reason: string, details: string) => void;
}

const REPORT_REASONS = [
  'Spam or advertising',
  'Harassment or abusive language',
  'Impersonation or phishing scam',
  'Inappropriate or sensitive media',
  'Threats of violence or illegal activity',
  'Other violation',
];

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  targetName,
  isMessageReport = false,
  messageSnippet,
  onClose,
  onSubmitReport,
}) => {
  const [selectedReason, setSelectedReason] = useState<string>('');
  const [details, setDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReason) return;
    onSubmitReport(selectedReason, details);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setSelectedReason('');
      setDetails('');
      onClose();
    }, 1200);
  };

  return (
    <Dialog
      isOpen={isOpen}
      title={isMessageReport ? 'Report Message' : `Report ${targetName}`}
      description={
        isMessageReport
          ? 'Help us keep conversations safe by reporting abusive messages'
          : 'Reports are reviewed by moderation and encrypted trust systems'
      }
      onClose={onClose}
      maxWidth="max-w-md"
    >
      {submitted ? (
        <div className="py-8 flex flex-col items-center justify-center text-center space-y-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-10 h-10 text-emerald-400" />
          <h4 className="text-base font-semibold text-white">Report Submitted</h4>
          <p className="text-xs text-white/50 max-w-xs">
            Thank you for helping keep nook safe. This report has been flagged for
            investigation.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {messageSnippet && (
            <div className="p-3 rounded-xl bg-[#161722] border border-[#232536] text-xs text-white/60 italic truncate">
              &ldquo;{messageSnippet}&rdquo;
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-xs font-semibold text-white/70">
              Select a reason for this report:
            </label>
            <div className="space-y-1.5" role="radiogroup">
              {REPORT_REASONS.map((reason) => {
                const isSelected = selectedReason === reason;
                return (
                  <button
                    key={reason}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => setSelectedReason(reason)}
                    className={`w-full flex items-center gap-3 p-2.5 rounded-xl border text-left text-xs transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-[#242636] border-[#6956e5] text-white font-medium'
                        : 'bg-[#12131a] border-[#222432] hover:border-[#323548] text-white/70'
                    }`}
                  >
                    <span
                      className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                        isSelected ? 'border-[#6956e5]' : 'border-[#3a3d52]'
                      }`}
                    >
                      {isSelected && <span className="w-2 h-2 rounded-full bg-[#6956e5]" />}
                    </span>
                    <span>{reason}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label
              htmlFor="report-details"
              className="block text-xs font-semibold text-white/70 mb-1"
            >
              Additional context (optional)
            </label>
            <textarea
              id="report-details"
              rows={2}
              placeholder="Provide any relevant details..."
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              className="w-full rounded-xl bg-[#12131a] border border-[#262838] p-2.5 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#6956e5]/70 focus:ring-1 focus:ring-[#6956e5]/40 resize-none scr"
            />
          </div>

          <div className="flex gap-2 pt-1">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="danger"
              className="flex-1 font-semibold"
              disabled={!selectedReason}
            >
              Submit Report
            </Button>
          </div>
        </form>
      )}
    </Dialog>
  );
};
