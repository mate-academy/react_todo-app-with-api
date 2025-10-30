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
import { ErrorNotification } from './components/ErrorNotification';
import { Todo } from './types/Todo';
import { ERROR_TEXT } from './constants';
import { Filters } from './types/Filters';
import { Filter } from './components/Filter';
import { NewTodoForm } from './components/NewTodoForm';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { TodoItem } from './components/TodoItem';
import { useErrorHandler } from './hooks/useErrorHandler';
import { useProcessing } from './hooks/useProcessing';

export const App: React.FC = () => {
  // states
  const [todos, setTodos] = useState<Todo[]>([]);
  const [message, showError, hideError] = useErrorHandler();
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [isTogglingAll, setIsTogglingAll] = useState(false);
  const [processingIds, addProcessing, removeProcessing, addManyProcessing] =
    useProcessing();
  const [filter, setFilter] = useState<Filters>(Filters.all);
  const [newTitle, setNewTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // load todos on mount
  useEffect(() => {
    hideError();
    setIsLoading(true);
    getTodos()
      .then(todosFromServer => setTodos(todosFromServer))
      .catch(() => showError(ERROR_TEXT.load))
      .finally(() => setIsLoading(false));
  }, [hideError, showError]);

  useEffect(() => {
    if (!isLoading && !isAdding && editingId === null) {
      inputRef.current?.focus();
    }
  }, [isLoading, isAdding, editingId]);

  // count active todos
  const itemsLeft = useMemo(
    () => todos.filter(t => !t.completed).length,
    [todos],
  );

  const hasTodos = todos.length > 0;
  const hasCompleted = useMemo(() => todos.some(t => t.completed), [todos]);
  const allCompleted = hasTodos && itemsLeft === 0;

  // filtered list of todos
  const filteredTodos = useMemo(() => {
    switch (filter) {
      case Filters.active:
        return todos.filter(t => !t.completed);
      case Filters.completed:
        return todos.filter(t => t.completed);
      case Filters.all:
        return todos;
    }
  }, [todos, filter]);

  // add todo
  const handleAddTodo = async () => {
    const title = newTitle.trim();

    if (!title) {
      showError(ERROR_TEXT.emptyTitle);

      return;
    }

    hideError();
    setIsAdding(true);

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
      setNewTitle('');
    } catch {
      showError(ERROR_TEXT.add);
    } finally {
      setTempTodo(null);
      setIsAdding(false);
    }
  };

  // delete single todo
  const handleDelete = async (id: number) => {
    hideError();
    // add to set to show loader
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

  // clear completed todos
  const handleClearCompleted = async () => {
    const ids = todos.filter(todo => todo.completed).map(todo => todo.id);

    hideError();
    setIsClearing(true);

    // marking all as deleting
    addManyProcessing(ids);

    // list of deletes for  parallel deleting
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

  // toggle single
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

  // toggle all
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

    setEditingId(todo.id);
    setEditingTitle(todo.title);
  };

  const handleCancelEditing = () => {
    setEditingId(null);
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

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this button should have `active` class only if all todos are completed */}
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
            value={newTitle}
            onChange={setNewTitle}
            onSubmit={handleAddTodo}
            disabled={isAdding || isLoading}
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
                    onDelete={handleDelete}
                    onToggle={handleToggle}
                    editControls={{
                      isEditing: editingId === todo.id,
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
              <CSSTransition key="temp" timeout={300} classNames="item">
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
            {/* this button should be disabled if there are no completed todos */}
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
