import React, {
  createRef,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Todo } from '../types/Todo';
import * as postService from '../api/todos';

enum FilerType {
  ALL = 'all',
  ACTIVE = 'active',
  COMPLETED = 'completed',
}

type TodosContextType = {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  toggleAll: () => void;
  addTodo: (newTodo: Todo) => Promise<void>;
  isAllTodosCompleted: boolean;
  updateTodo: (newTodo: Todo) => Promise<void>;
  deleteTodo: (deletedTodo: Todo) => void;
  clearCompleted: () => void;
  filterField: FilerType;
  setFilterField: React.Dispatch<React.SetStateAction<FilerType>>;
  visibleTodos: Todo[];
  todoRef: React.RefObject<HTMLInputElement>;
  errorMessage: string;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  stateClearBtn: boolean;
  setStateClearBtn: React.Dispatch<React.SetStateAction<boolean>>;
  isSubmitting: boolean;
  setIsSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
  tempTodo: Todo | null;
  loadingIds: number[];
};

export const TodosContext = React.createContext<TodosContextType>({
  todos: [],
  setTodos: () => {},
  toggleAll: () => {},
  addTodo: async () => {},
  isAllTodosCompleted: false,
  updateTodo: async () => {},
  deleteTodo: () => {},
  clearCompleted: () => {},
  filterField: FilerType.ALL,
  setFilterField: () => {},
  visibleTodos: [],
  todoRef: createRef(),
  errorMessage: '',
  setErrorMessage: () => {},
  stateClearBtn: false,
  setStateClearBtn: () => {},
  isSubmitting: false,
  setIsSubmitting: () => {},
  tempTodo: null,
  loadingIds: [],
});

type Props = {
  children: React.ReactNode;
};

export const TodosProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterField, setFilterField] = useState(FilerType.ALL);
  const [errorMessage, setErrorMessage] = useState('');
  const [stateClearBtn, setStateClearBtn] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const [loadingIds, setLoadingIds] = useState<number[]>([]);

  const todoRef = useRef<HTMLInputElement>(null);

  useMemo(() => {
    if (todos.find(todo => todo.completed)) {
      setStateClearBtn(false);
    } else {
      setStateClearBtn(true);
    }
  }, [todos]);

  const addTodo = useCallback(({ title, completed, userId }: Todo) => {
    setErrorMessage('');

    if (title.trim() !== '') {
      setTempTodo({ id: 0, title, completed, userId });
    }

    return postService
      .createTodos({ title, completed, userId })
      .then(newTodo => {
        setTodos(curentTodos => [...curentTodos, newTodo]);
      })
      .catch(error => {
        setErrorMessage('Unable to add a todo');
        setTimeout(() => setErrorMessage(''), 3000);
        throw error;
      })
      .finally(() => {
        setTempTodo(null);
      });
  }, []);

  const updateTodo = useCallback(
    (updatedTodo: Todo) => {
      setErrorMessage('');

      setLoadingIds([...loadingIds, updatedTodo.id]);

      return postService
        .updateTodo(updatedTodo)
        .then(newTodo => {
          setTodos(curentTodos => {
            return curentTodos.map(todo =>
              todo.id === updatedTodo.id ? newTodo : todo,
            );
          });
        })
        .catch(error => {
          setErrorMessage('Unable to update a todo');
          setTimeout(() => setErrorMessage(''), 3000);
          throw error;
        })
        .finally(() => {
          setLoadingIds(loadingIds.filter(id => id !== updatedTodo.id));
        });
    },
    [loadingIds],
  );

  const deleteTodo = useCallback(
    (deletedTodo: Todo) => {
      setLoadingIds([...loadingIds, deletedTodo.id]);

      return postService
        .deleteTodo(deletedTodo.id)
        .then(() => {
          setTodos(curent => curent.filter(todo => todo.id !== deletedTodo.id));
        })
        .catch(error => {
          setTodos(curent => curent);
          setErrorMessage('Unable to delete a todo');
          setTimeout(() => setErrorMessage(''), 3000);
          throw error;
        })
        .finally(() => {
          setIsSubmitting(false);
          setLoadingIds(loadingIds.filter(todoid => todoid !== deletedTodo.id));
        });
    },
    [loadingIds],
  );

  const clearCompleted = useCallback(() => {
    const deleteTodos = todos.filter(todo => todo.completed === true);

    const deleteTodosId = deleteTodos.map(todo => todo.id);

    setLoadingIds([...loadingIds, ...deleteTodosId]);

    return deleteTodos.forEach(curentTodo => {
      deleteTodo(curentTodo).catch(() => {});
    });
  }, [deleteTodo, loadingIds, todos]);

  const toggleAll = useCallback(() => {
    const newTodos = [...todos];

    const result = newTodos.every(todo => todo.completed);

    if (result) {
      newTodos.forEach(todo => {
        updateTodo({ ...todo, completed: !todo.completed });
      });
    } else {
      newTodos.forEach(todo => {
        if (!todo.completed) {
          updateTodo({ ...todo, completed: !todo.completed });
        } else {
          setErrorMessage('');
        }
      });
    }
  }, [todos, updateTodo]);

  const isAllTodosCompleted = todos.every(todo => todo.completed);

  function getPreparedTodos(filter: FilerType, todos1: Todo[]) {
    const prepearedTodos = [...todos1];

    if (filter) {
      const result = prepearedTodos.filter(todo => {
        switch (filter) {
          case FilerType.ALL:
            return todo;
          case FilerType.ACTIVE:
            return todo.completed !== true;
          case FilerType.COMPLETED:
            return todo.completed === true;
          default:
            return todo;
        }
      });

      return result;
    } else {
      return todos;
    }
  }

  const visibleTodos = getPreparedTodos(filterField, todos);

  const value = useMemo(
    () => ({
      todos,
      setTodos,
      toggleAll,
      addTodo,
      isAllTodosCompleted,
      updateTodo,
      deleteTodo,
      clearCompleted,
      filterField,
      setFilterField,
      visibleTodos,
      todoRef,
      errorMessage,
      setErrorMessage,
      stateClearBtn,
      setStateClearBtn,
      isSubmitting,
      setIsSubmitting,
      tempTodo,
      loadingIds,
    }),
    [
      addTodo,
      clearCompleted,
      deleteTodo,
      filterField,
      isAllTodosCompleted,
      setTodos,
      todos,
      toggleAll,
      updateTodo,
      visibleTodos,
      todoRef,
      errorMessage,
      setErrorMessage,
      stateClearBtn,
      setStateClearBtn,
      isSubmitting,
      setIsSubmitting,
      tempTodo,
      loadingIds,
    ],
  );

  return (
    <TodosContext.Provider value={value}>{children}</TodosContext.Provider>
  );
};
