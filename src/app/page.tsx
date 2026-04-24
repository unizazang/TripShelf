export const dynamic = "force-dynamic";

import Link from "next/link";
import { getTrips } from "@/services/trips";

function getTripDuration(startDate: string, endDate: string) {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const diff = end.getTime() - start.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24)) + 1;

  if (Number.isNaN(days) || days <= 0) return null;
  return `${days}일 여행`;
}

export default async function HomePage() {
  const trips = await getTrips();

  const featuredTrip = trips[0] ?? null;
  const totalTrips = trips.length;
  const totalDestinations = new Set(trips.map((trip) => trip.destination)).size;

  return (
    <main className="pb-16 pt-10">
      <div className="container-page">
        {/* Hero */}
        <section className="soft-card overflow-hidden rounded-[32px]">
          <div className="grid gap-8 px-8 py-10 md:px-10 md:py-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div>
              <div className="inline-flex items-center rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-xs font-medium text-slate-600">
                TripShelf · Travel Content Service
              </div>

              <h1 className="mt-5 max-w-3xl text-4xl font-bold leading-tight tracking-tight text-slate-900 md:text-5xl">
                여행 기록을 남기고,
                <br />
                그 기록을 책으로 연결하는 콘텐츠 서비스
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600">
                여행별로 사진과 글을 기록하고, 완성된 기록을 나중에 책 주문으로
                이어갈 수 있습니다. 먼저 콘텐츠를 쌓고, 그 다음 결과물을 만드는
                흐름에 집중했습니다.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/trips/new"
                  className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  새 여행 만들기
                </Link>

                <Link
                  href="/orders"
                  className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  주문 목록 보기
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <p className="text-sm text-slate-500">전체 여행</p>
                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {totalTrips}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <p className="text-sm text-slate-500">여행지 수</p>
                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {totalDestinations}
                </p>
              </div>

              <div className="col-span-2 rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-900 to-slate-700 p-5 text-white">
                <p className="text-sm text-slate-200">최근 여행</p>
                <p className="mt-2 text-lg font-semibold">
                  {featuredTrip ? featuredTrip.title : "아직 여행이 없습니다"}
                </p>
                <p className="mt-1 text-sm text-slate-300">
                  {featuredTrip
                    ? `${featuredTrip.destination} · ${featuredTrip.startDate} ~ ${featuredTrip.endDate}`
                    : "첫 여행 콘텐츠를 만들어보세요."}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section header */}
        <section className="mt-12">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Contents</p>
              <h2 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
                여행 목록
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                지금까지 만든 여행 콘텐츠를 확인할 수 있습니다.
              </p>
            </div>

            <div className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600">
              총 {trips.length}개
            </div>
          </div>

          {trips.length === 0 ? (
            <div className="soft-card mt-6 rounded-3xl border border-dashed px-6 py-16 text-center">
              <div className="mx-auto max-w-md">
                <h3 className="text-xl font-semibold text-slate-900">
                  아직 여행이 없습니다
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  첫 번째 여행을 만들고, 여행별 기록을 콘텐츠처럼 쌓아보세요.
                </p>
                <Link
                  href="/trips/new"
                  className="mt-6 inline-flex rounded-xl bg-slate-900 px-5 py-3 white text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  새 여행 만들기
                </Link>
              </div>
            </div>
          ) : (
            <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {trips.map((trip) => {
                const duration = getTripDuration(trip.startDate, trip.endDate);

                return (
                  <Link
                    key={trip.id}
                    href={`/trips/${trip.id}`}
                    className="soft-card grid-card overflow-hidden rounded-[28px]"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                      {trip.coverImageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={trip.coverImageUrl}
                          alt={trip.title}
                          className="h-full w-full object-cover transition duration-300 hover:scale-[1.03]"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-200 to-slate-100 text-sm font-medium text-slate-500">
                          이미지 없음
                        </div>
                      )}

                      <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                        <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm">
                          {trip.destination}
                        </span>
                        {duration ? (
                          <span className="rounded-full bg-slate-900/85 px-3 py-1 text-xs font-semibold text-white">
                            {duration}
                          </span>
                        ) : null}
                      </div>
                    </div>

                    <div className="space-y-4 p-5">
                      <div>
                        <h3 className="line-clamp-1 text-xl font-bold tracking-tight text-slate-900">
                          {trip.title}
                        </h3>
                        <p className="mt-2 text-sm font-medium text-slate-500">
                          {trip.startDate} ~ {trip.endDate}
                        </p>
                      </div>

                      <p className="line-clamp-2 text-sm leading-6 text-slate-600">
                        {trip.description || "여행 설명이 아직 없습니다."}
                      </p>

                      <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                        <span className="text-sm font-medium text-slate-500">
                          콘텐츠 보러가기
                        </span>
                        <span className="text-lg text-slate-400">→</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}