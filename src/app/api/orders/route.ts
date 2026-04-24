import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

const allowedThemes = ["basic", "photo", "diary"] as const;

export async function POST(request: Request) {

  const db = getDb();
  try {
    const body = await request.json();

    const tripId = String(body.tripId ?? "").trim();
    const bookTitle = String(body.bookTitle ?? "").trim();
    const subtitle = String(body.subtitle ?? "").trim();
    const theme = String(body.theme ?? "").trim();

    if (!tripId) {
      return NextResponse.json(
        { message: "주문할 여행 정보가 필요합니다." },
        { status: 400 }
      );
    }

    if (!bookTitle) {
      return NextResponse.json(
        { message: "책 제목은 필수입니다." },
        { status: 400 }
      );
    }

    if (!allowedThemes.includes(theme as (typeof allowedThemes)[number])) {
      return NextResponse.json(
        { message: "올바른 테마를 선택해주세요." },
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
      insert into print_orders (
        trip_id,
        book_title,
        subtitle,
        theme,
        include_scope,
        status
      )
      values ($1, $2, $3, $4, 'all', 'pending')
      returning *
      `,
      [tripId, bookTitle, subtitle || null, theme]
    );

    return NextResponse.json({ order: result.rows[0] }, { status: 201 });
  } catch (error) {
    console.error("POST /api/orders error:", error);

    return NextResponse.json(
      { message: "주문 생성에 실패했습니다." },
      { status: 500 }
    );
  }
}