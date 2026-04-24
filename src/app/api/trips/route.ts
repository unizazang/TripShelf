import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function POST(request: Request) {

  const db = getDb();
  try {
    const body = await request.json();

    const title = String(body.title ?? "").trim();
    const destination = String(body.destination ?? "").trim();
    const startDate = String(body.startDate ?? "").trim();
    const endDate = String(body.endDate ?? "").trim();
    const description = String(body.description ?? "").trim();
    const coverImageUrl = String(body.coverImageUrl ?? "").trim();

    if (!title) {
      return NextResponse.json(
        { message: "여행 제목은 필수입니다." },
        { status: 400 }
      );
    }

    if (!destination) {
      return NextResponse.json(
        { message: "여행지는 필수입니다." },
        { status: 400 }
      );
    }

    if (!startDate || !endDate) {
      return NextResponse.json(
        { message: "시작일과 종료일은 필수입니다." },
        { status: 400 }
      );
    }

    if (new Date(startDate) > new Date(endDate)) {
      return NextResponse.json(
        { message: "종료일은 시작일보다 빠를 수 없습니다." },
        { status: 400 }
      );
    }

    const result = await db.query(
      `
      insert into trips (
        title,
        destination,
        start_date,
        end_date,
        description,
        cover_image_url
      )
      values ($1, $2, $3, $4, $5, $6)
      returning *
      `,
      [
        title,
        destination,
        startDate,
        endDate,
        description || null,
        coverImageUrl || null,
      ]
    );

    return NextResponse.json({ trip: result.rows[0] }, { status: 201 });
  } catch (error) {
    console.error("POST /api/trips error:", error);

    return NextResponse.json(
      { message: "여행 생성에 실패했습니다." },
      { status: 500 }
    );
  }
}