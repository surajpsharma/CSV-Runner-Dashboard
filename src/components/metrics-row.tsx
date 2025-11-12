"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type Metrics } from "@/lib/stats";

function fmt(n: number) {
  if (!Number.isFinite(n)) return "-";
  return n.toFixed(2);
}

export function MetricsRow({ title, metrics }: { title: string; metrics: Metrics }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <Card className="shadow-md border-2 border-blue-100 bg-gradient-to-br from-blue-50 to-white hover:shadow-xl transition-shadow">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-blue-700 flex items-center gap-2">
            <span className="text-lg">📊</span>
            {title} Average
          </CardTitle>
        </CardHeader>
        <CardContent className="text-3xl font-bold text-blue-900">{fmt(metrics.average)} mi</CardContent>
      </Card>
      <Card className="shadow-md border-2 border-green-100 bg-gradient-to-br from-green-50 to-white hover:shadow-xl transition-shadow">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-green-700 flex items-center gap-2">
            <span className="text-lg">⬇️</span>
            {title} Min
          </CardTitle>
        </CardHeader>
        <CardContent className="text-3xl font-bold text-green-900">{fmt(metrics.min)} mi</CardContent>
      </Card>
      <Card className="shadow-md border-2 border-purple-100 bg-gradient-to-br from-purple-50 to-white hover:shadow-xl transition-shadow">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-purple-700 flex items-center gap-2">
            <span className="text-lg">⬆️</span>
            {title} Max
          </CardTitle>
        </CardHeader>
        <CardContent className="text-3xl font-bold text-purple-900">{fmt(metrics.max)} mi</CardContent>
      </Card>
    </div>
  );
}
