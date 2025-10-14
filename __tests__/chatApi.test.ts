// adjust the path

import { PUT } from "@/app/api/chats/route";
import db from "@/config/db";
import { NextResponse, NextRequest } from "next/server";

// Mock the DB methods
jest.mock("@/config/db", () => ({
  update: jest.fn().mockReturnThis(),
  set: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
}));

describe("Chat API PUT", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should update chat messages and return result", async () => {
    // Mock DB update
    (db.update as jest.Mock).mockReturnValueOnce({ rowCount: 1 });

    // Create fake request
    const req = new NextRequest("http://localhost/api/chat", {
      method: "PUT",
      body: JSON.stringify({
        frameId: "f1",
        messages: "Updated chat message",
      }),
    });

    // Call the PUT handler
    const res = await PUT(req as any); // cast to any to satisfy TypeScript
    const data = await res.json();

    // Expectations
    expect(data).toEqual({ result: "updated" });
    expect(db.update).toHaveBeenCalledWith(expect.anything()); // check that update was called
    // @ts-ignore
    expect(db.set).toHaveBeenCalledWith({ chatMessage: "Updated chat message" });
    // @ts-ignore
    expect(db.where).toHaveBeenCalled();
  });
});
