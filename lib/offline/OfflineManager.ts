import React from 'react';
import { Problem, QuizResult, User } from '@/types/quiz';

interface OfflineData {
  problems: Problem[];
  userProgress: {
    user: User;
    pendingResults: QuizResult[];
    lastSync: string;
  };
  cachedPages: {
    [url: string]: {
      data: any;
      timestamp: number;
      expiry: number;
    };
  };
}

interface SyncStatus {
  isOnline: boolean;
  lastSyncAttempt: string | null;
  pendingOperations: number;
  syncInProgress: boolean;
}

export class OfflineManager {
  private static instance: OfflineManager;
  private readonly OFFLINE_STORAGE_KEY = 'speedcoders_offline_data';
  private readonly SYNC_STATUS_KEY = 'speedcoders_sync_status';
  private readonly CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours
  private readonly MAX_OFFLINE_RESULTS = 100;

  private syncListeners: ((status: SyncStatus) => void)[] = [];
  private onlineListeners: ((isOnline: boolean) => void)[] = [];

  static getInstance(): OfflineManager {
    if (!OfflineManager.instance) {
      OfflineManager.instance = new OfflineManager();
    }
    return OfflineManager.instance;
  }

  private constructor() {
    if (typeof window !== 'undefined') {
      this.setupEventListeners();
      this.initializeOfflineData();
    }
  }

  private setupEventListeners(): void {
    window.addEventListener('online', () => {
      this.handleOnlineStatusChange(true);
    });

    window.addEventListener('offline', () => {
      this.handleOnlineStatusChange(false);
    });

    // Periodic sync attempt when online
    setInterval(() => {
      if (navigator.onLine) {
        this.attemptSync();
      }
    }, 30000); // Every 30 seconds
  }

  private handleOnlineStatusChange(isOnline: boolean): void {
    this.updateSyncStatus({ isOnline });
    this.notifyOnlineListeners(isOnline);

    if (isOnline) {
      // Attempt to sync when coming back online
      this.attemptSync();
    }
  }

  private initializeOfflineData(): void {
    const offlineData = this.getOfflineData();
    if (!offlineData) {
      const initialData: OfflineData = {
        problems: [],
        userProgress: {
          user: {} as User,
          pendingResults: [],
          lastSync: new Date().toISOString(),
        },
        cachedPages: {},
      };
      this.saveOfflineData(initialData);
    }

    // Initialize sync status
    const syncStatus = this.getSyncStatus();
    if (!syncStatus) {
      const initialStatus: SyncStatus = {
        isOnline: navigator.onLine,
        lastSyncAttempt: null,
        pendingOperations: 0,
        syncInProgress: false,
      };
      this.updateSyncStatus(initialStatus);
    }
  }

  // Core data management
  private getOfflineData(): OfflineData | null {
    try {
      const data = localStorage.getItem(this.OFFLINE_STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Failed to retrieve offline data:', error);
      return null;
    }
  }

  private saveOfflineData(data: OfflineData): void {
    try {
      localStorage.setItem(this.OFFLINE_STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save offline data:', error);
      // Handle storage quota exceeded
      this.cleanupOldData();
      try {
        localStorage.setItem(this.OFFLINE_STORAGE_KEY, JSON.stringify(data));
      } catch (retryError) {
        console.error('Failed to save offline data after cleanup:', retryError);
      }
    }
  }

  private getSyncStatus(): SyncStatus | null {
    try {
      const status = localStorage.getItem(this.SYNC_STATUS_KEY);
      return status ? JSON.parse(status) : null;
    } catch (error) {
      console.error('Failed to retrieve sync status:', error);
      return null;
    }
  }

  private updateSyncStatus(updates: Partial<SyncStatus>): void {
    try {
      const currentStatus = this.getSyncStatus() || {
        isOnline: navigator.onLine,
        lastSyncAttempt: null,
        pendingOperations: 0,
        syncInProgress: false,
      };

      const newStatus = { ...currentStatus, ...updates };
      localStorage.setItem(this.SYNC_STATUS_KEY, JSON.stringify(newStatus));
      
      this.notifySyncListeners(newStatus);
    } catch (error) {
      console.error('Failed to update sync status:', error);
    }
  }

  // Public API
  public isOnline(): boolean {
    return navigator.onLine;
  }

  public async cacheProblems(problems: Problem[]): Promise<void> {
    const offlineData = this.getOfflineData() || {
      problems: [],
      userProgress: { user: {} as User, pendingResults: [], lastSync: new Date().toISOString() },
      cachedPages: {},
    };

    offlineData.problems = problems;
    this.saveOfflineData(offlineData);
  }

  public getCachedProblems(): Problem[] {
    const offlineData = this.getOfflineData();
    return offlineData?.problems || [];
  }

  public async storeQuizResult(result: QuizResult, user: User): Promise<void> {
    const offlineData = this.getOfflineData() || {
      problems: [],
      userProgress: { user, pendingResults: [], lastSync: new Date().toISOString() },
      cachedPages: {},
    };

    offlineData.userProgress.user = user;

    if (this.isOnline()) {
      // Try to sync immediately if online
      try {
        await this.syncQuizResult(result);
      } catch (error) {
        console.error('Failed to sync quiz result immediately:', error);
        // Store for later sync
        offlineData.userProgress.pendingResults.push(result);
        this.updateSyncStatus({ pendingOperations: offlineData.userProgress.pendingResults.length });
      }
    } else {
      // Store for later sync
      offlineData.userProgress.pendingResults.push(result);
      
      // Limit stored results to prevent storage overflow
      if (offlineData.userProgress.pendingResults.length > this.MAX_OFFLINE_RESULTS) {
        offlineData.userProgress.pendingResults = offlineData.userProgress.pendingResults
          .slice(-this.MAX_OFFLINE_RESULTS);
      }
      
      this.updateSyncStatus({ pendingOperations: offlineData.userProgress.pendingResults.length });
    }

    this.saveOfflineData(offlineData);
  }

  public getPendingResults(): QuizResult[] {
    const offlineData = this.getOfflineData();
    return offlineData?.userProgress.pendingResults || [];
  }

  public async cachePage(url: string, data: any, customTTL?: number): Promise<void> {
    const offlineData = this.getOfflineData() || {
      problems: [],
      userProgress: { user: {} as User, pendingResults: [], lastSync: new Date().toISOString() },
      cachedPages: {},
    };

    const ttl = customTTL || this.CACHE_DURATION;
    offlineData.cachedPages[url] = {
      data,
      timestamp: Date.now(),
      expiry: Date.now() + ttl,
    };

    this.saveOfflineData(offlineData);
  }

  public getCachedPage(url: string): any | null {
    const offlineData = this.getOfflineData();
    if (!offlineData?.cachedPages[url]) {
      return null;
    }

    const cached = offlineData.cachedPages[url];
    if (Date.now() > cached.expiry) {
      // Remove expired cache
      delete offlineData.cachedPages[url];
      this.saveOfflineData(offlineData);
      return null;
    }

    return cached.data;
  }

  public async attemptSync(): Promise<boolean> {
    if (!this.isOnline()) {
      return false;
    }

    const syncStatus = this.getSyncStatus();
    if (syncStatus?.syncInProgress) {
      return false;
    }

    this.updateSyncStatus({ syncInProgress: true, lastSyncAttempt: new Date().toISOString() });

    try {
      const offlineData = this.getOfflineData();
      if (!offlineData?.userProgress.pendingResults.length) {
        this.updateSyncStatus({ syncInProgress: false, pendingOperations: 0 });
        return true;
      }

      // Sync pending quiz results
      const results = [...offlineData.userProgress.pendingResults];
      const syncedResults: QuizResult[] = [];

      for (const result of results) {
        try {
          await this.syncQuizResult(result);
          syncedResults.push(result);
        } catch (error) {
          console.error('Failed to sync quiz result:', error);
          break; // Stop syncing on first error
        }
      }

      // Remove synced results
      if (syncedResults.length > 0) {
        offlineData.userProgress.pendingResults = offlineData.userProgress.pendingResults
          .filter(result => !syncedResults.some(synced => synced.date === result.date));
        offlineData.userProgress.lastSync = new Date().toISOString();
        this.saveOfflineData(offlineData);
      }

      const remainingOperations = offlineData.userProgress.pendingResults.length;
      this.updateSyncStatus({ 
        syncInProgress: false, 
        pendingOperations: remainingOperations 
      });

      return remainingOperations === 0;
    } catch (error) {
      console.error('Sync failed:', error);
      this.updateSyncStatus({ syncInProgress: false });
      return false;
    }
  }

  private async syncQuizResult(result: QuizResult): Promise<void> {
    const response = await fetch('/api/quiz/sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(result),
    });

    if (!response.ok) {
      throw new Error(`Sync failed: ${response.statusText}`);
    }
  }

  private cleanupOldData(): void {
    try {
      const offlineData = this.getOfflineData();
      if (!offlineData) return;

      // Remove expired cached pages
      const now = Date.now();
      Object.keys(offlineData.cachedPages).forEach(url => {
        if (offlineData.cachedPages[url].expiry < now) {
          delete offlineData.cachedPages[url];
        }
      });

      // Limit pending results
      if (offlineData.userProgress.pendingResults.length > this.MAX_OFFLINE_RESULTS / 2) {
        offlineData.userProgress.pendingResults = offlineData.userProgress.pendingResults
          .slice(-Math.floor(this.MAX_OFFLINE_RESULTS / 2));
      }

      this.saveOfflineData(offlineData);
    } catch (error) {
      console.error('Failed to cleanup old data:', error);
    }
  }

  // Event listeners
  public onSyncStatusChange(listener: (status: SyncStatus) => void): void {
    this.syncListeners.push(listener);
  }

  public onOnlineStatusChange(listener: (isOnline: boolean) => void): void {
    this.onlineListeners.push(listener);
  }

  public removeSyncListener(listener: (status: SyncStatus) => void): void {
    const index = this.syncListeners.indexOf(listener);
    if (index > -1) {
      this.syncListeners.splice(index, 1);
    }
  }

  public removeOnlineListener(listener: (isOnline: boolean) => void): void {
    const index = this.onlineListeners.indexOf(listener);
    if (index > -1) {
      this.onlineListeners.splice(index, 1);
    }
  }

  private notifySyncListeners(status: SyncStatus): void {
    this.syncListeners.forEach(listener => {
      try {
        listener(status);
      } catch (error) {
        console.error('Error in sync listener:', error);
      }
    });
  }

  private notifyOnlineListeners(isOnline: boolean): void {
    this.onlineListeners.forEach(listener => {
      try {
        listener(isOnline);
      } catch (error) {
        console.error('Error in online listener:', error);
      }
    });
  }

  // Utility methods
  public getStorageStats(): {
    totalSize: number;
    problemsSize: number;
    pendingResultsSize: number;
    cachedPagesSize: number;
    storageUsagePercent: number;
  } {
    try {
      const offlineData = this.getOfflineData();
      if (!offlineData) {
        return {
          totalSize: 0,
          problemsSize: 0,
          pendingResultsSize: 0,
          cachedPagesSize: 0,
          storageUsagePercent: 0,
        };
      }

      const dataString = JSON.stringify(offlineData);
      const totalSize = new Blob([dataString]).size;

      const problemsSize = new Blob([JSON.stringify(offlineData.problems)]).size;
      const pendingResultsSize = new Blob([JSON.stringify(offlineData.userProgress.pendingResults)]).size;
      const cachedPagesSize = new Blob([JSON.stringify(offlineData.cachedPages)]).size;

      // Estimate localStorage quota (usually 10MB)
      const estimatedQuota = 10 * 1024 * 1024;
      const storageUsagePercent = (totalSize / estimatedQuota) * 100;

      return {
        totalSize,
        problemsSize,
        pendingResultsSize,
        cachedPagesSize,
        storageUsagePercent,
      };
    } catch (error) {
      console.error('Failed to get storage stats:', error);
      return {
        totalSize: 0,
        problemsSize: 0,
        pendingResultsSize: 0,
        cachedPagesSize: 0,
        storageUsagePercent: 0,
      };
    }
  }

  public clearOfflineData(): void {
    try {
      localStorage.removeItem(this.OFFLINE_STORAGE_KEY);
      localStorage.removeItem(this.SYNC_STATUS_KEY);
      this.initializeOfflineData();
    } catch (error) {
      console.error('Failed to clear offline data:', error);
    }
  }
}

// React hook for using offline manager
export const useOfflineManager = () => {
  const manager = OfflineManager.getInstance();
  const [isOnline, setIsOnline] = React.useState(manager.isOnline());
  const [syncStatus, setSyncStatus] = React.useState<SyncStatus | null>(null);

  React.useEffect(() => {
    const handleOnlineChange = (online: boolean) => setIsOnline(online);
    const handleSyncChange = (status: SyncStatus) => setSyncStatus(status);

    manager.onOnlineStatusChange(handleOnlineChange);
    manager.onSyncStatusChange(handleSyncChange);

    return () => {
      manager.removeOnlineListener(handleOnlineChange);
      manager.removeSyncListener(handleSyncChange);
    };
  }, [manager]);

  return {
    isOnline,
    syncStatus,
    attemptSync: () => manager.attemptSync(),
    cacheProblems: (problems: Problem[]) => manager.cacheProblems(problems),
    getCachedProblems: () => manager.getCachedProblems(),
    storeQuizResult: (result: QuizResult, user: User) => manager.storeQuizResult(result, user),
    getPendingResults: () => manager.getPendingResults(),
    getStorageStats: () => manager.getStorageStats(),
    clearOfflineData: () => manager.clearOfflineData(),
  };
};

export default OfflineManager;