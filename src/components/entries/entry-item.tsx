"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { TripEntry } from "@/types/entry";

type EntryItemProps = {
  entry: TripEntry;
};

type EditFormState = {
  entryDate: string;
  title: string;
  content: string;
  imageUrl: string;
  moodTag: string;
};

export default function EntryItem({ entry }: EntryItemProps) {
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [form, setForm] = useState<EditFormState>({
    entryDate: entry.entryDate,
    title: entry.title,
    content: entry.content,
    imageUrl: entry.imageUrl ?? "",
    moodTag: entry.moodTag ?? "",
  });

  const handleUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const response = await fetch(`/api/entries/${entry.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const result = await response.json();

      if (!response.ok) {
        setErrorMessage(result.message ?? "기록 수정에 실패했습니다.");
        return;
      }

      setIsEditing(false);
      router.refresh();
    } catch (error) {
      console.error(error);
      setErrorMessage("요청 중 문제가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    const ok = window.confirm("이 기록을 삭제하시겠습니까?");
    if (!ok) return;

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const response = await fetch(`/api/entries/${entry.id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        setErrorMessage(result.message ?? "기록 삭제에 실패했습니다.");
        return;
      }

      router.refresh();
    } catch (error) {
      console.error(error);
      setErrorMessage("요청 중 문제가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isEditing) {
    return (
      <article className="rounded-2xl border bg-white p-5 shadow-sm">
        <form onSubmit={handleUpdate} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="block text-sm font-medium">기록 날짜 *</label>
              <input
                type="date"
                value={form.entryDate}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, entryDate: event.target.value }))
                }
                className="w-full rounded-lg border px-3 py-2"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">기분 태그</label>
              <input
                type="text"
                value={form.moodTag}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, moodTag: event.target.value }))
                }
                className="w-full rounded-lg border px-3 py-2"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">기록 제목 *</label>
            <input
              type="text"
              value={form.title}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, title: event.target.value }))
              }
              className="w-full rounded-lg border px-3 py-2"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">내용 *</label>
            <textarea
              value={form.content}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, content: event.target.value }))
              }
              className="min-h-32 w-full rounded-lg border px-3 py-2"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">이미지 URL</label>
            <input
              type="text"
              value={form.imageUrl}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, imageUrl: event.target.value }))
              }
              className="w-full rounded-lg border px-3 py-2"
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
              {isSubmitting ? "저장 중..." : "수정 저장"}
            </button>

            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="rounded-lg border px-4 py-2 text-sm font-medium"
            >
              취소
            </button>
          </div>
        </form>
      </article>
    );
  }

  return (
    <article className="overflow-hidden rounded-2xl border bg-white shadow-sm">
      <div className="grid gap-0 md:grid-cols-[220px_1fr]">
        <div className="aspect-[4/3] bg-gray-100 md:aspect-auto">
          {entry.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={entry.imageUrl}
              alt={entry.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-gray-400">
              이미지 없음
            </div>
          )}
        </div>

        <div className="space-y-3 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-xs text-gray-500">{entry.entryDate}</p>
              {entry.moodTag ? (
                <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-700">
                  {entry.moodTag}
                </span>
              ) : null}
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="rounded-lg border px-3 py-1.5 text-xs font-medium"
              >
                수정
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isSubmitting}
                className="rounded-lg border px-3 py-1.5 text-xs font-medium text-red-600 disabled:opacity-50"
              >
                삭제
              </button>
            </div>
          </div>

          <h3 className="text-lg font-semibold">{entry.title}</h3>
          <p className="text-sm leading-6 text-gray-700">{entry.content}</p>

          {errorMessage ? (
            <p className="text-sm text-red-600">{errorMessage}</p>
          ) : null}
        </div>
      </div>
    </article>
  );
}