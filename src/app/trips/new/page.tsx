import Link from "next/link";
import TripForm from "@/components/trips/trip-form";

export default function NewTripPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">새 여행 만들기</h1>
          <p className="mt-2 text-sm text-gray-600">
            여행 콘텐츠의 시작이 되는 기본 정보를 입력하세요.
          </p>
        </div>

        <Link
          href="/"
          className="rounded-lg border px-4 py-2 text-sm font-medium"
        >
          홈으로
        </Link>
      </div>

      <div className="mt-8 rounded-2xl border bg-white p-6 shadow-sm">
        <TripForm />
      </div>
    </main>
  );
}