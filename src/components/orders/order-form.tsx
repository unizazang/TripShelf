"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type OrderFormProps = {
  tripId: string;
  tripTitle: string;
};

type FormState = {
  bookTitle: string;
  subtitle: string;
  theme: "basic" | "photo" | "diary";
};

export default function OrderForm({ tripId, tripTitle }: OrderFormProps) {
  const router = useRouter();

  const [form, setForm] = useState<FormState>({
    bookTitle: `${tripTitle} 기록집`,
    subtitle: "",
    theme: "basic",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tripId,
          bookTitle: form.bookTitle,
          subtitle: form.subtitle,
          theme: form.theme,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setErrorMessage(result.message ?? "주문 생성에 실패했습니다.");
        return;
      }

      router.push(`/orders/${result.order.id}`);
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
        <label className="block text-sm font-medium">책 제목 *</label>
        <input
          type="text"
          value={form.bookTitle}
          onChange={(event) =>
            setForm((prev) => ({ ...prev, bookTitle: event.target.value }))
          }
          className="w-full rounded-lg border px-3 py-2"
          placeholder="예: 도쿄 여행 기록집"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">부제</label>
        <input
          type="text"
          value={form.subtitle}
          onChange={(event) =>
            setForm((prev) => ({ ...prev, subtitle: event.target.value }))
          }
          className="w-full rounded-lg border px-3 py-2"
          placeholder="예: 2026년 봄 벚꽃 여행"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">테마</label>
        <select
          value={form.theme}
          onChange={(event) =>
            setForm((prev) => ({
              ...prev,
              theme: event.target.value as FormState["theme"],
            }))
          }
          className="w-full rounded-lg border px-3 py-2"
        >
          <option value="basic">basic</option>
          <option value="photo">photo</option>
          <option value="diary">diary</option>
        </select>
      </div>

      {errorMessage ? (
        <p className="text-sm text-red-600">{errorMessage}</p>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
      >
        {isSubmitting ? "주문 생성 중..." : "책 주문 생성"}
      </button>
    </form>
  );
}