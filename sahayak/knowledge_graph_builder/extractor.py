import os
from pydantic import BaseModel, Field
from typing import List, Optional
from google import genai
from google.genai import types

# Initialize Gemini Client
# It will automatically pick up GOOGLE_API_KEY from environment variables
client = genai.Client()

# Define the structured output schema for the Knowledge Graph

class Node(BaseModel):
    id: str = Field(description="A unique identifier for the node (e.g., 'dr_john_smith', 'dataset_x').")
    label: str = Field(description="The type of the node. Must be one of: Researcher, Department, Paper, Dataset, Methodology, Concept, CodeRepo.")
    properties: dict = Field(description="Key-value pairs of additional properties (e.g., {'name': 'John Smith', 'title': 'Professor'}).")

class Edge(BaseModel):
    source_id: str = Field(description="The ID of the source node.")
    target_id: str = Field(description="The ID of the target node.")
    relationship_type: str = Field(description="The type of relationship. Must be one of: AUTHORED, AFFILIATED_WITH, USES_DATASET, USES_METHODOLOGY, REFERENCES, EXPLORES_CONCEPT.")
    properties: dict = Field(default_factory=dict, description="Optional properties for the edge (e.g., {'year': '2023'}).")

class KnowledgeGraph(BaseModel):
    nodes: List[Node] = Field(description="List of nodes extracted from the text.")
    edges: List[Edge] = Field(description="List of edges (relationships) extracted from the text.")

def extract_entities_and_relationships(text: str) -> KnowledgeGraph:
    """
    Extracts entities and relationships from unstructured text to build a knowledge graph.
    """
    prompt = f"""
    You are an expert researcher building a university knowledge graph.
    Analyze the following text and extract entities and their relationships.
    Identify Researchers, Departments, Papers, Datasets, Methodologies, Concepts, and CodeRepos.
    Identify how they are connected (AUTHORED, AFFILIATED_WITH, USES_DATASET, etc.).
    
    Text:
    {text}
    """
    
    response = client.models.generate_content(
        model='gemini-2.5-pro',
        contents=prompt,
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema=KnowledgeGraph,
            temperature=0.1,
        ),
    )
    
    # Parse the structured JSON response into our Pydantic model
    # response.parsed will contain the KnowledgeGraph object if structured output is successful
    if response.parsed:
        return response.parsed
    else:
        # Fallback parsing if needed
        import json
        data = json.loads(response.text)
        return KnowledgeGraph(**data)

def generate_embeddings(text: str) -> List[float]:
    """
    Generates text embeddings for semantic search.
    """
    response = client.models.embed_content(
        model='text-embedding-004',
        contents=text,
    )
    return response.embeddings[0].values
