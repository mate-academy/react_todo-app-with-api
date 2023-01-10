import {
  createContext,
  FC,
  useCallback,
  useContext,
  useMemo,
} from 'react';
import { editTodo } from '../api/todos';
import { Todo } from '../types/Todo';
import { DeleteContext } from './DeleteContext';
import { GlobalContext } from './GlobalContext';

type Props = {
  children: JSX.Element,
};

interface ContextType {
  onToggle: (id: number) => void,
  onToggleAll: () => void,
  onRename: (newTitle: string, id: number) => void,
  isToggleAllActive: boolean,
}

export const EditContext = createContext<ContextType>({
  onToggle: () => { },
  onToggleAll: () => { },
  onRename: () => { },
  isToggleAllActive: false,
});

export const EditProvider: FC<Props> = ({ children }) => {
  const {
    todos,
    setTodos,
    showError,
    setIsLoading,
  } = useContext(GlobalContext);

  const {
    onDelete,
  } = useContext(DeleteContext);

  const onToggle = useCallback((id: number) => {
    setIsLoading((currentArrIsDelete) => [...currentArrIsDelete, id]);
    const todoToedit = todos.find(todo => todo.id === id);

    if (!todoToedit) {
      showError('Unable to update a todo');

      return;
    }

    const newData: Pick<Todo, 'completed'> = {
      completed: !todoToedit.completed,
    };

    editTodo(id, newData)
      .then(() => {
        setTodos((currentTodos) => {
          return currentTodos.map(todo => {
            if (todo.id === id) {
              return {
                ...todo,
                ...newData,
              };
            }

            return todo;
          });
        });
      })
      .catch(() => showError('Unable to update a todo'))
      .finally(() => {
        setIsLoading((areLoadingNow) => {
          return areLoadingNow
            .filter(idOfLoadedTodo => idOfLoadedTodo !== id);
        });
      });
  }, [todos]);

  const onToggleAll = useCallback(() => {
    const areAllCompleted = todos.every(todo => todo.completed);

    if (!areAllCompleted) {
      todos.forEach(todo => {
        if (!todo.completed) {
          onToggle(todo.id);
        }
      });

      return;
    }

    todos.forEach(todo => {
      onToggle(todo.id);
    });
  }, [todos]);

  const onRename = useCallback((newTitle: string, id: number) => {
    const todoToedit = todos.find(todo => todo.id === id);

    if (!todoToedit) {
      showError('Unable to update a todo');

      return;
    }

    const oldTitle = todoToedit.title.trim();

    if (newTitle.trim() === oldTitle) {
      return;
    }

    if (newTitle.trim() === '') {
      onDelete(id);

      return;
    }

    const newData: Pick<Todo, 'title'> = {
      title: newTitle,
    };

    setIsLoading((currentArrIsDelete) => [...currentArrIsDelete, id]);

    editTodo(id, newData)
      .then(() => {
        setTodos((currentTodos) => {
          return currentTodos.map(todo => {
            if (todo.id === id) {
              return {
                ...todo,
                ...newData,
              };
            }

            return todo;
          });
        });
      })
      .catch(() => showError('Unable to update a todo'))
      .finally(() => {
        setIsLoading((areLoadingNow) => {
          return areLoadingNow
            .filter(idOfLoadedTodo => idOfLoadedTodo !== id);
        });
      });
  }, [todos]);

  const isToggleAllActive: boolean = useMemo(() => {
    return todos.every(({ completed }) => completed);
  }, [todos]);

  const contextValue: ContextType = useMemo(() => {
    return {
      onToggle,
      onToggleAll,
      onRename,
      isToggleAllActive,
    };
  }, [todos]);

  return (
    <EditContext.Provider value={contextValue}>
      {children}
    </EditContext.Provider>
  );
};
