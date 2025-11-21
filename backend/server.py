from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from datetime import datetime
from typing import List

from models import Ticket, TicketCreate, TicketStatusUpdate
from classifier import classify_issue

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]
tickets_collection = db['tickets']

# Create the main app
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Helper function to generate ticket ID
async def generate_ticket_id() -> str:
    """Generate next ticket ID"""
    count = await tickets_collection.count_documents({})
    return f"TICK-{str(count + 1).zfill(3)}"

@api_router.post("/tickets", response_model=Ticket)
async def create_ticket(ticket_data: TicketCreate):
    """Create a new citizen report"""
    try:
        ticket_id = await generate_ticket_id()
        category = classify_issue(ticket_data.description)
        
        ticket = {
            "ticketId": ticket_id,
            "description": ticket_data.description,
            "location": ticket_data.location,
            "category": category,
            "status": "Pending",
            "createdAt": datetime.utcnow(),
            "reportedBy": ticket_data.reportedBy or "Anonymous",
            "dispatchedAt": None,
            "resolvedAt": None
        }
        
        result = await tickets_collection.insert_one(ticket)
        logger.info(f"Created ticket {ticket_id}")
        
        return Ticket(
            id=ticket_id,
            description=ticket["description"],
            location=ticket["location"],
            category=ticket["category"],
            status=ticket["status"],
            createdAt=ticket["createdAt"],
            reportedBy=ticket["reportedBy"]
        )
    except Exception as e:
        logger.error(f"Error creating ticket: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/tickets", response_model=List[Ticket])
async def get_tickets():
    """Get all tickets"""
    try:
        tickets = await tickets_collection.find().sort("createdAt", -1).to_list(1000)
        
        return [
            Ticket(
                id=ticket["ticketId"],
                description=ticket["description"],
                location=ticket["location"],
                category=ticket["category"],
                status=ticket["status"],
                createdAt=ticket["createdAt"],
                reportedBy=ticket["reportedBy"],
                dispatchedAt=ticket.get("dispatchedAt"),
                resolvedAt=ticket.get("resolvedAt")
            )
            for ticket in tickets
        ]
    except Exception as e:
        logger.error(f"Error fetching tickets: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.patch("/tickets/{ticket_id}/status", response_model=Ticket)
async def update_ticket_status(ticket_id: str, status_update: TicketStatusUpdate):
    """Update ticket status"""
    try:
        update_data = {"status": status_update.status}
        
        if status_update.status == "Dispatched":
            update_data["dispatchedAt"] = datetime.utcnow()
        elif status_update.status == "Resolved":
            update_data["resolvedAt"] = datetime.utcnow()
        
        result = await tickets_collection.find_one_and_update(
            {"ticketId": ticket_id},
            {"$set": update_data},
            return_document=True
        )
        
        if not result:
            raise HTTPException(status_code=404, detail="Ticket not found")
        
        logger.info(f"Updated ticket {ticket_id} to {status_update.status}")
        
        return Ticket(
            id=result["ticketId"],
            description=result["description"],
            location=result["location"],
            category=result["category"],
            status=result["status"],
            createdAt=result["createdAt"],
            reportedBy=result["reportedBy"],
            dispatchedAt=result.get("dispatchedAt"),
            resolvedAt=result.get("resolvedAt")
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating ticket: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Health check
@api_router.get("/")
async def root():
    return {"message": "The Direct Line API", "status": "operational"}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
