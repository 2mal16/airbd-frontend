/**
 * Offline snapshot of the catalogue.
 *
 * GENERATED FILE — do not edit. Regenerate with:
 *
 *     node scripts/snapshot-fallback.mjs [apiBaseUrl]
 *
 * The app serves this only when the API is unreachable, and always behind a
 * visible warning, so nobody mistakes it for live data.
 *
 * Captured 2026-09-22T15:43:10.553Z from https://backend-19c991af.fastapicloud.dev
 * (BIDS Dataset Explorer API 0.1.0, BIDS 1.11.1).
 */

import type {
  CatalogueStats,
  DatasetDetail,
  DatasetFacets,
  ValidationReport,
} from '@/lib/types'

export const SNAPSHOT_TAKEN_AT = "2026-09-22T15:43:10.553Z"
export const SNAPSHOT_SOURCE = "https://backend-19c991af.fastapicloud.dev"

export const FALLBACK_DATASETS: DatasetDetail[] = [
  {
    "dataset_id": "ds004148",
    "name": "Resting-state EEG with eyes open and eyes closed",
    "description": "Resting-state EEG recorded from 60 healthy adults across three sessions, alternating eyes-open and eyes-closed blocks, using a 64-channel BioSemi ActiveTwo system.",
    "status": "active",
    "visibility": "public",
    "doi": "doi:10.18112/openneuro.ds004148.v1.0.1",
    "source": "openneuro",
    "source_id": "ds004148",
    "owner_username": null,
    "created_at": "2026-09-22T15:39:43.242003Z",
    "updated_at": "2026-09-22T15:39:43.242003Z",
    "latest_version": "v1.0.1",
    "bids_version": "1.8.0",
    "modalities": [
      "eeg"
    ],
    "tasks": [
      "restEC",
      "restEO"
    ],
    "participants": 60,
    "sessions_count": 3,
    "total_files": 1447,
    "file_size": 48318382080,
    "age_min": 19,
    "age_max": 26,
    "authors": [
      "Yulin Wang",
      "Wei Duan",
      "Debo Dong",
      "Xu Lei"
    ],
    "license": "CC0",
    "license_tier": "public",
    "num_citations": 0,
    "n_channels": 64,
    "channel_count_min": 64,
    "channel_count_max": 64,
    "electrode_system": "biosemi",
    "sampling_frequency": 500,
    "power_line_frequency": 50,
    "eeg_reference": "CPz",
    "placement_scheme": "BioSemi ABC layout",
    "recording_count": 360,
    "total_recording_duration": 108000,
    "recording_duration_min": 280,
    "recording_duration_max": 320,
    "has_hed": false,
    "hed_version": null,
    "data_complete": true,
    "validation": {
      "is_valid": false,
      "error_count": 2,
      "warning_count": 1,
      "schema_version": "1.2.1",
      "error_codes": [
        "CHANNELS_TSV_MISSING",
        "PARTICIPANT_ID_MISMATCH"
      ],
      "warning_codes": [
        "JSON_KEY_RECOMMENDED"
      ]
    },
    "readme": "# Resting-state EEG\n\nResting-state EEG recorded from 60 healthy adults across three sessions, alternating eyes-open and eyes-closed blocks, using a 64-channel BioSemi ActiveTwo system.\n",
    "dataset_description": {
      "Name": "Resting-state EEG with eyes open and eyes closed",
      "BIDSVersion": "1.8.0",
      "HEDVersion": null,
      "DatasetLinks": null,
      "DatasetType": "raw",
      "License": "CC0",
      "Authors": [
        "Yulin Wang",
        "Wei Duan",
        "Debo Dong",
        "Xu Lei"
      ],
      "Keywords": [
        "resting state",
        "EEG",
        "eyes open",
        "eyes closed",
        "alpha"
      ],
      "Acknowledgements": null,
      "HowToAcknowledge": null,
      "Funding": null,
      "EthicsApprovals": null,
      "ReferencesAndLinks": null,
      "DatasetDOI": "doi:10.18112/openneuro.ds004148.v1.0.1",
      "GeneratedBy": null,
      "SourceDatasets": null
    },
    "keywords": [
      "resting state",
      "EEG",
      "eyes open",
      "eyes closed",
      "alpha"
    ],
    "funding": [],
    "ethics_approvals": [],
    "references_and_links": [],
    "how_to_acknowledge": null,
    "demographics": {
      "participants": 60,
      "with_sex": 60,
      "with_age": 60,
      "sex_counts": [
        {
          "sex": "male",
          "count": 30
        },
        {
          "sex": "female",
          "count": 30
        }
      ],
      "age_bins": [
        {
          "start": 15,
          "end": 20,
          "count": 9
        },
        {
          "start": 20,
          "end": 25,
          "count": 43
        },
        {
          "start": 25,
          "end": 30,
          "count": 8
        }
      ],
      "age_min": 19,
      "age_max": 26,
      "age_mean": 22.1,
      "age_median": 22
    },
    "session_details": [
      {
        "session_id": "01",
        "datatypes": [
          "eeg"
        ],
        "tasks": [
          "restEC",
          "restEO"
        ],
        "subject_count": 60,
        "file_count": 482,
        "size": 16106127360,
        "recording_count": 120,
        "total_recording_duration": 36000,
        "sampling_frequency": 500,
        "n_channels": 64,
        "description": "Baseline visit: eyes-closed and eyes-open blocks.",
        "metadata": {
          "Manufacturer": "BioSemi",
          "ManufacturersModelName": "ActiveTwo",
          "PowerLineFrequency": 50,
          "EEGReference": "CPz",
          "EEGPlacementScheme": "BioSemi ABC layout",
          "RecordingType": "continuous",
          "SoftwareFilters": "n/a"
        },
        "size_formatted": "15.00 GB"
      },
      {
        "session_id": "02",
        "datatypes": [
          "eeg"
        ],
        "tasks": [
          "restEC",
          "restEO"
        ],
        "subject_count": 60,
        "file_count": 482,
        "size": 16106127360,
        "recording_count": 120,
        "total_recording_duration": 36000,
        "sampling_frequency": 500,
        "n_channels": 64,
        "description": "Follow-up at one week, identical protocol.",
        "metadata": {
          "Manufacturer": "BioSemi",
          "ManufacturersModelName": "ActiveTwo",
          "PowerLineFrequency": 50,
          "EEGReference": "CPz",
          "EEGPlacementScheme": "BioSemi ABC layout",
          "RecordingType": "continuous",
          "SoftwareFilters": "n/a"
        },
        "size_formatted": "15.00 GB"
      },
      {
        "session_id": "03",
        "datatypes": [
          "eeg"
        ],
        "tasks": [
          "restEC",
          "restEO"
        ],
        "subject_count": 60,
        "file_count": 482,
        "size": 16106127360,
        "recording_count": 120,
        "total_recording_duration": 36000,
        "sampling_frequency": 500,
        "n_channels": 64,
        "description": "Follow-up at one month, identical protocol.",
        "metadata": {
          "Manufacturer": "BioSemi",
          "ManufacturersModelName": "ActiveTwo",
          "PowerLineFrequency": 50,
          "EEGReference": "CPz",
          "EEGPlacementScheme": "BioSemi ABC layout",
          "RecordingType": "continuous",
          "SoftwareFilters": "n/a"
        },
        "size_formatted": "15.00 GB"
      }
    ],
    "subjects": [
      "01",
      "02",
      "03",
      "04",
      "05",
      "06",
      "07",
      "08",
      "09",
      "10",
      "11",
      "12",
      "13",
      "14",
      "15",
      "16",
      "17",
      "18",
      "19",
      "20",
      "21",
      "22",
      "23",
      "24",
      "25",
      "26",
      "27",
      "28",
      "29",
      "30",
      "31",
      "32",
      "33",
      "34",
      "35",
      "36",
      "37",
      "38",
      "39",
      "40",
      "41",
      "42",
      "43",
      "44",
      "45",
      "46",
      "47",
      "48",
      "49",
      "50",
      "51",
      "52",
      "53",
      "54",
      "55",
      "56",
      "57",
      "58",
      "59",
      "60"
    ],
    "sessions": [
      "01",
      "02",
      "03"
    ],
    "secondary_modalities": [],
    "validated_at": "2026-09-22T15:39:43.242003Z",
    "file_size_formatted": "45.00 GB",
    "is_valid": false
  },
  {
    "dataset_id": "ds003645",
    "name": "Face processing MEEG with HED annotation",
    "description": "A HED-annotated EEG dataset used as a worked example of event annotation. Every event file carries HED tags describing stimulus, response and experimental context.",
    "status": "active",
    "visibility": "public",
    "doi": "doi:10.18112/openneuro.ds003645.v1.0.0",
    "source": "openneuro",
    "source_id": "ds003645",
    "owner_username": null,
    "created_at": "2026-09-22T15:39:43.224116Z",
    "updated_at": "2026-09-22T15:39:43.224116Z",
    "latest_version": "v1.0.0",
    "bids_version": "1.6.0",
    "modalities": [
      "eeg",
      "beh"
    ],
    "tasks": [
      "FacePerception"
    ],
    "participants": 18,
    "sessions_count": 0,
    "total_files": 289,
    "file_size": 7516192768,
    "age_min": 25,
    "age_max": 33,
    "authors": [
      "Kay Robbins",
      "Dung Truong",
      "Scott Makeig"
    ],
    "license": "CC-BY-NC-SA-4.0",
    "license_tier": "noncommercial",
    "num_citations": 0,
    "n_channels": 128,
    "channel_count_min": 128,
    "channel_count_max": 128,
    "electrode_system": "egi-geodesic",
    "sampling_frequency": 250,
    "power_line_frequency": 60,
    "eeg_reference": "average",
    "placement_scheme": "EGI HydroCel Geodesic Sensor Net 128",
    "recording_count": 54,
    "total_recording_duration": 24300,
    "recording_duration_min": 420,
    "recording_duration_max": 480,
    "has_hed": true,
    "hed_version": "8.0.0",
    "data_complete": true,
    "validation": {
      "is_valid": true,
      "error_count": 0,
      "warning_count": 1,
      "schema_version": "1.2.1",
      "error_codes": [],
      "warning_codes": [
        "TSV_COLUMN_ORDER_INCORRECT"
      ]
    },
    "readme": "# Face processing MEEG\n\nA HED-annotated EEG dataset used as a worked example of event annotation. Every event file carries HED tags describing stimulus, response and experimental context.\n",
    "dataset_description": {
      "Name": "Face processing MEEG with HED annotation",
      "BIDSVersion": "1.6.0",
      "HEDVersion": "8.0.0",
      "DatasetLinks": null,
      "DatasetType": "raw",
      "License": "CC-BY-NC-SA-4.0",
      "Authors": [
        "Kay Robbins",
        "Dung Truong",
        "Scott Makeig"
      ],
      "Keywords": [
        "HED",
        "EEG",
        "annotation",
        "events"
      ],
      "Acknowledgements": null,
      "HowToAcknowledge": null,
      "Funding": null,
      "EthicsApprovals": null,
      "ReferencesAndLinks": null,
      "DatasetDOI": "doi:10.18112/openneuro.ds003645.v1.0.0",
      "GeneratedBy": null,
      "SourceDatasets": null
    },
    "keywords": [
      "HED",
      "EEG",
      "annotation",
      "events"
    ],
    "funding": [],
    "ethics_approvals": [],
    "references_and_links": [],
    "how_to_acknowledge": null,
    "demographics": {
      "participants": 18,
      "with_sex": 18,
      "with_age": 18,
      "sex_counts": [
        {
          "sex": "male",
          "count": 9
        },
        {
          "sex": "female",
          "count": 9
        }
      ],
      "age_bins": [
        {
          "start": 25,
          "end": 30,
          "count": 14
        },
        {
          "start": 30,
          "end": 35,
          "count": 4
        }
      ],
      "age_min": 25,
      "age_max": 33,
      "age_mean": 28.3,
      "age_median": 28
    },
    "session_details": [],
    "subjects": [
      "01",
      "02",
      "03",
      "04",
      "05",
      "06",
      "07",
      "08",
      "09",
      "10",
      "11",
      "12",
      "13",
      "14",
      "15",
      "16",
      "17",
      "18"
    ],
    "sessions": [],
    "secondary_modalities": [],
    "validated_at": "2026-09-22T15:39:43.224116Z",
    "file_size_formatted": "7.00 GB",
    "is_valid": true
  },
  {
    "dataset_id": "ds002718",
    "name": "EEG: Face processing in familiar and unfamiliar faces",
    "description": "The EEG subset of the Wakeman & Henson multimodal face-processing study, converted to BIDS and annotated with HED tags so that event structure is machine-readable across the whole dataset.",
    "status": "active",
    "visibility": "public",
    "doi": "doi:10.18112/openneuro.ds002718.v1.0.5",
    "source": "openneuro",
    "source_id": "ds002718",
    "owner_username": null,
    "created_at": "2026-09-22T15:39:43.214634Z",
    "updated_at": "2026-09-22T15:39:43.214634Z",
    "latest_version": "v1.0.5",
    "bids_version": "1.10.0",
    "modalities": [
      "eeg"
    ],
    "tasks": [
      "FaceRecognition"
    ],
    "participants": 19,
    "sessions_count": 0,
    "total_files": 421,
    "file_size": 15032385536,
    "age_min": 23,
    "age_max": 35,
    "authors": [
      "Richard N. Henson",
      "Daniel G. Wakeman",
      "Alexandre Gramfort"
    ],
    "license": "CC-BY-4.0",
    "license_tier": "attribution",
    "num_citations": 0,
    "n_channels": 70,
    "channel_count_min": 70,
    "channel_count_max": 70,
    "electrode_system": "10-20",
    "sampling_frequency": 1100,
    "power_line_frequency": 50,
    "eeg_reference": "average",
    "placement_scheme": "based on the extended 10-20 system",
    "recording_count": 114,
    "total_recording_duration": 51300,
    "recording_duration_min": 430,
    "recording_duration_max": 470,
    "has_hed": true,
    "hed_version": "8.2.0",
    "data_complete": true,
    "validation": {
      "is_valid": true,
      "error_count": 0,
      "warning_count": 0,
      "schema_version": "1.2.1",
      "error_codes": [],
      "warning_codes": []
    },
    "readme": "# EEG face processing\n\nThe EEG subset of the Wakeman & Henson multimodal face-processing study, converted to BIDS and annotated with HED tags so that event structure is machine-readable across the whole dataset.\n",
    "dataset_description": {
      "Name": "EEG: Face processing in familiar and unfamiliar faces",
      "BIDSVersion": "1.10.0",
      "HEDVersion": "8.2.0",
      "DatasetLinks": null,
      "DatasetType": "raw",
      "License": "CC-BY-4.0",
      "Authors": [
        "Richard N. Henson",
        "Daniel G. Wakeman",
        "Alexandre Gramfort"
      ],
      "Keywords": [
        "EEG",
        "faces",
        "N170",
        "ERP",
        "HED"
      ],
      "Acknowledgements": null,
      "HowToAcknowledge": null,
      "Funding": null,
      "EthicsApprovals": null,
      "ReferencesAndLinks": [
        "https://doi.org/10.1038/sdata.2015.1"
      ],
      "DatasetDOI": "doi:10.18112/openneuro.ds002718.v1.0.5",
      "GeneratedBy": null,
      "SourceDatasets": null
    },
    "keywords": [
      "EEG",
      "faces",
      "N170",
      "ERP",
      "HED"
    ],
    "funding": [],
    "ethics_approvals": [],
    "references_and_links": [
      "https://doi.org/10.1038/sdata.2015.1"
    ],
    "how_to_acknowledge": null,
    "demographics": {
      "participants": 19,
      "with_sex": 19,
      "with_age": 19,
      "sex_counts": [
        {
          "sex": "male",
          "count": 9
        },
        {
          "sex": "female",
          "count": 10
        }
      ],
      "age_bins": [
        {
          "start": 20,
          "end": 25,
          "count": 7
        },
        {
          "start": 25,
          "end": 30,
          "count": 6
        },
        {
          "start": 30,
          "end": 35,
          "count": 3
        },
        {
          "start": 35,
          "end": 40,
          "count": 3
        }
      ],
      "age_min": 23,
      "age_max": 35,
      "age_mean": 27.6,
      "age_median": 26
    },
    "session_details": [],
    "subjects": [
      "01",
      "02",
      "03",
      "04",
      "05",
      "06",
      "07",
      "08",
      "09",
      "10",
      "11",
      "12",
      "13",
      "14",
      "15",
      "16",
      "17",
      "18",
      "19"
    ],
    "sessions": [],
    "secondary_modalities": [],
    "validated_at": "2026-09-22T15:39:43.214634Z",
    "file_size_formatted": "14.00 GB",
    "is_valid": true
  },
  {
    "dataset_id": "ds000117",
    "name": "Multisubject, multimodal face processing",
    "description": "Simultaneous MEG and EEG were recorded from 16 participants who viewed famous, unfamiliar and scrambled faces while performing a symmetry judgement task. Structural and functional MRI were acquired in separate sessions for the same participants.",
    "status": "active",
    "visibility": "public",
    "doi": "doi:10.18112/openneuro.ds000117.v1.0.6",
    "source": "openneuro",
    "source_id": "ds000117",
    "owner_username": null,
    "created_at": "2026-09-22T15:39:43.190332Z",
    "updated_at": "2026-09-22T15:39:43.190332Z",
    "latest_version": "v1.0.6",
    "bids_version": "1.9.0",
    "modalities": [
      "meg",
      "eeg",
      "anat",
      "func",
      "fmap"
    ],
    "tasks": [
      "facerecognition"
    ],
    "participants": 16,
    "sessions_count": 2,
    "total_files": 2807,
    "file_size": 91622478336,
    "age_min": 22,
    "age_max": 38,
    "authors": [
      "Daniel G. Wakeman",
      "Richard N. Henson"
    ],
    "license": "CC0",
    "license_tier": "public",
    "num_citations": 0,
    "n_channels": 74,
    "channel_count_min": 70,
    "channel_count_max": 74,
    "electrode_system": "10-10",
    "sampling_frequency": 1100,
    "power_line_frequency": 50,
    "eeg_reference": "nose",
    "placement_scheme": "extended 10-10 system",
    "recording_count": 96,
    "total_recording_duration": 43200,
    "recording_duration_min": 420,
    "recording_duration_max": 480,
    "has_hed": false,
    "hed_version": null,
    "data_complete": true,
    "validation": {
      "is_valid": true,
      "error_count": 0,
      "warning_count": 3,
      "schema_version": "1.2.1",
      "error_codes": [],
      "warning_codes": [
        "EVENTS_TSV_MISSING",
        "JSON_KEY_RECOMMENDED",
        "README_FILE_SMALL"
      ]
    },
    "readme": "# Multisubject, multimodal face processing\n\nSimultaneous MEG and EEG were recorded from 16 participants who viewed famous, unfamiliar and scrambled faces while performing a symmetry judgement task. Structural and functional MRI were acquired in separate sessions for the same participants.\n\n## Task\n\nSix runs per participant, each about 7.5 minutes long.\n",
    "dataset_description": {
      "Name": "Multisubject, multimodal face processing",
      "BIDSVersion": "1.9.0",
      "HEDVersion": null,
      "DatasetLinks": null,
      "DatasetType": "raw",
      "License": "CC0",
      "Authors": [
        "Daniel G. Wakeman",
        "Richard N. Henson"
      ],
      "Keywords": [
        "face processing",
        "MEG",
        "EEG",
        "fMRI",
        "multimodal"
      ],
      "Acknowledgements": null,
      "HowToAcknowledge": "Please cite Wakeman & Henson (2015), Scientific Data 2:150001.",
      "Funding": [
        "UK Medical Research Council MC_US_A060_0046"
      ],
      "EthicsApprovals": [
        "Cambridge Psychology Research Ethics Committee (CPREC 2005.08)"
      ],
      "ReferencesAndLinks": [
        "https://doi.org/10.1038/sdata.2015.1"
      ],
      "DatasetDOI": "doi:10.18112/openneuro.ds000117.v1.0.6",
      "GeneratedBy": null,
      "SourceDatasets": null
    },
    "keywords": [
      "face processing",
      "MEG",
      "EEG",
      "fMRI",
      "multimodal"
    ],
    "funding": [
      "UK Medical Research Council MC_US_A060_0046"
    ],
    "ethics_approvals": [
      "Cambridge Psychology Research Ethics Committee (CPREC 2005.08)"
    ],
    "references_and_links": [
      "https://doi.org/10.1038/sdata.2015.1"
    ],
    "how_to_acknowledge": "Please cite Wakeman & Henson (2015), Scientific Data 2:150001.",
    "demographics": {
      "participants": 16,
      "with_sex": 16,
      "with_age": 16,
      "sex_counts": [
        {
          "sex": "male",
          "count": 8
        },
        {
          "sex": "female",
          "count": 8
        }
      ],
      "age_bins": [
        {
          "start": 20,
          "end": 25,
          "count": 4
        },
        {
          "start": 25,
          "end": 30,
          "count": 6
        },
        {
          "start": 30,
          "end": 35,
          "count": 4
        },
        {
          "start": 35,
          "end": 40,
          "count": 2
        }
      ],
      "age_min": 22,
      "age_max": 38,
      "age_mean": 28.6,
      "age_median": 28
    },
    "session_details": [
      {
        "session_id": "meg",
        "datatypes": [
          "meg",
          "eeg"
        ],
        "tasks": [
          "facerecognition"
        ],
        "subject_count": 16,
        "file_count": 1632,
        "size": 74088775680,
        "recording_count": 96,
        "total_recording_duration": 43200,
        "sampling_frequency": 1100,
        "n_channels": 376,
        "description": "Simultaneous MEG and EEG, six runs of the face-recognition task.",
        "metadata": {
          "Manufacturer": "Elekta",
          "ManufacturersModelName": "TRIUX",
          "PowerLineFrequency": 50,
          "DewarPosition": "upright",
          "SoftwareFilters": "n/a",
          "EEGReference": "nose"
        },
        "size_formatted": "69.00 GB"
      },
      {
        "session_id": "mri",
        "datatypes": [
          "anat",
          "func",
          "fmap"
        ],
        "tasks": [
          "facerecognition"
        ],
        "subject_count": 16,
        "file_count": 1175,
        "size": 17533702656,
        "recording_count": 144,
        "total_recording_duration": 30240,
        "sampling_frequency": null,
        "n_channels": null,
        "description": "Structural and functional MRI acquired in a separate visit.",
        "metadata": {
          "Manufacturer": "Siemens",
          "ManufacturersModelName": "TrioTim",
          "MagneticFieldStrength": 3,
          "RepetitionTime": 2,
          "EchoTime": 0.03
        },
        "size_formatted": "16.33 GB"
      }
    ],
    "subjects": [
      "01",
      "02",
      "03",
      "04",
      "05",
      "06",
      "07",
      "08",
      "09",
      "10",
      "11",
      "12",
      "13",
      "14",
      "15",
      "16"
    ],
    "sessions": [
      "meg",
      "mri"
    ],
    "secondary_modalities": [
      "MRI_Structural",
      "MRI_Functional"
    ],
    "validated_at": "2026-09-22T15:39:43.190332Z",
    "file_size_formatted": "85.33 GB",
    "is_valid": true
  }
]

export const FALLBACK_REPORTS: Record<string, ValidationReport> = {
  "ds004148": {
    "dataset_id": "ds004148",
    "validated_at": "2026-09-22T15:39:43.242003+00:00",
    "summary": {
      "is_valid": false,
      "error_count": 2,
      "warning_count": 1,
      "schema_version": "1.2.1",
      "error_codes": [
        "CHANNELS_TSV_MISSING",
        "PARTICIPANT_ID_MISMATCH"
      ],
      "warning_codes": [
        "JSON_KEY_RECOMMENDED"
      ]
    },
    "issues": [
      {
        "code": "CHANNELS_TSV_MISSING",
        "subCode": null,
        "severity": "error",
        "location": "/sub-42/ses-03/eeg/sub-42_ses-03_task-restEC_eeg.bdf",
        "issueMessage": "A required channels.tsv file is missing for this recording.",
        "suggestion": null,
        "affects": null,
        "rule": "rules.files.raw.eeg.channels",
        "line": null,
        "character": null
      },
      {
        "code": "PARTICIPANT_ID_MISMATCH",
        "subCode": null,
        "severity": "error",
        "location": "/participants.tsv",
        "issueMessage": "participants.tsv lists sub-61, which has no directory in the dataset.",
        "suggestion": null,
        "affects": null,
        "rule": "rules.checks.dataset.ParticipantIDMismatch",
        "line": null,
        "character": null
      },
      {
        "code": "JSON_KEY_RECOMMENDED",
        "subCode": "Manufacturer",
        "severity": "warning",
        "location": "/task-restEO_eeg.json",
        "issueMessage": "A JSON file is missing a key listed as recommended.",
        "suggestion": null,
        "affects": null,
        "rule": "rules.sidecars.eeg.EEGHardware",
        "line": null,
        "character": null
      }
    ]
  },
  "ds003645": {
    "dataset_id": "ds003645",
    "validated_at": "2026-09-22T15:39:43.224116+00:00",
    "summary": {
      "is_valid": true,
      "error_count": 0,
      "warning_count": 1,
      "schema_version": "1.2.1",
      "error_codes": [],
      "warning_codes": [
        "TSV_COLUMN_ORDER_INCORRECT"
      ]
    },
    "issues": [
      {
        "code": "TSV_COLUMN_ORDER_INCORRECT",
        "subCode": null,
        "severity": "warning",
        "location": "/sub-003/eeg/sub-003_task-FacePerception_run-2_events.tsv",
        "issueMessage": "Some TSV columns are in the wrong order.",
        "suggestion": null,
        "affects": null,
        "rule": "rules.tabular_data.task.Events",
        "line": null,
        "character": null
      }
    ]
  },
  "ds002718": {
    "dataset_id": "ds002718",
    "validated_at": "2026-09-22T15:39:43.214634+00:00",
    "summary": {
      "is_valid": true,
      "error_count": 0,
      "warning_count": 0,
      "schema_version": "1.2.1",
      "error_codes": [],
      "warning_codes": []
    },
    "issues": []
  },
  "ds000117": {
    "dataset_id": "ds000117",
    "validated_at": "2026-09-22T15:39:43.190332+00:00",
    "summary": {
      "is_valid": true,
      "error_count": 0,
      "warning_count": 3,
      "schema_version": "1.2.1",
      "error_codes": [],
      "warning_codes": [
        "EVENTS_TSV_MISSING",
        "JSON_KEY_RECOMMENDED",
        "README_FILE_SMALL"
      ]
    },
    "issues": [
      {
        "code": "README_FILE_SMALL",
        "subCode": null,
        "severity": "warning",
        "location": "/README",
        "issueMessage": "The recommended file /README is very small. Please consider expanding it with additional information about the dataset.",
        "suggestion": null,
        "affects": null,
        "rule": "rules.checks.dataset.README",
        "line": null,
        "character": null
      },
      {
        "code": "JSON_KEY_RECOMMENDED",
        "subCode": "InstitutionName",
        "severity": "warning",
        "location": "/sub-01/ses-meg/meg/sub-01_ses-meg_task-facerecognition_run-01_meg.json",
        "issueMessage": "A JSON file is missing a key listed as recommended.",
        "suggestion": null,
        "affects": null,
        "rule": "rules.sidecars.meg.MEGHardware",
        "line": null,
        "character": null
      },
      {
        "code": "EVENTS_TSV_MISSING",
        "subCode": null,
        "severity": "warning",
        "location": "/sub-04/ses-meg/meg/sub-04_ses-meg_task-facerecognition_run-06_meg.fif",
        "issueMessage": "Task scans should have a corresponding events.tsv file.",
        "suggestion": null,
        "affects": null,
        "rule": "rules.checks.func.EventsMissing",
        "line": null,
        "character": null
      }
    ]
  }
}

export const FALLBACK_FACETS: DatasetFacets = {
  "modality": [
    {
      "value": "eeg",
      "count": 4
    },
    {
      "value": "anat",
      "count": 1
    },
    {
      "value": "beh",
      "count": 1
    },
    {
      "value": "fmap",
      "count": 1
    },
    {
      "value": "func",
      "count": 1
    },
    {
      "value": "meg",
      "count": 1
    }
  ],
  "license": [
    {
      "value": "public",
      "count": 2
    },
    {
      "value": "attribution",
      "count": 1
    },
    {
      "value": "noncommercial",
      "count": 1
    }
  ],
  "electrode-system": [
    {
      "value": "10-10",
      "count": 1
    },
    {
      "value": "10-20",
      "count": 1
    },
    {
      "value": "biosemi",
      "count": 1
    },
    {
      "value": "egi-geodesic",
      "count": 1
    }
  ],
  "powerline": [
    {
      "value": "50",
      "count": 3
    },
    {
      "value": "60",
      "count": 1
    }
  ],
  "bids-version": [
    {
      "value": "1.10.0",
      "count": 1
    },
    {
      "value": "1.6.0",
      "count": 1
    },
    {
      "value": "1.8.0",
      "count": 1
    },
    {
      "value": "1.9.0",
      "count": 1
    }
  ],
  "hed-version": [
    {
      "value": "8.0.0",
      "count": 1
    },
    {
      "value": "8.2.0",
      "count": 1
    }
  ],
  "source": [
    {
      "value": "openneuro",
      "count": 4
    }
  ],
  "validation": [
    {
      "value": "valid",
      "count": 3
    },
    {
      "value": "invalid",
      "count": 1
    }
  ],
  "task": {
    "values": [
      {
        "value": "FacePerception",
        "count": 1
      },
      {
        "value": "FaceRecognition",
        "count": 1
      },
      {
        "value": "facerecognition",
        "count": 1
      },
      {
        "value": "restEC",
        "count": 1
      },
      {
        "value": "restEO",
        "count": 1
      }
    ],
    "distinct_total": 5,
    "truncated": false
  }
}

export const FALLBACK_STATS: CatalogueStats = {
  "dataset_count": 4,
  "participant_count": 113,
  "session_count": 5,
  "file_count": 4964,
  "total_size": 162489438720,
  "demographics": {
    "participants": 113,
    "with_sex": 113,
    "with_age": 113,
    "sex_counts": [
      {
        "sex": "male",
        "count": 56
      },
      {
        "sex": "female",
        "count": 57
      }
    ],
    "age_bins": [
      {
        "start": 15,
        "end": 20,
        "count": 9
      },
      {
        "start": 20,
        "end": 25,
        "count": 54
      },
      {
        "start": 25,
        "end": 30,
        "count": 34
      },
      {
        "start": 30,
        "end": 35,
        "count": 11
      },
      {
        "start": 35,
        "end": 40,
        "count": 5
      }
    ],
    "age_min": 19,
    "age_max": 38,
    "age_mean": 24.9,
    "age_median": 24
  },
  "modality": [
    {
      "value": "eeg",
      "count": 4
    },
    {
      "value": "anat",
      "count": 1
    },
    {
      "value": "beh",
      "count": 1
    },
    {
      "value": "fmap",
      "count": 1
    },
    {
      "value": "func",
      "count": 1
    },
    {
      "value": "meg",
      "count": 1
    }
  ],
  "license": [
    {
      "value": "public",
      "count": 2
    },
    {
      "value": "attribution",
      "count": 1
    },
    {
      "value": "noncommercial",
      "count": 1
    }
  ],
  "bids_version": [
    {
      "value": "1.10.0",
      "count": 1
    },
    {
      "value": "1.6.0",
      "count": 1
    },
    {
      "value": "1.8.0",
      "count": 1
    },
    {
      "value": "1.9.0",
      "count": 1
    }
  ],
  "electrode_system": [
    {
      "value": "10-10",
      "count": 1
    },
    {
      "value": "10-20",
      "count": 1
    },
    {
      "value": "biosemi",
      "count": 1
    },
    {
      "value": "egi-geodesic",
      "count": 1
    }
  ],
  "validation": [
    {
      "value": "valid",
      "count": 3
    },
    {
      "value": "invalid",
      "count": 1
    }
  ],
  "top_error_codes": [
    {
      "value": "CHANNELS_TSV_MISSING",
      "count": 1
    },
    {
      "value": "PARTICIPANT_ID_MISMATCH",
      "count": 1
    }
  ],
  "top_warning_codes": [
    {
      "value": "JSON_KEY_RECOMMENDED",
      "count": 2
    },
    {
      "value": "EVENTS_TSV_MISSING",
      "count": 1
    },
    {
      "value": "README_FILE_SMALL",
      "count": 1
    },
    {
      "value": "TSV_COLUMN_ORDER_INCORRECT",
      "count": 1
    }
  ],
  "session_counts": [
    {
      "value": "0",
      "count": 2
    },
    {
      "value": "2",
      "count": 1
    },
    {
      "value": "3",
      "count": 1
    }
  ],
  "session_datatypes": [
    {
      "value": "eeg",
      "count": 4
    },
    {
      "value": "anat",
      "count": 1
    },
    {
      "value": "fmap",
      "count": 1
    },
    {
      "value": "func",
      "count": 1
    },
    {
      "value": "meg",
      "count": 1
    }
  ],
  "datasets": [
    {
      "dataset_id": "ds000117",
      "name": "Multisubject, multimodal face processing",
      "participants": 16,
      "sessions_count": 2,
      "file_size": 91622478336,
      "total_files": 2807,
      "modalities": [
        "meg",
        "eeg",
        "anat",
        "func",
        "fmap"
      ],
      "is_valid": true
    },
    {
      "dataset_id": "ds002718",
      "name": "EEG: Face processing in familiar and unfamiliar faces",
      "participants": 19,
      "sessions_count": 0,
      "file_size": 15032385536,
      "total_files": 421,
      "modalities": [
        "eeg"
      ],
      "is_valid": true
    },
    {
      "dataset_id": "ds003645",
      "name": "Face processing MEEG with HED annotation",
      "participants": 18,
      "sessions_count": 0,
      "file_size": 7516192768,
      "total_files": 289,
      "modalities": [
        "eeg",
        "beh"
      ],
      "is_valid": true
    },
    {
      "dataset_id": "ds004148",
      "name": "Resting-state EEG with eyes open and eyes closed",
      "participants": 60,
      "sessions_count": 3,
      "file_size": 48318382080,
      "total_files": 1447,
      "modalities": [
        "eeg"
      ],
      "is_valid": false
    }
  ],
  "growth": [
    {
      "date": "2026-09-22",
      "datasets": 4,
      "cumulative_datasets": 4,
      "cumulative_participants": 113
    }
  ],
  "total_size_formatted": "151.33 GB"
}
