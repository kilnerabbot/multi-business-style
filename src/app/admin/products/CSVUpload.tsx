"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Upload, Download, X, CheckCircle, AlertCircle, ChevronDown, ChevronUp, Loader2 } from "lucide-react";

/* ── CSV column spec ───────────────────────────────────────────────────── */
const COLUMNS = ["name","description","price","sale_price","category","gender","stock","featured","active","sizes","colors"] as const;
type Col = typeof COLUMNS[number];
type Row = Record<Col, string>;

/* ── Template CSV content ──────────────────────────────────────────────── */
const TEMPLATE_CSV = `name,description,price,sale_price,category,gender,stock,featured,active,sizes,colors
Classic White Tee,Comfortable everyday tee in premium cotton.,299,,Men,men,50,false,true,S|M|L|XL,white|black|navy
Floral Wrap Dress,Elegant wrap dress with floral print.,549,399,Women,women,30,true,true,XS|S|M|L,red|blue
Kids Denim Jacket,Durable denim jacket for kids.,349,,Kids,kids,25,false,true,3-4Y|5-6Y|7-8Y,blue|black
Leather Crossbody Bag,Genuine leather bag with adjustable strap.,599,449,Accessories,unisex,20,true,true,,tan|black`;

function downloadTemplate() {
  const blob = new Blob([TEMPLATE_CSV], { type: "text/csv" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href = url; a.download = "mbs-products-template.csv";
  a.click(); URL.revokeObjectURL(url);
}

/* ── CSV parser ────────────────────────────────────────────────────────── */
function parseCSV(text: string): Row[] {
  const lines = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n").trim().split("\n");
  if (lines.length < 2) return [];

  const headers = lines[0].split(",").map((h) => h.trim().toLowerCase().replace(/\s+/g, "_")) as Col[];

  return lines.slice(1)
    .filter((l) => l.trim())
    .map((line) => {
      // Handle quoted fields
      const cells: string[] = [];
      let cur = "", inQuote = false;
      for (let i = 0; i < line.length; i++) {
        if (line[i] === '"') { inQuote = !inQuote; continue; }
        if (line[i] === "," && !inQuote) { cells.push(cur.trim()); cur = ""; continue; }
        cur += line[i];
      }
      cells.push(cur.trim());

      const row = {} as Row;
      headers.forEach((h, i) => {
        if (COLUMNS.includes(h)) row[h] = cells[i] ?? "";
      });
      return row;
    });
}

/* ── Validation ────────────────────────────────────────────────────────── */
type RowError = { row: number; field: string; message: string };

function validate(rows: Row[]): RowError[] {
  const errors: RowError[] = [];
  const VALID_GENDERS = ["men","women","kids","unisex"];
  rows.forEach((r, i) => {
    if (!r.name?.trim())  errors.push({ row: i+2, field: "name",   message: "Name is required" });
    if (!r.price || isNaN(parseFloat(r.price))) errors.push({ row: i+2, field: "price", message: "Price must be a number" });
    if (r.gender && !VALID_GENDERS.includes(r.gender.toLowerCase()))
      errors.push({ row: i+2, field: "gender", message: `Gender must be one of: ${VALID_GENDERS.join(", ")}` });
  });
  return errors;
}

/* ── Component ─────────────────────────────────────────────────────────── */
export default function CSVUpload() {
  const router  = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  const [open,      setOpen]      = useState(false);
  const [rows,      setRows]      = useState<Row[]>([]);
  const [errors,    setErrors]    = useState<RowError[]>([]);
  const [uploading, setUploading] = useState(false);
  const [result,    setResult]    = useState<{ count: number } | null>(null);
  const [parseErr,  setParseErr]  = useState("");
  const [showAll,   setShowAll]   = useState(false);

  const PREVIEW_LIMIT = 5;

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setResult(null); setParseErr(""); setErrors([]);

    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = parseCSV(ev.target?.result as string);
        if (!parsed.length) { setParseErr("No data rows found. Check your CSV format."); return; }
        const errs = validate(parsed);
        setRows(parsed); setErrors(errs);
      } catch {
        setParseErr("Could not parse the CSV. Please use the template.");
      }
    };
    reader.readAsText(file);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleImport = async () => {
    if (errors.length) return;
    setUploading(true);
    const res = await fetch("/api/admin/products/bulk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ products: rows }),
    });
    setUploading(false);
    if (!res.ok) {
      const { error } = await res.json();
      setParseErr(error ?? "Import failed."); return;
    }
    const data = await res.json();
    setResult({ count: data.count });
    setRows([]); setErrors([]);
    router.refresh();
  };

  const reset = () => {
    setRows([]); setErrors([]); setResult(null); setParseErr(""); setShowAll(false);
  };

  const visibleRows = showAll ? rows : rows.slice(0, PREVIEW_LIMIT);

  return (
    <div className="mb-8">
      {/* Toggle button */}
      <button
        onClick={() => { setOpen((o) => !o); if (open) reset(); }}
        className="flex items-center gap-2 border border-dashed border-gray-300 hover:border-[#2ECC71] text-gray-500 hover:text-[#2ECC71] font-semibold text-sm px-5 py-2.5 rounded-xl transition-all"
      >
        <Upload size={15} />
        {open ? "Close CSV Import" : "Import Products via CSV"}
      </button>

      {open && (
        <div className="mt-4 bg-white border border-gray-100 rounded-2xl shadow-sm p-6 space-y-5">
          {/* Header row */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-[#0D1B2A]">Bulk Product Import</h3>
              <p className="text-xs text-gray-400 mt-0.5">Upload a CSV file. Use the template to get started.</p>
            </div>
            <button onClick={downloadTemplate}
              className="flex items-center gap-1.5 text-xs font-semibold text-[#2ECC71] hover:text-[#27AE60] transition-colors">
              <Download size={13} /> Download Template
            </button>
          </div>

          {/* Column guide */}
          <div className="bg-[#F9FAFB] rounded-xl p-3 overflow-x-auto">
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-2">Expected columns</p>
            <div className="flex gap-2 flex-wrap">
              {COLUMNS.map((col) => (
                <span key={col} className={`text-xs px-2 py-0.5 rounded-md font-mono ${
                  ["name","price"].includes(col) ? "bg-[#2ECC71]/15 text-[#27AE60] font-bold" : "bg-gray-100 text-gray-500"
                }`}>
                  {col}{["name","price"].includes(col) ? "*" : ""}
                </span>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Sizes &amp; colors: separate multiple values with <code className="bg-gray-200 px-1 rounded">|</code>
              &nbsp;e.g. <code className="bg-gray-200 px-1 rounded">S|M|L|XL</code>
            </p>
          </div>

          {/* Success state */}
          {result && (
            <div className="flex items-center gap-3 bg-green-50 border border-green-100 rounded-xl px-4 py-3">
              <CheckCircle size={18} className="text-green-500 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-green-700">
                  {result.count} product{result.count !== 1 ? "s" : ""} imported successfully!
                </p>
                <p className="text-xs text-green-600 mt-0.5">They appear in the list below — click Edit to add images and finalise.</p>
              </div>
              <button onClick={reset} className="ml-auto text-green-400 hover:text-green-600"><X size={15} /></button>
            </div>
          )}

          {/* Parse error */}
          {parseErr && (
            <div className="flex items-center gap-3 bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-sm text-red-600">
              <AlertCircle size={16} className="flex-shrink-0" /> {parseErr}
            </div>
          )}

          {/* File drop zone */}
          {!rows.length && !result && (
            <>
              <input ref={fileRef} type="file" accept=".csv,text/csv" onChange={handleFile} className="hidden" id="csv-upload" />
              <label htmlFor="csv-upload"
                className="flex flex-col items-center justify-center gap-3 border-2 border-dashed border-gray-200 hover:border-[#2ECC71] rounded-xl py-10 cursor-pointer transition-colors group">
                <div className="w-12 h-12 bg-[#2ECC71]/10 rounded-full flex items-center justify-center group-hover:bg-[#2ECC71]/20 transition-colors">
                  <Upload size={22} className="text-[#2ECC71]" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-gray-600 group-hover:text-[#0D1B2A] transition-colors">
                    Click to upload your CSV file
                  </p>
                  <p className="text-xs text-gray-400 mt-1">Only .csv files accepted</p>
                </div>
              </label>
            </>
          )}

          {/* Preview table */}
          {rows.length > 0 && !result && (
            <div>
              {/* Validation errors */}
              {errors.length > 0 && (
                <div className="mb-4 bg-red-50 border border-red-100 rounded-xl p-4 space-y-1">
                  <p className="text-xs font-bold text-red-600 uppercase tracking-wide mb-2">
                    {errors.length} validation error{errors.length > 1 ? "s" : ""} — fix before importing
                  </p>
                  {errors.map((e, i) => (
                    <p key={i} className="text-xs text-red-500">
                      Row {e.row} · <span className="font-semibold">{e.field}</span>: {e.message}
                    </p>
                  ))}
                </div>
              )}

              {/* Table */}
              <div className="border border-gray-100 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-[#F9FAFB] border-b border-gray-100">
                        <th className="px-3 py-2.5 text-left font-semibold text-gray-500 uppercase tracking-wide">#</th>
                        {COLUMNS.map((col) => (
                          <th key={col} className="px-3 py-2.5 text-left font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{col}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {visibleRows.map((row, i) => (
                        <tr key={i} className="hover:bg-gray-50">
                          <td className="px-3 py-2 text-gray-400">{i + 1}</td>
                          {COLUMNS.map((col) => (
                            <td key={col} className={`px-3 py-2 max-w-[140px] truncate ${
                              !row[col] && ["name","price"].includes(col) ? "bg-red-50 text-red-500" : "text-gray-600"
                            }`} title={row[col]}>
                              {row[col] || <span className="text-gray-300 italic">empty</span>}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {rows.length > PREVIEW_LIMIT && (
                  <button
                    onClick={() => setShowAll((s) => !s)}
                    className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-[#0D1B2A] font-medium w-full justify-center py-2.5 border-t border-gray-50 transition-colors"
                  >
                    {showAll ? <><ChevronUp size={13} /> Show less</> : <><ChevronDown size={13} /> Show all {rows.length} rows</>}
                  </button>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-between mt-4">
                <p className="text-xs text-gray-400">
                  <span className="font-semibold text-[#0D1B2A]">{rows.length}</span> product{rows.length !== 1 ? "s" : ""} ready to import
                </p>
                <div className="flex gap-3">
                  <button onClick={reset}
                    className="text-sm font-medium text-gray-400 hover:text-gray-600 transition-colors">
                    Clear
                  </button>
                  <button
                    onClick={handleImport}
                    disabled={uploading || errors.length > 0}
                    className="flex items-center gap-2 bg-[#2ECC71] hover:bg-[#27AE60] disabled:bg-gray-200 disabled:text-gray-400 text-[#0D1B2A] font-bold px-5 py-2 rounded-xl text-sm transition-colors"
                  >
                    {uploading
                      ? <><Loader2 size={14} className="animate-spin" /> Importing…</>
                      : <><Upload size={14} /> Import {rows.length} Product{rows.length !== 1 ? "s" : ""}</>
                    }
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
