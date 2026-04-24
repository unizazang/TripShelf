"use client";

type ExportButtonProps = {
  orderId: string;
};

export default function ExportButton({ orderId }: ExportButtonProps) {
  const handleDownload = () => {
    window.location.href = `/api/export/${orderId}`;
  };

  return (
    <button
      type="button"
      onClick={handleDownload}
      className="rounded-lg border px-4 py-2 text-sm font-medium"
    >
      주문 데이터 JSON 다운로드
    </button>
  );
}