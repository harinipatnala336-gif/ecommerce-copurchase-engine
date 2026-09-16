import React, { useState } from 'react';
import { Upload, FileText, CheckCircle2, AlertCircle, Sparkles, ArrowRight } from 'lucide-react';
import { parseCustomCSV, ColumnMapping } from '../services/datasetEngine';
import { LoadedDataset } from '../services/datasets/datasetRegistry';

interface FileUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDatasetLoaded: (dataset: LoadedDataset) => void;
}

export const FileUploadModal: React.FC<FileUploadModalProps> = ({
  isOpen,
  onClose,
  onDatasetLoaded
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [previewRows, setPreviewRows] = useState<string[][]>([]);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setError(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setFileContent(text);

      // Simple preview of first 5 lines
      const lines = text.split('\n').filter(l => l.trim().length > 0).slice(0, 6);
      const rows = lines.map(line => line.split(/[,;\t]/).map(item => item.trim().replace(/^["']|["']$/g, '')));
      setPreviewRows(rows);
    };
    reader.readAsText(selectedFile);
  };

  const handleProcessUpload = async () => {
    if (!fileContent) {
      setError('Please select a valid CSV file first.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const parsedDataset = await parseCustomCSV(fileContent);
      onDatasetLoaded(parsedDataset);
      setLoading(false);
      onClose();
    } catch (err: any) {
      setLoading(false);
      setError(err.message || 'Failed to parse the uploaded transaction dataset.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-xl glass-panel rounded-2xl p-6 border-blue-500/40 space-y-5 shadow-2xl bg-[#0a0f1d]">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Universal Transaction Dataset Ingestor
              </h3>
              <p className="text-xs text-slate-400">
                Upload any Kaggle or custom CSV/Text transaction file
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-xs text-slate-400 hover:text-white p-1"
          >
            ✕
          </button>
        </div>

        {/* Dropzone */}
        <label className="border-2 border-dashed border-slate-700 hover:border-blue-500/60 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all bg-slate-900/40 hover:bg-slate-900/80 group">
          <Upload className="w-8 h-8 text-slate-400 group-hover:text-blue-400 transition-colors mb-2" />
          <span className="text-xs font-bold text-white group-hover:text-blue-300">
            {file ? file.name : 'Click to Browse or Drag & Drop Transaction CSV'}
          </span>
          <span className="text-[11px] text-slate-400 mt-1">
            Supports Tall format (InvoiceNo, ItemName, Price) or Wide Basket format (ItemA, ItemB, ItemC)
          </span>
          <input
            type="file"
            accept=".csv,.txt,.json"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>

        {/* Error message */}
        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Preview of parsed rows */}
        {previewRows.length > 0 && (
          <div className="space-y-2">
            <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
              <span>File Data Preview (First 5 Rows):</span>
              <span className="text-[10px] text-emerald-400 font-mono">Format Detected</span>
            </div>
            <div className="overflow-x-auto rounded-xl border border-slate-800 max-h-36 bg-slate-950/80 p-2">
              <table className="w-full text-left text-[11px] font-mono text-slate-300">
                <tbody>
                  {previewRows.map((row, rIdx) => (
                    <tr key={rIdx} className={rIdx === 0 ? 'text-blue-400 font-bold border-b border-slate-800' : 'border-b border-slate-900'}>
                      {row.map((cell, cIdx) => (
                        <td key={cIdx} className="p-1.5 truncate max-w-[140px]">{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
          >
            Cancel
          </button>

          <button
            onClick={handleProcessUpload}
            disabled={!fileContent || loading}
            className={`px-5 py-2 rounded-xl text-xs font-bold shadow-lg transition-all flex items-center gap-2 ${
              fileContent && !loading
                ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/20 active:scale-95'
                : 'bg-slate-800 text-slate-400 cursor-not-allowed'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            {loading ? 'Mining & Processing...' : 'Ingest & Mine Market Baskets'}
          </button>
        </div>
      </div>
    </div>
  );
};
