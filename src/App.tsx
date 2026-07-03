/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { useTodo } from './hooks/useTodo';
import { useError } from './hooks/useError';
import { ErrorNotification } from './components/ErrorNotification';
import {
  TodoAdd,
  TodoAddFormData,
  TodoFilter,
  TodoList,
} from './components/Todo';
import { ToggleAllButton } from './components/ToggleAllButton';
import { Todo, TodoUpdate } from './types/Todo';

export const App: React.FC = () => {
  const {
    todos,
    todosCount,
    loadingTodoIds,
    activeTodosCount,
    completedTodosCount,
    filterCompleted,
    isAllCompleted,
    setFilterCompleted,
    addTodo,
    getTodoList,
    deleteTodo,
    updateTodo,
    deleteCompletedTodos,
    updateTodoCompletedField,
  } = useTodo();
  const { error, setError, clearError } = useError();

  useEffect(() => {
    getTodoList().catch(err => {
      setError(err.message);
    });
  }, [getTodoList, setError]);

  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const formRef = useRef<HTMLInputElement>(null);

  function handleFocusAddForm() {
    if (formRef.current) {
      formRef.current.disabled = false;
      formRef.current.focus();
    }
  }

  function handleDisabledAddForm() {
    if (formRef.current) {
      formRef.current.disabled = true;
    }
  }

  async function handleDeleteTodo(id: Todo['id']) {
    deleteTodo(id)
      .catch(err => {
        setError(err.message);
      })
      .finally(() => handleFocusAddForm());
  }

  async function handleChangeTodo(id: Todo['id'], values: TodoUpdate) {
    return updateTodo(id, values)
      .then(() => {})
      .catch(err => {
        setError(err.message);
        throw new Error();
      });
  }

  function handleAddTodo({ title }: TodoAddFormData, callback: () => void) {
    handleDisabledAddForm();

    setTempTodo({
      title,
      userId: 0,
      id: 0,
      completed: false,
    });

    addTodo(title)
      .then(() => {
        callback();
      })
      .catch(err => {
        setError(err.message);
      })
      .finally(() => {
        setTempTodo(null);
        handleFocusAddForm();
      });
  }

  function handleDeleteCompletedTodos() {
    deleteCompletedTodos()
      .catch(err => {
        setError(err.message);
      })
      .finally(() => handleFocusAddForm());
  }

  const showActions = !!todosCount;

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <header className="todoapp__header">
          {showActions && (
            <ToggleAllButton
              value={isAllCompleted}
              onToggle={() => updateTodoCompletedField(!isAllCompleted)}
            />
          )}
          <TodoAdd
            onSubmit={handleAddTodo}
            onError={() => setError('Title should not be empty')}
            ref={formRef}
          />
        </header>
        {showActions && (
          <>
            <TodoList
              todoList={todos}
              loadingIds={loadingTodoIds}
              onDeleteTodo={handleDeleteTodo}
              onChangeTodo={handleChangeTodo}
              tempTodo={tempTodo}
            />
            <footer className="todoapp__footer" data-cy="Footer">
              <span className="todo-count" data-cy="TodosCounter">
                {`${activeTodosCount} items left`}
              </span>
              <TodoFilter
                status={filterCompleted}
                onChange={setFilterCompleted}
              />
              <button
                type="button"
                className="todoapp__clear-completed"
                data-cy="ClearCompletedButton"
                disabled={completedTodosCount < 1}
                onClick={handleDeleteCompletedTodos}
              >
                Clear completed
              </button>
            </footer>
          </>
        )}
      </div>
      <ErrorNotification errorMessage={error} onClose={() => clearError()} />
    </div>
  );
};
