import React, { useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';
import { TodoList } from './components/TodosList';
import { filterTodos } from './utils/filterTodos';
import { useError } from './hooks/useError';
import { AlertError } from './components/AlertError';
import { TodoFooter } from './components/TodoFooter';
import { useTodosAction } from './hooks/useTodosAction';
import { useTodosState } from './hooks/useTodosState';
import { TodoHeader } from './components/TodoHeader';
import { FilterStatus } from './types/filterStatus';
import { ERROR_MESSAGES } from './constants/errors';

export const App: React.FC = () => {
  const { error, showError, clearError } = useError();
  const {
    todos,
    setTodos,
    tempTodo,
    setTempTodo,
    completedTodos,
    activeTodos,
    updateTodoById,
  } = useTodosState();

  const {
    deleteTodoById,
    deleteCompleted,
    createTodo,
    updateManyTodos,
    updateTodo,
  } = useTodosAction({
    showError,
    todos,
    setTodos,
    tempTodo,
    setTempTodo,
    completedTodos,
    activeTodos,
    updateTodoById,
  });

  const [filterCompleted, setFilterCompleted] = useState<FilterStatus>(
    FilterStatus.All,
  );
  const [disabled, setDisabled] = useState(false);
  const [value, setValue] = useState('');

  const visibleTodos = filterTodos(todos, filterCompleted);

  const inputRef = useRef<HTMLInputElement>(null);

  function inputFocus() {
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  }

  async function handleCreateTodo(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const valueTrim = value.trim();

    if (!valueTrim) {
      showError(ERROR_MESSAGES.EMPTY_TITLE);

      return;
    }

    setDisabled(true);
    try {
      await createTodo(valueTrim);
      setValue('');
    } catch {
    } finally {
      setDisabled(false);
      inputFocus();
    }
  }

  async function handleDelete(id: number) {
    try {
      await deleteTodoById(id);
      inputFocus();

      return true;
    } catch (errors) {
      throw errors;
    }
  }

  async function handleDeleteCompletedTodos() {
    await deleteCompleted();
    inputFocus();
  }

  async function updateTodos() {
    if (activeTodos.length) {
      await updateManyTodos(activeTodos, true);

      return;
    }

    if (completedTodos.length) {
      await updateManyTodos(completedTodos, false);
    }
  }

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          inputRef={inputRef}
          onUpdateTodos={updateTodos}
          onCreateTodo={handleCreateTodo}
          value={value}
          onChangeValue={(title: string) => setValue(title)}
          disabled={disabled}
          activeTodosCount={activeTodos.length}
          completedTodos={completedTodos.length}
          todos={todos}
        />
        <TodoList
          todos={visibleTodos}
          handleDelete={handleDelete}
          tempTodo={tempTodo}
          handleUpdateTodo={updateTodo}
        />

        {todos?.length > 0 && (
          <TodoFooter
            filterCompleted={filterCompleted}
            onCompleted={filter => setFilterCompleted(filter)}
            activeTodosCount={activeTodos.length}
            onDeleteAllTodos={handleDeleteCompletedTodos}
            completedTodos={completedTodos.length}
          />
        )}
      </div>

      <AlertError error={error} onClear={clearError} />
    </div>
  );
};
