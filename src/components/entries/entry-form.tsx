"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type EntryFormProps = {
  tripId: string;
};

type FormState = {
  entryDate: string;
  title: string;
  content: string;
  imageUrl: string;
  moodTag: string;
};

const initialState: FormState = {
  entryDate: "",
  title: "",
  content: "",
  imageUrl: "",
  moodTag: "",
};

export default function EntryForm({ tripId }: EntryFormProps) {
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
      const response = await fetch("/api/entries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tripId,
          ...form,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setErrorMessage(result.message ?? "기록 저장에 실패했습니다.");
        return;
      }

      setForm(initialState);
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
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="block text-sm font-medium">기록 날짜 *</label>
          <input
            type="date"
            value={form.entryDate}
            onChange={handleChange("entryDate")}
            className="w-full rounded-lg border px-3 py-2"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">기분 태그</label>
          <input
            type="text"
            value={form.moodTag}
            onChange={handleChange("moodTag")}
            className="w-full rounded-lg border px-3 py-2"
            placeholder="예: 설렘, 행복, 평온"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">기록 제목 *</label>
        <input
          type="text"
          value={form.title}
          onChange={handleChange("title")}
          className="w-full rounded-lg border px-3 py-2"
          placeholder="예: 첫날 숙소 도착"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">내용 *</label>
        <textarea
          value={form.content}
          onChange={handleChange("content")}
          className="min-h-32 w-full rounded-lg border px-3 py-2"
          placeholder="그날 있었던 일을 기록해보세요."
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">이미지 URL</label>
        <input
          type="text"
          value={form.imageUrl}
          onChange={handleChange("imageUrl")}
          className="w-full rounded-lg border px-3 py-2"
          placeholder="https://..."
        />
      </div>

      {errorMessage ? (
        <p className="text-sm text-red-600">{errorMessage}</p>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
      >
        {isSubmitting ? "저장 중..." : "기록 추가"}
      </button>
    </form>
  );
}