import db from "@/config/db";
import {
  chatTable,
  frameTable,
  projectTable,
  usersTable,
} from "@/config/schema";
import { eq } from "drizzle-orm";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { projectId, frameId, messages, credits } = await req.json();
    const user = await currentUser();

    // Validate user authentication
    if (!user?.primaryEmailAddress?.emailAddress) {
      return NextResponse.json(
        { message: "Unauthorized - Please sign in" },
        { status: 401 }
      );
    }

    // Validate required fields
    if (!projectId || !frameId || !messages) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate credits
    if (credits !== undefined && credits <= 0) {
      return NextResponse.json(
        { message: "Insufficient credits" },
        { status: 400 }
      );
    }

    const userEmail = user.primaryEmailAddress.emailAddress;

    // Create project
    await db.insert(projectTable).values({
      projectId,
      createdBy: userEmail,
    });

    // Create frame
    await db.insert(frameTable).values({
      frameId,
      projectId,
    });

    // Update user credits (only if credits provided)
    if (credits !== undefined) {
      await db
        .update(usersTable)
        .set({
          credits: credits - 1,
        })
        .where(eq(usersTable.email, userEmail));
    }

    // Save user chat
    await db.insert(chatTable).values({
      chatMessage: messages,
      createdBy: userEmail,
      frameId,
    });

    return NextResponse.json(
      { 
        projectId, 
        frameId, 
        messages,
        success: true 
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Error creating project:", error);
    
    // Return a user-friendly error message
    return NextResponse.json(
      { 
        message: "Failed to create project. Please try again.",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

