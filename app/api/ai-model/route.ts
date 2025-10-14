import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "alibaba/tongyi-deepresearch-30b-a3b:free",
        messages,
        stream: true,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:3000",
          "X-Title": "My Next.js App",
        },
        responseType: "stream",
      }
    );

    const stream = response.data;
    const encoder = new TextEncoder();

    const readable = new ReadableStream({
      async start(controller) {
        let closed = false;
        let buffer = ""; // Buffer for incomplete chunks

        const closeSafely = () => {
          if (!closed) {
            closed = true;
            controller.close();
          }
        };

        stream.on("data", (chunk: any) => {
          // Append new chunk to buffer
          buffer += chunk.toString();

          // Split by double newline (SSE message separator)
          const lines = buffer.split("\n");

          // Keep the last incomplete line in buffer
          buffer = lines.pop() || "";

          for (const line of lines) {
            const trimmedLine = line.trim();

            // Skip empty lines
            if (!trimmedLine) continue;

            // Skip SSE comments (lines starting with ':')
            if (trimmedLine.startsWith(":")) continue;

            // Check for [DONE] signal
            if (trimmedLine.includes("[DONE]")) {
              closeSafely();
              return;
            }

            // Process data lines
            if (trimmedLine.startsWith("data:")) {
              const jsonStr = trimmedLine.slice(5).trim(); // Remove 'data:' prefix

              // Skip if empty or [DONE]
              if (!jsonStr || jsonStr === "[DONE]") {
                if (jsonStr === "[DONE]") {
                  closeSafely();
                  return;
                }
                continue;
              }

              try {
                const data = JSON.parse(jsonStr);

                // Handle potential error in stream
                if (data.error) {
                  console.error("Stream error:", data.error);
                  if (!closed) {
                    controller.error(
                      new Error(data.error.message || "Stream error")
                    );
                  }
                  return;
                }

                const text = data.choices?.[0]?.delta?.content;
                if (text && !closed) {
                  controller.enqueue(encoder.encode(text));
                }
              } catch (err) {
                // Log but don't crash on parse errors
                console.error("Error parsing JSON:", jsonStr, err);
              }
            }
          }
        });

        stream.on("end", () => {
          closeSafely();
        });

        stream.on("error", (err: any) => {
          console.error("Stream error:", err);
          if (!closed) {
            controller.error(err);
          }
        });
      },
    });

    return new NextResponse(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error: any) {
    console.error("API error:", error);
    return NextResponse.json(
      {
        error: "Something went wrong",
        message: error.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}
// import { NextRequest, NextResponse } from "next/server";
// import axios from "axios";

// export async function POST(req: NextRequest) {
//   try {
//     const { messages } = await req.json();

//     const response = await axios.post(
//       "https://openrouter.ai/api/v1/chat/completions",
//       {
//         model: "alibaba/tongyi-deepresearch-30b-a3b:free", // or any OpenRouter-supported model
//         messages,
//         stream: true, // enable streaming
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
//           "Content-Type": "application/json",
//           "HTTP-Referer": "http://localhost:3000", // optional
//           "X-Title": "My Next.js App", // optional
//         },
//         responseType: "stream", // important for streaming
//       }
//     );

//     const stream = response.data;

//     // Return as a web stream so frontend can consume
//     const encoder = new TextEncoder();
//     const readable = new ReadableStream({
//       async start(controller) {
//         let closed = false;

//         const closeSafely = () => {
//           if (!closed) {
//             closed = true;
//             controller.close();
//           }
//         };

//         stream.on("data", (chunk: any) => {
//           const payloads = chunk.toString().split("\n\n");
//           for (const payload of payloads) {
//             if (payload.includes("[DONE]")) {
//               closeSafely();
//               return;
//             }
//             if (payload.startsWith("data:")) {
//               try {
//                 const data = JSON.parse(payload.replace("data:", ""));
//                 const text = data.choices[0]?.delta?.content;
//                 if (text && !closed) {
//                   controller.enqueue(encoder.encode(text));
//                 }
//               } catch (err) {
//                 console.error("Error parsing stream", err);
//               }
//             }
//           }
//         });

//         stream.on("end", () => {
//           closeSafely();
//         });

//         stream.on("error", (err: any) => {
//           console.error("Stream error", err);
//           if (!closed) controller.error(err);
//         });
//       },
//     });

//     return new NextResponse(readable, {
//       headers: {
//         "Content-Type": "text/plain; charset=utf-8",
//         "Transfer-Encoding": "chunked",
//       },
//     });
//   } catch (error) {
//     console.error("API error:", error);
//     return NextResponse.json(
//       { error: "Something went wrong" },
//       { status: 500 }
//     );
//   }
// }
