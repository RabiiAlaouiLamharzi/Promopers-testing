import { NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob'

const RECIPIENT = 'info@promopers.com'
const WEB3FORMS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY || '043e1710-1882-450f-a66e-86093869654d'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    const name     = formData.get('name') as string
    const email    = formData.get('email') as string
    const phone    = formData.get('phone') as string | null
    const position = formData.get('position') as string | null
    const message  = formData.get('message') as string | null
    const file     = formData.get('cv') as File | null

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required.' }, { status: 400 })
    }

    // Upload CV to Vercel Blob if provided
    let cvUrl: string | null = null
    if (file && file.size > 0) {
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
      const blob = await put(`cv/${Date.now()}-${safeName}`, file, {
        access: 'public',
      })
      cvUrl = blob.url
    }

    // Build email body
    const bodyLines = [
      `Name: ${name}`,
      `Email: ${email}`,
      phone    ? `Phone: ${phone}` : null,
      position ? `Position of interest: ${position}` : null,
      message  ? `\nCover letter / message:\n${message}` : null,
      cvUrl    ? `\nCV / Resume: ${cvUrl}` : 'No CV attached.',
    ].filter(Boolean).join('\n')

    // Send via Web3Forms
    const w3Response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: WEB3FORMS_KEY,
        subject: `Job Application – ${position || 'PromoPers'} – ${name}`,
        from_name: name,
        email,
        message: bodyLines,
        to: RECIPIENT,
      }),
    })

    const result = await w3Response.json()
    if (!result.success) {
      throw new Error(result.message || 'Web3Forms submission failed')
    }

    return NextResponse.json({ success: true, cvUrl })
  } catch (error: any) {
    console.error('[apply]', error)
    return NextResponse.json({ error: error.message || 'Submission failed.' }, { status: 500 })
  }
}
