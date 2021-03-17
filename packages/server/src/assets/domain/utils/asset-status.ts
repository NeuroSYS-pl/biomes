export enum AssetStatus {
  UPLOADING = 'uploading',
  PROCESSING = 'processing',
  INVALID = 'invalid',
  READY = 'ready',
}

export enum AssetInvalidityReason {
  TIMEOUT = 'timeout',
  CHECKSUM = 'checksum',
  INTERNAL = 'internal',
}
