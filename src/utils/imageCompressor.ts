/**
 * High-performance client-side image compression utility.
 * Downscales large mobile phone photos (which are typically 3MB-15MB)
 * to web-optimized dimensions (~1200px) and compresses them to ~50KB-120KB JPEG/WebP.
 * Prevents browser localStorage and IndexedDB quota overflow.
 */

export interface CompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  mimeType?: 'image/jpeg' | 'image/webp';
}

export interface CompressionResult {
  dataUrl: string;
  originalSize: number;
  compressedSize: number;
  width: number;
  height: number;
}

const DEFAULT_OPTIONS: Required<CompressionOptions> = {
  maxWidth: 1280,
  maxHeight: 1280,
  quality: 0.78,
  mimeType: 'image/jpeg',
};

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Compresses an uploaded File object (e.g. from file picker or camera).
 */
export async function compressImageFile(
  file: File,
  options?: CompressionOptions
): Promise<CompressionResult> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const originalSize = file.size;

  // Don't compress SVG files or non-images
  if (file.type === 'image/svg+xml') {
    const dataUrl = await fileToDataUrl(file);
    return {
      dataUrl,
      originalSize,
      compressedSize: originalSize,
      width: 0,
      height: 0,
    };
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      try {
        const result = compressCanvasImage(img, opts, originalSize);
        resolve(result);
      } catch (err) {
        reject(err);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Impossible de charger l'image sélectionnée."));
    };

    img.src = objectUrl;
  });
}

/**
 * Compresses an existing base64 Data URL if it exceeds the maximum size.
 */
export async function compressDataUrl(
  dataUrl: string,
  options?: CompressionOptions
): Promise<string> {
  if (!dataUrl.startsWith('data:image/')) {
    return dataUrl;
  }

  // If already under 100KB and not a gigantic image, skip
  const approxSize = Math.round((dataUrl.length * 3) / 4);
  if (approxSize < 90 * 1024 && !dataUrl.includes('image/png')) {
    return dataUrl;
  }

  const opts = { ...DEFAULT_OPTIONS, ...options };

  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      try {
        const result = compressCanvasImage(img, opts, approxSize);
        resolve(result.dataUrl);
      } catch {
        resolve(dataUrl); // Fallback to original
      }
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}

function compressCanvasImage(
  img: HTMLImageElement,
  opts: Required<CompressionOptions>,
  originalSize: number
): CompressionResult {
  let { width, height } = img;

  // Calculate proportional downscaling
  if (width > opts.maxWidth || height > opts.maxHeight) {
    if (width / height > opts.maxWidth / opts.maxHeight) {
      height = Math.round((height * opts.maxWidth) / width);
      width = opts.maxWidth;
    } else {
      width = Math.round((width * opts.maxHeight) / height);
      height = opts.maxHeight;
    }
  }

  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, width);
  canvas.height = Math.max(1, height);

  const ctx = canvas.getContext('2d', { alpha: false });
  if (!ctx) {
    throw new Error('Canvas 2D context not available');
  }

  // Smooth rendering
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  // Fill white background in case of transparent png conversion to jpeg
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, width, height);

  // Draw scaled image
  ctx.drawImage(img, 0, 0, width, height);

  // Export compressed data URL
  let dataUrl = canvas.toDataURL(opts.mimeType, opts.quality);

  // If the result is somehow larger than original, stick with original if available
  let compressedSize = Math.round((dataUrl.length * 3) / 4);

  // If still too large (> 300KB), make another pass with slightly lower quality
  if (compressedSize > 300 * 1024 && opts.quality > 0.6) {
    dataUrl = canvas.toDataURL(opts.mimeType, 0.65);
    compressedSize = Math.round((dataUrl.length * 3) / 4);
  }

  return {
    dataUrl,
    originalSize,
    compressedSize,
    width,
    height,
  };
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string) || '');
    reader.onerror = () => reject(new Error('Erreur de lecture du fichier'));
    reader.readAsDataURL(file);
  });
}
