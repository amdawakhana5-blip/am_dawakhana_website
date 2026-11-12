import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, address, quantity } = body;

    // Yahan apna direct URL daal do (jaise pehle chal raha tha)
    const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwgxx2TKUrsW54MqBtXS6B4HoLOK0cU0-TAkRH6f-FDsAjA6hMP1IWTWfRjc1Gv8avA/exec";

    // Send data directly to Google Sheets
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      redirect: 'follow',
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
    console.error('Server Error:', error);
    return NextResponse.json(
      { error: 'Server error occurred' },
      { status: 500 }
    );
  }
}
