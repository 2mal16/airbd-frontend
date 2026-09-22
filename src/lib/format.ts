/** Presentation helpers shared across the discovery views. */

export function formatBytes(bytes: number | null | undefined): string {
  if (!bytes || bytes < 0) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  let size = bytes
  let unit = 0
  while (size >= 1024 && unit < units.length - 1) {
    size /= 1024
    unit += 1
  }
  return `${size.toFixed(unit === 0 ? 0 : 2)} ${units[unit]}`
}

export function formatCount(value: number): string {
  return new Intl.NumberFormat('en-GB').format(value)
}

export function formatDate(value: string | null | undefined): string {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

/** Recording durations arrive in seconds; hours read better on a card. */
export function formatDuration(seconds: number | null | undefined): string {
  if (!seconds || seconds <= 0) return '—'
  if (seconds < 90) return `${Math.round(seconds)} s`
  const minutes = seconds / 60
  if (minutes < 90) return `${minutes.toFixed(0)} min`
  return `${(minutes / 60).toFixed(1)} h`
}

export function formatAgeRange(min: number | null, max: number | null): string | null {
  if (min === null && max === null) return null
  if (min !== null && max !== null) {
    return min === max ? `${min} y` : `${min}–${max} y`
  }
  return `${min ?? max} y`
}

export function formatChannels(
  n: number | null,
  min: number | null,
  max: number | null,
): string | null {
  if (min !== null && max !== null && min !== max) return `${min}–${max}`
  const value = n ?? min ?? max
  return value === null ? null : String(value)
}

/** The licence facet buckets, spelled the way the sidebar shows them. */
export const LICENSE_LABELS: Record<string, string> = {
  public: 'Public domain',
  attribution: 'Attribution',
  sharealike: 'Share-alike',
  noncommercial: 'Non-commercial',
  noderiv: 'No derivatives',
  unknown: 'Unknown',
}

export const VALIDATION_LABELS: Record<string, string> = {
  valid: 'BIDS valid',
  invalid: 'Has errors',
  unvalidated: 'Not validated',
}

/** Display names for the BIDS datatypes shown as the modality facet. */
export const DATATYPE_LABELS: Record<string, string> = {
  anat: 'Anatomical MRI',
  beh: 'Behavioural',
  dwi: 'Diffusion MRI',
  eeg: 'EEG',
  emg: 'EMG',
  fmap: 'Field maps',
  func: 'Functional MRI',
  ieeg: 'iEEG',
  meg: 'MEG',
  micr: 'Microscopy',
  motion: 'Motion',
  mrs: 'MR spectroscopy',
  perf: 'Perfusion',
  pet: 'PET',
  phenotype: 'Phenotype',
  nirs: 'NIRS',
}
