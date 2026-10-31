export interface ChunkingOptions {
    chunkSize?: number;
    overlap?: number;
}
export declare function normalizeText(text: string): string;
export declare function chunkText(input: string, options?: ChunkingOptions): string[];
