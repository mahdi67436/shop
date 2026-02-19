"""
WebSocket Router for Real-time Features
"""
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import Dict, Set

router = APIRouter()


class ConnectionManager:
    """Manages WebSocket connections"""
    
    def __init__(self):
        # user_id -> websocket
        self.active_connections: Dict[str, WebSocket] = {}
        # room_id -> set of user_ids
        self.rooms: Dict[str, Set[str]] = {}
    
    async def connect(self, websocket: WebSocket, user_id: str):
        await websocket.accept()
        self.active_connections[user_id] = websocket
    
    def disconnect(self, user_id: str):
        if user_id in self.active_connections:
            del self.active_connections[user_id]
        
        # Remove from all rooms
        for room_id in self.rooms:
            if user_id in self.rooms[room_id]:
                self.rooms[room_id].discard(user_id)
    
    async def send_personal_message(self, message: dict, user_id: str):
        if user_id in self.active_connections:
            await self.active_connections[user_id].send_json(message)
    
    async def broadcast(self, message: dict, room_id: str = None):
        if room_id:
            # Send to specific room
            for user_id in self.rooms.get(room_id, set()):
                await self.send_personal_message(message, user_id)
        else:
            # Send to all
            for connection in self.active_connections.values():
                await connection.send_json(message)


manager = ConnectionManager()


@router.websocket("/connect")
async def websocket_endpoint(websocket: WebSocket):
    """WebSocket endpoint for real-time communication"""
    user_id = None
    
    try:
        # Get user_id from query params or first message
        await websocket.accept()
        
        # Wait for first message to authenticate
        data = await websocket.receive_json()
        user_id = data.get("user_id")
        
        if user_id:
            await manager.connect(websocket, user_id)
            
            while True:
                data = await websocket.receive_json()
                message_type = data.get("type")
                
                if message_type == "join_room":
                    room_id = data.get("room_id")
                    if room_id:
                        if room_id not in manager.rooms:
                            manager.rooms[room_id] = set()
                        manager.rooms[room_id].add(user_id)
                
                elif message_type == "leave_room":
                    room_id = data.get("room_id")
                    if room_id and room_id in manager.rooms:
                        manager.rooms[room_id].discard(user_id)
                
                elif message_type == "ping":
                    await manager.send_personal_message({"type": "pong"}, user_id)
                    
    except WebSocketDisconnect:
        if user_id:
            manager.disconnect(user_id)
