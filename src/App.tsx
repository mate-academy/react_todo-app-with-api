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
  const showList = hasTodos || !!tempTodo;

  const activeTodosCount = useMemo(
    () => todos.filter(todo => !todo.completed).length,
    [todos],
  );

  const completedTodosCount = todos.length - activeTodosCount;
  const allCompleted = hasTodos && activeTodosCount === 0;

  const filteredTodos = useMemo(
    () => filterTodos(selectedFilter, todos) || [],
    [todos, selectedFilter],
  );

  useEffect(() => {
    const onHashChange = () => setSelectedFilter(getFilterFromHash());

    onHashChange();
    window.addEventListener('hashchange', onHashChange);

    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  useEffect(() => {
    if (errorMessage === ErrorMessage.None) {
      return;
    }

    const timer = window.setTimeout(
      () => setErrorMessage(ErrorMessage.None),
      3000,
    );

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

      setTodos(current => [...current, newTodo]);
      setTodoTitle('');
    } catch {
      setErrorMessage(ErrorMessage.AddTodo);
    } finally {
      setTempTodo(null);
    }
  };

  const handleRemoveTodo = async (todoId: number) => {
    setProcessingIds(ids => [...ids, todoId]);

    try {
      await todoService.deleteTodo(todoId);
      setTodos(current => current.filter(todo => todo.id !== todoId));
    } catch {
      setErrorMessage(ErrorMessage.DeleteTodo);
    } finally {
      setProcessingIds(ids => ids.filter(id => id !== todoId));
      inputRef.current?.focus();
    }
  };

  const handleToggleTodo = async (todo: Todo) => {
    setProcessingIds(ids => [...ids, todo.id]);

    try {
      const updated = await todoService.updateTodo({
        ...todo,
        completed: !todo.completed,
      });

      setTodos(current =>
        current.map(t => (t.id === updated.id ? updated : t)),
      );
    } catch {
      setErrorMessage(ErrorMessage.UpdateTodo);
    } finally {
      setProcessingIds(ids => ids.filter(id => id !== todo.id));
    }
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

    setProcessingIds(ids => [...ids, todo.id]);

    try {
      const updated = await todoService.updateTodo({
        ...todo,
        title: trimmed,
      });

      setTodos(current =>
        current.map(t => (t.id === updated.id ? updated : t)),
      );
    } catch {
      setErrorMessage(ErrorMessage.UpdateTodo);
      throw new Error();
    } finally {
      setProcessingIds(ids => ids.filter(id => id !== todo.id));
    }
  };

  const handleClearCompleted = () => {
    todos
      .filter(todo => todo.completed)
      .forEach(todo => void handleRemoveTodo(todo.id));
  };

  const isHeaderDisabled = !!tempTodo;
  const isClearCompletedDisabled =
    completedTodosCount === 0 || !!tempTodo || processingIds.length > 0;

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
          onToggleAll={() => {}}
          disabled={isHeaderDisabled}
          hasTodos={hasTodos}
        />

        {showList && (
          <section className="todoapp__main" data-cy="TodoList">
            {filteredTodos.map(todo => (
              <TodoItem
                key={todo.id}
                todo={todo}
                isProcessing={processingIds.includes(todo.id)}
                onDelete={handleRemoveTodo}
                onToggle={() => handleToggleTodo(todo)}
                onUpdateTitle={newTitle => handleUpdateTitle(todo, newTitle)}
              />
            ))}

            {tempTodo && <TodoItem key={0} todo={tempTodo} isProcessing />}
          </section>
        )}

        {!!hasTodos && (
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
