import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

// Define an interface for the file metadata you expect from the backend
export interface FileMetadata {
  _id: string; // MongoDB document ID
  fileName: string;
  fileType: string;
  size: number; // Size in bytes
  uploadDate: string; // ISO string date
  url?: string; // URL to download the file (if applicable)
}

@Injectable({
  providedIn: 'root'
})
export class FileService {
  // IMPORTANT: Replace this with the actual URL of your backend API
  // For example: 'http://localhost:3000/api/files' or 'https://your-backend-api.com/api/files'
  private apiUrl = 'http://localhost:3000/api/files'; // Placeholder backend API URL

  constructor(private http: HttpClient) { }

  /**
   * Fetches a list of all files (metadata) from the backend.
   * @returns An Observable of an array of FileMetadata.
   */
  getFiles(): Observable<FileMetadata[]> {
    console.log('Fetching files from:', this.apiUrl);
    return this.http.get<FileMetadata[]>(this.apiUrl).pipe(
      catchError(this.handleError<FileMetadata[]>('getFiles', []))
    );
  }

  /**
   * Uploads a file to the backend.
   * @param file The file to upload (e.g., from an <input type="file"> event).
   * @returns An Observable of the uploaded file's metadata.
   */
  uploadFile(file: File): Observable<FileMetadata> {
    const formData = new FormData();
    formData.append('file', file, file.name); // 'file' should match the field name expected by your backend

    console.log('Uploading file:', file.name);
    // The backend should handle saving the file to MongoDB (e.g., using GridFS for large files)
    // and storing metadata in a separate collection.
    return this.http.post<FileMetadata>(`${this.apiUrl}/upload`, formData).pipe(
      catchError(this.handleError<FileMetadata>('uploadFile'))
    );
  }

  /**
   * Deletes a file from the backend by its ID.
   * @param fileId The unique ID of the file to delete.
   * @returns An Observable indicating success or failure.
   */
  deleteFile(fileId: string): Observable<any> {
    console.log('Deleting file with ID:', fileId);
    return this.http.delete(`${this.apiUrl}/${fileId}`).pipe(
      catchError(this.handleError<any>('deleteFile'))
    );
  }

  /**
   * Handles HTTP operation errors.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed:`, error); // Log the error to console
      // Optionally, you could send the error to a remote logging infrastructure
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
