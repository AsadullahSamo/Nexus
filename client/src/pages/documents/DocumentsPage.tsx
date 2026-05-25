import { useRef } from 'react';
import { FileText,  Upload,  Download,  Trash2,  FileImage,  FileSpreadsheet} from 'lucide-react';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useDocuments,  useUploadDocument,  useDeleteDocument} from '../../hooks/useDocuments';

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

  const {data: documents = [], isLoading} = useDocuments();
  const {mutate: uploadDocument,isPending: isUploading} = useUploadDocument();

  const {mutate: deleteDocument} = useDeleteDocument();

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
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error('Download failed');
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = name;
      a.click();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
    }
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