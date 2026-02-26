'use server'

import { prisma } from '@/lib/prisma'
import { contactFormSchema } from '@/lib/validations'
import { sendEmail } from '@/lib/email'
import { z } from 'zod'

export async function submitContactForm(formData: FormData) {
  try {
    // Extract and validate data
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      business: formData.get('business') as string || undefined,
      message: formData.get('message') as string,
    }

    const validated = contactFormSchema.parse(data)

    // Save to database
    const lead = await prisma.lead.create({
      data: {
        name: validated.name,
        email: validated.email,
        business: validated.business,
        message: validated.message,
        status: 'NEW',
      },
    })

    // Send email notification
    try {
      await sendEmail({
        to: process.env.EMAIL_TO || 'rajdipn@iitd.ac.in',
        subject: `New Contact from ${validated.name}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${validated.name}</p>
          <p><strong>Email:</strong> ${validated.email}</p>
          ${validated.business ? `<p><strong>Affiliation:</strong> ${validated.business}</p>` : ''}
          <p><strong>Message:</strong></p>
          <p>${validated.message}</p>
          <hr>
          <p><small>Submission ID: ${lead.id}</small></p>
        `,
      })
    } catch (emailError) {
      // Log email error but don't fail the submission
      console.error('Failed to send email:', emailError)
    }

    return { success: true }
  } catch (error) {
    console.error('Form submission error:', error)

    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors[0].message,
      }
    }

    return {
      success: false,
      error: 'Failed to submit form. Please try again.',
    }
  }
}
