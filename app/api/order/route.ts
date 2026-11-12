import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, address, quantity } = body;

    const GOOGLE_SCRIPT_URL = process.env.GOOGLE_SHEETS_SCRIPT_URL;

    if (!GOOGLE_SCRIPT_URL) {
      return NextResponse.json(
        { error: 'Google Script URL setup nahi hai.' },
        { status: 500 }
      );
    }

    // Send data directly to Google Sheets with redirect handling
    await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      redirect: 'follow', // <-- Yeh add kar diya hai
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        phone,
        address,
        quantity,
        date: new Date().toLocaleString('en-US', { timeZone: 'Asia/Karachi' }),
      }),
    });

    return NextResponse.json({ success: true, message: 'Order submitted!' });
  } catch (error) {
    console.error('Sheet Error:', error);
    return NextResponse.json(
      { error: 'Server error occurred' },
      { status: 500 }
    );
  }
}
