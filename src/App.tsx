import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { TodoHeader } from './components/TodoHeader';
import { TodoList } from './components/TodoList';
import { TodoFooter } from './components/TodoFooter';
import { ErrorNotification } from './components/ErrorNotification';
import {
  validateTitle,
  getCompletedTodos,
  getActiveTodos,
  getVisibleTodos,
} from './utils/helpers';
import { Todo } from './types/Todo';
import { TodoStatusFilter } from './types/TodoStatusFilter';
import {
  createTodo,
  deleteTodo,
  getTodos,
  updateTodo,
} from './api/todos';

const USER_ID = 10684;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [statusFilter, setStatusFilter] = useState(TodoStatusFilter.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingTodos, setLoadingTodos] = useState<number[]>([0]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getTodos(USER_ID)
      .then((setTodos))
      .catch((e) => setError(e.message));
  }, []);

  useEffect(() => {
    let timerId: NodeJS.Timeout;

    if (error) {
      timerId = setTimeout(() => {
        setError(null);
      }, 3000);
    }

    return () => clearTimeout(timerId);
  }, [error]);

  const completedTodos = useMemo(() => (
    getCompletedTodos(todos)
  ), [todos, statusFilter]);

  const activeTodos = useMemo(() => (
    getActiveTodos(todos)
  ), [todos, statusFilter]);

  const visibleTodos = useMemo(() => (
    getVisibleTodos(todos, statusFilter)
  ), [todos, statusFilter]);

  const activeTodosLeft = activeTodos.length;

  const hasTodos = todos.length > 0;
  const hasVisibleTodos = todos.length > 0 || Boolean(tempTodo);
  const isAllTodosCompleted = !activeTodos.length;
  const canClearCompleted = completedTodos.length > 0;

  const closeErrorNotification = useCallback(() => {
    setError(null);
  }, [setError]);

  const changeErrorMessage = useCallback((errorMessage: string) => {
    setError(errorMessage);
  }, [setError]);

  const changeFilterStatus = useCallback((status: TodoStatusFilter) => {
    setStatusFilter(status);
  }, [setStatusFilter]);

  const addTodo = useCallback(async (title: string) => {
    try {
      const newTodo = {
        title: title.trim(),
        completed: false,
        userId: USER_ID,
      };

      setTempTodo({
        ...newTodo,
        id: 0,
      });

      const createdTodo = await createTodo(newTodo);

      setTodos(currentTodos => [...currentTodos, createdTodo]);
    } catch {
      setError('Unable to add a todo');
    } finally {
      setTempTodo(null);
    }
  }, [createTodo]);

  const removeTodo = useCallback(async (todoId: number) => {
    try {
      setLoadingTodos((currentTodos) => [...currentTodos, todoId]);

      await deleteTodo(todoId);

      setTodos((currentTodos) => (
        currentTodos.filter((todo) => todo.id !== todoId)
      ));
    } catch {
      setError('Unable to delete a todo');
    } finally {
      setLoadingTodos((currentTodos) => (
        currentTodos.filter((id) => id !== todoId)
      ));
    }
  }, [deleteTodo]);

  const clearCompleted = useCallback(() => {
    completedTodos.forEach(async (todo) => {
      await removeTodo(todo.id);
    });
  }, [completedTodos, removeTodo]);

  const editTodo = useCallback(async (
    todoId: number,
    values: Partial<Todo>,
  ) => {
    const data = { ...values };

    try {
      setLoadingTodos((currentTodos) => [...currentTodos, todoId]);

      if (data.title) {
        validateTitle(data.title);

        data.title = data.title.trim();
      }

      await updateTodo(todoId, data);

      setTodos((currentTodos) => currentTodos.map((currentTodo) => (
        currentTodo.id === todoId
          ? { ...currentTodo, ...data }
          : currentTodo
      )));
    } catch {
      setError('Unable to update a todo');
    } finally {
      setLoadingTodos((currentTodos) => (
        currentTodos.filter((id) => id !== todoId)
      ));
    }
  }, [updateTodo]);

  const toggleAllTodos = useCallback(() => {
    todos.forEach(async (todo) => {
      await editTodo(
        todo.id,
        { completed: !isAllTodosCompleted },
      );
    });
  }, [todos, editTodo]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          changeError={changeErrorMessage}
          addTodo={addTodo}
          toggleAllTodos={toggleAllTodos}
          isAllCompleted={isAllTodosCompleted}
          hasTodos={hasTodos}
        />

        {hasVisibleTodos && (
          <>
            <TodoList
              todos={visibleTodos}
              loadingTodos={loadingTodos}
              tempTodo={tempTodo}
              removeTodo={removeTodo}
              editTodo={editTodo}
            />

            <TodoFooter
              statusFilter={statusFilter}
              changeFilterStatus={changeFilterStatus}
              clearCompleted={clearCompleted}
              activeTodosLeft={activeTodosLeft}
              isClearCompletedVisible={canClearCompleted}
            />
          </>
        )}
      </div>

      <ErrorNotification
        error={error}
        closeError={closeErrorNotification}
      />
    </div>
  );
};
