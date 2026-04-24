"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type FormState = {
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  description: string;
  coverImageUrl: string;
};

const initialState: FormState = {
  title: "",
  destination: "",
  startDate: "",
  endDate: "",
  description: "",
  coverImageUrl: "",
};

export default function TripForm() {
  const router = useRouter();

  const [form, setForm] = useState<FormState>(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange =
    (key: keyof FormState) =>
    (
      event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
      setForm((prev) => ({
        ...prev,
        [key]: event.target.value,
      }));
    };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/trips", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const result = await response.json();

      if (!response.ok) {
        setErrorMessage(result.message ?? "여행 생성에 실패했습니다.");
        return;
      }

      router.push("/");
      router.refresh();
    } catch (error) {
      console.error(error);
      setErrorMessage("요청 중 문제가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <label className="block text-sm font-medium">여행 제목 *</label>
        <input
          type="text"
          value={form.title}
          onChange={handleChange("title")}
          className="w-full rounded-lg border px-3 py-2"
          placeholder="예: 도쿄 3박 4일 여행"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">여행지 *</label>
        <input
          type="text"
          value={form.destination}
          onChange={handleChange("destination")}
          className="w-full rounded-lg border px-3 py-2"
          placeholder="예: 도쿄"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="block text-sm font-medium">시작일 *</label>
          <input
            type="date"
            value={form.startDate}
            onChange={handleChange("startDate")}
            className="w-full rounded-lg border px-3 py-2"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">종료일 *</label>
          <input
            type="date"
            value={form.endDate}
            onChange={handleChange("endDate")}
            className="w-full rounded-lg border px-3 py-2"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">대표 이미지 URL</label>
        <input
          type="text"
          value={form.coverImageUrl}
          onChange={handleChange("coverImageUrl")}
          className="w-full rounded-lg border px-3 py-2"
          placeholder="https://..."
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">여행 설명</label>
        <textarea
          value={form.description}
          onChange={handleChange("description")}
          className="min-h-32 w-full rounded-lg border px-3 py-2"
          placeholder="이번 여행에 대한 간단한 설명을 적어주세요."
        />
      </div>

      {errorMessage ? (
        <p className="text-sm text-red-600">{errorMessage}</p>
      ) : null}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {isSubmitting ? "저장 중..." : "여행 저장"}
        </button>

        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-lg border px-4 py-2 text-sm font-medium"
        >
          취소
        </button>
      </div>
    </form>
  );
}