import type { DealStatus } from '@/types'

type Tone = 'pos' | 'warn' | 'neg' | 'neutral' | 'accent'

export const STATUS_LABEL: Record<DealStatus, string> = {
  new: 'New',
  ready: 'Ready for review',
  'sent-to-ic': 'Sent to IC',
  rejected: 'Rejected',
  archived: 'Archived',
}

export const STATUS_TONE: Record<DealStatus, Tone> = {
  new: 'accent',
  ready: 'neutral',
  'sent-to-ic': 'pos',
  rejected: 'neg',
  archived: 'neutral',
}

// human-readable history entry when a deal moves to a status
export const STATUS_EVENT: Record<DealStatus, string> = {
  new: 'Deal added',
  ready: 'Ready for review — analysis complete',
  'sent-to-ic': 'Sent to Investment Committee',
  rejected: 'Rejected by deal team',
  archived: 'Archived',
}

export const STATUS_ORDER: Record<DealStatus, number> = {
  'sent-to-ic': 0,
  ready: 1,
  new: 2,
  rejected: 3,
  archived: 4,
}

// active = counts toward the pipeline / capital (not rejected or archived)
export const isActive = (s: DealStatus) => s !== 'rejected' && s !== 'archived'
export const isArchived = (s: DealStatus) => s === 'archived'

// the order statuses appear as filter chips / cards
export const STATUS_FILTER_ORDER: DealStatus[] = ['new', 'ready', 'sent-to-ic', 'rejected', 'archived']

// allowed transitions, used by both the row ⋯ menu and the deal-header actions
export interface StatusAction {
  label: string
  to: DealStatus
  danger?: boolean
}
export function statusActions(s: DealStatus): StatusAction[] {
  switch (s) {
    case 'new':
      return [{ label: 'Reject', to: 'rejected', danger: true }, { label: 'Archive', to: 'archived' }]
    case 'ready':
      return [{ label: 'Send to IC', to: 'sent-to-ic' }, { label: 'Reject', to: 'rejected', danger: true }, { label: 'Archive', to: 'archived' }]
    case 'sent-to-ic':
      return [{ label: 'Reject', to: 'rejected', danger: true }, { label: 'Archive', to: 'archived' }]
    case 'rejected':
      return [{ label: 'Reopen', to: 'ready' }, { label: 'Archive', to: 'archived' }]
    case 'archived':
      return [{ label: 'Restore', to: 'ready' }]
  }
}
