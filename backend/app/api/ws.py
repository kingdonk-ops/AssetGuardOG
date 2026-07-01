import json
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.agents.rbi_engine import generate_rbi_report

router = APIRouter()


class ConnectionManager:
    def __init__(self):
        self.active: list[WebSocket] = []

    async def connect(self, ws: WebSocket):
        await ws.accept()
        self.active.append(ws)

    def disconnect(self, ws: WebSocket):
        if ws in self.active:
            self.active.remove(ws)

    async def broadcast(self, message: str):
        for conn in self.active:
            try:
                await conn.send_text(message)
            except Exception:
                pass


manager = ConnectionManager()


@router.websocket("/ws/rbi")
async def rbi_websocket(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            payload = json.loads(data)
            report = generate_rbi_report(
                payload.get("asset_name", "Unknown"),
                payload.get("risk_level", "low"),
                payload.get("findings", ""),
            )
            await websocket.send_text(json.dumps({"type": "rbi_report", "data": report}))
    except WebSocketDisconnect:
        manager.disconnect(websocket)
