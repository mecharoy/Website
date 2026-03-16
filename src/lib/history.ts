import { SubmissionAction } from '@prisma/client'
import { prisma } from '@/lib/prisma'

type LogParams = {
  submissionId: string
  action: SubmissionAction
  actorType: 'ADMIN' | 'USER'
  actorName?: string
  oldValue?: Record<string, unknown>
  newValue?: Record<string, unknown>
}

export function logSubmissionEvent(params: LogParams): void {
  // Fire-and-forget — never blocks the response
  prisma.submissionHistory
    .create({
      data: {
        submissionId: params.submissionId,
        action: params.action,
        actorType: params.actorType,
        actorName: params.actorName ?? null,
        oldValue: params.oldValue ? JSON.stringify(params.oldValue) : null,
        newValue: params.newValue ? JSON.stringify(params.newValue) : null,
      },
    })
    .catch(() => {
      // Non-critical — silently ignore logging failures
    })
}
