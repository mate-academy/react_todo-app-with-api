class StorageService {
  private static readonly _id = 'currentUserId';

  public static setCurrentUserId(id: number): void {
    localStorage.setItem(StorageService._id, `${id}`);
  }

  public static removeCurrentUserId(): void {
    localStorage.removeItem(StorageService._id);
  }

  public static getCurrentUserId():string | null {
    return localStorage.getItem(StorageService._id) || null;
  }
}

export default StorageService;
