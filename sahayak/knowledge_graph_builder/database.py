import psycopg2
from psycopg2.extras import Json
from pgvector.psycopg2 import register_vector
import os

def get_db_connection():
    """
    Establish connection to AlloyDB (PostgreSQL).
    Requires environment variables: DB_HOST, DB_NAME, DB_USER, DB_PASSWORD
    """
    conn = psycopg2.connect(
        host=os.environ.get("DB_HOST", "localhost"),
        database=os.environ.get("DB_NAME", "knowledge_graph"),
        user=os.environ.get("DB_USER", "postgres"),
        password=os.environ.get("DB_PASSWORD", "postgres"),
        port=os.environ.get("DB_PORT", "5432")
    )
    # Register pgvector extension
    register_vector(conn)
    return conn

def insert_graph_data(graph_data, document_content: str, embedding: list):
    """
    Inserts extracted nodes, edges, and document embedding into the database.
    """
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            # 1. Insert Nodes
            for node in graph_data.nodes:
                cur.execute(
                    """
                    INSERT INTO graph_nodes (id, label, properties)
                    VALUES (%s, %s, %s)
                    ON CONFLICT (id) DO UPDATE 
                    SET label = EXCLUDED.label, properties = graph_nodes.properties || EXCLUDED.properties
                    """,
                    (node.id, node.label, Json(node.properties))
                )
            
            # 2. Insert Edges
            for edge in graph_data.edges:
                # Basic check to ensure source and target exist 
                # (In a real system, you might want to handle missing nodes gracefully)
                cur.execute(
                    """
                    INSERT INTO graph_edges (source_id, target_id, relationship_type, properties)
                    VALUES (%s, %s, %s, %s)
                    ON CONFLICT (source_id, target_id, relationship_type) DO UPDATE
                    SET properties = graph_edges.properties || EXCLUDED.properties
                    """,
                    (edge.source_id, edge.target_id, edge.relationship_type, Json(edge.properties))
                )
            
            # 3. Insert Document Embedding
            cur.execute(
                """
                INSERT INTO document_embeddings (content, embedding)
                VALUES (%s, %s)
                """,
                (document_content, embedding)
            )
            
        conn.commit()
    except Exception as e:
        conn.rollback()
        raise e
    finally:
        conn.close()

def search_similar_documents(query_embedding: list, limit: int = 5):
    """
    Performs vector search to find similar documents.
    """
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            # Uses the <-> operator for L2 distance, order by closest
            cur.execute(
                """
                SELECT id, content, embedding <-> %s AS distance
                FROM document_embeddings
                ORDER BY embedding <-> %s
                LIMIT %s
                """,
                (query_embedding, query_embedding, limit)
            )
            results = cur.fetchall()
            return [{"id": r[0], "content": r[1], "distance": r[2]} for r in results]
    finally:
        conn.close()
