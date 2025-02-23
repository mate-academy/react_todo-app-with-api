export type UpdatingFunction = (
  id: number,
  updatedTitle?: string,
) => Promise<void>;

export type DeletingFunction = (itemID: number) => Promise<void>;
