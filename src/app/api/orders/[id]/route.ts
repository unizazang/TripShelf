import { NextResponse } from "next/server";
import { db } from "@/lib/db";

const allowedStatuses = ["pending", "processing", "completed"] as const;

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    const body = await request.json();

    const status = String(body.status ?? "").trim();

    if (!allowedStatuses.includes(status as (typeof allowedStatuses)[number])) {
      return NextResponse.json(
        { message: "올바른 상태값이 아닙니다." },
        { status: 400 }
      );
    }

    const result = await db.query(
      `
      update print_orders
      set
        status = $1,
        updated_at = now()
      where id = $2
      returning *
      `,
      [status, id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { message: "주문을 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    return NextResponse.json({ order: result.rows[0] }, { status: 200 });
  } catch (error) {
    console.error("PATCH /api/orders/[id] error:", error);

    return NextResponse.json(
      { message: "주문 상태 변경에 실패했습니다." },
      { status: 500 }
    );
  }
}