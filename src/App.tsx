/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { FormEvent, useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  USER_ID,
  getTodos,
  createTodo,
  deleteTodo,
  updateTodo,
} from './api/todos';
import { Todo } from './types/Todo';
import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
import { getFilteredTodos } from './utils/getFiltredTodos';
import { FilterStatus } from './types/FilterStatus';
import { Footer } from './components/Footer/Footer';
import { ErrorMessage } from './types/ErrorMessage';
import cn from 'classnames';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<ErrorMessage | null>(null);
  const [selectedFilter, setSelectedFilter] = useState(FilterStatus.All);
  const [title, setTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingTodos, setLoadingTodos] = useState<number[]>([]);

  const filteredTodos = getFilteredTodos(todos, selectedFilter);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();

    getTodos()
      .then(res => setTodos(res))
      .catch(() => setError(ErrorMessage.UnableLoad));
  }, []);

  useEffect(() => {
    if (!error) {
      return;
    }

    const timeout = setTimeout(() => setError(null), 3000);

    return () => clearTimeout(timeout);
  }, [error]);

  const handleAddTodo = (event: FormEvent) => {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setError(ErrorMessage.TitleIsEmpty);

      return;
    }

    if (inputRef.current) {
      inputRef.current.disabled = true;
    }

    const newTodo: Omit<Todo, 'id'> = {
      title: trimmedTitle,
      completed: false,
      userId: USER_ID,
    };

    setTempTodo({
      id: 0,
      ...newTodo,
    });

    setLoadingTodos(current => [...current, 0]);

    createTodo(newTodo)
      .then(newTodoFromServer => {
        setTodos(currentTodos => [...currentTodos, newTodoFromServer]);
        setTitle('');
      })
      .catch(() => setError(ErrorMessage.UnableAddTodo))
      .finally(() => {
        if (inputRef.current) {
          inputRef.current.disabled = false;
          inputRef.current.focus();
        }

        setTempTodo(null);
        setLoadingTodos(current => current.filter(todoId => todoId !== 0));
      });
  };

  const handleDeleteTodo = (todoId: number) => {
    setLoadingTodos(current => [...current, todoId]);

    deleteTodo(todoId)
      .then(() =>
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        ),
      )
      .catch(() => setError(ErrorMessage.UnableDeleteTodo))
      .finally(() =>
        setLoadingTodos(current =>
          current.filter(deletingTodoId => todoId !== deletingTodoId),
        ),
      );
    inputRef.current?.focus();
  };

  const completedTodos = todos.filter(todo => todo.completed);
  const activeTodos = todos.filter(todo => !todo.completed);

  const handleDeleteAllCompleted = () => {
    completedTodos.forEach(todo => handleDeleteTodo(todo.id));
    inputRef.current?.focus();
  };

  const handleToggleStatus = (todo: Todo) => {
    setLoadingTodos(current => [...current, todo.id]);

    updateTodo({ ...todo, completed: !todo.completed })
      .then(updatedTodo =>
        setTodos(currentTodos =>
          currentTodos.map(currentTodo =>
            currentTodo.id === updatedTodo.id ? updatedTodo : currentTodo,
          ),
        ),
      )
      .catch(() => setError(ErrorMessage.UnableUppdateTodo))
      .finally(() =>
        setLoadingTodos(current => current.filter(id => id !== todo.id)),
      );
  };

  const handleToggleAll = () => {
    if (activeTodos.length > 0) {
      activeTodos.forEach(handleToggleStatus);
    } else {
      completedTodos.forEach(handleToggleStatus);
    }
  };

  const handleRename = (todo: Todo) => {
    setLoadingTodos(current => [...current, todo.id]);

    updateTodo(todo)
      .then(updatedTodo =>
        setTodos(currentTodos =>
          currentTodos.map(currentTodo =>
            currentTodo.id === updatedTodo.id ? updatedTodo : currentTodo,
          ),
        ),
      )
      .catch(() => setError(ErrorMessage.UnableUppdateTodo))
      .finally(() =>
        setLoadingTodos(current => current.filter(id => id !== todo.id)),
      );
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          inputRef={inputRef}
          todos={todos}
          title={title}
          onAdd={handleAddTodo}
          newTitle={setTitle}
          onToggleAll={handleToggleAll}
        />
        <TodoList
          todos={filteredTodos}
          onDelete={handleDeleteTodo}
          tempTodo={tempTodo}
          loadingTodos={loadingTodos}
          onToggle={handleToggleStatus}
          onRename={handleRename}
        />

        {todos.length !== 0 && (
          <Footer
            todos={todos}
            selectedFilter={selectedFilter}
            setSelectedFilter={setSelectedFilter}
            onClearCompleted={handleDeleteAllCompleted}
          />
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={cn(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !error },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setError(null)}
        />
        {error}
      </div>
    </div>
  );
};
