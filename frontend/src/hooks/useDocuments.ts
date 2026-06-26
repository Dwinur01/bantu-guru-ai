import { useState, useCallback } from 'react';
import { DocumentService } from '../services/documentService';
import { DocumentItem, GenerateDocPayload } from '../types/document';

export function useDocuments() {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [nextCursor, setNextCursor] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDocuments = useCallback(
    async (params: {
      type?: string;
      dateFrom?: string;
      dateTo?: string;
      cursor?: string;
      limit?: number;
      loadMore?: boolean;
    }) => {
      setLoading(true);
      setError(null);
      try {
        const { loadMore, ...apiParams } = params;
        const data = await DocumentService.list(apiParams);
        setDocuments((prev) => (loadMore ? [...prev, ...data.documents] : data.documents));
        setNextCursor(data.nextCursor);
        return data;
      } catch (err: any) {
        setError(err.message || 'Gagal memuat daftar dokumen.');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const generateDocument = useCallback(async (payload: GenerateDocPayload) => {
    setLoading(true);
    setError(null);
    try {
      const data = await DocumentService.generate(payload);
      return data;
    } catch (err: any) {
      setError(err.message || 'Gagal membuat dokumen.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const downloadDocument = useCallback(async (id: number | string) => {
    try {
      return await DocumentService.download(id);
    } catch (err: any) {
      console.error('Error downloading document:', err);
      throw err;
    }
  }, []);

  const deleteDocument = useCallback(async (id: number | string) => {
    try {
      await DocumentService.delete(id);
      setDocuments((prev) => prev.filter((doc) => doc.id !== id));
    } catch (err: any) {
      console.error('Error deleting document:', err);
      throw err;
    }
  }, []);

  const toggleShareDocument = useCallback(async (id: number | string) => {
    try {
      const data = await DocumentService.share(id);
      setDocuments((prev) =>
        prev.map((doc) =>
          doc.id === id ? { ...doc, isPublic: data.isPublic, sharedAt: data.sharedAt } : doc
        )
      );
      return data;
    } catch (err: any) {
      console.error('Error toggling document share:', err);
      throw err;
    }
  }, []);

  return {
    documents,
    nextCursor,
    loading,
    error,
    fetchDocuments,
    generateDocument,
    downloadDocument,
    deleteDocument,
    toggleShareDocument,
  };
}
