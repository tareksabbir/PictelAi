// adjust the path
import { GET, PUT } from "@/app/api/frames/route";
import db from "@/config/db";
import { NextRequest } from "next/server";

// Mock the DB methods
jest.mock("@/config/db", () => ({
  select: jest.fn().mockReturnThis(),
  update: jest.fn().mockReturnThis(),
  from: jest.fn().mockReturnThis(),
  set: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
}));

describe("Frame API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET", () => {
    it("should return frame data with chat messages", async () => {
      // Mock DB return values
      (db.select as jest.Mock).mockReturnValueOnce([
        { frameId: "f1", projectId: "p1", designCode: "<div>test</div>" },
      ]);
      (db.select as jest.Mock).mockReturnValueOnce([
        { chatMessage: "Hello world!" },
      ]);

      const req = new NextRequest("http://localhost/api/frame?frameId=f1&projectId=p1");
      const res = await GET(req);

      const data = await res.json();

      expect(data).toEqual({
        frameId: "f1",
        projectId: "p1",
        designCode: "<div>test</div>",
        chatMessages: "Hello world!",
      });
    });
  });

  describe("PUT", () => {
    it("should update the design code and return result", async () => {
      // Mock DB update
      (db.update as jest.Mock).mockReturnValueOnce({ rowCount: 1 });

      const req = new NextRequest("http://localhost/api/frame", {
        method: "PUT",
        body: JSON.stringify({
          frameId: "f1",
          projectId: "p1",
          designCode: "<div>updated</div>",
        }),
      });

      const res = await PUT(req);
      const data = await res.json();

      expect(data).toEqual({ result: "updated" });
      expect(db.update).toHaveBeenCalled();
    });
  });
});
