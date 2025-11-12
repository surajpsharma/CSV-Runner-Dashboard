"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { type RunRecord } from "@/lib/csv";

export function RunsTable({ records }: { records: RunRecord[] }) {
  return (
    <div className="rounded-md border w-full overflow-x-auto">
      <Table className="min-w-[520px]">
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Person</TableHead>
            <TableHead className="text-right">Miles</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.map((r, i) => (
            <TableRow key={i}>
              <TableCell>{r.date.toLocaleDateString()}</TableCell>
              <TableCell>{r.person}</TableCell>
              <TableCell className="text-right">{r.miles}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
