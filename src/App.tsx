/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { UserWarning } from './UserWarning';
import { TodoForm } from './components/TodoForm';
import { TodoList } from './components/TodoList';
import { TodoFooter } from './components/TodoFooter';
import { ErrorNotification } from './components/ErrorNotification';
import { Todo } from './types/Todo';
import { FilterStatus, ErrorMessage } from './types/enums';
import {
  getTodos,
  addTodo,
  deleteTodo,
  updateTodo,
  USER_ID,
} from './api/todos';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [filterBy, setFilterBy] = useState<FilterStatus>(FilterStatus.All);
  const [title, setTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deletingIds, setDeletingIds] = useState<number[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [updatingIds, setUpdatingIds] = useState<number[]>([]);
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);

  const newTodoFieldRef = useRef<HTMLInputElement>(null);
  const deletingIdsSet = useMemo(() => new Set(deletingIds), [deletingIds]);
  const updatingIdsSet = useMemo(() => new Set(updatingIds), [updatingIds]);

  useEffect(() => {
    setErrorMessage('');

    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage(ErrorMessage.LoadTodos);
      });
  }, []);

  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    const timerId = window.setTimeout(() => {
      setErrorMessage('');
    }, 3000);

    return () => {
      clearTimeout(timerId);
    };
  }, [errorMessage]);

  useEffect(() => {
    if (!isAdding && deletingIds.length === 0) {
      newTodoFieldRef.current?.focus();
    }
  }, [isAdding, deletingIds.length]);

  const handleAddTodo = async (event: React.FormEvent) => {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setErrorMessage(ErrorMessage.EmptyTitle);

      return;
    }

    const newTempTodo: Todo = {
      id: 0,
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    };

    setIsAdding(true);
    setTempTodo(newTempTodo);

    try {
      const createdTodo = await addTodo(USER_ID, trimmedTitle);

      setTodos(currentTodos => [...currentTodos, createdTodo]);
      setTitle('');
    } catch {
      setErrorMessage(ErrorMessage.AddTodo);
    } finally {
      setTempTodo(null);
      setIsAdding(false);
    }
  };

  const performDeleteTodo = async (todoId: number): Promise<boolean> => {
    setDeletingIds(current =>
      current.includes(todoId) ? current : [...current, todoId],
    );

    try {
      await deleteTodo(todoId);
      setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));

      return true;
    } catch {
      setErrorMessage(ErrorMessage.DeleteTodo);

      return false;
    } finally {
      setDeletingIds(current => current.filter(id => id !== todoId));
    }
  };

  const performRenameTodo = async (
    todoId: number,
    newTitle: string,
  ): Promise<boolean> => {
    setUpdatingIds(current =>
      current.includes(todoId) ? current : [...current, todoId],
    );

    try {
      const updated = await updateTodo(todoId, { title: newTitle });

      setTodos(current =>
        current.map(todo => (todo.id === todoId ? updated : todo)),
      );

      return true;
    } catch {
      setErrorMessage(ErrorMessage.UpdateTodo);

      return false;
    } finally {
      setUpdatingIds(current => current.filter(id => id !== todoId));
    }
  };

  const handleStartEditing = (todoId: number) => {
    setEditingTodoId(todoId);
  };

  const handleCancelEditing = () => {
    setEditingTodoId(null);
  };

  const handleSubmitTodoTitle = async (todoId: number, rawTitle: string) => {
    const todoToEdit = todos.find(todo => todo.id === todoId);

    if (!todoToEdit) {
      setEditingTodoId(null);

      return;
    }

    const trimmedTitle = rawTitle.trim();

    if (trimmedTitle === todoToEdit.title) {
      setEditingTodoId(null);

      return;
    }

    if (!trimmedTitle) {
      const isDeleted = await performDeleteTodo(todoId);

      if (isDeleted) {
        setEditingTodoId(null);
      }

      return;
    }

    const isUpdated = await performRenameTodo(todoId, trimmedTitle);

    if (isUpdated) {
      setEditingTodoId(null);
    }
  };

  const handleDeleteTodo = async (todoId: number) => {
    await performDeleteTodo(todoId);

    if (editingTodoId === todoId) {
      setEditingTodoId(null);
    }
  };

  const handleToggleTodo = async (todoId: number) => {
    const todoToUpdate = todos.find(todo => todo.id === todoId);

    if (!todoToUpdate) {
      return;
    }

    setUpdatingIds(current => [...current, todoId]);

    try {
      const updated = await updateTodo(todoId, {
        completed: !todoToUpdate.completed,
      });

      setTodos(current =>
        current.map(todo => (todo.id === todoId ? updated : todo)),
      );
    } catch {
      setErrorMessage(ErrorMessage.UpdateTodo);
    } finally {
      setUpdatingIds(current => current.filter(id => id !== todoId));
    }
  };

  const handleToggleAll = async () => {
    const allCompleted = todos.every(todo => todo.completed);
    const newStatus = !allCompleted;

    const todosToUpdate = todos.filter(todo => todo.completed !== newStatus);

    if (!todosToUpdate.length) {
      return;
    }

    const idsToUpdate = todosToUpdate.map(todo => todo.id);

    setUpdatingIds(current => [...current, ...idsToUpdate]);

    const results = await Promise.allSettled(
      todosToUpdate.map(todo => updateTodo(todo.id, { completed: newStatus })),
    );

    const successfulUpdates: Todo[] = [];

    results.forEach(result => {
      if (result.status === 'fulfilled') {
        successfulUpdates.push(result.value);
      }
    });

    if (successfulUpdates.length) {
      const successfulById = new Map(
        successfulUpdates.map(updatedTodo => [updatedTodo.id, updatedTodo]),
      );

      setTodos(current =>
        current.map(todo => successfulById.get(todo.id) || todo),
      );
    }

    if (results.some(result => result.status === 'rejected')) {
      setErrorMessage(ErrorMessage.UpdateTodo);
    }

    setUpdatingIds(current => current.filter(id => !idsToUpdate.includes(id)));
  };

  const handleClearCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed);

    if (!completedTodos.length) {
      return;
    }

    const completedIds = completedTodos.map(todo => todo.id);

    setDeletingIds(current => [
      ...current,
      ...completedIds.filter(id => !current.includes(id)),
    ]);

    const results = await Promise.allSettled(
      completedTodos.map(todo => deleteTodo(todo.id)),
    );

    const successfulIds = completedTodos
      .filter((_, index) => results[index].status === 'fulfilled')
      .map(todo => todo.id);
    const hasError = results.some(result => result.status === 'rejected');

    if (successfulIds.length) {
      setTodos(currentTodos =>
        currentTodos.filter(todo => !successfulIds.includes(todo.id)),
      );
    }

    if (hasError) {
      setErrorMessage(ErrorMessage.DeleteTodo);
    }

    setDeletingIds(current => current.filter(id => !completedIds.includes(id)));
  };

  const visibleTodos = useMemo(
    () =>
      todos.filter(todo => {
        if (filterBy === FilterStatus.Active) {
          return !todo.completed;
        }

        if (filterBy === FilterStatus.Completed) {
          return todo.completed;
        }

        return true;
      }),
    [todos, filterBy],
  );

  const activeTodos = useMemo(
    () => todos.filter(todo => !todo.completed),
    [todos],
  );

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoForm
          title={title}
          onTitleChange={setTitle}
          onSubmit={handleAddTodo}
          isDisabled={isAdding}
          inputRef={newTodoFieldRef}
          hasTodos={todos.length > 0}
          allCompleted={todos.length > 0 && todos.every(todo => todo.completed)}
          onToggleAll={handleToggleAll}
        />

        <TodoList
          visibleTodos={visibleTodos}
          tempTodo={tempTodo}
          deletingIds={deletingIdsSet}
          onDelete={handleDeleteTodo}
          updatingIds={updatingIdsSet}
          onToggle={handleToggleTodo}
          editingTodoId={editingTodoId}
          onStartEdit={handleStartEditing}
          onCancelEdit={handleCancelEditing}
          onSubmitTitle={handleSubmitTodoTitle}
        />

        <TodoFooter
          hasTodos={todos.length > 0}
          filterBy={filterBy}
          activeTodosCount={activeTodos.length}
          onFilterChange={setFilterBy}
          onClearCompleted={handleClearCompleted}
          hasCompletedTodos={todos.some(todo => todo.completed)}
        />
      </div>

      <ErrorNotification
        message={errorMessage}
        onClose={() => setErrorMessage('')}
      />
    </div>
  );
};
