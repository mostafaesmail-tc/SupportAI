export interface SearchResult {
  content: string;
  distance: number;
  sourceId: string;
  sourceTitle: string;
  chunkIndex: number;
}