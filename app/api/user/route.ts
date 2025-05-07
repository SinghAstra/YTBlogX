import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return Response.json(
        { message: "Sign In to Get Started" },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    const user = await prisma.account.findFirst({
      where: {
        userId,
      },
    });

    return Response.json({ user }, { status: 201 });
  } catch (error) {
    if (error instanceof Error) {
      console.log("error.stack is ", error.stack);
      console.log("error.message is ", error.message);
    }
    return Response.json({ message: "Failed to fetch User" }, { status: 500 });
  }
}
