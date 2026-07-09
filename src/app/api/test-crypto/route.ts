import { NextResponse } from 'next/server';

export async function GET() {
  const uid = () =>
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2) + Date.now().toString(36);

  return NextResponse.json({
    typeofCrypto: typeof crypto,
    hasRandomUUID: typeof crypto !== 'undefined' ? 'randomUUID' in crypto : false,
    uid: uid(),
  });
}
