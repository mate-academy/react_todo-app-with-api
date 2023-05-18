import { ReactNode, useState } from 'react';
import { TodoListContext } from './TodoListContext';

type Props = {
  children: ReactNode;
};

export const TodoListContextProvider: React.FC<Props> = ({ children }) => {
  const [deletedId, setDeletedId] = useState<number | null>(null);
  const [editedId, setEditedId] = useState<number | null>(null);
  const [areAllEdited, setareAllEdited] = useState(false);
  const [areCompletedDel, setCompletedDel] = useState(false);

  const contextValue = {
    deletedId,
    setDeletedId,
    editedId,
    setEditedId,
    areAllEdited,
    setareAllEdited,
    areCompletedDel,
    setCompletedDel,
  };

  return (
    <TodoListContext.Provider value={contextValue}>
      {children}
    </TodoListContext.Provider>
  );
};
