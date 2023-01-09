import {
  createContext,
  FC,
  useCallback,
  useContext,
  useMemo,
} from 'react';
import { deleteTodo } from '../api/todos';
import { GlobalContext } from './GlobalContext';

type Props = {
  children: JSX.Element,
};

interface ContextType {
  onDelete: (id: number) => void,
  onClearCompleted: () => void,
  isClearCompletedHidden: boolean,
}

export const DeleteContext = createContext<ContextType>({
  onDelete: () => { },
  onClearCompleted: () => { },
  isClearCompletedHidden: false,
});

export const DeleteProvider: FC<Props> = ({ children }) => {
  const {
    todos,
    setIsLoading,
    setTodos,
    showError,
  } = useContext(GlobalContext);

  const onDelete = useCallback((id: number) => {
    setIsLoading((currentArrIsDelete) => [...currentArrIsDelete, id]);

    deleteTodo(id)
      .then(() => {
        setTodos((currentTodos) => {
          return currentTodos.filter(todo => todo.id !== id);
        });
      })
      .catch(() => showError('Unable to delete a todo'))
      .finally(() => {
        setIsLoading((currentArrIsDelete) => {
          return currentArrIsDelete
            .filter(idOfDeletingItem => idOfDeletingItem !== id);
        });
      });
  }, []);

  const onClearCompleted = useCallback(() => {
    todos.forEach(({ id, completed }) => {
      if (completed) {
        onDelete(id);
      }
    });
  }, [todos]);

  const isClearCompletedHidden: boolean = useMemo(() => {
    return todos.some(({ completed }) => completed);
  }, [todos]);

  const contextValue: ContextType = useMemo(() => {
    return {
      onDelete,
      onClearCompleted,
      isClearCompletedHidden,
    };
  }, [todos]);

  return (
    <DeleteContext.Provider value={contextValue}>
      {children}
    </DeleteContext.Provider>
  );
};
