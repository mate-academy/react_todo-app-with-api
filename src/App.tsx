import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  addTodo,
  deleteTodo,
  getTodos,
  updateTodo,
  USER_ID,
} from './api/todos';
import { Todo } from './types/Todo';
import { Errors } from './types/Errors';
import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
import classNames from 'classnames';
import { Footer } from './components/Footer/Footer';
// eslint-disable-next-line import/no-extraneous-dependencies
import { useLocation } from 'react-router-dom';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deletingTodoIds, setDeletingTodoIds] = useState<Set<number>>(
    () => new Set(),
  );
  const [updatingTodoIds, setUpdatingTodoIds] = useState<Set<number>>(
    () => new Set(),
  );
  const [errorMessage, setErrorMessage] = useState<Errors>(Errors.None);
  const inputRef = useRef<HTMLInputElement>(null);

  const { pathname } = useLocation();
  const filteredTodos = todos.filter(todo => {
    if (pathname === '/active') {
      return !todo.completed;
    }

    if (pathname === '/completed') {
      return todo.completed;
    }

    return true;
  });

  //# region todo with API
  const createTodo = async (title: string): Promise<boolean> => {
    const newTempTodo: Todo = {
      id: 0,
      title,
      completed: false,
      userId: USER_ID,
    };

    setTempTodo(newTempTodo);

    try {
      const newTodo = await addTodo({
        title,
        completed: false,
        userId: USER_ID,
      });

      setTodos(currentTodos => [...currentTodos, newTodo]);
      setTempTodo(null);

      return true;
    } catch {
      setTempTodo(null);
      setErrorMessage(Errors.UnableToAddTodo);

      return false;
    }
  };

  const removeTodo = async (todoId: number): Promise<boolean> => {
    setDeletingTodoIds(currentIds => new Set(currentIds).add(todoId));

    try {
      await deleteTodo(todoId);
      setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));

      return true;
    } catch {
      setErrorMessage(Errors.UnableToDeleteTodo);

      return false;
    } finally {
      setDeletingTodoIds(currentIds => {
        const nextIds = new Set(currentIds);

        nextIds.delete(todoId);

        return nextIds;
      });
      inputRef.current?.focus();
    }
  };

  const handleClearCompleted = async (todoIds: number[]) => {
    await Promise.all(todoIds.map(removeTodo));

    inputRef.current?.focus();
  };

  const handleToggleAll = async (): Promise<boolean> => {
    const completedTodos = todos.filter(
      currTodo => currTodo.completed === true,
    );
    const shouldComplete = todos.length !== completedTodos.length;
    const todosToUpdate = todos.filter(
      todo => todo.completed !== shouldComplete,
    );
    const todoIds = todosToUpdate.map(todo => todo.id);

    setUpdatingTodoIds(new Set(todoIds));

    try {
      const updatedTodos = await Promise.all(
        todosToUpdate.map(todo =>
          updateTodo({ ...todo, completed: shouldComplete }),
        ),
      );

      setTodos(currentTodos =>
        currentTodos.map(
          todo =>
            updatedTodos.find(updatedTodo => updatedTodo.id === todo.id) ??
            todo,
        ),
      );

      return true;
    } catch {
      setErrorMessage(Errors.UnableToUpdateTodo);

      return false;
    } finally {
      setUpdatingTodoIds(new Set());
    }
  };

  const handleChangeTodo = async (newTodo: Todo) => {
    setUpdatingTodoIds(currentIds => new Set(currentIds).add(newTodo.id));

    try {
      await updateTodo(newTodo);

      setTodos(currentTodos =>
        currentTodos.map(todo => (todo.id === newTodo.id ? newTodo : todo)),
      );

      return true;
    } catch {
      setErrorMessage(Errors.UnableToUpdateTodo);

      return false;
    } finally {
      setUpdatingTodoIds(currentIds => {
        const nextIds = new Set(currentIds);

        nextIds.delete(newTodo.id);

        return nextIds;
      });
    }
  };
  //#endregion

  //#region Effects
  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage(Errors.UnableToLoadTodos);
        throw new Error(Errors.UnableToLoadTodos);
      });
  }, []);

  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setErrorMessage(Errors.None);
    }, 3000);

    return () => window.clearTimeout(timeoutId);
  }, [errorMessage]);
  //#endregion

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <Header
        todos={todos}
        createTodo={createTodo}
        onToggleAll={handleToggleAll}
        setErrorMessage={setErrorMessage}
        inputRef={inputRef}
      />

      <TodoList
        todos={filteredTodos}
        tempTodo={tempTodo}
        deletingTodoIds={deletingTodoIds}
        updatingTodoIds={updatingTodoIds}
        onChangeTodo={handleChangeTodo}
        removeTodo={removeTodo}
      />

      <div className="todoapp__content">
        {todos.length > 0 && (
          <Footer todos={todos} onClearCompleted={handleClearCompleted} />
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          {
            hidden: errorMessage === Errors.None,
          },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessage(Errors.None)}
        />
        {errorMessage}
      </div>
    </div>
  );
};
