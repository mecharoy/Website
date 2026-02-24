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

  try {
    const data = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'noreply@university.edu',
      to,
      subject,
      html,
    })

    return data
  } catch (error) {
    console.error('Error sending email:', error)
    throw error
  }
}
