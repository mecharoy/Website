import { Resend } from 'resend'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

interface EmailOptions {
  to: string
  subject: string
  html: string
}

export async function sendEmail({ to, subject, html }: EmailOptions) {
  if (!resend) {
    console.warn('Resend API key not configured. Email not sent.')
    return
  }

  const { data, error } = await resend.emails.send({
    from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
    to,
    subject,
    html,
  })

  if (error) {
    console.error('Resend error:', error)
    throw new Error(error.message)
  }

  return data
}
