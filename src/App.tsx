import {
  FC,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { UserWarning } from './UserWarning';
import {
  createTodo,
  getTodos,
  removeTodo,
  updateStatusTodo,
  updateTitleTodo,
} from './api/todos';
import { Todo } from './types/Todo';
import { Header } from './components/Header/Header';
import { Footer } from './components/Footer';
import { TodoList } from './components/TodoList';
import { Notification } from './components/Notification';
import { SortTypes } from './types/SortTypes';
import { TodoError } from './types/TodoError';
import { USER_ID } from './consts/consts';
import { Loader } from './components/Loader';

export const App: FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [activeFilter, setActiveFilter] = useState<SortTypes>(SortTypes.All);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsloading] = useState(false);
  const [todoId, setTodoId] = useState<number | null>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [todosId, setTodosId] = useState<number[]>([]);

  const handleError = useCallback((message: TodoError) => {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  }, []);

  const loadTodos = useCallback(async () => {
    setIsloading(true);
    try {
      const response = await getTodos(USER_ID);

      setTodos(response);
    } catch (error: unknown) {
      handleError(TodoError.LOAD);
    }

    setIsloading(false);
  }, []);

  const addTodo = useCallback(async (todoData: Todo) => {
    setTodoId(0);
    setTempTodo(todoData);

    try {
      const newTodo = await createTodo({
        title: todoData.title,
        completed: false,
        userId: USER_ID,
      });

      setTodos((prevTodos) => [...prevTodos, newTodo]);
    } catch {
      handleError(TodoError.LOAD);
    }

    setTempTodo(null);
    setTodoId(null);
  }, []);

  const changeStatus = useCallback(async (id: number, completed: boolean) => {
    try {
      if (id) {
        await updateStatusTodo(id, completed);
      }

      setTodos((prevTodos) => prevTodos.map((todo) => {
        if (todo.id === id) {
          return {
            ...todo,
            completed,
          };
        }

        return todo;
      }));
    } catch {
      handleError(TodoError.UPDATE);
    }

    setTodoId(null);
  }, []);

  const changeTitle = useCallback(async (id: number, title: string) => {
    try {
      if (title) {
        await updateTitleTodo(id, title);
      }

      setTodos((prevTodos) => prevTodos.map((todo) => {
        if (todo.id === id) {
          return {
            ...todo,
            title,
          };
        }

        return todo;
      }));
    } catch {
      handleError(TodoError.LOAD);
    }

    setTodoId(null);
  }, []);

  const deleteTodo = useCallback(async (id: number) => {
    try {
      await removeTodo(id);

      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
    } catch {
      handleError(TodoError.DELETE);
    }
  }, []);

  const clearCompletedTodos = useCallback(async () => {
    try {
      const completedTodos = todos.filter(({ completed }) => completed);

      setTodosId(completedTodos.map(({ id }) => id));

      await Promise.all(completedTodos.map(({ id }) => removeTodo(
        id,
      )));

      setTodos((prevTodos) => prevTodos.filter(({ completed }) => !completed));
    } catch {
      handleError(TodoError.DELETE);
    }

    setTodoId(null);
  }, [todos]);

  const toggleAllTodos = useCallback(async () => {
    let todosForChangingStatus = [...todos];
    const hasDifferentStatuses = todos.every(({ completed }) => (
      completed === todos[0].completed));

    if (!hasDifferentStatuses) {
      todosForChangingStatus = todos.filter(({ completed }) => !completed);
    }

    const updatedTodosId = todosForChangingStatus.map(({ id }) => id);

    setTodosId(updatedTodosId);
    try {
      await Promise.all(todosForChangingStatus.map(({ id, completed }) => (
        changeStatus(id, !completed))));
    } catch {
      handleError(TodoError.UPDATE);
    }

    setTodosId([]);
  }, [todos]);

  const vissibleTodos = useMemo(() => todos.filter((todo) => {
    switch (activeFilter) {
      case SortTypes.Active:
        return !todo.completed;

      case SortTypes.Completed:
        return todo.completed;

      case SortTypes.All:
        return true;

      default: return true;
    }
  }), [todos, activeFilter]);

  useEffect(() => {
    loadTodos();
  }, [loadTodos]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">

        <Header
          todos={todos}
          handleError={handleError}
          setTodoId={setTodoId}
          onAddTodo={addTodo}
          onToggleAllTodos={toggleAllTodos}
        />

        {isLoading && !todos.length && <Loader />}
        <TodoList
          todos={vissibleTodos}
          todoId={todoId}
          tempTodo={tempTodo}
          completedTodosId={todosId}
          onDelete={deleteTodo}
          setTodoId={setTodoId}
          onChangeStatus={changeStatus}
          onChangeTitle={changeTitle}
        />
        {!!todos.length && (
          <Footer
            todos={todos}
            activeFilter={activeFilter}
            onChangeFilter={setActiveFilter}
            onClearCompletedTodos={clearCompletedTodos}
          />
        )}

      </div>

      {errorMessage && (
        <Notification
          message={errorMessage}
        />
      )}

      <div className="modal overlay">
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>

    </div>
  );
};
