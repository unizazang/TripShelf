import { getOrderExportData } from "@/services/orders";

type RouteContext = {
  params: Promise<{ orderId: string }>;
};

export async function GET(_request: Request, { params }: RouteContext) {
  const { orderId } = await params;

  const exportData = await getOrderExportData(orderId);

  if (!exportData) {
    return Response.json(
      { message: "주문 데이터를 찾을 수 없습니다." },
      { status: 404 }
    );
  }

  const asciiFileName = `order-export-${orderId.slice(0, 8)}.json`;
  const originalFileName = `${exportData.order.bookTitle}-${orderId.slice(0, 8)}.json`;
  const encodedFileName = encodeURIComponent(originalFileName);

  return new Response(JSON.stringify(exportData, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="${asciiFileName}"; filename*=UTF-8''${encodedFileName}`,
    },
  });
}