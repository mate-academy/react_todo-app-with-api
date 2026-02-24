/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */

import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as todoService from './api/todos';

import { ErrorNotification } from './components/ErrorNotification';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { TodoItem } from './components/TodoItem';

import { ErrorMessage } from './enums/ErrorMessage';
import { TodoFilters } from './enums/TodoFilters';

import { Todo } from './types/Todo';
import { filterTodos } from './use_cases/filterTodos';

function getFilterFromHash(): TodoFilters {
  const hash = window.location.hash.replace('#/', '');

  switch (hash) {
    case TodoFilters.Active:
      return TodoFilters.Active;

    case TodoFilters.Completed:
      return TodoFilters.Completed;

    default:
      return TodoFilters.All;
  }
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<ErrorMessage>(
    ErrorMessage.None,
  );
  const [selectedFilter, setSelectedFilter] = useState<TodoFilters>(
    TodoFilters.All,
  );
  const [todoTitle, setTodoTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [processingIds, setProcessingIds] = useState<number[]>([]);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const hasTodos = todos.length > 0;

  const activeTodosCount = useMemo(
    () => todos.filter(todo => !todo.completed).length,
    [todos],
  );

  const completedTodosCount = todos.length - activeTodosCount;
  const allCompleted = hasTodos && activeTodosCount === 0;

  const filteredTodos = useMemo(
    () => filterTodos(selectedFilter, todos) ?? [],
    [todos, selectedFilter],
  );

  useEffect(() => {
    const onHashChange = () => {
      setSelectedFilter(getFilterFromHash());
    };

    onHashChange();
    window.addEventListener('hashchange', onHashChange);

    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  useEffect(() => {
    if (errorMessage === ErrorMessage.None) {
      return;
    }

    const timer = window.setTimeout(() => {
      setErrorMessage(ErrorMessage.None);
    }, 3000);

    return () => window.clearTimeout(timer);
  }, [errorMessage]);

  useEffect(() => {
    todoService
      .getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage(ErrorMessage.LoadTodos))
      .finally(() => {
        inputRef.current?.focus();
      });
  }, []);

  useEffect(() => {
    if (!tempTodo) {
      inputRef.current?.focus();
    }
  }, [tempTodo]);

  const handleAddTodo = async () => {
    const trimmedTitle = todoTitle.trim();

    if (!trimmedTitle) {
      setErrorMessage(ErrorMessage.EmptyTitle);

      return;
    }

    setTempTodo({
      id: 0,
      title: trimmedTitle,
      completed: false,
      userId: todoService.USER_ID,
    });

    try {
      const newTodo = await todoService.createTodo(trimmedTitle);

      setTodos(prev => [...prev, newTodo]);
      setTodoTitle('');
    } catch {
      setErrorMessage(ErrorMessage.AddTodo);
    } finally {
      setTempTodo(null);
    }
  };

  const handleRemoveTodo = async (todoId: number) => {
    setProcessingIds(prev => [...prev, todoId]);

    try {
      await todoService.deleteTodo(todoId);
      setTodos(prev => prev.filter(todo => todo.id !== todoId));
    } catch {
      setErrorMessage(ErrorMessage.DeleteTodo);
      throw new Error();
    } finally {
      setProcessingIds(prev => prev.filter(id => id !== todoId));
      inputRef.current?.focus();
    }
  };

  const handleToggleTodo = async (updatedTodo: Todo) => {
    setProcessingIds(prev => [...prev, updatedTodo.id]);

    try {
      const saved = await todoService.updateTodo(updatedTodo);

      setTodos(prev => prev.map(todo => (todo.id === saved.id ? saved : todo)));
    } catch {
      setErrorMessage(ErrorMessage.UpdateTodo);
    } finally {
      setProcessingIds(prev => prev.filter(id => id !== updatedTodo.id));
    }
  };

  const handleToggleAll = () => {
    const shouldComplete = !allCompleted;

    const todosToUpdate = shouldComplete
      ? todos.filter(todo => !todo.completed)
      : todos;

    todosToUpdate.forEach(todo => {
      handleToggleTodo({
        ...todo,
        completed: shouldComplete,
      });
    });
  };

  const handleUpdateTitle = async (
    todo: Todo,
    newTitle: string,
  ): Promise<void> => {
    const trimmed = newTitle.trim();

    if (!trimmed) {
      await handleRemoveTodo(todo.id);

      return;
    }

    if (trimmed === todo.title) {
      return;
    }

    setProcessingIds(prev => [...prev, todo.id]);

    try {
      const updated = await todoService.updateTodo({
        ...todo,
        title: trimmed,
      });

      setTodos(prev => prev.map(t => (t.id === updated.id ? updated : t)));
    } catch {
      setErrorMessage(ErrorMessage.UpdateTodo);
      throw new Error();
    } finally {
      setProcessingIds(prev => prev.filter(id => id !== todo.id));
    }
  };

  const handleClearCompleted = () => {
    todos
      .filter(todo => todo.completed)
      .forEach(todo => {
        handleRemoveTodo(todo.id);
      });
  };

  const isHeaderDisabled = Boolean(tempTodo);
  const isClearCompletedDisabled =
    completedTodosCount === 0 || Boolean(tempTodo) || processingIds.length > 0;

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          ref={inputRef}
          todoTitle={todoTitle}
          onTodoTitleChange={setTodoTitle}
          onAddTodo={handleAddTodo}
          isAllTodosCompleted={allCompleted}
          onToggleAll={handleToggleAll}
          disabled={isHeaderDisabled}
          hasTodos={hasTodos}
        />

        {(hasTodos || tempTodo) && (
          <section className="todoapp__main" data-cy="TodoList">
            {filteredTodos.map(todo => (
              <TodoItem
                key={todo.id}
                todo={todo}
                isProcessing={processingIds.includes(todo.id)}
                onDelete={handleRemoveTodo}
                onToggle={() =>
                  handleToggleTodo({
                    ...todo,
                    completed: !todo.completed,
                  })
                }
                onUpdateTitle={newTitle => handleUpdateTitle(todo, newTitle)}
              />
            ))}

            {tempTodo && <TodoItem key={0} todo={tempTodo} isProcessing />}
          </section>
        )}

        {hasTodos && (
          <Footer
            activeCount={activeTodosCount}
            filter={selectedFilter}
            onFilterChange={setSelectedFilter}
            onClearCompleted={handleClearCompleted}
            isClearCompletedDisabled={isClearCompletedDisabled}
          />
        )}
      </div>

      <ErrorNotification
        message={errorMessage}
        onClose={() => setErrorMessage(ErrorMessage.None)}
      />
    </div>
  );
};
