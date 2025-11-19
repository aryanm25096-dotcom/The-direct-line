from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class TicketCreate(BaseModel):
    description: str
    location: str
    reportedBy: Optional[str] = "Anonymous"

class TicketStatusUpdate(BaseModel):
    status: str

class Ticket(BaseModel):
    id: str
    description: str
    location: str
    category: str
    status: str
    createdAt: datetime
    reportedBy: str
    dispatchedAt: Optional[datetime] = None
    resolvedAt: Optional[datetime] = None
