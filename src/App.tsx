/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import * as todoService from './api/todos';
import { Header } from './components/Header/Header';
import { Footer } from './components/Footer/Footer';
import { Todo } from './types/Todo';
import { UserWarning } from './UserWarning';
import { SortByStatus } from './types/SortByStatus';
import { NotificationError } from
  './components/NotificationError/NotificationError';
import { TodoList } from './components/TodoList/TodoList';
import { ErrorTypes } from './types/ErrorTypes';

const USER_ID = 11196;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<ErrorTypes | null>(null);
  const [sortBy, setSortBy] = useState<SortByStatus>(SortByStatus.All);
  const [isTodoLoading, setIsTodoLoading] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [todoTitle, setTodoTitle] = useState('');
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);
  const [completedTodosCount, setCompletedTodosCount] = useState<number>(0);

  const updateCompletedTodosCount = (todosList: Todo[]) => {
    const count = todosList.filter(todo => todo.completed).length;

    setCompletedTodosCount(count);
  };

  useEffect(() => {
    todoService.getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        setError(ErrorTypes.Load);
      });
  }, []);

  const handleClearCompletedTodos = useCallback(() => {
    const completedTodos = todos.filter(todo => todo.completed);

    Promise.all(
      completedTodos.map(todo => (
        todoService.deleteTodo(todo.id)
      )),
    )
      .then(() => {
        setTodos(todos.filter(todo => !todo.completed));
      })
      .catch(() => {
        setError(ErrorTypes.Delete);
      });
  }, [todos]);

  const handleSubmitForm = useCallback((event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsTodoLoading(true);
    if (!todoTitle) {
      setError(ErrorTypes.Title);
      setIsTodoLoading(false);
      setTempTodo(null);

      return;
    }

    const newTempTodo: Todo = {
      id: 0,
      userId: USER_ID,
      title: todoTitle,
      completed: false,
    };

    setTempTodo(newTempTodo);

    todoService.createTodo({
      title: todoTitle,
      userId: USER_ID,
      completed: false,
    })
      .then((newTodo) => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
      })
      .catch(() => {
        setError(ErrorTypes.Add);
      })
      .finally(() => {
        setIsTodoLoading(false);
        setTodoTitle('');
        setTempTodo(null);
      });
  }, [todoTitle, todos]);

  const deleteTodo = (todoId: number) => {
    setLoadingTodoIds([todoId]);

    todoService.deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos => currentTodos.filter(todo => todoId !== todo.id));
        updateCompletedTodosCount(todos.filter(todo => todoId !== todo.id));
      })
      .catch(() => {
        setError(ErrorTypes.Delete);
      })
      .finally(() => setLoadingTodoIds([]));
  };

  const toggleTodoStatus = async (todoId: number, completed: boolean) => {
    try {
      setLoadingTodoIds([todoId]);
      await todoService.updateTodoStatus(todoId, completed);

      setTodos(currentTodos => currentTodos.map(
        todo => (todoId === todo.id ? { ...todo, completed } : todo),
      ));
      updateCompletedTodosCount(todos.map(
        todo => (todoId === todo.id ? { ...todo, completed } : todo),
      ));
    } catch {
      setError(ErrorTypes.Update);
    } finally {
      setLoadingTodoIds([]);
    }
  };

  const handleToggleTodosAll = async (completed: boolean) => {
    const todosIds = todos
      .filter(todo => todo.completed !== completed)
      .map(todo => todo.id);

    try {
      setLoadingTodoIds(todosIds);

      const updatedTodos = todos.map(todo => ({
        ...todo,
        completed,
      }));

      setTodos(updatedTodos);

      await Promise.all(
        todos.map(todo => todoService.updateTodoStatus(todo.id, completed)),
      );
      const countCompletedTodos = completed ? todos.length : 0;

      setCompletedTodosCount(countCompletedTodos);
    } catch {
      setError(ErrorTypes.Update);
    } finally {
      setLoadingTodoIds([]);
    }
  };

  const handleEditTodo = async (todoId: number, newTitle: string) => {
    if (!newTitle) {
      setError(ErrorTypes.Title);

      return;
    }

    try {
      setLoadingTodoIds([todoId]);
      const updatedTodo = await todoService.updateTodoTitle(todoId, newTitle);

      setTodos(currentTodos => currentTodos.map(
        todo => (todoId === todo.id ? updatedTodo : todo),
      ));
    } catch {
      setError(ErrorTypes.Title);
    } finally {
      setLoadingTodoIds([]);
    }
  };

  const handleCloseError = () => {
    setError(null);
  };

  const numberActiveTodos = todos.filter(todo => !todo.completed).length;

  const numberCompletedTodos
  = todos.filter(todo => todo.completed).length;

  const visibleTodos = useMemo(() => todos.filter((todo) => {
    switch (sortBy) {
      case SortByStatus.All:
        return todo;
      case SortByStatus.Active:
        return !todo.completed;
      case SortByStatus.Completed:
        return todo.completed;
      default:
        return true;
    }
  }), [todos, sortBy]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todosLength={visibleTodos.length}
          onSubmit={handleSubmitForm}
          todoTitle={todoTitle}
          setTodoTitle={setTodoTitle}
          isTodoLoading={isTodoLoading}
          numberCompletedTodos={numberCompletedTodos}
          onToggleAll={handleToggleTodosAll}
          allTodosCompleted={todos.length === completedTodosCount}
        />

        <TodoList
          todos={visibleTodos}
          onDeleteTodo={deleteTodo}
          tempTodo={tempTodo}
          loadingTodoIds={loadingTodoIds}
          onToggleTodoStatus={toggleTodoStatus}
          onChangeTodoTitle={handleEditTodo}
        />

        {todos.length > 0 && (
          <Footer
            sortBy={sortBy}
            numberActiveTodos={numberActiveTodos}
            onChangeSortBy={setSortBy}
            hasCompletedTodo={numberCompletedTodos > 0}
            clearCompletedTodos={handleClearCompletedTodos}
          />
        )}
      </div>

      {error
        && (
          <NotificationError
            error={error}
            setError={setError}
            onCloseError={handleCloseError}
          />
        )}
    </div>
  );
};
