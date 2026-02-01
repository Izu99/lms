import { API_URL } from "./constants";

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

    // Use API_URL which already includes the /api prefix
    const baseUploadUrl = `${API_URL}/uploads`;

    switch (type) {
        case 'video':
            if (cleanFilename.includes('videos/files/')) {
                return `${baseUploadUrl}/${cleanFilename}`;
            }
            return `${baseUploadUrl}/videos/files/${cleanFilename}`;

        case 'video-thumbnail':
            if (cleanFilename.includes('videos/images/')) {
                return `${baseUploadUrl}/${cleanFilename}`;
            }
            return `${baseUploadUrl}/videos/images/${cleanFilename}`;

        case 'paper':
            // Check if it already has the relative path (papers/mcq/... or papers/structure-essay/...)
            if (cleanFilename.includes('papers/')) {
                return `${baseUploadUrl}/${cleanFilename}`;
            }
            // Fallback for legacy or partial paths
            return `${baseUploadUrl}/papers/pdf-papers/${cleanFilename}`;

        case 'paper-thumbnail':
            if (cleanFilename.includes('papers/')) {
                return `${baseUploadUrl}/${cleanFilename}`;
            }
            return `${baseUploadUrl}/papers/images/${cleanFilename}`;

        case 'image':
        default:
            // Check if it starts with uploads/ (common in some parts of the app)
            if (cleanFilename.startsWith('uploads/')) {
                const actualPath = cleanFilename.replace('uploads/', '');
                return `${baseUploadUrl}/${actualPath}`;
            }
            return `${baseUploadUrl}/${cleanFilename}`;
    }
};
