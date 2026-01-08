import { API_BASE_URL } from "./constants";

export type FileType = 'video' | 'paper' | 'image' | 'video-thumbnail' | 'paper-thumbnail';

/**
 * Generates a full URL for a file based on its type and filename.
 * This abstracts the underlying storage structure (local vs cloud).
 * 
 * @param filename The filename or partial path from the database
 * @param type The type of file to determine the base path
 * @returns The full absolute URL to the file
 */
export const getFileUrl = (filename: string | undefined | null, type: FileType): string => {
    if (!filename) return '';

    // If it's already a full URL (e.g. from external source or future cloud storage), return it
    if (filename.startsWith('http://') || filename.startsWith('https://')) {
        return filename;
    }

    // Remove leading slash if present to avoid double slashes
    const cleanFilename = filename.startsWith('/') ? filename.slice(1) : filename;

    switch (type) {
        case 'video':
            // If the filename already contains the relative path (e.g. "videos/files/"), just prepend /uploads/
            if (cleanFilename.includes('videos/files/')) {
                return `${API_BASE_URL}/uploads/${cleanFilename}`;
            }
            // Fallback for legacy filenames that are just 'filename.mp4'
            return `${API_BASE_URL}/uploads/videos/files/${cleanFilename}`;

        case 'video-thumbnail':
            // Handle if it already has the full relative path
            if (cleanFilename.includes('videos/images/')) {
                return `${API_BASE_URL}/uploads/${cleanFilename}`;
            }
            // Standard fallback
            return `${API_BASE_URL}${filename.startsWith('/uploads') ? filename : `/uploads/videos/images/${cleanFilename}`}`;

        case 'paper':
            // Papers are stored in uploads/paper/pdf-papers/
            if (cleanFilename.includes('paper/')) { // Broadened to include any paper subfolder
                return `${API_BASE_URL}/uploads/${cleanFilename}`;
            }
            if (cleanFilename.includes('uploads/')) {
                return `${API_BASE_URL}/${cleanFilename}`;
            }
            return `${API_BASE_URL}/uploads/paper/pdf-papers/${cleanFilename}`;

        case 'paper-thumbnail':
            // Paper thumbnails
            if (cleanFilename.includes('paper/')) {
                return `${API_BASE_URL}/uploads/${cleanFilename}`;
            }
            return `${API_BASE_URL}${filename.startsWith('/uploads') ? filename : `/uploads/paper/images/${cleanFilename}`}`;

        case 'image':
        default:
            // Generic fallback
            if (cleanFilename.startsWith('uploads/')) {
                return `${API_BASE_URL}/${cleanFilename}`;
            }
            // Add /uploads/ prefix if not present for all other relative paths (tutes, profile, etc.)
            // New standardized relative paths will hit this.
            return `${API_BASE_URL}/uploads/${cleanFilename}`;
    }
};
