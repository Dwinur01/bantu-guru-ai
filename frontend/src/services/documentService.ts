import { api } from './api';
import { API_ENDPOINTS } from '../constants/api';
import { GenerateDocPayload, DocumentItem } from '../types/document';

export interface GenerateDocResponse {
  success: boolean;
  data: {
    document: DocumentItem;
    signedUrl: string;
    quotaRemaining?: number;
  };
}

export interface ListDocsResponse {
  success: boolean;
  data: {
    documents: DocumentItem[];
    nextCursor: number | null;
  };
}

export interface LibraryResponse {
  success: boolean;
  data: {
    documents: DocumentItem[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

export class DocumentService {
  static async generate(payload: GenerateDocPayload): Promise<GenerateDocResponse['data']> {
    const res = await api.post<GenerateDocResponse>(API_ENDPOINTS.DOCUMENTS.GENERATE, payload);
    return res.data.data;
  }

  static async list(params: {
    type?: string;
    dateFrom?: string;
    dateTo?: string;
    cursor?: string;
    limit?: number;
  }): Promise<ListDocsResponse['data']> {
    const res = await api.get<ListDocsResponse>(API_ENDPOINTS.DOCUMENTS.LIST, { params });
    return res.data.data;
  }

  static async download(id: number | string): Promise<{ signedUrl: string; filename?: string }> {
    const res = await api.get<{ success: boolean; data: { signedUrl: string; filename?: string } }>(
      API_ENDPOINTS.DOCUMENTS.DOWNLOAD(id)
    );
    return res.data.data;
  }

  static async share(id: number | string): Promise<{ isPublic: boolean; sharedAt: string | null; message: string }> {
    const res = await api.patch<{ success: boolean; data: { isPublic: boolean; sharedAt: string | null; message: string } }>(
      API_ENDPOINTS.DOCUMENTS.SHARE(id)
    );
    return res.data.data;
  }

  static async delete(id: number | string): Promise<void> {
    await api.delete(API_ENDPOINTS.DOCUMENTS.DELETE(id));
  }

  static async getPublicLibrary(params: {
    page?: number;
    limit?: number;
    type?: string;
  }): Promise<LibraryResponse['data']> {
    const res = await api.get<LibraryResponse>(API_ENDPOINTS.LIBRARY.LIST, { params });
    return res.data.data;
  }
}
