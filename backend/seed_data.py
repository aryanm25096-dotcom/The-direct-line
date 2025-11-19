"""Seed initial tickets data"""
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

async def seed_tickets():
    """Seed initial ticket data"""
    
    # Clear existing tickets
    await db.tickets.delete_many({})
    
    now = datetime.utcnow()
    
    tickets = [
        {
            "ticketId": "TICK-001",
            "description": "Large pothole near Tea Lobby Cafe causing traffic issues",
            "location": "Tea Lobby Cafe, Gwalior",
            "category": "Roads & Infrastructure",
            "status": "Pending",
            "createdAt": now - timedelta(hours=2),
            "reportedBy": "Rajesh Kumar",
            "dispatchedAt": None,
            "resolvedAt": None
        },
        {
            "ticketId": "TICK-002",
            "description": "Garbage not collected for 3 days, causing health hazard",
            "location": "Lashkar Area, Gwalior",
            "category": "Sanitation",
            "status": "Dispatched",
            "createdAt": now - timedelta(hours=5),
            "reportedBy": "Priya Sharma",
            "dispatchedAt": now - timedelta(hours=1),
            "resolvedAt": None
        },
        {
            "ticketId": "TICK-003",
            "description": "Street light not working for past week",
            "location": "City Center, Gwalior",
            "category": "Electricity",
            "status": "Pending",
            "createdAt": now - timedelta(hours=8),
            "reportedBy": "Amit Verma",
            "dispatchedAt": None,
            "resolvedAt": None
        },
        {
            "ticketId": "TICK-004",
            "description": "Water pipe leaking causing road flooding",
            "location": "Madhav Nagar, Gwalior",
            "category": "Water Supply",
            "status": "Resolved",
            "createdAt": now - timedelta(days=1),
            "reportedBy": "Sunita Gupta",
            "dispatchedAt": now - timedelta(hours=20),
            "resolvedAt": now - timedelta(hours=12)
        },
        {
            "ticketId": "TICK-005",
            "description": "Broken pavement near school entrance creating danger for children",
            "location": "Model School Road, Gwalior",
            "category": "Public Safety",
            "status": "Pending",
            "createdAt": now - timedelta(hours=12),
            "reportedBy": "Mohan Singh",
            "dispatchedAt": None,
            "resolvedAt": None
        },
        {
            "ticketId": "TICK-006",
            "description": "Illegal dumping of construction waste",
            "location": "Residency Area, Gwalior",
            "category": "Sanitation",
            "status": "Dispatched",
            "createdAt": now - timedelta(hours=15),
            "reportedBy": "Kavita Rao",
            "dispatchedAt": now - timedelta(hours=3),
            "resolvedAt": None
        }
    ]
    
    result = await db.tickets.insert_many(tickets)
    print(f"✓ Seeded {len(result.inserted_ids)} tickets")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(seed_tickets())
