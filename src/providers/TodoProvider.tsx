import {
  Dispatch,
  FC, createContext, useCallback, useContext, useEffect, useMemo, useState,
} from 'react';
import { Todo } from '../types/Todo';
import {
  deleteTodo, getTodos, patchTodo, postTodo,
} from '../api/todos';
import { FilterType } from '../types/FilterType';
import { ErrorType } from '../types/ErrorType';

type TodoContextType = {
  USER_ID: number;
  todos: Todo[];
  setTodos: Dispatch<React.SetStateAction<Todo[]>>;
  visibleTodos: Todo[];
  setVisibleTodos: Dispatch<React.SetStateAction<Todo[]>>;
  addTodo: (todo: Omit<Todo, 'id'>) => void;
  deleteTodoFromApi: (todoId: number) => void;
  updateTodo: (todoId: number, data: Partial<Todo>) => void;
  modifiedTodo: number | null;
  setModifiedTodo: Dispatch<React.SetStateAction<number | null>>;
  todosLeft: number;
  activeFilter: FilterType;
  setActiveFilter: Dispatch<React.SetStateAction<FilterType>>;
  newTodoTitle: string;
  setNewTodoTitle: Dispatch<React.SetStateAction<string>>;
  tempTodo: Todo | null;
  isDeleting: number[];
  isUpdating: number[];
  error: ErrorType | null;
  setError: Dispatch<React.SetStateAction<ErrorType | null>>;
};

const TodoContext = createContext<TodoContextType>({} as TodoContextType);

type Props = {
  children: React.ReactNode
};

export const TodoProvider: FC<Props> = ({ children }) => {
  const USER_ID = 11288;
  const [todos, setTodos] = useState<Todo[]>([]);
  const [modifiedTodo, setModifiedTodo] = useState<number | null>(null);
  const [todosLeft, setTodosLeft] = useState<number>(0);
  const [visibleTodos, setVisibleTodos] = useState<Todo[]>([]);
  const [activeFilter, setActiveFilter] = useState<FilterType>('All');
  const [newTodoTitle, setNewTodoTitle] = useState<string>('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isDeleting, setIsDeleting] = useState<number[]>([]);
  const [isUpdating, setIsUpdating] = useState<number[]>([]);
  const [error, setError] = useState<ErrorType | null>(null);

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => setError('Load'));
  }, []);

  useMemo(() => {
    let uncompleted = 0;

    todos.forEach(todo => {
      if (!todo.completed) {
        uncompleted += 1;
      }
    });

    setTodosLeft(uncompleted);
    setVisibleTodos(todos);
  }, [todos]);

  useMemo(() => {
    setVisibleTodos(todos.filter((todo) => {
      switch (activeFilter) {
        case 'Active':
          return !todo.completed;
        case 'Completed':
          return todo.completed;
        default:
          return true;
      }
    }));
  }, [todos, activeFilter]);

  const addTodo = useCallback((todo: Omit<Todo, 'id'>) => {
    setTempTodo({ ...todo, id: 0 });
    postTodo(todo)
      .then(data => {
        setTodos(prev => [...prev, data]);
        setNewTodoTitle('');
      })
      .catch(() => setError('Add'))
      .finally(() => setTempTodo(null));
  }, []);

  const deleteTodoFromApi = useCallback((todoId: number) => {
    setIsDeleting(prev => [...prev, todoId]);
    deleteTodo(todoId)
      .then(() => {
        setTodos(prev => prev.filter(todo => todo.id !== todoId));
      })
      .catch(() => setError('Delete'))
      .finally(() => setIsDeleting(prev => prev.filter(id => id !== todoId)));
  }, []);

  const updateTodo = useCallback((todoId: number, data: Partial<Todo>) => {
    setIsUpdating(prev => [...prev, todoId]);
    patchTodo(todoId, data)
      .then((todo) => {
        setTodos(prev => {
          const copy = [...prev];
          const index = copy.findIndex(item => item.id === todoId);

          if (todo) {
            copy[index] = todo;
          }

          return copy;
        });

        setModifiedTodo(null);
      })
      .catch(() => setError('Update'))
      .finally(() => setIsUpdating(prev => prev.filter(id => id !== todoId)));
  }, []);

  const value = {
    USER_ID,
    todos,
    setTodos,
    visibleTodos,
    setVisibleTodos,
    addTodo,
    deleteTodoFromApi,
    updateTodo,
    modifiedTodo,
    setModifiedTodo,
    todosLeft,
    activeFilter,
    setActiveFilter,
    newTodoTitle,
    setNewTodoTitle,
    tempTodo,
    error,
    setError,
    isDeleting,
    isUpdating,
  };

  return (
    <TodoContext.Provider value={value}>
      {children}
    </TodoContext.Provider>
  );
};

export const useTodo = () => useContext(TodoContext);
