import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/prismicio";
import * as z from "zod";

const revalidateSchema = z.object({
  secret: z.string(),
  documents: z.array(z.string()),
});

export async function GET(req: NextRequest) {
  console.log("This is a get request!");
  const body = req.body;
  console.dir({ body, url: req.url }, { depth: null });
  // console.dir({ req }, { depth: null });
  return NextResponse.json({ message: "GETTTTT" }, { status: 200 });
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  console.log("Body:");
  console.dir(body, { depth: null });

  try {
    const parsedBody = revalidateSchema.parse(body);

    if (parsedBody.secret !== process.env.REVALIDATE_SECRET_KEY) {
      console.log("Invalid secret key");
      return NextResponse.json(
        { message: "Invalid token", revalidated: false },
        { status: 401 }
      );
    }

    const client = createClient();

    await Promise.all(
      parsedBody.documents.map(async (documentId) => {
        const doc = await client.getByID(documentId);
        revalidatePath(doc.url ?? "/");
      })
    );

    return NextResponse.json(
      { revalidated: true, now: Date.now() },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(error.issues, { status: 422 });
    }

    return NextResponse.json(null, { status: 500 });
  }
}
