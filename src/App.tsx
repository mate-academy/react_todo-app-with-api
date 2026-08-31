/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { Filter } from './types/Filter';
import { ErrorMessage } from './types/ErrorMessage';
import * as postService from './api/todos';
import { TodoList } from './components/TodoList';
import { TodoForm } from './components/TodoForm';
import { TodoFilter } from './components/TodoFilter';
import { ErrorNotification } from './components/ErrorNotification';
import { ToggleAllButton } from './components/ToggleAllButton';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filter, setFilter] = useState<Filter>(Filter.All);
  const [errorMessage, setErrorMessage] = useState<ErrorMessage>(
    ErrorMessage.None,
  );
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deletingTodoIds, setDeletingTodoIds] = useState<number[]>([]);
  const [updatingTodoIds, setUpdatingTodoIds] = useState<number[]>([]);

  const titleField = useRef<HTMLInputElement>(null);

  const activeTodosCount = todos.filter(todo => !todo.completed).length;
  const hasCompletedTodos = todos.some(todo => todo.completed);
  const areAllCompleted =
    todos.length > 0 && todos.every(todo => todo.completed);

  const visibleTodos = useMemo(() => {
    switch (filter) {
      case Filter.Active:
        return todos.filter(todo => !todo.completed);
      case Filter.Completed:
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  }, [todos, filter]);

  const showError = (message: ErrorMessage) => {
    setErrorMessage(message);
    window.setTimeout(() => setErrorMessage(ErrorMessage.None), 3000);
  };

  useEffect(() => {
    postService
      .getTodos()
      .then(setTodos)
      .catch(() => showError(ErrorMessage.Load))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (!isSubmitting && deletingTodoIds.length === 0) {
      titleField.current?.focus();
    }
  }, [isSubmitting, deletingTodoIds]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const handleToggleAll = () => {
    const shouldMarkAllCompleted = !areAllCompleted;

    const todosToUpdate = shouldMarkAllCompleted
      ? todos.filter(todo => !todo.completed)
      : todos.filter(todo => todo.completed);

    setUpdatingTodoIds(todosToUpdate.map(todo => todo.id));

    Promise.all(
      todosToUpdate.map(todo =>
        postService.updateTodos(todo.id, {
          ...todo,
          completed: shouldMarkAllCompleted,
        }),
      ),
    )
      .then(updatedTodos => {
        setTodos(currentTodos =>
          currentTodos.map(todo => {
            const updatedTodo = updatedTodos.find(item => item.id === todo.id);

            return updatedTodo || todo;
          }),
        );
      })
      .catch(() => {
        showError(ErrorMessage.Update);
      })
      .finally(() => {
        setUpdatingTodoIds([]);
      });
  };

  const handleToggleTodo = (todoId: number) => {
    const todoToUpdateToggle = todos.find(todo => todo.id === todoId);

    if (!todoToUpdateToggle) {
      return;
    }

    setUpdatingTodoIds(current => [...current, todoId]);

    postService
      .updateTodos(todoId, {
        ...todoToUpdateToggle,
        completed: !todoToUpdateToggle.completed,
      })
      .then(updatedTodo => {
        setTodos(currentTodos =>
          currentTodos.map(todo =>
            todo.id === updatedTodo.id ? updatedTodo : todo,
          ),
        );
      })
      .catch(() => {
        showError(ErrorMessage.Update);
      })
      .finally(() => {
        setUpdatingTodoIds(current => current.filter(id => id !== todoId));
      });
  };

  const handleUpdatedTodo = async (todoId: number, newTitle: string) => {
    const todoToUpdate = todos.find(todo => todo.id === todoId);

    if (!todoToUpdate) {
      return;
    }

    setUpdatingTodoIds(current => [...current, todoId]);

    try {
      const updatedTodo = await postService.updateTodos(todoId, {
        ...todoToUpdate,
        title: newTitle,
      });

      setTodos(currentTodos =>
        currentTodos.map(todo =>
          todo.id === updatedTodo.id ? updatedTodo : todo,
        ),
      );
    } catch {
      showError(ErrorMessage.Update);

      throw new Error('Update failed');
    } finally {
      setUpdatingTodoIds(current => current.filter(id => id !== todoId));
    }
  };

  const handleDeleteTodo = async (todoId: number) => {
    setDeletingTodoIds(current => [...current, todoId]);

    try {
      await postService.deleteTodos(todoId);

      setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));
    } catch {
      showError(ErrorMessage.Delete);
    } finally {
      setDeletingTodoIds(current => current.filter(id => id !== todoId));
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      showError(ErrorMessage.Empty);

      return;
    }

    const newTempTodo: Todo = {
      id: 0,
      title: trimmedTitle,
      userId: USER_ID,
      completed: false,
    };

    setTempTodo(newTempTodo);
    setErrorMessage(ErrorMessage.None);
    setIsSubmitting(true);

    postService
      .createTodos({
        title: trimmedTitle,
        userId: USER_ID,
        completed: false,
      })
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
        setTitle('');
      })
      .catch(() => {
        showError(ErrorMessage.Add);
      })
      .finally(() => {
        setTempTodo(null);
        setIsSubmitting(false);
      });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this button should have `active` class only if all todos are completed */}
          {!isLoading && todos.length > 0 && (
            <ToggleAllButton
              areAllCompleted={areAllCompleted}
              onToggleAll={handleToggleAll}
            />
          )}

          <TodoForm
            title={title}
            isSubmitting={isSubmitting}
            onTitleChange={setTitle}
            onSubmit={handleSubmit}
            titleFieldRef={titleField}
          />
        </header>

        <TodoList
          todos={visibleTodos}
          tempTodo={tempTodo}
          deletingTodoIds={deletingTodoIds}
          onToggle={handleToggleTodo}
          onDelete={handleDeleteTodo}
          onUpdate={handleUpdatedTodo}
          updatingTodoIds={updatingTodoIds}
        />

        {todos.length > 0 && (
          <TodoFilter
            activeTodosCount={activeTodosCount}
            filter={filter}
            hasCompletedTodos={hasCompletedTodos}
            onFilterChange={setFilter}
            onClearCompleted={() => {
              todos
                .filter(todo => todo.completed)
                .forEach(todo => handleDeleteTodo(todo.id));
            }}
          />
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        onHide={() => setErrorMessage(ErrorMessage.None)}
      />
    </div>
  );
};
