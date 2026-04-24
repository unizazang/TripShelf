export const dynamic = "force-dynamic";

import Link from "next/link";
import { getOrders } from "@/services/orders";

function getStatusLabel(status: string) {
  if (status === "pending") return "대기중";
  if (status === "processing") return "처리중";
  if (status === "completed") return "완료";
  return status;
}

export default async function OrdersPage() {
  const orders = await getOrders();

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">주문 목록</h1>
          <p className="mt-2 text-sm text-gray-600">
            생성된 책 주문과 현재 상태를 확인할 수 있습니다.
          </p>
        </div>

        <Link
          href="/"
          className="rounded-lg border px-4 py-2 text-sm font-medium"
        >
          홈으로
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed p-10 text-center text-sm text-gray-500">
          아직 생성된 주문이 없습니다.
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/orders/${order.id}`}
              className="block rounded-2xl border bg-white p-5 shadow-sm transition hover:-translate-y-0.5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold">{order.bookTitle}</h2>
                  <p className="mt-1 text-sm text-gray-600">
                    여행: {order.trip?.title ?? order.tripId}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    테마: {order.theme}
                  </p>
                </div>

                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                  {getStatusLabel(order.status)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}