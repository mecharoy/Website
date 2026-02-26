'use server'

import { prisma } from '@/lib/prisma'
import { contactFormSchema } from '@/lib/validations'
import { z } from 'zod'

export async function submitContactForm(formData: FormData) {
  try {
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      business: formData.get('business') as string || undefined,
      message: formData.get('message') as string,
    }

    const validated = contactFormSchema.parse(data)

    await prisma.lead.create({
      data: {
        name: validated.name,
        email: validated.email,
        business: validated.business,
        message: validated.message,
        status: 'NEW',
      },
    })

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
