import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import axios from "axios";
import { prisma } from "@/db/prisma";
import bcrypt from "bcryptjs";


export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ message: "No token provided" }, { status: 401 });
  }

  const token = authHeader.split(" ")[1];
  const body = await req.json();
  const password = body.password;
  if (!password) {
    return NextResponse.json({ message: "Password is missing" }, { status: 400 });
  }
  
  

  try {
    //Get user id from token
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const mongoId = decoded.userId;



    //Get user from mongo
    const { data: mongoUser } = await axios.get(
      `http://localhost:5000/api/users/support/${mongoId}`
    );

    
    let user = await prisma.user.findUnique({
      where: { mongoId },
    });
    

    if (!user ) {
      const passwordMatched = await bcrypt.compare(password, mongoUser.password);
      const hashedPassword = await bcrypt.hash(password,10);
      if (!passwordMatched) {
        return NextResponse.json({ message: "Invalid password" }, { status: 401 });
      }
      
      user = await prisma.user.create({
        data: {
          mongoId,
          name: mongoUser.name,
          email: mongoUser.email,
          password: hashedPassword,
        },
      });

      
    } else {
      
    }
    return NextResponse.json({ user });
  } catch (err: any) {
    console.error("❌ Error in /api/me:", err.message, err.stack);
    return NextResponse.json({ message: "Invalid token or server error", error: err.message }, { status: 500 });
  }
}
