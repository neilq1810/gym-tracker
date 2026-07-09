/**
 * Minimal async key-value contract for persistence.
 *
 * Every method returns a Promise even though the current implementation
 * (LocalStorageAdapter) is synchronous under the hood. That keeps the
 * repository layer — and every caller above it — agnostic to whether data
 * lives in localStorage today or a Firebase/Supabase backend tomorrow;
 * swapping the adapter is the only change a future cloud migration needs.
 */
export interface StorageAdapter {
  getItem<T>(key: string): Promise<T | null>
  setItem<T>(key: string, value: T): Promise<void>
  removeItem(key: string): Promise<void>
}
