"use client";

import { useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { parseCsv, type RunRecord } from "@/lib/csv";

export type UploadOutcome = {
  records: RunRecord[];
  errors: string[];
};

export function CsvUploader(props: { onParsed: (out: UploadOutcome) => void }) {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);

  const handleFiles = async (file?: File | null) => {
    if (!file) return;
    setBusy(true);
    try {
      const text = await file.text();
      const out = parseCsv(text);
      setErrors(out.errors);
      props.onParsed(out);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="grid gap-2">
        <Label htmlFor="csv" className="text-sm font-medium">Upload CSV (columns: date, person, miles run)</Label>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <Input id="csv" ref={fileRef} type="file" accept=".csv,text/csv" onChange={(e) => handleFiles(e.target.files?.[0])} />
          <Button className="w-full sm:w-auto" type="button" variant="secondary" onClick={() => fileRef.current?.click()} disabled={busy}>
            {busy ? "Parsing…" : "Choose file"}
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          Need an example? <a className="underline" href="/sample.csv">Download sample.csv</a>
        </p>
      </div>

      {errors.length > 0 && (
        <Alert variant="destructive">
          <AlertDescription>
            <ul className="list-disc pl-4 space-y-1">
              {errors.map((e, i) => (
                <li key={i}>{e}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
