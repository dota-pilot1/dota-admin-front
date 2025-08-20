"use client";

import { useQuery } from "@tanstack/react-query";
import { getPayments, type PaymentItem } from "@/features/payments/api/list";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";

function StatusBadge({ status }: { status: PaymentItem["status"] }) {
  const map: Record<PaymentItem["status"], { variant: "default" | "secondary" | "destructive"; label: string }> = {
    PAID: { variant: "default", label: "결제완료" },
    FAILED: { variant: "destructive", label: "실패" },
    PENDING: { variant: "secondary", label: "대기" },
  };
  const v = map[status];
  return <Badge variant={v.variant}>{v.label}</Badge>;
}

export default function PaymentsPage() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["payments", "list"],
    queryFn: getPayments,
  });

  // Local fallback: if backend has no data, read from localStorage cache populated after payments
  let items = data;
  if ((items?.length ?? 0) === 0 && typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem("paymentsCache");
      const parsed = raw ? JSON.parse(raw) : [];
      items = parsed;
    } catch {
      // ignore parsing errors
    }
  }

  // Hide pending items if any
  const visible: PaymentItem[] = (items || []).filter((p: PaymentItem) => p.status !== "PENDING");

  return (
    <main className="max-w-4xl mx-auto p-6 space-y-4">
      <h1 className="text-xl font-semibold">결제 내역</h1>

      {isLoading && <div>불러오는 중…</div>}
      {isError && <div className="text-red-600">{(error as Error).message}</div>}

      <div className="grid grid-cols-1 gap-3">
  {visible?.map((p: PaymentItem) => (
          <Card key={p.id}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{p.orderName}</CardTitle>
                <StatusBadge status={p.status} />
              </div>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <div className="flex flex-wrap gap-x-4 gap-y-1">
                <span>금액 {p.amount.toLocaleString()} {p.currency}</span>
                {p.method && <span>수단 {p.method}</span>}
                {p.provider && <span>PG {p.provider}</span>}
                {p.payerName && <span>이름 {p.payerName}</span>}
                {p.payerEmail && <span>이메일 {p.payerEmail}</span>}
                {p.paidAt && <span>일시 {new Date(p.paidAt).toLocaleString()}</span>}
              </div>
            </CardContent>
          </Card>
        ))}
        {!isLoading && !isError && (visible?.length ?? 0) === 0 && (
          <div className="text-sm text-muted-foreground">결제 내역이 없습니다.</div>
        )}
      </div>
    </main>
  );
}
