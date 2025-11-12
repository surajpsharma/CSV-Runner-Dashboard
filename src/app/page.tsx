"use client";

import { useMemo, useState } from "react";
import { CsvUploader, type UploadOutcome } from "@/components/csv-uploader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MetricsRow } from "@/components/metrics-row";
import { RunsTable } from "@/components/runs-table";
import { RunLineChart } from "@/components/run-line-chart";
import { type RunRecord } from "@/lib/csv";
import { byPerson, computeMetrics } from "@/lib/stats";

export default function Home() {
  const [records, setRecords] = useState<RunRecord[]>([]);
  const [selectedPerson, setSelectedPerson] = useState<string | null>(null);

  const people = useMemo(() => Array.from(new Set(records.map((r) => r.person))).sort(), [records]);
  const perPerson = useMemo(() => byPerson(records), [records]);
  const overallMetrics = useMemo(() => computeMetrics(records), [records]);
  const selectedRecords = useMemo(() => (selectedPerson ? perPerson[selectedPerson] ?? [] : []), [perPerson, selectedPerson]);
  const selectedMetrics = useMemo(() => computeMetrics(selectedRecords), [selectedRecords]);

  const onParsed = (out: UploadOutcome) => {
    setRecords(out.records);
    setSelectedPerson(null);
  };

  return (
    <div className="mx-auto max-w-5xl p-4 sm:p-6 space-y-6">
      <header className="space-y-2 text-center py-6">
        <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">CSV Runner Dashboard</h1>
        <p className="text-base text-muted-foreground">Upload a CSV with columns: date, person, miles run.</p>
      </header>

      <Card className="shadow-lg border-2 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50">
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">📤</span>
            Upload
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <CsvUploader onParsed={onParsed} />
        </CardContent>
      </Card>

      <Tabs defaultValue="overall">
        <TabsList className="flex-wrap bg-white/80 backdrop-blur-sm shadow-md">
          <TabsTrigger value="overall">📊 Overall</TabsTrigger>
          <TabsTrigger value="per">👤 Per Person</TabsTrigger>
        </TabsList>

        <TabsContent value="overall" className="space-y-4">
          <MetricsRow title="Overall" metrics={overallMetrics} />
          <Card className="shadow-lg backdrop-blur-sm border">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
              <CardTitle className="flex items-center gap-2">
                <span className="text-xl">📈</span>
                Miles over time (total)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {records.length === 0 ? (
                <p className="text-sm text-muted-foreground">No data yet. Upload a CSV to see the chart.</p>
              ) : (
                <RunLineChart records={records} />
              )}
            </CardContent>
          </Card>
          {records.length > 0 && (
            <Card className="shadow-lg backdrop-blur-sm border">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50">
                <CardTitle className="flex items-center gap-2">
                  <span className="text-xl">📋</span>
                  All records
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RunsTable records={records} />
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="per" className="space-y-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium">Person</label>
            <Select value={selectedPerson ?? undefined} onValueChange={(v) => setSelectedPerson(v)}>
              <SelectTrigger className="w-full sm:w-64">
                <SelectValue placeholder={people.length ? "Choose a person" : "No people yet"} />
              </SelectTrigger>
              <SelectContent>
                {people.map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedPerson ? (
            <div className="space-y-4">
              <MetricsRow title={selectedPerson} metrics={selectedMetrics} />
              <Card className="shadow-lg backdrop-blur-sm border">
                <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-xl">🏃</span>
                    {selectedPerson} miles over time
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RunLineChart records={selectedRecords} color="#22c55e" />
                </CardContent>
              </Card>
              <Card className="shadow-lg backdrop-blur-sm border">
                <CardHeader className="bg-gradient-to-r from-emerald-50 to-green-50">
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-xl">📊</span>
                    {selectedPerson} records
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RunsTable records={selectedRecords} />
                </CardContent>
              </Card>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Choose a person to view metrics and charts.</p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
