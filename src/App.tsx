/* eslint-disable max-len */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import cn from 'classnames';
import { UserWarning } from './UserWarning';
import {
  createTodo,
  deleteTodo,
  getTodos,
  updateTodo,
  USER_ID,
} from './api/todos';
import { useErrorMessage } from './hooks/useErrorMessage';
import { Todo } from './types/Todo';
import { useProcessingIds } from './hooks/useProcessingIds';
import { Filters } from './types/Filters';
import { ERROR_TEXT } from './constants';
import { NewTodoForm } from './components/NewTodoForm/NewTodoForm';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { TodoItem } from './components/TodoItem/TodoItem';
import { Filter } from './components/Filter/Filter';
import { ErrorNotification } from './components/ErrorNotification/ErrorNotification';

export const App: React.FC = () => {
  // #region states
  const [todos, setTodos] = useState<Todo[]>([]);
  const [message, showError, hideError] = useErrorMessage();
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingTodo, setIsAddingTodo] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [isTogglingAll, setIsTogglingAll] = useState(false);
  const { processingIds, addProcessing, removeProcessing, addManyProcessing } =
    useProcessingIds();
  const [filter, setFilter] = useState<Filters>(Filters.ALL);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  // #endregion

  // #region load todos
  useEffect(() => {
    hideError();
    setIsLoading(true);
    getTodos()
      .then(todosFromServer => setTodos(todosFromServer))
      .catch(() => showError(ERROR_TEXT.load))
      .finally(() => setIsLoading(false));
  }, [hideError, showError]);

  useEffect(() => {
    if (!isLoading && !isAddingTodo && editingTodoId === null) {
      inputRef.current?.focus();
    }
  }, [isLoading, isAddingTodo, editingTodoId]);
  // #endregion

  const itemsLeft = useMemo(
    () => todos.filter(todo => !todo.completed).length,
    [todos],
  );

  const hasTodos = todos.length > 0;
  const hasCompleted = useMemo(
    () => todos.some(todo => todo.completed),
    [todos],
  );
  const allCompleted = hasTodos && itemsLeft === 0;

  const filteredTodos = useMemo(() => {
    switch (filter) {
      case Filters.ACTIVE:
        return todos.filter(todo => !todo.completed);
      case Filters.COMPLETED:
        return todos.filter(todo => todo.completed);
      case Filters.ALL:
        return todos;
    }
  }, [todos, filter]);

  // #region add todo
  const handleAddTodo = async () => {
    const title = newTodoTitle.trim();

    if (!title) {
      showError(ERROR_TEXT.emptyTitle);

      return;
    }

    hideError();
    setIsAddingTodo(true);

    const temp: Todo = {
      id: 0,
      userId: USER_ID,
      title,
      completed: false,
    };

    setTempTodo(temp);

    try {
      const created = await createTodo(title);

      setTodos(prev => [...prev, created]);
      setNewTodoTitle('');
    } catch {
      showError(ERROR_TEXT.add);
    } finally {
      setTempTodo(null);
      setIsAddingTodo(false);
    }
  };
  // #endregion

  // #region delete single todo
  const handleDeleteTodo = async (id: number) => {
    hideError();
    addProcessing(id);

    try {
      await deleteTodo(id);
      setTodos(prev => prev.filter(todo => todo.id !== id));
      inputRef.current?.focus();
    } catch {
      showError(ERROR_TEXT.delete);
    } finally {
      removeProcessing(id);
    }
  };
  // #endregion

  // #region clear completed todos
  const handleClearCompleted = async () => {
    const ids = todos.filter(todo => todo.completed).map(todo => todo.id);

    hideError();
    setIsClearing(true);

    addManyProcessing(ids);

    const deletions = ids.map(async id => {
      try {
        await deleteTodo(id);
        setTodos(prev => prev.filter(todo => todo.id !== id));

        return { id, ok: true };
      } catch {
        return { id, ok: false };
      } finally {
        removeProcessing(id);
      }
    });

    const results = await Promise.allSettled(deletions);
    const anyFailed = results.some(
      result =>
        (result.status === 'fulfilled' && !result.value.ok) ||
        result.status === 'rejected',
    );

    if (anyFailed) {
      showError(ERROR_TEXT.delete);
    }

    setIsClearing(false);

    if (!anyFailed) {
      inputRef.current?.focus();
    }
  };
  // #endregion

  // #region toggle single
  const handleToggle = async (id: number, newState: boolean) => {
    hideError();
    addProcessing(id);
    try {
      const updated = await updateTodo(id, { completed: newState });

      setTodos(prev =>
        prev.map(todo =>
          todo.id === id ? { ...todo, completed: updated.completed } : todo,
        ),
      );
    } catch {
      showError(ERROR_TEXT.update);
    } finally {
      removeProcessing(id);
    }
  };
  // #endregion

  // #region toggle all
  const handleToggleAll = async () => {
    if (!hasTodos) {
      return;
    }

    const goalState = !allCompleted;
    const idsToUpdate = todos
      .filter(todo => todo.completed !== goalState)
      .map(todo => todo.id);

    hideError();
    setIsTogglingAll(true);

    addManyProcessing(idsToUpdate);
    const updates = idsToUpdate.map(async id => {
      try {
        const updated = await updateTodo(id, { completed: goalState });

        setTodos(prev =>
          prev.map(todo =>
            todo.id === id ? { ...todo, completed: updated.completed } : todo,
          ),
        );

        return { id, ok: true };
      } catch {
        return { id, ok: false };
      } finally {
        removeProcessing(id);
      }
    });

    const results = await Promise.allSettled(updates);
    const anyFailed = results.some(
      result =>
        (result.status === 'fulfilled' && !result.value.ok) ||
        result.status === 'rejected',
    );

    if (anyFailed) {
      showError(ERROR_TEXT.update);
    }

    setIsTogglingAll(false);
  };

  const handleStartEditing = (todo: Todo) => {
    if (processingIds.has(todo.id)) {
      return;
    }

    setEditingTodoId(todo.id);
    setEditingTitle(todo.title);
  };

  const handleCancelEditing = () => {
    setEditingTodoId(null);
    setEditingTitle('');
  };

  const handleRename = async (id: number) => {
    const todo = todos.find(t => t.id === id);

    if (!todo) {
      return;
    }

    const nextTitle = editingTitle.trim();

    if (nextTitle === todo.title) {
      handleCancelEditing();

      return;
    }

    if (!nextTitle) {
      hideError();
      addProcessing(id);

      try {
        await deleteTodo(id);
        setTodos(prev => prev.filter(t => t.id !== id));
        handleCancelEditing();
      } catch {
        showError(ERROR_TEXT.delete);
      } finally {
        removeProcessing(id);
      }

      return;
    }

    hideError();
    addProcessing(id);

    try {
      const updated = await updateTodo(id, { title: nextTitle });

      setTodos(prev =>
        prev.map(t => (t.id === id ? { ...t, title: updated.title } : t)),
      );
      handleCancelEditing();
    } catch {
      showError(ERROR_TEXT.update);
    } finally {
      removeProcessing(id);
    }
  };

  if (!USER_ID) {
    return <UserWarning />;
  }
  // #endregion

  return (
    <div className={cn('todoapp', { 'has-error': !!message })}>
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {!isLoading && hasTodos && (
            <button
              type="button"
              className={cn('todoapp__toggle-all', { active: allCompleted })}
              data-cy="ToggleAllButton"
              onClick={handleToggleAll}
              disabled={isTogglingAll}
            />
          )}

          <NewTodoForm
            ref={inputRef}
            value={newTodoTitle}
            onChange={setNewTodoTitle}
            onSubmit={handleAddTodo}
            disabled={isAddingTodo || isLoading}
          />
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          <TransitionGroup>
            {filteredTodos.map(todo => {
              const isBusy = processingIds?.has(todo.id) ?? false;

              return (
                <CSSTransition key={todo.id} timeout={300} classNames="item">
                  <TodoItem
                    todo={todo}
                    isBusy={isBusy}
                    onDelete={handleDeleteTodo}
                    onToggle={handleToggle}
                    editControls={{
                      isEditing: editingTodoId === todo.id,
                      editTitle: editingTitle,
                      startEdit: () => handleStartEditing(todo),
                      changeEditTitle: setEditingTitle,
                      submitEdit: () => handleRename(todo.id),
                      cancelEdit: handleCancelEditing,
                    }}
                  />
                </CSSTransition>
              );
            })}
            {tempTodo && (
              <CSSTransition key="temp" timeout={300} classNames="temp-item">
                <TodoItem
                  todo={tempTodo}
                  isBusy
                  editControls={{
                    isEditing: false,
                    editTitle: tempTodo.title,
                    startEdit: () => {},
                    changeEditTitle: () => {},
                    submitEdit: () => {},
                    cancelEdit: () => {},
                  }}
                />
              </CSSTransition>
            )}
          </TransitionGroup>
        </section>

        {hasTodos && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {itemsLeft} items left
            </span>

            <Filter value={filter} onChange={setFilter} />
            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              onClick={handleClearCompleted}
              disabled={!hasCompleted || isClearing}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      <ErrorNotification message={message} onHide={hideError} />
    </div>
  );
};
