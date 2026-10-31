CREATE TABLE "knowledge_source_chunks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"knowledge_source_id" uuid NOT NULL,
	"content" text NOT NULL,
	"chunk_index" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "knowledge_source_chunks_source_index_unique" UNIQUE("knowledge_source_id","chunk_index")
);
--> statement-breakpoint
ALTER TABLE "knowledge_source_chunks" ADD CONSTRAINT "knowledge_source_chunks_knowledge_source_id_knowledge_sources_id_fk" FOREIGN KEY ("knowledge_source_id") REFERENCES "public"."knowledge_sources"("id") ON DELETE cascade ON UPDATE no action;