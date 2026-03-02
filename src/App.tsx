import { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { TodoList } from './components/TodoList';
import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';
import { HeaderTodo } from './components/HeaderTodo';
import { FilterTodo } from './components/FilterTodo';
import { useTodos } from './hooks/useTodos';
import { useErrorMessage } from './hooks/useErrorMessage';
import { filterTodos, FilterType } from './utils/todoFilters';
import { ErrorMessage } from './types/ErrorMessage';

export const App: React.FC = () => {
  const [filter, setFilter] = useState<FilterType>(FilterType.ALL);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const { errorMessage, setErrorMessage } = useErrorMessage();
  const {
    todos,
    isAdding,
    deletingIds,
    tempTodo,
    isClearing,
    handleAddTodo,
    handleDeleteTodo,
    handleClearCompleted,
    handleCompletedTodo,
    handleToggleAllTodos,
    completingIds,
    editingId,
    editingIds,
    editingTitle,
    setEditingTitle,
    handleStartEdit,
    handleCommitEdit,
    handleCancelEdit,
  } = useTodos(setErrorMessage);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!isAdding && deletingIds.length === 0 && !isClearing) {
      inputRef.current?.focus();
    }
  }, [isAdding, deletingIds.length, isClearing]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedTitle = newTodoTitle.trim();

    if (!trimmedTitle) {
      setErrorMessage(ErrorMessage.EMPTY_TITLE);

      return;
    }

    try {
      await handleAddTodo(trimmedTitle, USER_ID);
      setNewTodoTitle('');
    } catch {
      setErrorMessage(ErrorMessage.ADD_TODO);
    }
  };

  const handleComplete = async (id: number, completed: boolean) => {
    try {
      await handleCompletedTodo(id, completed);
    } catch {
      setErrorMessage(ErrorMessage.UPDATE_TODO);
    }
  };

  const handleToggleAll = async () => {
    const hasActiveTodos = todos.some(todo => !todo.completed);

    try {
      await handleToggleAllTodos(hasActiveTodos);
    } catch {
      setErrorMessage(ErrorMessage.UPDATE_TODO);
    }
  };

  const handleEditTodo = async (id: number, title: string) => {
    let shouldDelete = false;

    try {
      shouldDelete = await handleCommitEdit(id, title);
    } catch {
      setErrorMessage(ErrorMessage.UPDATE_TODO);

      return;
    }

    if (shouldDelete) {
      try {
        await handleDeleteTodo(id);
        handleCancelEdit();
      } catch {
        setErrorMessage(ErrorMessage.DELETE_TODO);
      }
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await handleDeleteTodo(id);
    } catch {
      setErrorMessage(ErrorMessage.DELETE_TODO);
    }
  };

  const handleClear = async () => {
    try {
      await handleClearCompleted();
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      }
    }
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  const filteredTodos = filterTodos(todos, filter, tempTodo);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <HeaderTodo
          handlerSubmit={handleSubmit}
          handleToggleAll={handleToggleAll}
          inputRef={inputRef}
          newTodoTitle={newTodoTitle}
          setNewTodoTitle={setNewTodoTitle}
          isAdding={isAdding}
          todos={todos}
        />

        <TodoList
          todos={filteredTodos}
          isAdding={isAdding}
          deletingIds={deletingIds}
          completingIds={completingIds}
          editingId={editingId}
          editingIds={editingIds}
          editingTitle={editingTitle}
          setEditingTitle={setEditingTitle}
          handleDelete={handleDelete}
          handleComplete={handleComplete}
          handleStartEdit={handleStartEdit}
          handleEditTodo={handleEditTodo}
          handleCancelEdit={handleCancelEdit}
        />

        <FilterTodo
          todos={todos}
          filter={filter}
          setFilter={setFilter}
          handleClearCompleted={handleClear}
        />
      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          {
            hidden: !errorMessage,
          },
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
