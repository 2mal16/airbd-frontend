/**
 * The BIDS Dataset Explorer API's wire types.
 *
 * Mirrors the backend's OpenAPI schema (`/openapi.json`). The BIDS vocabulary
 * below — datatypes, licence tiers, electrode systems — is generated on the
 * server from the BIDS specification schema, which is why it is enumerated
 * here rather than typed as `string`.
 */

export const DATATYPES = [
  'anat',
  'beh',
  'dwi',
  'eeg',
  'emg',
  'fmap',
  'func',
  'ieeg',
  'meg',
  'micr',
  'motion',
  'mrs',
  'perf',
  'pet',
  'phenotype',
  'nirs',
] as const
export type Datatype = (typeof DATATYPES)[number]

export const LICENSE_TIERS = [
  'public',
  'attribution',
  'sharealike',
  'noncommercial',
  'noderiv',
  'unknown',
] as const
export type LicenseTier = (typeof LICENSE_TIERS)[number]

export const ELECTRODE_SYSTEMS = [
  '10-05',
  '10-10',
  '10-20',
  'biosemi',
  'egi-geodesic',
  'other',
] as const
export type ElectrodeSystem = (typeof ELECTRODE_SYSTEMS)[number]

export const SORT_ORDERS = [
  'newest',
  'oldest',
  'name',
  'participants',
  'size',
  'citations',
  'validation',
] as const
export type SortOrder = (typeof SORT_ORDERS)[number]

export type SourceArchive = 'openneuro' | 'nemar' | 'gin' | 'local' | 'other'

export interface ValidationSummary {
  is_valid: boolean
  error_count: number
  warning_count: number
  schema_version: string | null
  error_codes: string[]
  warning_codes: string[]
}

export interface DatasetSummary {
  dataset_id: string
  name: string
  description: string | null
  status: string
  visibility: string
  doi: string | null
  source: SourceArchive | null
  source_id: string | null
  owner_username: string | null
  created_at: string
  updated_at: string
  latest_version: string | null
  bids_version: string | null
  modalities: Datatype[]
  tasks: string[]
  participants: number
  sessions_count: number
  total_files: number
  file_size: number
  age_min: number | null
  age_max: number | null
  authors: string[]
  license: string | null
  license_tier: LicenseTier
  num_citations: number
  n_channels: number | null
  channel_count_min: number | null
  channel_count_max: number | null
  electrode_system: ElectrodeSystem | null
  sampling_frequency: number | null
  power_line_frequency: number | null
  eeg_reference: string | null
  placement_scheme: string | null
  recording_count: number | null
  total_recording_duration: number | null
  recording_duration_min: number | null
  recording_duration_max: number | null
  has_hed: boolean
  hed_version: string | null
  data_complete: boolean
  validation: ValidationSummary | null
  file_size_formatted: string
  is_valid: boolean | null
}

export interface DatasetDescription {
  Name: string
  BIDSVersion: string
  DatasetType?: string | null
  License?: string | null
  Authors?: string[] | null
  Keywords?: string[] | null
  HowToAcknowledge?: string | null
  Funding?: string[] | null
  EthicsApprovals?: string[] | null
  ReferencesAndLinks?: string[] | null
  DatasetDOI?: string | null
  HEDVersion?: string | string[] | null
  [key: string]: unknown
}

export interface DatasetDetail extends DatasetSummary {
  demographics: Demographics
  session_details: SessionSummary[]
  readme: string | null
  dataset_description: DatasetDescription | null
  keywords: string[]
  funding: string[]
  ethics_approvals: string[]
  references_and_links: string[]
  how_to_acknowledge: string | null
  subjects: string[]
  sessions: string[]
  secondary_modalities: string[]
  validated_at: string | null
}

export interface DatasetListEnvelope {
  datasets: DatasetSummary[]
  count: number
  total_count: number
  limit: number
  offset: number
}

export interface SearchHit {
  dataset_id: string
  name: string
  modalities: Datatype[]
  participants: number
  doi: string | null
  tasks: string[]
  authors: string[]
  has_hed: boolean
  score: number
  snippet: string
}

export interface DatasetSearchEnvelope {
  results: SearchHit[]
  count: number
  total_count: number
  limit: number
  offset: number
  method: 'exact_id' | 'text' | 'unavailable'
  min_score: number
}

export interface FacetValue {
  value: string
  count: number
}

export interface DatasetFacets {
  modality: FacetValue[]
  license: FacetValue[]
  'electrode-system': FacetValue[]
  powerline: FacetValue[]
  'bids-version': FacetValue[]
  'hed-version': FacetValue[]
  source: FacetValue[]
  validation: FacetValue[]
  task: { values: FacetValue[]; distinct_total: number; truncated: boolean }
}

export interface Issue {
  code: string
  subCode: string | null
  severity: 'error' | 'warning' | 'ignore'
  location: string | null
  issueMessage: string | null
  suggestion: string | null
  affects: string[] | null
  rule: string | null
  line: number | null
  character: number | null
}

export interface ValidationReport {
  dataset_id: string
  validated_at: string | null
  summary: ValidationSummary
  issues: Issue[]
}

export interface TermDefinition {
  value: string
  display_name: string
  description: string | null
}

export interface PathCheck {
  path: string
  is_bids: boolean
  subject: string | null
  session: string | null
  datatype: Datatype | null
  suffix: string | null
  extension: string | null
  entities: Record<string, string>
}

export interface PathCheckResponse {
  results: PathCheck[]
  valid_count: number
  invalid_count: number
}

export interface ServiceInfo {
  name: string
  version: string
  bids_version: string
  bids_schema_version: string
  datasets: number
}

// --- demographics, sessions and statistics ----------------------------------

export const SEXES = ['male', 'female', 'other', 'unknown'] as const
export type Sex = (typeof SEXES)[number]

export interface SexCount {
  sex: Sex
  count: number
}

export interface AgeBin {
  start: number
  end: number
  count: number
}

export interface Demographics {
  participants: number
  /** How many participants actually declared a sex — a chart must state its coverage. */
  with_sex: number
  with_age: number
  sex_counts: SexCount[]
  age_bins: AgeBin[]
  age_min: number | null
  age_max: number | null
  age_mean: number | null
  age_median: number | null
}

export interface SessionSummary {
  session_id: string
  datatypes: Datatype[]
  tasks: string[]
  subject_count: number | null
  file_count: number | null
  size: number | null
  recording_count: number | null
  total_recording_duration: number | null
  sampling_frequency: number | null
  n_channels: number | null
  description: string | null
  metadata: Record<string, unknown>
  size_formatted: string | null
}

export interface DatasetPoint {
  dataset_id: string
  name: string
  participants: number
  sessions_count: number
  file_size: number
  total_files: number
  modalities: Datatype[]
  is_valid: boolean | null
}

export interface GrowthPoint {
  date: string
  datasets: number
  cumulative_datasets: number
  cumulative_participants: number
}

export interface CatalogueStats {
  dataset_count: number
  participant_count: number
  session_count: number
  file_count: number
  total_size: number
  total_size_formatted: string
  demographics: Demographics
  modality: FacetValue[]
  license: FacetValue[]
  bids_version: FacetValue[]
  electrode_system: FacetValue[]
  validation: FacetValue[]
  top_error_codes: FacetValue[]
  top_warning_codes: FacetValue[]
  session_counts: FacetValue[]
  session_datatypes: FacetValue[]
  datasets: DatasetPoint[]
  growth: GrowthPoint[]
}
