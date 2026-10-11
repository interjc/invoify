const MAX_SOURCE_BYTES = 15 * 1024 * 1024;
const MAX_SOURCE_PIXELS = 25_000_000;
const MAX_OUTPUT_BYTES = 2 * 1024 * 1024;
const MAX_OUTPUT_EDGE = 1_000;
const MIN_OUTPUT_EDGE = 256;

export type ImageOptimizationErrorCode =
    | "invalidImage"
    | "tooLarge"
    | "processingFailed";

export class ImageOptimizationError extends Error {
    code: ImageOptimizationErrorCode;

    constructor(code: ImageOptimizationErrorCode) {
        super(code);
        this.name = "ImageOptimizationError";
        this.code = code;
    }
}

export const readImageAsDataUrl = (file: File) =>
    new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            if (typeof reader.result === "string") resolve(reader.result);
            else reject(new ImageOptimizationError("processingFailed"));
        };
        reader.onerror = () => reject(new ImageOptimizationError("processingFailed"));
        reader.readAsDataURL(file);
    });

const canvasToBlob = (
    canvas: HTMLCanvasElement,
    type: string,
    quality?: number
) =>
    new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
            (blob) => {
                if (blob) {
                    resolve(blob);
                } else {
                    reject(new ImageOptimizationError("processingFailed"));
                }
            },
            type,
            quality
        );
    });

const hasTransparency = (context: CanvasRenderingContext2D, width: number, height: number) => {
    const { data } = context.getImageData(0, 0, width, height);
    for (let index = 3; index < data.length; index += 4) {
        if (data[index] !== 255) return true;
    }
    return false;
};

/** Decode and downsample a user-selected image before storing it in invoice state. */
export const optimizeUploadedImage = async (file: File): Promise<File> => {
    if (!file.type.startsWith("image/")) {
        throw new ImageOptimizationError("invalidImage");
    }
    if (file.size > MAX_SOURCE_BYTES) {
        throw new ImageOptimizationError("tooLarge");
    }

    let bitmap: ImageBitmap | undefined;
    try {
        try {
            bitmap = await createImageBitmap(file);
        } catch {
            throw new ImageOptimizationError("invalidImage");
        }
        if (!bitmap.width || !bitmap.height) {
            throw new ImageOptimizationError("invalidImage");
        }
        if (bitmap.width * bitmap.height > MAX_SOURCE_PIXELS) {
            throw new ImageOptimizationError("tooLarge");
        }

        const scale = Math.min(1, MAX_OUTPUT_EDGE / Math.max(bitmap.width, bitmap.height));
        let width = Math.max(1, Math.round(bitmap.width * scale));
        let height = Math.max(1, Math.round(bitmap.height * scale));
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d", { alpha: true });
        if (!context) {
            throw new ImageOptimizationError("processingFailed");
        }

        let blob: Blob | undefined;
        while (true) {
            canvas.width = width;
            canvas.height = height;
            context.clearRect(0, 0, width, height);
            context.drawImage(bitmap, 0, 0, width, height);

            const transparent = hasTransparency(context, width, height);
            if (transparent) {
                blob = await canvasToBlob(canvas, "image/png");
            } else {
                for (const quality of [0.88, 0.78, 0.68]) {
                    blob = await canvasToBlob(canvas, "image/jpeg", quality);
                    if (blob && blob.size <= MAX_OUTPUT_BYTES) break;
                }
            }

            const encodedBlob = blob;
            if (!encodedBlob) {
                throw new ImageOptimizationError("processingFailed");
            }
            if (encodedBlob.size <= MAX_OUTPUT_BYTES) break;
            if (Math.max(width, height) <= MIN_OUTPUT_EDGE) {
                throw new ImageOptimizationError("tooLarge");
            }
            width = Math.max(1, Math.round(width * 0.75));
            height = Math.max(1, Math.round(height * 0.75));
        }

        const outputBlob = blob;
        if (!outputBlob) {
            throw new ImageOptimizationError("processingFailed");
        }
        const extension = outputBlob.type === "image/png" ? "png" : "jpg";
        const name = file.name.replace(/\.[^.]+$/, "") || "image";
        return new File([outputBlob], `${name}-optimized.${extension}`, {
            type: outputBlob.type,
            lastModified: file.lastModified,
        });
    } catch (error) {
        if (error instanceof ImageOptimizationError) throw error;
        throw new ImageOptimizationError("processingFailed");
    } finally {
        bitmap?.close();
    }
};
