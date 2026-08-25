-- schema.sql
CREATE EXTENSION IF NOT EXISTS vector;

-- Table to store nodes in the Knowledge Graph
CREATE TABLE IF NOT EXISTS graph_nodes (
    id VARCHAR(255) PRIMARY KEY,
    label VARCHAR(50) NOT NULL,
    properties JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table to store edges (relationships)
CREATE TABLE IF NOT EXISTS graph_edges (
    id SERIAL PRIMARY KEY,
    source_id VARCHAR(255) REFERENCES graph_nodes(id) ON DELETE CASCADE,
    target_id VARCHAR(255) REFERENCES graph_nodes(id) ON DELETE CASCADE,
    relationship_type VARCHAR(50) NOT NULL,
    properties JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_edge UNIQUE (source_id, target_id, relationship_type)
);

-- Table to store document embeddings for vector search
CREATE TABLE IF NOT EXISTS document_embeddings (
    id SERIAL PRIMARY KEY,
    source_id VARCHAR(255), -- Could be a reference to a document node
    content TEXT,
    embedding VECTOR(768), -- Vertex AI text-embedding-004 is 768 dimensions by default
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_graph_nodes_label ON graph_nodes(label);
CREATE INDEX IF NOT EXISTS idx_graph_edges_source ON graph_edges(source_id);
CREATE INDEX IF NOT EXISTS idx_graph_edges_target ON graph_edges(target_id);
CREATE INDEX IF NOT EXISTS document_embeddings_embedding_idx ON document_embeddings USING hnsw (embedding vector_l2_ops);
