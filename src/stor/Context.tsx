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
  FILTER_TODO_ALL = 'all',
  FILTER_TODO_ACTIVE = 'active',
  FILTER_TODO_COMPLETED = 'completed',
}

type TodosContextType = {
  todos: Todo[];
  setTodos: (v: Todo[]) => void;
  toggleAll: () => void;
  addTodo: (newTodo: Todo) => Promise<void>;
  isAllTodoCompleted: boolean;
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
  isAllTodoCompleted: false,
  updateTodo: async () => {},
  deleteTodo: () => {},
  clearCompleted: () => {},
  filterField: FilerType.FILTER_TODO_ALL,
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
  const [filterField, setFilterField] = useState(FilerType.FILTER_TODO_ALL);
  const [errorMessage, setErrorMessage] = useState('');
  const [stateClearBtn, setStateClearBtn] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const [loadingIds, setLoadingIds] = useState<number[]>([]);

  const todoRef = useRef<HTMLInputElement>(null);
  // const inputElement = document.getElementById('NewTodoField');

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
        .finally(() => {
          setLoadingIds(loadingIds.filter(id => id !== updatedTodo.id));
        })
        .then(newTodo => {
          setTodos(curentTodos => {
            const newTodos = [...curentTodos];
            const index = newTodos.findIndex(
              todo => todo.id === updatedTodo.id,
            );

            newTodos.splice(index, 1, newTodo);

            return newTodos;
          });
        })
        .catch(error => {
          setErrorMessage('Unable to update a todo');
          setTimeout(() => setErrorMessage(''), 3000);
          throw error;
        });
    },
    [loadingIds],
  );

  const deleteTodo = useCallback(
    (deletedTodo: Todo) => {
      const newTodos = todos.filter(todo => todo.id !== deletedTodo.id);

      setLoadingIds([...loadingIds, deletedTodo.id]);

      return postService
        .deleteTodo(deletedTodo.id)
        .finally(() => {
          setIsSubmitting(false);
          setTodos(newTodos);
          setLoadingIds(loadingIds.filter(todoid => todoid !== deletedTodo.id));
        })
        .catch(error => {
          setTodos(todos);
          setErrorMessage('Unable to delete a todo');
          setTimeout(() => setErrorMessage(''), 3000);
          throw error;
        });
    },
    [loadingIds, todos],
  );

  const clearCompleted = useCallback(() => {
    const noDeleteTodos = todos.filter(todo => todo.completed === false);
    const deleteTodos = todos.filter(todo => todo.completed === true);

    const deleteTodosId = deleteTodos.map(todo => todo.id);

    setLoadingIds([...loadingIds, ...deleteTodosId]);

    return deleteTodos.forEach(todo => {
      postService
        .deleteTodo(todo.id)
        .then(() => setTodos(noDeleteTodos))
        .finally(() => {
          setLoadingIds(
            loadingIds.filter(id => deleteTodosId.includes(id) === false),
          );
          setIsSubmitting(false);
        })
        .catch(() => {
          setTodos(todos);
          setErrorMessage('Unable to delete a todo');
          setTimeout(() => setErrorMessage(''), 3000);
        });
    });
  }, [loadingIds, todos]);

  const toggleAll = useCallback(() => {
    const newTodos = [...todos];

    const result = newTodos.every(todo => todo.completed);

    if (result) {
      const changeTodos = newTodos.map(todo => {
        return { ...todo, completed: !todo.completed };
      });

      setTodos(changeTodos);
    } else {
      const changeTodos = newTodos.map(todo => {
        if (todo.completed === false) {
          return { ...todo, completed: !todo.completed };
        } else {
          return todo;
        }
      });

      setTodos(changeTodos);
    }
  }, [setTodos, todos]);

  const isAllTodoCompleted = todos.every(todo => todo.completed);

  function getPrepareTodos(filter: FilerType, todos1: Todo[]) {
    const prepearedTodos = [...todos1];

    if (filter) {
      const result = prepearedTodos.filter(todo => {
        switch (filter) {
          case FilerType.FILTER_TODO_ALL:
            return todo;
          case FilerType.FILTER_TODO_ACTIVE:
            return todo.completed !== true;
          case FilerType.FILTER_TODO_COMPLETED:
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

  const visibleTodos = getPrepareTodos(filterField, todos);

  const value = useMemo(
    () => ({
      todos,
      setTodos,
      toggleAll,
      addTodo,
      isAllTodoCompleted,
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
      // errorDalay,
      tempTodo,
      loadingIds,
    }),
    [
      addTodo,
      clearCompleted,
      deleteTodo,
      filterField,
      isAllTodoCompleted,
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
      // errorDalay,
      tempTodo,
      loadingIds,
    ],
  );

  return (
    <TodosContext.Provider value={value}>{children}</TodosContext.Provider>
  );
};
