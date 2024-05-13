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
  modifiedTodoId: 0,
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
  const [modifiedTodoId, setModifiedTodoId] = useState(0);
  const activeTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);

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

  const onDelete = useCallback(
    async (todoId: number) => {
      setLoading(true);
      setModifiedTodoId(todoId);
      setErrMessage(ErrText.NoErr);
      try {
        await todoServices.deleteTodos(todoId);
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
        setLoading(false);
      } catch (error) {
        setErrMessage(ErrText.DeleteErr);
        setTodos(todos);
        setTimeout(() => setErrMessage(ErrText.NoErr), 3000);
      } finally {
        setLoading(false);
        setModifiedTodoId(0);
      }
    },
    [todos],
  );

  const onAdd = useCallback(
    async ({ title, completed, userId }: Todo) => {
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
        setLoading(false);
      } catch (error) {
        setErrMessage(ErrText.AddErr);
        setTempTodo(null);
        setTodos(todos);
        setTimeout(() => setErrMessage(ErrText.NoErr), 3000);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [todos],
  );

  const toggleCompleted = useCallback(async (toggledTodo: Todo) => {
    setLoading(true);
    setModifiedTodoId(toggledTodo.id);
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
      setModifiedTodoId(0);
    }
  }, []);

  const toggleAllCompleted = useCallback(() => {
    const toggledTodos = !!activeTodos.length ? activeTodos : completedTodos;

    toggledTodos.forEach(todo => toggleCompleted(todo));
  }, [activeTodos, completedTodos, toggleCompleted]);

  const onUpdate = useCallback(
    async (updatedTodo: Todo) => {
      setLoading(true);
      setModifiedTodoId(updatedTodo.id);
      setErrMessage(ErrText.NoErr);
      try {
        const editedTodo = await todoServices.updateTodos(updatedTodo);

        setTodos(currentTodos =>
          currentTodos.map(todo =>
            todo.id === updatedTodo.id ? editedTodo : todo,
          ),
        );
      } catch (error) {
        setErrMessage(ErrText.UpdateErr);
        setTodos(todos);
        setTimeout(() => setErrMessage(ErrText.NoErr), 3000);
        setLoading(false);
      } finally {
        setLoading(false);
        setModifiedTodoId(0);
      }
    },
    [todos],
  );

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
