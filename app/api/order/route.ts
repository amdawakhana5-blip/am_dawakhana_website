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

    // 1. Send data to Google Sheets
    await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
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

    // 2. Trigger Meta Conversions API (Server-Side Purchase Event)
    try {
      const PIXEL_ID = '4731333547192871';
      const CAPI_ACCESS_TOKEN = process.env.META_CAPI_ACCESS_TOKEN;

      if (CAPI_ACCESS_TOKEN) {
        const isTwoBottles = quantity?.includes('4,400') || false;
        const orderValue = isTwoBottles ? 4400 : 2299;

        await fetch(`https://graph.facebook.com/v19.0/${PIXEL_ID}/events?access_token=${CAPI_ACCESS_TOKEN}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            data: [
              {
                event_name: 'Purchase',
                event_time: Math.floor(Date.now() / 1000),
                action_source: 'website',
                event_source_url: 'https://am-dawakhana-website.vercel.app',
                custom_data: {
                  currency: 'PKR',
                  value: orderValue,
                  content_name: 'AM Vitality Tablet',
                  contents: [
                    {
                      id: isTwoBottles ? 'am_vitality_2x' : 'am_vitality_1x',
                      quantity: isTwoBottles ? 2 : 1,
                      item_price: orderValue,
                    }
                  ],
                },
              }
            ],
          }),
        });
      }
    } catch (capiErr) {
      console.error('Meta CAPI Error:', capiErr);
      // Order Google Sheets par save ho chuka hoga, isliye CAPI error se order fail nahi hoga
    }

    return NextResponse.json({ success: true, message: 'Order submitted!' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Server error occurred' },
      { status: 500 }
    );
  }
}
