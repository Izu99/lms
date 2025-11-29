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
            // Videos are stored in uploads/videos/files/
            return `${API_BASE_URL}/uploads/videos/files/${cleanFilename}`;

        case 'video-thumbnail':
            // Video thumbnails are stored in uploads/videos/images/
            // Note: Some legacy data might have different paths, but this is the standard
            return `${API_BASE_URL}${filename.startsWith('/uploads') ? filename : `/uploads/videos/images/${cleanFilename}`}`;

        case 'paper':
            // Papers are stored in uploads/paper/pdf-papers/
            // Check if it already has the full path (legacy) or just filename
            if (cleanFilename.includes('uploads/')) {
                return `${API_BASE_URL}/${cleanFilename}`;
            }
            return `${API_BASE_URL}/uploads/paper/pdf-papers/${cleanFilename}`;

        case 'paper-thumbnail':
            // Paper thumbnails
            return `${API_BASE_URL}${filename.startsWith('/uploads') ? filename : `/uploads/paper/images/${cleanFilename}`}`;

        case 'image':
        default:
            // Generic fallback or direct path
            return `${API_BASE_URL}/${cleanFilename}`;
    }
};
