import { createContext, useEffect, useState } from 'react';
import { Todo } from '../types/Todo';
import { deleteTodo, getTodos, updateTodo } from '../api/todos';
import { Filter } from '../enum/Filter';

type Props = {
  children: React.ReactNode;
};

type ContextType = {
  everyCompleted: boolean;
  hideMessage: () => void;
  handleToggle: (todos: Todo[], v: boolean) => void;
  focused: Date;
  loadingIds: number[];
  setLoadingIds: (v: number[]) => void;
  handleDelete: (id: number) => void;
  handleComplete: (todo: Todo, status: boolean) => void;
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
  everyCompleted: false,
  hideMessage: () => {},
  handleToggle: () => {},
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
  const everyCompleted =
    todos.length !== 0 ? todos.every(todo => todo.completed) : false;
  const hideMessage = () =>
    setTimeout(() => {
      setErrorMessage('');
    }, 3000);

  useEffect(() => {
    setErrorMessage('');
    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to load todos');
      });

    hideMessage();
  }, []);

  const handleDelete = (todoId: number) => {
    setLoadingIds(prev => [...prev, todoId]);

    return deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
      })
      .finally(() => {
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

  const handleComplete = (todo: Todo, status: boolean) => {
    setLoadingIds(prevIds => [...prevIds, todo.id]);
    setIsCompleted(!status);
    const changeStatus = { ...todo, completed: status };

    updateTodo(changeStatus)
      .then(() =>
        setTodos(prevTodos =>
          prevTodos.map(item =>
            item.id === changeStatus.id ? changeStatus : item,
          ),
        ),
      )
      .catch(() => {
        setErrorMessage('Unable to update a todo');
      })
      .finally(() => {
        setLoadingIds([]);
        setIsCompleted(false);
        hideMessage();
      });
  };

  const handleToggle = (list: Todo[], status: boolean) => {
    if (everyCompleted) {
      list.forEach(item => handleComplete(item, status));
    } else {
      list.forEach(item => !item.completed && handleComplete(item, status));
    }
  };

  const todosTools = {
    everyCompleted,
    hideMessage,
    handleToggle,
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
