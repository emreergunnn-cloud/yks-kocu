import { NextResponse } from "next/server";
import data from "@/data/universities-programs.json";

export async function GET() {
  return NextResponse.json(data);
}