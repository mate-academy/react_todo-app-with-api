export interface TodoContextData {
  deletedId: number | null;
  setDeletedId: React.Dispatch<React.SetStateAction<number | null>>;
  editedId: number | null;
  setEditedId: React.Dispatch<React.SetStateAction<number | null>>;
  areAllEdited: boolean;
  setareAllEdited: React.Dispatch<React.SetStateAction<boolean>>;
  areCompletedDel: boolean;
  setCompletedDel: React.Dispatch<React.SetStateAction<boolean>>;
}
