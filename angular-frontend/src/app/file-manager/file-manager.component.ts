// src/app/file-manager/file-manager.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule for ngFor, ngIf
import { FileService, FileMetadata } from './file.service'; // Import the service and interface

@Component({
  selector: 'app-file-manager',
  standalone: true, // Mark component as standalone
  imports: [CommonModule], // Add CommonModule to imports for standalone components
  templateUrl: './file-manager.component.html',
  styleUrls: ['./file-manager.component.css']
})
export class FileManagerComponent implements OnInit {
  selectedFile: File | null = null;
  files: FileMetadata[] = [];
  uploading: boolean = false;
  loadingFiles: boolean = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(private fileService: FileService) { }

  ngOnInit(): void {
    this.getFiles(); // Load files when the component initializes
  }

  /**
   * Handles the file selection event from the input.
   * @param event The change event from the file input.
   */
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.clearMessages();
    } else {
      this.selectedFile = null;
    }
  }

  /**
   * Initiates the file upload process.
   */
  uploadFile(): void {
    if (!this.selectedFile) {
      this.errorMessage = 'Please select a file to upload.';
      return;
    }

    this.uploading = true;
    this.clearMessages();

    this.fileService.uploadFile(this.selectedFile).subscribe({
      next: (response) => {
        this.successMessage = `File "${response.fileName}" uploaded successfully!`;
        this.selectedFile = null; // Clear selected file after upload
        this.getFiles(); // Refresh the list of files
      },
      error: (err) => {
        this.errorMessage = `Error uploading file: ${err.message || 'Unknown error'}`;
        console.error('Upload error:', err);
      },
      complete: () => {
        this.uploading = false;
      }
    });
  }

  /**
   * Initiates the file deletion process.
   * @param fileId The ID of the file to delete.
   */
  deleteFile(fileId: string): void {
    if (!confirm('Are you sure you want to delete this file?')) { // Using confirm for simplicity, consider a custom modal
      return;
    }

    this.clearMessages();
    this.fileService.deleteFile(fileId).subscribe({
      next: () => {
        this.successMessage = 'File deleted successfully!';
        this.files = this.files.filter(file => file._id !== fileId); // Remove from local list
      },
      error: (err) => {
        this.errorMessage = `Error deleting file: ${err.message || 'Unknown error'}`;
        console.error('Delete error:', err);
      }
    });
  }

  /**
   * Fetches the list of files from the backend.
   */
  getFiles(): void {
    this.loadingFiles = true;
    this.clearMessages();
    this.fileService.getFiles().subscribe({
      next: (data) => {
        this.files = data;
      },
      error: (err) => {
        this.errorMessage = `Error fetching files: ${err.message || 'Unknown error'}`;
        console.error('Fetch files error:', err);
      },
      complete: () => {
        this.loadingFiles = false;
      }
    });
  }

  /**
   * Helper to clear messages.
   */
  private clearMessages(): void {
    this.errorMessage = null;
    this.successMessage = null;
  }

  /**
   * Generates a download URL for a file.
   * IMPORTANT: This assumes your backend provides a direct download endpoint.
   * @param fileId The ID of the file.
   * @param fileName The name of the file.
   * @returns A string representing the download URL.
   */
  getDownloadUrl(file: FileMetadata): string {
    // Assuming your backend has a download endpoint like /api/files/download/:id
    // You might also use the 'url' property if your FileMetadata already includes it.
    return file.url || `http://localhost:3000/api/files/download/${file._id}`;
  }
}
