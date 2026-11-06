/**
 * Hybrid Storage Adapter (IndexedDB + resilient localStorage).
 * Solves "Failed to execute 'setItem' on 'Storage': Setting the value exceeded the quota"
 * by storing rich data in IndexedDB (which has hundreds of MBs of storage)
 * while keeping localStorage safely synchronized and preventing QuotaExceededError crashes.
 */

const DB_NAME = 'youppi_catalog_db_v1';
const STORE_NAME = 'catalog_store';
const DB_VERSION = 1;

class StorageAdapter {
  private dbPromise: Promise<IDBDatabase | null> | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'indexedDB' in window) {
      this.initDB();
    }
  }

  private initDB(): Promise<IDBDatabase | null> {
    if (this.dbPromise) return this.dbPromise;

    this.dbPromise = new Promise((resolve) => {
      try {
        const request = window.indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event) => {
          const db = (event.target as IDBOpenDBRequest).result;
          if (!db.objectStoreNames.contains(STORE_NAME)) {
            db.createObjectStore(STORE_NAME);
          }
        };

        request.onsuccess = () => {
          resolve(request.result);
        };

        request.onerror = () => {
          console.warn('IndexedDB unavailable, falling back to localStorage');
          resolve(null);
        };
      } catch (err) {
        console.warn('Failed to open IndexedDB:', err);
        resolve(null);
      }
    });

    return this.dbPromise;
  }

  /**
   * Reads an item from IndexedDB asynchronously.
   */
  public async getIdbItem<T>(key: string): Promise<T | null> {
    try {
      const db = await this.initDB();
      if (!db) return null;

      return new Promise((resolve) => {
        try {
          const tx = db.transaction(STORE_NAME, 'readonly');
          const store = tx.objectStore(STORE_NAME);
          const req = store.get(key);

          req.onsuccess = () => {
            resolve(req.result ?? null);
          };

          req.onerror = () => {
            resolve(null);
          };
        } catch {
          resolve(null);
        }
      });
    } catch {
      return null;
    }
  }

  /**
   * Writes an item to IndexedDB asynchronously.
   */
  public async setIdbItem<T>(key: string, value: T): Promise<boolean> {
    try {
      const db = await this.initDB();
      if (!db) return false;

      return new Promise((resolve) => {
        try {
          const tx = db.transaction(STORE_NAME, 'readwrite');
          const store = tx.objectStore(STORE_NAME);
          const req = store.put(value, key);

          req.onsuccess = () => resolve(true);
          req.onerror = () => resolve(false);
        } catch {
          resolve(false);
        }
      });
    } catch {
      return false;
    }
  }

  /**
   * Safely writes to localStorage.
   * If QuotaExceededError is thrown, it strips large base64 images from the localStorage
   * cache so that localStorage remains under quota, while IndexedDB holds the full records.
   */
  public safeSetLocalStorage(key: string, rawValue: string): boolean {
    if (typeof window === 'undefined') return false;

    try {
      localStorage.setItem(key, rawValue);
      return true;
    } catch (err: any) {
      const isQuotaError =
        err?.name === 'QuotaExceededError' ||
        err?.name === 'NS_ERROR_DOM_QUOTA_REACHED' ||
        err?.code === 22 ||
        err?.code === 1014 ||
        (err?.message && err.message.toLowerCase().includes('quota'));

      if (!isQuotaError) {
        console.warn(`LocalStorage write error for ${key}:`, err);
        return false;
      }

      console.warn(`LocalStorage quota exceeded for ${key}. Applying compression & pruning strategy.`);

      // Strategy 1: If saving products, prune heavy base64 strings for localStorage copy
      if (key === 'youppi_products_v1' || key === 'nexbyte_products_v1') {
        try {
          const parsed = JSON.parse(rawValue);
          if (Array.isArray(parsed)) {
            // Keep first image and trim oversized base64 strings in localStorage copy only
            const lightened = parsed.map((item: any) => {
              if (!item.images || !Array.isArray(item.images)) return item;
              return {
                ...item,
                images: item.images.map((img: any, idx: number) => {
                  // If base64 is longer than 50KB and not primary, keep placeholder
                  if (typeof img.url === 'string' && img.url.startsWith('data:image/') && img.url.length > 50000) {
                    if (idx > 0) {
                      return { ...img, url: '' }; // omit extra secondary images in localStorage
                    }
                  }
                  return img;
                }),
              };
            });

            const lightenedStr = JSON.stringify(lightened);
            localStorage.setItem(key, lightenedStr);
            console.info('Successfully saved lightened products cache to localStorage.');
            return true;
          }
        } catch (e2) {
          console.warn('Could not lighten products for localStorage:', e2);
        }
      }

      // Strategy 2: If still overflowing, clear non-critical old logs/movements from localStorage
      try {
        localStorage.removeItem('youppi_movements_v1');
        localStorage.removeItem('nexbyte_movements_v1');
        localStorage.setItem(key, rawValue);
        return true;
      } catch {
        // Safe degrade: IndexedDB will hold the source of truth
        console.warn('Unable to write to localStorage even after pruning; relying on IndexedDB.');
        return false;
      }
    }
  }

  /**
   * Safely reads from localStorage.
   */
  public safeGetLocalStorage(key: string): string | null {
    if (typeof window === 'undefined') return null;
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  }
}

export const storageAdapter = new StorageAdapter();
