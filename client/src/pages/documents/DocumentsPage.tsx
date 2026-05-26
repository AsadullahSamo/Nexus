import { useRef, useState } from 'react';
import { FileText,  Upload,  Download,  Trash2,  FileImage,  FileSpreadsheet, Eye, X, PenLine} from 'lucide-react';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useDocuments,  useUploadDocument,  useDeleteDocument} from '../../hooks/useDocuments';
import { useSaveSignature } from '../../hooks/useDocuments';
import SignatureCanvas from 'react-signature-canvas';
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { useAuth } from '../../context/AuthContext';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const formatBytes = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const getFileType = (mimetype: string) => {
  if (mimetype === 'application/pdf') return 'PDF';
  if (mimetype.includes('word')) return 'Word';
  if (mimetype.includes('excel') || mimetype.includes('spreadsheet'))return 'Excel';
  if (mimetype.includes('image')) return 'Image';
  return 'File';
};

const getFileIcon = (mimetype: string) => {
  if (mimetype === 'application/pdf') {
    return <FileText size={24} className="text-red-600" />;
  }

  if (mimetype.includes('image')) {
    return <FileImage size={24} className="text-green-600" />;
  }

  if (mimetype.includes('excel') ||mimetype.includes('spreadsheet')) {
    return <FileSpreadsheet size={24} className="text-emerald-600"/>
  }

  if (mimetype.includes('word')) {
    return <FileText size={24} className="text-blue-600" />;
  }

  return <FileText size={24} className="text-primary-600" />;
};

export const DocumentsPage = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const sigPadRef = useRef<SignatureCanvas>(null);

  const [previewDoc, setPreviewDoc] = useState<{ id: string; name: string } | null>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [signDoc, setSignDoc] = useState<{ id: string; name: string } | null>(null);


  const {user} = useAuth()
  const {data: documents = [], isLoading} = useDocuments(user?._id || '');
  const {mutate: uploadDocument,isPending: isUploading} = useUploadDocument();
  const {mutate: deleteDocument} = useDeleteDocument();
  const {mutate: saveSignature, isPending: isSaving} = useSaveSignature();

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();

    formData.append('file', file);
    formData.append('name', file.name);

    uploadDocument(formData);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDownload = async (id: string, name: string) => {
    try {
      const token = localStorage.getItem('token');

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/documents/${id}/download`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!res.ok) throw new Error('Download failed');

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = name;
      a.click();

      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
    }
  };

  const handlePreview = async (id: string, name: string, mimetype: string) => {
    if (!mimetype.includes('pdf')) return;
    const token = localStorage.getItem('token');
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/documents/${id}/download`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (!res.ok) {
      console.error('Failed to fetch document for preview');
      return;
    }

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    setPreviewUrl(url);
    setPreviewDoc({ id, name });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Documents </h1>
          <p className="text-gray-600">Manage your important files </p>
        </div>

        <div>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleUpload}
            accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
          />
          <Button
            leftIcon={<Upload size={18} />}
            isLoading={isUploading}
            onClick={() => fileInputRef.current?.click()}
          >
            Upload Document
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-medium text-gray-900"> My Documents </h2>
        </CardHeader>

        <CardBody>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600" />
            </div>
          ) : documents.length > 0 ? (
            <div className="space-y-2">
              {documents.map((doc: any) => (
                <div
                  key={doc._id}
                  className="flex items-center p-4 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className="p-2 bg-primary-50 rounded-lg mr-4">
                    {getFileIcon(doc.mimetype)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {doc.name}
                      </h3>

                      <Badge variant="gray" size="sm">
                        {getFileType(doc.mimetype)}
                      </Badge>

                      {doc.signature ? (
                        <Badge variant="success" size="sm">Signed</Badge>
                      ) : (
                        <Badge variant="error" size="sm">Unsigned</Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                      <span> {formatBytes(doc.size)} </span>
                      <span> v{doc.version} </span>
                      <span> {new Date(doc.createdAt).toLocaleDateString()} </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-2"
                      aria-label="Download"
                      onClick={() => handleDownload(doc._id, doc.originalName)}
                    >
                      <Download size={18} />
                    </Button>

                    {doc.mimetype === 'application/pdf' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-2"
                        aria-label="Preview"
                        onClick={() => handlePreview(doc._id, doc.name, doc.mimetype)}
                      >
                        <Eye size={18} />
                      </Button>
                    )}

                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-2"
                      aria-label="Sign"
                      disabled={doc.signature}
                      title={doc.signature ? "Already signed" : "Sign document"}
                      onClick={() => {
                        if (doc.signature) return;
                        setSignDoc({ id: doc._id, name: doc.name });
                      }}
                    >
                      <PenLine size={18} />
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-2 text-error-600 hover:text-error-700"
                      aria-label="Delete"
                      onClick={() => deleteDocument(doc._id)}
                    >
                      <Trash2 size={18} />
                    </Button>
                  </div>
                </div>
              ))}
              {previewDoc && previewUrl && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
                  <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
                    <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200">
                      <h3 className="text-sm font-medium text-gray-900 truncate">{previewDoc.name}</h3>
                      <button
                        onClick={() => {
                          setPreviewDoc(null);
                          if (previewUrl) URL.revokeObjectURL(previewUrl);
                          setPreviewUrl(null);
                          setNumPages(0);
                        }}
                        className="p-1.5 rounded-md hover:bg-gray-100 transition-colors"
                      >
                        <X size={18} className="text-gray-500" />
                      </button>
                    </div>

                    <div className="overflow-y-auto flex-1 flex flex-col items-center p-4 bg-gray-50">
                      <Document
                        file={previewUrl}
                        onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                        loading={
                          <div className="flex justify-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600" />
                          </div>
                        }
                      >
                        {Array.from({ length: numPages }, (_, i) => (
                          <Page
                            key={i + 1}
                            pageNumber={i + 1}
                            width={700}
                            className="mb-4 shadow-sm"
                          />
                        ))}
                      </Document>
                    </div>

                    <div className="px-5 py-3 border-t border-gray-200 text-xs text-gray-500 text-right">
                      {numPages} page{numPages !== 1 ? 's' : ''}
                    </div>
                  </div>
                </div>
              )}

              {signDoc && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
                  <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg flex flex-col">
                    <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200">
                      <h3 className="text-sm font-medium text-gray-900">
                        Sign: {signDoc.name}
                      </h3>
                      <button
                        onClick={() => setSignDoc(null)}
                        className="p-1.5 rounded-md hover:bg-gray-100 transition-colors"
                      >
                        <X size={18} className="text-gray-500" />
                      </button>
                    </div>

                    <div className="p-5">
                      <p className="text-sm text-gray-500 mb-3">
                        Draw your signature below
                      </p>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
                        <SignatureCanvas
                          ref={sigPadRef}
                          penColor="black"
                          canvasProps={{
                            width: 460,
                            height: 180,
                            className: 'w-full',
                          }}
                        />
                      </div>
                    </div>

                    <div className="flex justify-between items-center px-5 py-3 border-t border-gray-200">
                      <button
                        onClick={() => sigPadRef.current?.clear()}
                        className="text-sm text-gray-500 hover:text-gray-700"
                      >
                        Clear
                      </button>
                      <div className="flex gap-3">
                        <Button variant="outline" onClick={() => setSignDoc(null)}>
                          Cancel
                        </Button>
                        <Button
                          isLoading={isSaving}
                          onClick={() => {
                            if (!sigPadRef.current || sigPadRef.current.isEmpty()) return;
                            const signature = sigPadRef.current.toDataURL('image/png');
                            saveSignature(
                              { id: signDoc.id, signature },
                              { onSuccess: () => setSignDoc(null) }
                            );
                          }}
                        >
                          Save Signature
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="bg-gray-100 p-4 rounded-full inline-flex mb-4">
                <FileText size={32} className="text-gray-400"/>
              </div>

              <h3 className="text-lg font-medium text-gray-700">
                No documents yet
              </h3>

              <p className="text-gray-500 mt-1">
                Upload your first document to get started
              </p>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};