import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export const runtime = "nodejs";

type Reservation = {
  id: string;
  name: string;
  phone: string;
  guests: number;
  start: string; // yyyy-mm-dd
  end: string;   // yyyy-mm-dd (checkout, 미포함)
  createdAt: string;
};

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "reservations.json");
const MAX_GUESTS = 5;

async function ensureFile() {
  await fs.mkdir(DATA_DIR, { recursive: true }).catch(() => {});
  try { await fs.access(DATA_FILE); }
  catch { await fs.writeFile(DATA_FILE, "[]", "utf8"); }
}

async function readAll(): Promise<Reservation[]> {
  await ensureFile();
  const txt = await fs.readFile(DATA_FILE, "utf8");
  return JSON.parse(txt || "[]");
}

async function writeAll(rows: Reservation[]) {
  await fs.writeFile(DATA_FILE, JSON.stringify(rows, null, 2), "utf8");
}

const overlap = (aS: string, aE: string, bS: string, bE: string) =>
  new Date(aS) < new Date(bE) && new Date(bS) < new Date(aE);

export async function GET() {
  const rows = await readAll();
  rows.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "잘못된 요청" }, { status: 400 });

  const { name, phone, guests, start, end } = body as Partial<Reservation>;
  if (!name || !phone || !start || !end || !guests)
    return NextResponse.json({ error: "필수 항목 누락" }, { status: 400 });

  if (guests < 1 || guests > MAX_GUESTS)
    return NextResponse.json({ error: `인원은 1~${MAX_GUESTS}명` }, { status: 400 });
  if (new Date(start) >= new Date(end))
    return NextResponse.json({ error: "체크아웃은 체크인보다 뒤여야 합니다." }, { status: 400 });

  const rows = await readAll();
  if (rows.find(r => overlap(start!, end!, r.start, r.end)))
    return NextResponse.json({ error: "이미 예약된 기간입니다." }, { status: 409 });

  const row: Reservation = {
    id: Math.random().toString(36).slice(2, 10),
    name: name!, phone: phone!, guests: guests!,
    start: start!, end: end!, createdAt: new Date().toISOString(),
  };
  rows.push(row);
  await writeAll(rows);
  return NextResponse.json(row, { status: 201 });
}
