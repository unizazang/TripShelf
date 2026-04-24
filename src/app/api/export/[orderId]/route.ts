import { getOrderExportData } from "@/services/orders";
import { getDb } from "@/lib/db";


type RouteContext = {
  params: Promise<{ orderId: string }>;
};

export async function GET(_request: Request, { params }: RouteContext) {

  const db = getDb();
  const { orderId } = await params;

  const exportData = await getOrderExportData(orderId);

  if (!exportData) {
    return Response.json(
      { message: "주문 데이터를 찾을 수 없습니다." },
      { status: 404 }
    );
  }

  const safeTitle = exportData.order.bookTitle
    .replace(/[^\w가-힣-]+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "");

  const fileName = `${safeTitle || "order-export"}-${orderId.slice(0, 8)}.json`;

  return new Response(JSON.stringify(exportData, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="${fileName}"`,
    },
  });
}