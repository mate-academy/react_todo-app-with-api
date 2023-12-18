/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import * as todoService from './api/todos';

import { Status } from './types/Status';
import { Todo } from './types/Todo';

import { UserWarning } from './UserWarning';
import { ErrorMessages } from './types/ErrorMessages';
import { TodoList } from './components/TodoList/TodoList';
import { Header } from './components/Header/Header';
import { Footer } from './components/Footer/Footer';
import { ErrorMessage } from './components/ErrorMessage/ErrorMessage';

const USER_ID = 11073;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<ErrorMessages | null>(null);
  const [filterStatus, setFilterStatus] = useState(Status.ALL);
  const [todoTitle, setTodoTitle] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  useEffect(() => {
    todoService.getTodos(USER_ID)
      .then((todosFromServer) => {
        setTodos(todosFromServer);
      })
      .catch(() => {
        setErrorMessage(ErrorMessages.LOAD);
      });
  }, []);

  useEffect((): (() => void) | undefined => {
    if (errorMessage) {
      const timeout = setTimeout(() => {
        setErrorMessage(null);
      }, 3000);

      return () => clearTimeout(timeout);
    }

    return undefined;
  }, [errorMessage]);

  const handleAddTodo = useCallback(async (title: string) => {
    setIsLoading(true);

    try {
      const newTodo = {
        title,
        userId: USER_ID,
        completed: false,
      };

      setTempTodo({ ...newTodo, id: 0 });

      const createdTodo = await todoService.createTodo(newTodo);

      setTodos((currentTodos) => [...currentTodos, createdTodo]);
    } catch {
      setErrorMessage(ErrorMessages.ADD);
    } finally {
      setTempTodo(null);
      setIsLoading(false);
    }
  }, []);

  const handleRemoveTodo = useCallback(async (todoId: number) => {
    setIsLoading(true);

    try {
      setTodos((currentTodos) => currentTodos.map((todo) => (todo.id === todoId ? { ...todo, isLoading: true } : todo)));

      await todoService.deleteTodo(todoId);

      setTodos((currentTodos) => currentTodos.filter((todo) => todo.id !== todoId));
    } catch {
      setErrorMessage(ErrorMessages.DELETE);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleClearAllCompletedTodos = useCallback(async () => {
    todos
      .filter((todo) => todo.completed)
      .map((todo) => handleRemoveTodo(todo.id));
  }, [todos]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!todoTitle.trim()) {
      setErrorMessage(ErrorMessages.TITLE);
    }

    handleAddTodo(todoTitle);
    setTodoTitle('');
  };

  const handleToggleCompleted = useCallback(
    async (todoId: number, completed: boolean) => {
      setIsLoading(true);

      try {
        const updatedTodo = {
          completed: !completed,
        };

        setTodos((currentTodos) => currentTodos.map((todo) => (todo.id === todoId
          ? { ...todo, completed: !completed, isLoading: true }
          : todo
        )));

        await todoService.updateTodo(todoId, updatedTodo);

        setTodos((currentTodos) => currentTodos.map((todo) => (todo.id === todoId ? { ...todo, isLoading: false } : todo)));
      } catch {
        setErrorMessage(ErrorMessages.UPDATE);
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const handleToggleAllTodosCompleted = () => {
    setIsLoading(true);

    try {
      todos.map((todo) => handleToggleCompleted(todo.id, todo.completed));
    } catch {
      setErrorMessage(ErrorMessages.TOGGLE);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangeTitle = async (todoId: number, newTitle: string) => {
    try {
      setTodos((currentTodos) => currentTodos.map((todo) => (todo.id === todoId ? { ...todo, isLoading: true } : todo)));
      await todoService.updateTodo(todoId, { title: newTitle });

      setTodos(currentTodos => currentTodos.map(todo => (todo.id === todoId ? { ...todo, title: newTitle, isLoading: false } : todo)));
    } catch {
      setTodos((currentTodos) => currentTodos.filter((todo) => todo.id !== todoId));
    }
  };

  const allCopmletedCheck = useCallback(() => todos.every((todo) => todo.completed), []);
  const [completedTodo, uncompletedTodo] = todos.reduce<[Todo[], Todo[]]>(
    (acc, todo) => {
      if (todo.completed) {
        acc[0].push(todo);
      } else {
        acc[1].push(todo);
      }

      return acc;
    },
    [[], []],
  );

  const visibleTodos = useMemo(() => {
    switch (filterStatus) {
      case Status.COMPLETED:
        return completedTodo;

      case Status.ACTIVE:
        return uncompletedTodo;

      case Status.ALL:
      default:
        return todos;
    }
  }, [todos, filterStatus]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          allCopmletedCheck={allCopmletedCheck}
          handleToggleAllTodosCompleted={handleToggleAllTodosCompleted}
          handleSubmit={handleSubmit}
          todoTitle={todoTitle}
          tempTodo={tempTodo}
          setTodoTitle={setTodoTitle}
        />

        <TodoList
          visibleTodos={visibleTodos}
          handleToggleCompleted={handleToggleCompleted}
          handleRemoveTodo={handleRemoveTodo}
          tempTodo={tempTodo}
          isLoading={isLoading}
          handleChangeTitle={handleChangeTitle}
        />

        {todos?.length > 0 && (
          <Footer
            uncompletedTodos={uncompletedTodo}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            completedTodos={completedTodo}
            handleClearAllCompletedTodos={handleClearAllCompletedTodos}
          />
        )}
      </div>

      <ErrorMessage
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
