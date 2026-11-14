CREATE EXTENSION IF NOT EXISTS vector;
--> statement-breakpoint

ALTER TABLE "knowledge_source_chunks"
ADD COLUMN "embedding" vector(768);