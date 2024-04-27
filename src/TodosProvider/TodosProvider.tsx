import { createContext, useEffect, useState } from 'react';
import { Todo } from '../types/Todo';
import { deleteTodo, getTodos, updateTodo } from '../api/todos';
import { Filter } from '../enum/Filter';
import { useLocalStorage } from '../api/useLocalStorage';

type Props = {
  children: React.ReactNode;
};

type ContextType = {
  selectFilter: string;
  setSelectFilter: (v: string) => void;
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
  setTodos: (value: Todo[]) => void;
  errorMessage: string;
  setErrorMessage: (v: string) => void;
};

export const TodosContext = createContext<ContextType>({
  selectFilter: '',
  setSelectFilter: () => {},
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
  const [todos, setTodos] = useLocalStorage<Todo[]>('todos', []);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);
  const [isDisabled, setIdDisabled] = useState(false);
  const [focused, setFocused] = useState(new Date());
  const [loadingIds, setLoadingIds] = useState<number[]>([]);
  const [selectFilter, setSelectFilter] = useState('');

  // useEffect(() => {
  //   const data = localStorage.getItem('key');

  //   if (data !== null) {
  //     setSelectFilter(JSON.parse(data));
  //   }
  // }, []);

  // useEffect(() => {
  //   const data = JSON.stringify(selectFilter);

  //   localStorage.setItem('key', data);
  // }, [selectFilter]);

  const everyCompleted =
    todos.length !== 0 ? todos.every((todo: Todo) => todo.completed) : false;
  const hideMessage = () =>
    setTimeout(() => {
      setErrorMessage('');
    }, 3000);

  useEffect(() => {
    setErrorMessage('');

    const fetchData = async () => {
      try {
        const readyTodos = await getTodos();

        setTodos(readyTodos);
      } catch (error) {
        setErrorMessage('Unable to load todos');
      } finally {
        hideMessage();
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (todoId: number) => {
    setLoadingIds(prev => [...prev, todoId]);

    try {
      await deleteTodo(todoId);

      setTodos(prevTodo => prevTodo.filter(todo => todo.id !== todoId));
      // setTodos(todos.filter(todo => todo.id !== todoId));
    } catch (error) {
      setErrorMessage('Unable to delete a todo');
    } finally {
      setLoadingIds(prev => prev.filter(item => item !== todoId));
      setFocused(new Date());
    }
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
    todos.forEach((todo: Todo) => {
      if (todo.completed) {
        handleDelete(todo.id);
      }
    });
  };

  const handleComplete = (todo: Todo, status: boolean) => {
    setLoadingIds(prevIds => [...prevIds, todo.id]);
    setIsCompleted(!status);
    const changeStatus: Todo = { ...todo, completed: status };

    const handleData = async () => {
      try {
        await updateTodo(changeStatus);

        const changedStatus = todos.map(item =>
          item.id === changeStatus.id ? changeStatus : item,
        );

        setTodos([...changedStatus]);
      } catch (error) {
        setErrorMessage('Unable to update a todo');
      } finally {
        setLoadingIds([]);
        setIsCompleted(false);
        hideMessage();
      }
    };

    handleData();
  };

  const handleToggle = (list: Todo[], status: boolean) => {
    if (everyCompleted) {
      list.forEach(item => handleComplete(item, status));
    } else {
      list.forEach(item => !item.completed && handleComplete(item, status));
    }
  };

  const todosTools = {
    selectFilter,
    setSelectFilter,
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
