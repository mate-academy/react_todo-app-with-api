import {
  // prettier-ignore
  Dispatch,
  SetStateAction,
  useState,
  useEffect,
  useContext,
  useMemo,
} from 'react';
import { Todo } from '../types/Todo';
import { Error, SetError, ErrorMsg } from '../types/Error';
import { FilterStatus } from '../types/Filter';
import { deleteTodo, getTodos, updateTodo } from '../api/todos';
import { AuthContext } from '../components/Auth/AuthContext';
import type { InitialState } from './todoContext';

export const useTodoStore = (initial: InitialState) => {
  const [todos, setTodos] = useState<Todo[]>(initial.todos);
  const [newTodo, setNewTodo] = useState<string>(initial.newTodo);
  const [error, errorSet] = useState<Error>(initial.error);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>(
    initial.filter,
  );
  const [tempTodo, setTempTodo] = useState<Todo | null>(initial.tempTodo);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(0);

  const user = useContext(AuthContext);

  const setError: SetError = (err = false, msg = ErrorMsg.NoError) => {
    errorSet([err, msg]);
  };

  const getNewTodo = (todo: string) => {
    setNewTodo(todo);
  };

  const todoLength = todos.length;

  useEffect(() => {
    setError();

    getTodos(user?.id || 0)
      .then(data => setTodos(prev => [...prev, ...data]))
      .catch(() => setError(true, ErrorMsg.AddError));
  }, []);

  const changeFilterStatus = (status: FilterStatus) => {
    setFilterStatus(status);
  };

  const renewTodos = (todo: Todo) => {
    setTodos(prev => [...prev, todo]);
  };

  const updateSingleTodo = async (
    id: number,
    todo: Todo,
    updating: Dispatch<SetStateAction<number>>,
  ): Promise<Todo> => {
    updating(id);

    try {
      const res = await updateTodo(id, todo);

      return res;
    } catch {
      setError(true, ErrorMsg.UpdateError);

      return todo;
    } finally {
      updating(0);
    }
  };

  const toggleTodo = (id: number) => {
    const updatedTodo = todos.find(todo => todo.id === id) as Todo;
    const todoIndex = todos.findIndex(todo => todo.id === id);

    updateSingleTodo(
      id,
      {
        ...updatedTodo,
        completed: !updatedTodo.completed,
      },
      setIsUpdating,
    ).then(res => {
      return setTodos(prev => [
        ...prev.slice(0, todoIndex),
        res || updatedTodo,
        ...prev.slice(todoIndex + 1),
      ]);
    });
  };

  const deleteSingleTodo = async (
    id: number,
    isDeleting: Dispatch<SetStateAction<boolean>>,
  ) => {
    isDeleting(true);
    try {
      await deleteTodo(id);
    } catch {
      setError(true, ErrorMsg.DeleteError);
    } finally {
      isDeleting(false);
    }

    setTodos(prev => prev.filter(todo => todo.id !== id));
  };

  const completedTodos = useMemo(
    () => todos.filter(todo => todo.completed),
    [todos],
  );

  const clearCompletedTodos = () => {
    completedTodos.map(todo => deleteSingleTodo(todo.id, setIsLoading));
  };

  const filteredTodos = useMemo(() => {
    return todos.filter(todo => {
      switch (filterStatus) {
        case FilterStatus.Completed:
          return todo.completed;

        case FilterStatus.Active:
          return !todo.completed;

        default:
          return todo;
      }
    });
  }, [todos]);

  const addTempTodo = (todoTitle = '', userId = 0) => {
    if (todoTitle === '' || userId === 0) {
      setTempTodo(null);

      return;
    }

    const todo = {
      id: 0,
      userId,
      title: todoTitle,
      completed: false,
    };

    setTempTodo(todo);
  };

  return {
    todos: filteredTodos,
    renewTodos,
    todoLength,
    newTodo,
    error,
    setError,
    getNewTodo,
    changeFilterStatus,
    filterStatus,
    tempTodo,
    addTempTodo,
    clearCompletedTodos,
    deleteSingleTodo,
    completedTodos,
    isLoading,
    toggleTodo,
    isUpdating,
  };
};
