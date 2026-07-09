import { LocalStorageAdapter } from '../storage/LocalStorageAdapter'
import { DataRepository } from './DataRepository'

/**
 * App-wide repository singleton. Swapping to a cloud backend later means
 * replacing `new LocalStorageAdapter()` with a Firebase/Supabase adapter
 * that implements the same StorageAdapter interface — nothing else in the
 * app needs to change.
 */
export const repository = new DataRepository(new LocalStorageAdapter())

export { DEFAULT_SETTINGS } from './DataRepository'
