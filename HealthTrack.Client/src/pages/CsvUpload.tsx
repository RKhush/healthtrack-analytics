import { useState } from 'react';
import Layout from '../components/Layout';
import { Upload, FileText, CheckCircle, XCircle, Download } from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const CsvUpload = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [result, setResult] = useState<{imported: number, errors: number} | null>(null);

  const handleUpload = async (file: File) => {
    if (!file.name.endsWith('.csv')) {
      toast.error('Only CSV files allowed!');
      return;
    }
    setIsUploading(true);
    setResult(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await api.post('/Csv/upload-patients', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResult(response.data);
      toast.success(`Imported ${response.data.imported} patients!`);
    } catch (error) {
      toast.error('Upload failed!');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleUpload(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
  };

  const downloadTemplate = async () => {
    const response = await api.get('/Csv/template', { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'patients_template.csv');
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <Layout>
      <div className="space-y-6 max-w-2xl">
        
        <div>
          <h1 className="text-2xl font-bold text-gray-900">CSV Upload</h1>
          <p className="text-gray-500">Import patients in bulk using a CSV file</p>
        </div>

        {/* Download template */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText className="text-blue-600" size={20} />
            <div>
              <p className="text-sm font-medium text-blue-900">Need a template?</p>
              <p className="text-xs text-blue-600">Download the CSV template with the correct format</p>
            </div>
          </div>
          <button
            onClick={downloadTemplate}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
          >
            <Download size={16} />
            Download
          </button>
        </div>

        {/* Drop zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-12 text-center transition-all ${
            isDragging ? 'border-teal-500 bg-teal-50' : 'border-gray-300 bg-white hover:border-teal-400'
          }`}
        >
          <Upload className="mx-auto text-gray-400 mb-4" size={40} />
          <p className="text-gray-600 font-medium mb-1">Drag & drop your CSV file here</p>
          <p className="text-gray-400 text-sm mb-4">or click to browse</p>
          <label className="cursor-pointer px-6 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700">
            Browse File
            <input type="file" accept=".csv" onChange={handleFileInput} className="hidden" />
          </label>
        </div>

        {/* Loading */}
        {isUploading && (
          <div className="bg-white rounded-xl p-6 border border-gray-100 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto mb-3"></div>
            <p className="text-gray-600">Uploading and processing...</p>
          </div>
        )}

        {/* Result */}
        {result && (
          <div className="bg-white rounded-xl p-6 border border-gray-100 space-y-3">
            <h3 className="font-semibold text-gray-900">Upload Result</h3>
            <div className="flex gap-4">
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle size={18} />
                <span className="text-sm font-medium">{result.imported} patients imported</span>
              </div>
              {result.errors > 0 && (
                <div className="flex items-center gap-2 text-red-500">
                  <XCircle size={18} />
                  <span className="text-sm font-medium">{result.errors} errors</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CsvUpload;