import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    const body = await request.json();

    const entryDate = String(body.entryDate ?? "").trim();
    const title = String(body.title ?? "").trim();
    const content = String(body.content ?? "").trim();
    const imageUrl = String(body.imageUrl ?? "").trim();
    const moodTag = String(body.moodTag ?? "").trim();

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

    const db = getDb();

    const result = await db.query(
      `
      update trip_entries
      set
        entry_date = $1,
        title = $2,
        content = $3,
        image_url = $4,
        mood_tag = $5,
        updated_at = now()
      where id = $6
      returning *
      `,
      [entryDate, title, content, imageUrl || null, moodTag || null, id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { message: "기록을 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    return NextResponse.json({ entry: result.rows[0] }, { status: 200 });
  } catch (error) {
    console.error("PATCH /api/entries/[id] error:", error);

    return NextResponse.json(
      { message: "기록 수정에 실패했습니다." },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;

    const db = getDb();

    const result = await db.query(
      `
      delete from trip_entries
      where id = $1
      returning id
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { message: "기록을 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("DELETE /api/entries/[id] error:", error);

    return NextResponse.json(
      { message: "기록 삭제에 실패했습니다." },
      { status: 500 }
    );
  }
}