import Link from "next/link";
import { notFound } from "next/navigation";
import ExportButton from "@/components/orders/export-button";
import OrderStatusForm from "@/components/orders/order-status-form";
import { getOrderById } from "@/services/orders";

function getStatusLabel(status: string) {
  if (status === "pending") return "대기중";
  if (status === "processing") return "처리중";
  if (status === "completed") return "완료";
  return status;
}

type OrderDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function OrderDetailPage({
  params,
}: OrderDetailPageProps) {
  const { id } = await params;

  const order = await getOrderById(id);

  if (!order) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">주문 상세</h1>
          <p className="mt-2 text-sm text-gray-600">
            주문 정보를 확인하고 상태를 변경할 수 있습니다.
          </p>
        </div>

        <Link
          href="/orders"
          className="rounded-lg border px-4 py-2 text-sm font-medium"
        >
          주문 목록으로
        </Link>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">주문 정보</h2>

          <div className="mt-6 space-y-4 text-sm">
            <div>
              <p className="text-gray-500">책 제목</p>
              <p className="mt-1 font-medium">{order.bookTitle}</p>
            </div>

            <div>
              <p className="text-gray-500">부제</p>
              <p className="mt-1 font-medium">{order.subtitle ?? "-"}</p>
            </div>

            <div>
              <p className="text-gray-500">테마</p>
              <p className="mt-1 font-medium">{order.theme}</p>
            </div>

            <div>
              <p className="text-gray-500">현재 상태</p>
              <p className="mt-1 font-medium">{getStatusLabel(order.status)}</p>
            </div>

            <div>
              <p className="text-gray-500">주문 대상 여행</p>
              <p className="mt-1 font-medium">
                {order.trip?.title ?? "알 수 없음"}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                {order.trip?.destination ?? ""}
              </p>
            </div>
          </div>

          <div className="mt-8">
            <ExportButton orderId={order.id} />
          </div>
        </section>

        <aside className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">상태 관리</h2>
          <p className="mt-2 text-sm text-gray-600">
            주문 진행 상태를 단계별로 변경할 수 있습니다.
          </p>

          <div className="mt-6">
            <OrderStatusForm
              orderId={order.id}
              currentStatus={order.status}
            />
          </div>
        </aside>
      </div>
    </main>
  );
}