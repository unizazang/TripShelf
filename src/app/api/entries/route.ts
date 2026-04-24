import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function POST(request: Request) {

  const db = getDb();
  try {
    const body = await request.json();

    const tripId = String(body.tripId ?? "").trim();
    const entryDate = String(body.entryDate ?? "").trim();
    const title = String(body.title ?? "").trim();
    const content = String(body.content ?? "").trim();
    const imageUrl = String(body.imageUrl ?? "").trim();
    const moodTag = String(body.moodTag ?? "").trim();

    if (!tripId) {
      return NextResponse.json(
        { message: "여행 ID가 필요합니다." },
        { status: 400 }
      );
    }

    if (!entryDate) {
      return NextResponse.json(
        { message: "기록 날짜는 필수입니다." },
        { status: 400 }
      );
    }

    if (!title) {
      return NextResponse.json(
        { message: "기록 제목은 필수입니다." },
        { status: 400 }
      );
    }

    if (!content) {
      return NextResponse.json(
        { message: "기록 내용은 필수입니다." },
        { status: 400 }
      );
    }

    const tripCheck = await db.query(
      `
      select id
      from trips
      where id = $1
      limit 1
      `,
      [tripId]
    );

    if (tripCheck.rows.length === 0) {
      return NextResponse.json(
        { message: "존재하지 않는 여행입니다." },
        { status: 404 }
      );
    }

    const result = await db.query(
      `
      insert into trip_entries (
        trip_id,
        entry_date,
        title,
        content,
        image_url,
        mood_tag
      )
      values ($1, $2, $3, $4, $5, $6)
      returning *
      `,
      [tripId, entryDate, title, content, imageUrl || null, moodTag || null]
    );

    return NextResponse.json({ entry: result.rows[0] }, { status: 201 });
  } catch (error) {
    console.error("POST /api/entries error:", error);

    return NextResponse.json(
      { message: "기록 저장에 실패했습니다." },
      { status: 500 }
    );
  }
}