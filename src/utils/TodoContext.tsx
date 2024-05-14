import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Status } from '../types/Status';
import { ErrText } from '../types/ErrText';
import { Todo } from '../types/Todo';
import * as todoServices from '../api/todos';
import { TodoContextTypes } from '../types/TodoContextTypes';

const initTodoCont: TodoContextTypes = {
  todos: [],
  setTodos: () => {},
  status: Status.All,
  setStatus: () => {},
  errMessage: ErrText.NoErr,
  setErrMessage: () => {},
  onDelete: async () => {},
  onAdd: async () => {},
  onUpdate: async () => {},
  toggleCompleted: async () => {},
  toggleAllCompleted: () => {},
  loading: false,
  setLoading: () => {},
  tempTodo: null,
  setTempTodo: () => {},
  modifiedTodoId: [],
  setModifiedTodoId: () => {},
};

export const TodoContext = React.createContext<TodoContextTypes>(initTodoCont);

interface Props {
  children: React.ReactNode;
}

export const TodoContextProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [status, setStatus] = useState(Status.All);
  const [errMessage, setErrMessage] = useState(ErrText.NoErr);
  const [loading, setLoading] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [modifiedTodoId, setModifiedTodoId] = useState<number[]>([]);

  useEffect(() => {
    todoServices
      .getTodos()
      .then(setTodos)
      .catch(() => {
        setErrMessage(ErrText.LoadErr);
        setTimeout(() => {
          setErrMessage(ErrText.NoErr);
        }, 3000);
      });
  }, []);

  const onDelete = useCallback(async (todoId: number) => {
    setLoading(true);
    setModifiedTodoId(prev => [...prev, todoId]);
    setErrMessage(ErrText.NoErr);
    try {
      await todoServices.deleteTodos(todoId);
      setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));
    } catch (error) {
      setErrMessage(ErrText.DeleteErr);
      setTimeout(() => setErrMessage(ErrText.NoErr), 3000);
    } finally {
      setLoading(false);
      setModifiedTodoId(prev => prev.filter(id => id !== todoId));
    }
  }, []);

  const onAdd = useCallback(async ({ title, completed, userId }: Todo) => {
    setLoading(true);
    setErrMessage(ErrText.NoErr);
    setTempTodo({ id: 0, title, completed, userId });
    try {
      const newTodo = await todoServices.createTodos({
        title,
        completed,
        userId,
      });

      setTempTodo(null);
      setTodos(currentTodos => [...currentTodos, newTodo]);
    } catch (error) {
      setErrMessage(ErrText.AddErr);
      setTempTodo(null);
      setTimeout(() => setErrMessage(ErrText.NoErr), 3000);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const onUpdate = useCallback(async (updatedTodo: Todo) => {
    setLoading(false);
    setModifiedTodoId(prev => [...prev, updatedTodo.id]);
    setErrMessage(ErrText.NoErr);
    try {
      const response = await todoServices.updateTodos(updatedTodo);

      setTodos(currentTodos =>
        currentTodos.map(todo =>
          todo.id === updatedTodo.id ? { ...todo, ...response } : todo,
        ),
      );
    } catch (error) {
      setErrMessage(ErrText.UpdateErr);
      setTimeout(() => setErrMessage(ErrText.NoErr), 3000);
      throw error;
    } finally {
      setLoading(false);
      setModifiedTodoId(prev => prev.filter(id => id !== updatedTodo.id));
    }
  }, []);

  const toggleCompleted = useCallback(async (toggledTodo: Todo) => {
    setLoading(true);
    setModifiedTodoId(prev => [...prev, toggledTodo.id]);
    setErrMessage(ErrText.NoErr);
    try {
      const toggled = await todoServices.updateTodos({
        ...toggledTodo,
        completed: !toggledTodo.completed,
      });

      setTodos(prevTodos =>
        prevTodos.map(todo =>
          todo.id === toggled.id
            ? { ...todo, completed: !todo.completed }
            : todo,
        ),
      );
    } catch (error) {
      setErrMessage(ErrText.UpdateErr);
      setTimeout(() => setErrMessage(ErrText.NoErr), 3000);
    } finally {
      setLoading(false);
      setModifiedTodoId(prev => prev.filter(id => id !== toggledTodo.id));
    }
  }, []);

  const toggleAllCompleted = useCallback(() => {
    const areAllCompleted = todos.every(todo => todo.completed);
    const newCompletedStatus = !areAllCompleted;

    const todosToUpdate = todos.filter(
      todo => todo.completed !== newCompletedStatus,
    );

    todosToUpdate.forEach(todo => {
      toggleCompleted({ ...todo, completed: newCompletedStatus });
    });
  }, [todos, toggleCompleted]);

  const todoContextValue = useMemo(
    () => ({
      todos,
      setTodos,
      status,
      setStatus,
      errMessage,
      setErrMessage,
      onDelete,
      onAdd,
      onUpdate,
      toggleCompleted,
      toggleAllCompleted,
      loading,
      setLoading,
      tempTodo,
      setTempTodo,
      modifiedTodoId,
      setModifiedTodoId,
    }),
    [
      errMessage,
      loading,
      modifiedTodoId,
      onAdd,
      onDelete,
      onUpdate,
      status,
      tempTodo,
      todos,
      toggleCompleted,
      toggleAllCompleted,
    ],
  );

  return (
    <TodoContext.Provider value={todoContextValue}>
      {children}
    </TodoContext.Provider>
  );
};

export const useTodos = () => useContext(TodoContext);
