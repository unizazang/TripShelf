import Link from "next/link";
import { getTrips } from "@/services/trips";

export default async function HomePage() {
  const trips = await getTrips();

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <section className="rounded-3xl border bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">TripShelf</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight">
              여행 기록을 남기고,
              <br />
              그 기록을 책으로 연결하는 콘텐츠 서비스
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-gray-600">
              여행별로 사진과 글을 기록하고, 완성된 기록을 나중에 책 주문으로
              이어갈 수 있습니다.
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              href="/trips/new"
              className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white"
            >
              새 여행 만들기
            </Link>

            <Link
              href="/orders"
              className="rounded-lg border px-4 py-2 text-sm font-medium"
            >
              주문 목록
            </Link>
          </div>
        </div>
      </section>

      <section className="mt-10">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold">여행 목록</h2>
            <p className="mt-1 text-sm text-gray-500">
              지금까지 만든 여행 콘텐츠를 확인할 수 있습니다.
            </p>
          </div>
          <span className="text-sm text-gray-500">총 {trips.length}개</span>
        </div>

        {trips.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed p-10 text-center text-sm text-gray-500">
            아직 여행이 없습니다. 첫 여행을 만들어보세요.
          </div>
        ) : (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {trips.map((trip) => (
              <Link
                key={trip.id}
                href={`/trips/${trip.id}`}
                className="overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:-translate-y-1"
              >
                <div className="aspect-[4/3] bg-gray-100">
                  {trip.coverImageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={trip.coverImageUrl}
                      alt={trip.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-gray-400">
                      이미지 없음
                    </div>
                  )}
                </div>

                <div className="space-y-2 p-4">
                  <h3 className="text-lg font-semibold">{trip.title}</h3>
                  <p className="text-sm text-gray-600">{trip.destination}</p>
                  <p className="text-xs text-gray-500">
                    {trip.startDate} ~ {trip.endDate}
                  </p>
                  {trip.description ? (
                    <p className="line-clamp-2 text-sm leading-6 text-gray-600">
                      {trip.description}
                    </p>
                  ) : null}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}