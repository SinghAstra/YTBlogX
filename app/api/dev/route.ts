import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const users = await prisma.user.deleteMany();

    return Response.json({ users }, { status: 201 });
  } catch (error) {
    if (error instanceof Error) {
      console.log("error.stack is ", error.stack);
      console.log("error.message is ", error.message);
    }
    return Response.json({ message: "Failed to fetch User" }, { status: 500 });
  }
}
