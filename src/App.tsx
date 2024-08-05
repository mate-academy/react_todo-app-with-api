/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  USER_ID,
  addTodo,
  changeTodo,
  deleteTodo,
  getTodos,
} from './api/todos';
import { Todo } from './types/Todo';
import classNames from 'classnames';
import { Filter } from './types/EnumFilter';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Error } from './types/EnumError';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<Filter>(Filter.all);
  const [errorMessage, setErrorMessage] = useState('');
  const [todosAreLoadingIds, setTodosAreLoadingIds] = useState<number[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const showError = (error: string) => {
    setErrorMessage(error);
    setTimeout(() => setErrorMessage(''), 3000);
  };

  const fieldFocus = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fieldFocus.current?.focus();
  }, [todos.length, tempTodo]);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        showError(Error.load);
      });
  }, []);

  const completedTodosId = todos
    .filter(todo => todo.completed)
    .map(todo => todo.id);

  const activeTodosIds = useMemo(() => {
    return todos.filter(todo => !todo.completed).map(todo => todo.id);
  }, [todos]);

  const handleAddTodo = (
    newTitle: string,
    setNewTitle: (newTitle: string) => void,
  ) => {
    return addTodo({
      title: newTitle.trim(),
      completed: false,
      userId: USER_ID,
    })
      .then(newTodo => {
        setTodos([...todos, newTodo]);
        setNewTitle('');
      })
      .catch(() => {
        showError(Error.add);
      })
      .finally(() => {
        setTempTodo(null);
      });
  };

  const handleDeleteTodo = (id: number) => {
    setTodosAreLoadingIds(currentTodosAreLoadingIds => [
      ...currentTodosAreLoadingIds,
      id,
    ]);

    return deleteTodo(id)
      .then(() => {
        setTodos(currentTodos => currentTodos.filter(todo => todo.id !== id));
      })
      .catch(() => {
        showError(Error.delete);

        return { error: true };
      })
      .finally(() => {
        setTodosAreLoadingIds([]);
      });
  };

  const handleChangeTodo = ({ id, title, userId, completed }: Todo) => {
    setTodosAreLoadingIds(currentTodosAreLoadingIds => [
      ...currentTodosAreLoadingIds,
      id,
    ]);

    return changeTodo({ id, title, userId, completed })
      .then(changedTodo => {
        setTodos(currentTodos => {
          return currentTodos.map(todo =>
            todo.id === id ? changedTodo : todo,
          );
        });
      })
      .catch(() => {
        showError(Error.update);

        return { error: true };
      })
      .finally(() => setTodosAreLoadingIds([]));
  };

  const filteredTodos = todos.filter(({ completed }) => {
    switch (filter) {
      case Filter.active:
        return !completed;

      case Filter.completed:
        return completed;

      default:
        return true;
    }
  });

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          showError={showError}
          setTempTodo={setTempTodo}
          tempTodo={tempTodo}
          onChange={handleChangeTodo}
          activeTodosIds={activeTodosIds}
          fieldFocus={fieldFocus}
          onAdd={handleAddTodo}
        />

        <TodoList
          todos={filteredTodos}
          onDelete={handleDeleteTodo}
          todosAreLoadingIds={todosAreLoadingIds}
          tempTodo={tempTodo}
          onChange={handleChangeTodo}
        />

        {!!todos.length && (
          <Footer
            filter={filter}
            onFilter={setFilter}
            completedTodosId={completedTodosId}
            activeTodosIds={activeTodosIds}
            onDelete={handleDeleteTodo}
          />
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !errorMessage },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessage('')}
        />
        {errorMessage}
      </div>
    </div>
  );
};
