import Papa from "papaparse";
import { z } from "zod";
import { parse as parseDate, isValid as isValidDate } from "date-fns";

export type RunRecord = {
  date: Date;
  person: string;
  miles: number;
};

const RawRowSchema = z.object({
  date: z.string().min(1, "date required"),
  person: z.string().min(1, "person required"),
  miles: z.union([z.string(), z.number()]),
});

function normalizeHeaders<T extends Record<string, unknown>>(row: T): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(row)) {
    const key = k.trim().toLowerCase();
    let nk = key;
    if (key === "miles" || key === "miles_run" || key === "miles-run") nk = "miles run";
    if (key === "miles run") nk = "miles run";
    out[nk] = v;
  }
  return out;
}

function parseMiles(value: string | number): number | null {
  if (typeof value === "number") return isFinite(value) ? value : null;
  const cleaned = value.replace(/,/g, "").trim();
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
}

function parseDateFlexible(input: string): Date | null {
  const trimmed = input.trim();
  // Try ISO first
  let d = new Date(trimmed);
  if (isValidDate(d)) return d;
  // Try common formats
  const formats = ["yyyy-MM-dd", "MM/dd/yyyy", "M/d/yyyy", "dd/MM/yyyy", "d/M/yyyy"] as const;
  for (const fmt of formats) {
    d = parseDate(trimmed, fmt, new Date());
    if (isValidDate(d)) return d;
  }
  return null;
}

export type ParseResult = {
  records: RunRecord[];
  errors: string[];
};

export function parseCsv(text: string): ParseResult {
  const papa = Papa.parse<Record<string, unknown>>(text, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (h) => h,
  });

  const errors: string[] = [];
  const records: RunRecord[] = [];

  // Header validation
  if (!papa.meta.fields || papa.meta.fields.length === 0) {
    errors.push("CSV has no header row.");
    return { records, errors };
  }
  const normalizedHeaders = papa.meta.fields.map((f) => normalizeHeaders({ [f]: null })).map((o) => Object.keys(o)[0]);
  const required = ["date", "person", "miles run"];
  for (const r of required) {
    if (!normalizedHeaders.includes(r)) {
      errors.push(`Missing required column: ${r}`);
    }
  }

  papa.data.forEach((raw, idx) => {
    const normalized = normalizeHeaders(raw);
    const dateRaw = (normalized["date"] ?? "") as string;
    const personRaw = (normalized["person"] ?? "") as string;
    const milesRaw = (normalized["miles run"] ?? normalized["miles"]) as string | number | undefined;

    const milesParsed = milesRaw == null ? null : parseMiles(milesRaw);
    const dateParsed = typeof dateRaw === "string" ? parseDateFlexible(dateRaw) : null;
    const person = typeof personRaw === "string" ? personRaw.trim() : "";

    const schemaCheck = RawRowSchema.safeParse({ date: dateRaw ?? "", person, miles: milesRaw ?? "" });
    if (!schemaCheck.success) {
      errors.push(`Row ${idx + 2}: ${schemaCheck.error.issues.map((i) => i.message).join(", ")}`);
      return;
    }

    if (!dateParsed) {
      errors.push(`Row ${idx + 2}: invalid date '${dateRaw}'`);
      return;
    }
    if (!person) {
      errors.push(`Row ${idx + 2}: person is empty`);
      return;
    }
    if (milesParsed == null) {
      errors.push(`Row ${idx + 2}: miles is not a number`);
      return;
    }

    records.push({ date: dateParsed, person, miles: milesParsed });
  });

  return { records, errors };
}
