import Link from "next/link";
import { notFound } from "next/navigation";
import EntryForm from "@/components/entries/entry-form";
import EntryItem from "@/components/entries/entry-item";
import OrderForm from "@/components/orders/order-form";
import { getEntriesByTripId } from "@/services/entries";
import { getTripById } from "@/services/trips";

type TripDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function TripDetailPage({
  params,
}: TripDetailPageProps) {
  const { id } = await params;

  const trip = await getTripById(id);

  if (!trip) {
    notFound();
  }

  const entries = await getEntriesByTripId(id);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <section className="overflow-hidden rounded-3xl border bg-white shadow-sm">
        <div className="aspect-[16/6] bg-gray-100">
          {trip.coverImageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={trip.coverImageUrl}
              alt={trip.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-gray-400">
              대표 이미지 없음
            </div>
          )}
        </div>

        <div className="space-y-3 p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm text-gray-500">{trip.destination}</p>
              <h1 className="mt-1 text-3xl font-bold">{trip.title}</h1>
            </div>

            <div className="flex gap-3">
              <Link
                href="/"
                className="rounded-lg border px-4 py-2 text-sm font-medium"
              >
                홈으로
              </Link>
              <Link
                href="/orders"
                className="rounded-lg border px-4 py-2 text-sm font-medium"
              >
                주문 목록
              </Link>
            </div>
          </div>

          <p className="text-sm text-gray-500">
            {trip.startDate} ~ {trip.endDate}
          </p>

          {trip.description ? (
            <p className="text-sm leading-6 text-gray-700">{trip.description}</p>
          ) : null}
        </div>
      </section>

      <section className="mt-10 grid gap-8 lg:grid-cols-[1.3fr_0.9fr]">
        <div>
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold">여행 기록</h2>
              <p className="mt-1 text-sm text-gray-500">
                이 여행에 쌓인 콘텐츠 목록입니다.
              </p>
            </div>
            <span className="text-sm text-gray-500">총 {entries.length}개</span>
          </div>

          {entries.length === 0 ? (
            <div className="rounded-2xl border border-dashed p-10 text-center text-sm text-gray-500">
              아직 기록이 없습니다. 오른쪽에서 첫 기록을 추가해보세요.
            </div>
          ) : (
            <div className="space-y-4">
              {entries.map((entry) => (
                <EntryItem key={entry.id} entry={entry} />
              ))}
            </div>
          )}
        </div>

        <aside className="space-y-6">
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold">기록 추가</h2>
            <p className="mt-2 text-sm text-gray-600">
              이 여행에 새로운 하루의 기록을 남겨보세요.
            </p>

            <div className="mt-6">
              <EntryForm tripId={trip.id} />
            </div>
          </div>

          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold">책 주문</h2>
            <p className="mt-2 text-sm text-gray-600">
              현재 여행 기록을 바탕으로 책 주문을 생성합니다.
            </p>

            <div className="mt-6">
              <OrderForm tripId={trip.id} tripTitle={trip.title} />
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}