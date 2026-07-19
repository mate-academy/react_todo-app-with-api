import React, { useEffect, useMemo, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  USER_ID,
  getTodos,
  createTodo,
  deleteTodo,
  updateTodo,
} from './api/todos';
import { Todo } from './types/Todo';
import { Status } from './types/Status';
import { ErrorMessage } from './types/ErrorMessage';
import { Header, TodoList, Footer, ErrorNotification } from './components';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [filter, setFilter] = useState<Status>(Status.All);
  const [error, setError] = useState<ErrorMessage>(ErrorMessage.None);
  const [title, setTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [processingIds, setProcessingIds] = useState<number[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);

  const focusInput = () => inputRef.current?.focus();

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => setError(ErrorMessage.Load));
  }, []);

  useEffect(() => {
    if (!error) {
      return undefined;
    }

    const timerId = window.setTimeout(() => {
      setError(ErrorMessage.None);
    }, 3000);

    return () => window.clearTimeout(timerId);
  }, [error]);

  // Keep the text field focused once it becomes enabled again
  useEffect(() => {
    if (!isSubmitting) {
      focusInput();
    }
  }, [isSubmitting]);

  const visibleTodos = useMemo(() => {
    switch (filter) {
      case Status.Active:
        return todos.filter(todo => !todo.completed);
      case Status.Completed:
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  }, [todos, filter]);

  const handleAddTodo = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setError(ErrorMessage.EmptyTitle);

      return;
    }

    setError(ErrorMessage.None);
    setIsSubmitting(true);
    setTempTodo({
      id: 0,
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    });

    createTodo({ userId: USER_ID, title: trimmedTitle, completed: false })
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
        setTitle('');
      })
      .catch(() => setError(ErrorMessage.Add))
      .finally(() => {
        setTempTodo(null);
        setIsSubmitting(false);
      });
  };

  const handleDeleteTodo = (todoId: number) => {
    setProcessingIds(current => [...current, todoId]);

    return deleteTodo(todoId)
      .then(() => {
        setTodos(current => current.filter(todo => todo.id !== todoId));
      })
      .catch(deleteError => {
        setError(ErrorMessage.Delete);
        throw deleteError;
      })
      .finally(() => {
        setProcessingIds(current => current.filter(id => id !== todoId));
        focusInput();
      });
  };

  const handleClearCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    Promise.all(completedTodos.map(todo => handleDeleteTodo(todo.id))).catch(
      () => {},
    );
  };

  const handleUpdateTodo = (todoToUpdate: Todo) => {
    setProcessingIds(current => [...current, todoToUpdate.id]);
    setError(ErrorMessage.None);

    return updateTodo(todoToUpdate)
      .then(updatedTodo => {
        setTodos(current =>
          current.map(todo =>
            todo.id === updatedTodo.id ? updatedTodo : todo,
          ),
        );
      })
      .catch(updateError => {
        setError(ErrorMessage.Update);
        throw updateError;
      })
      .finally(() => {
        setProcessingIds(current =>
          current.filter(id => id !== todoToUpdate.id),
        );
      });
  };

  const handleToggleTodo = (todoToToggle: Todo) => {
    handleUpdateTodo({
      ...todoToToggle,
      completed: !todoToToggle.completed,
    }).catch(() => {});
  };

  const handleToggleAll = () => {
    const areAllCompleted = todos.every(todo => todo.completed);

    todos
      .filter(todo => todo.completed === areAllCompleted)
      .forEach(todo => {
        handleUpdateTodo({ ...todo, completed: !areAllCompleted }).catch(
          () => {},
        );
      });
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          title={title}
          isSubmitting={isSubmitting}
          inputRef={inputRef}
          onTitleChange={setTitle}
          onSubmit={handleAddTodo}
          onToggleAll={handleToggleAll}
        />

        {(todos.length > 0 || tempTodo) && (
          <TodoList
            todos={visibleTodos}
            tempTodo={tempTodo}
            processingIds={processingIds}
            hasError={!!error}
            onDelete={handleDeleteTodo}
            onToggle={handleToggleTodo}
            onRename={handleUpdateTodo}
          />
        )}

        {todos.length > 0 && (
          <Footer
            todos={todos}
            filter={filter}
            onFilterChange={setFilter}
            onClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      <ErrorNotification
        error={error}
        onClose={() => setError(ErrorMessage.None)}
      />
    </div>
  );
};
