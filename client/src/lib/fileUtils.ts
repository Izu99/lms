export type FileType = 'video' | 'paper' | 'image' | 'video-thumbnail' | 'paper-thumbnail';

/**
 * Generates a full URL for a file based on its type and filename.
 * This abstracts the underlying storage structure (local vs cloud).
 * 
 * @param filename The filename or partial path from the database
 * @param type The type of file to determine the base path
 * @returns The full absolute URL to the file
 */
export const getFileUrl = (filename: any, type: FileType): string => {
    if (!filename || typeof filename !== 'string') return '';

    // If it's already a full URL, return it
    if (filename.startsWith('http://') || filename.startsWith('https://')) {
        return filename;
    }

    // Use environment variable directly or fallback to localhost
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";
    const baseUploadUrl = `${baseUrl}/api/uploads`;

    // Remove leading slash if present
    let cleanPath = filename.startsWith('/') ? filename.slice(1) : filename;
    
    // Remove redundant path segments if they exist in the filename string
    // This handles cases where the DB might store "uploads/videos/..." or "api/uploads/..."
    cleanPath = cleanPath.replace(/^api\/uploads\//, '').replace(/^uploads\//, '');

    switch (type) {
        case 'video':
            if (cleanPath.startsWith('videos/files/')) return `${baseUploadUrl}/${cleanPath}`;
            return `${baseUploadUrl}/videos/files/${cleanPath}`;

        case 'video-thumbnail':
            if (cleanPath.startsWith('videos/images/')) return `${baseUploadUrl}/${cleanPath}`;
            return `${baseUploadUrl}/videos/images/${cleanPath}`;

        case 'paper':
            if (cleanPath.startsWith('papers/')) return `${baseUploadUrl}/${cleanPath}`;
            return `${baseUploadUrl}/papers/pdf-papers/${cleanPath}`;

        case 'paper-thumbnail':
            if (cleanPath.startsWith('papers/')) return `${baseUploadUrl}/${cleanPath}`;
            return `${baseUploadUrl}/papers/images/${cleanPath}`;

        case 'image':
        default:
            return `${baseUploadUrl}/${cleanPath}`;
    }
};
