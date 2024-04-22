import { createContext, useEffect, useState } from 'react';
import { Todo } from '../types/Todo';
import { deleteTodo, getTodos } from '../api/todos';
import { Filter } from '../enum/Filter';

type Props = {
  children: React.ReactNode;
};

type ContextType = {
  focused: Date;
  loadingIds: number[];
  setLoadingIds: (v: number[]) => void;
  handleDelete: (id: number) => void;
  handleComplete: (todoId: number, status: boolean) => void;
  handleClearCompleted: () => void;
  setFocused: (v: Date) => void;
  filterTodos: (list: Todo[], filterBy: string) => Todo[];
  isDisabled: boolean;
  setIdDisabled: (v: boolean) => void;
  isCompleted: boolean;
  setIsCompleted: (v: boolean) => void;
  tempTodo: Todo | null;
  setTempTodo: (v: Todo | null) => void;
  todos: Todo[];
  setTodos: (value: React.SetStateAction<Todo[]>) => void;
  errorMessage: string;
  setErrorMessage: (v: string) => void;
};

export const TodosContext = createContext<ContextType>({
  focused: new Date(),
  loadingIds: [],
  setLoadingIds: () => [],
  handleDelete: () => {},
  handleComplete: () => [],
  handleClearCompleted: () => {},
  setFocused: () => {},
  filterTodos: () => [],
  isDisabled: false,
  setIdDisabled: () => {},
  isCompleted: false,
  setIsCompleted: () => {},
  tempTodo: null,
  setTempTodo: () => {},
  todos: [],
  setTodos: () => {},
  errorMessage: '',
  setErrorMessage: () => {},
});

export const TodosProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);
  const [isDisabled, setIdDisabled] = useState(false);
  // eslint-disable-next-line
  const [focused, setFocused] = useState(new Date());
  const [loadingIds, setLoadingIds] = useState<number[]>([]);

  useEffect(() => {
    setErrorMessage('');
    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to load todos');
      });

    setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  }, []);

  const handleDelete = (todoId: number) => {
    setLoadingIds([...loadingIds, todoId]);
    debugger;

    return deleteTodo(todoId)
      .then(() => {
        debugger;
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(() => {
        debugger;
        setErrorMessage('Unable to delete a todo');
      })
      .finally(() => {
        debugger;
        setLoadingIds(prev => prev.filter(item => item !== todoId));
        setFocused(new Date());
      });
  };

  function filterTodos(list: Todo[], filterBy: string) {
    switch (filterBy) {
      case Filter.all:
        return list;
      case Filter.active:
        return list.filter(todo => !todo.completed);
      case Filter.completed:
        return list.filter(todo => todo.completed);
      default:
        return list;
    }
  }

  const handleClearCompleted = () => {
    todos.forEach(todo => {
      if (todo.completed) {
        handleDelete(todo.id);
      }
    });
  };

  const handleComplete = (todoId: number, status: boolean) => {
    setIsCompleted(!status);

    setTodos(prevTodo => {
      const newTodo = [...prevTodo];

      return newTodo.map(todo => {
        if (todo.id === todoId) {
          return {
            ...todo,
            completed: status,
          };
        }

        return todo;
      });
    });
  };

  const todosTools = {
    focused,
    loadingIds,
    setLoadingIds,
    handleDelete,
    handleComplete,
    handleClearCompleted,
    setFocused,
    filterTodos,
    isCompleted,
    setIsCompleted,
    tempTodo,
    setTempTodo,
    todos,
    setTodos,
    errorMessage,
    setErrorMessage,
    isDisabled,
    setIdDisabled,
  };

  return (
    <TodosContext.Provider value={todosTools}>{children}</TodosContext.Provider>
  );
};
