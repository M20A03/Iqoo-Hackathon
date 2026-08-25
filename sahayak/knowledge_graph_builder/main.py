from fastapi import FastAPI, UploadFile, File, HTTPException
from pydantic import BaseModel
import uvicorn
import os

app = FastAPI(title="University Knowledge Graph Builder API")

class ProcessTextRequest(BaseModel):
    content: str
    source_type: str # e.g., 'markdown', 'code'
    metadata: dict = {}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

from extractor import extract_entities_and_relationships, generate_embeddings
from database import insert_graph_data, search_similar_documents

class SearchRequest(BaseModel):
    query: str
    limit: int = 5

@app.post("/ingest/text")
async def ingest_text(request: ProcessTextRequest):
    try:
        # Extract Graph Data
        graph_data = extract_entities_and_relationships(request.content)
        
        # Generate embedding for the full document content (for semantic search)
        doc_embedding = generate_embeddings(request.content)
        
        # Insert into AlloyDB
        insert_graph_data(graph_data, request.content, doc_embedding)
        
        return {
            "message": "Text processed successfully",
            "extracted_nodes_count": len(graph_data.nodes),
            "extracted_edges_count": len(graph_data.edges),
            "status": "success"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/search")
async def search(request: SearchRequest):
    try:
        query_embedding = generate_embeddings(request.query)
        results = search_similar_documents(query_embedding, request.limit)
        return {"results": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/ingest/file")
async def ingest_file(file: UploadFile = File(...)):
    # TODO: Implement PDF/File parsing
    return {"filename": file.filename, "message": "File received for processing"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=int(os.environ.get("PORT", 8080)))
