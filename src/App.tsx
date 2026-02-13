/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect, useMemo, useRef } from 'react';
import cn from 'classnames';
import { MAIN_PHRASES, ERROR_MESSAGE, TEMP_TODO_ID } from './constants';
import {
  USER_ID,
  addTodo,
  deleteTodo,
  getTodos,
  updateTodo,
} from './api/todos';
import { Todo, TodoChangeOptions } from './types/Todo';
import { UserWarning } from './UserWarning';
import { Filter, FilterType } from './types/FilterType';
import { TodoList } from './components/TodoList';
import { TodoFooter } from './components/TodoFooter';
import { ErrorNotification } from './components/ErrorNotification';
import { ErrorMessage } from './types/Phrases';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Partial<Todo> | null>(null);
  const [filter, setFilter] = useState<FilterType>(Filter.All);
  const [errorMessage, setErrorMessage] = useState<ErrorMessage>(
    ERROR_MESSAGE.default,
  );
  const [processingIds, setProcessingIds] = useState<number[]>([]);

  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage(ERROR_MESSAGE.errorLoadFailed));
  }, []);

  const filteredTodos = useMemo(() => {
    return todos.filter(todo => {
      switch (filter) {
        case Filter.Active:
          return !todo.completed;
        case Filter.Completed:
          return todo.completed;
        case Filter.All:
        default:
          return true;
      }
    });
  }, [todos, filter]);

  const activeTodosCount = useMemo(
    () => todos.filter(todo => !todo.completed).length,
    [todos],
  );
  const allCompleted = todos.length > 0 && activeTodosCount === 0;

  useEffect(() => {
    if (input.current) {
      input.current.focus();
    }
  }, []);

  const handleAddTodo = async (title: string) => {
    if (!input.current || tempTodo) {
      return;
    }

    const trimmedTitle = title.trim();

    if (trimmedTitle) {
      input.current.disabled = true;

      setTempTodo({
        id: TEMP_TODO_ID,
        title: trimmedTitle,
        completed: false,
      });

      try {
        const newTodo = await addTodo(trimmedTitle);

        setTodos(prevTodos => [...prevTodos, newTodo]);

        if (input.current) {
          input.current.value = '';
        }
      } catch {
        setErrorMessage(ERROR_MESSAGE.errorAddFailed);
      } finally {
        if (input.current) {
          input.current.disabled = false;
          input.current.focus();
        }

        setTempTodo(null);
      }
    } else {
      setErrorMessage(ERROR_MESSAGE.errorEmptyTitle);
    }
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (input.current) {
      handleAddTodo(input.current.value);
    }
  };

  const handleUpdateTodo = async (
    id: number,
    changes: TodoChangeOptions,
  ): Promise<void> => {
    const todo = todos.find(td => td.id === id);

    if (!todo) {
      return;
    }

    setProcessingIds(prev => [...prev, id]);

    try {
      const updatedTodo = await updateTodo(id, {
        completed: changes.completed ?? todo.completed,
        title: changes.title ?? todo.title,
      });

      setTodos(prevTodos =>
        prevTodos.map(td => (td.id === id ? updatedTodo : td)),
      );
    } catch (error) {
      setErrorMessage(ERROR_MESSAGE.errorUpdateFailed);
      throw error;
    } finally {
      setProcessingIds(prev => prev.filter(todoId => todoId !== id));
    }
  };

  const handleToggleAll = async () => {
    const shouldCompleteAll = !allCompleted;

    const todosToUpdate = todos.filter(
      todo => todo.completed !== shouldCompleteAll,
    );

    setProcessingIds(prev => [...prev, ...todosToUpdate.map(t => t.id)]);

    const results = await Promise.allSettled(
      todosToUpdate.map(todo =>
        updateTodo(todo.id, { completed: shouldCompleteAll }),
      ),
    );

    const successfulTodoUpdates = results
      .map((result, index) =>
        result.status === 'fulfilled'
          ? { ...todosToUpdate[index], completed: shouldCompleteAll }
          : null,
      )
      .filter((todo): todo is Todo => todo !== null);

    setTodos(prevTodos =>
      prevTodos.map(
        todo =>
          successfulTodoUpdates.find(updated => updated.id === todo.id) || todo,
      ),
    );

    setProcessingIds(prev =>
      prev.filter(id => !todosToUpdate.some(t => t.id === id)),
    );

    const hasErrors = results.some(result => result.status === 'rejected');

    if (hasErrors) {
      setErrorMessage(ERROR_MESSAGE.errorUpdateFailed);
    }
  };

  const handleDeleteTodo = async (id: number): Promise<void> => {
    setProcessingIds(prev => [...prev, id]);

    try {
      await deleteTodo(id);
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
    } catch (error) {
      setErrorMessage(ERROR_MESSAGE.errorDeleteFailed);
      throw error;
    } finally {
      setProcessingIds(prev => prev.filter(todoId => todoId !== id));
      input.current?.focus();
    }
  };

  const handleDeleteCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed);

    setProcessingIds(prev => [...prev, ...completedTodos.map(t => t.id)]);

    const results = await Promise.allSettled(
      completedTodos.map(todo => deleteTodo(todo.id)),
    );

    const successfullyDeletedIds = completedTodos
      .filter((_, index) => results[index].status === 'fulfilled')
      .map(todo => todo.id);

    setTodos(prevTodos =>
      prevTodos.filter(todo => !successfullyDeletedIds.includes(todo.id)),
    );

    setProcessingIds(prev =>
      prev.filter(id => !completedTodos.some(t => t.id === id)),
    );

    const hasErrors = results.some(result => result.status === 'rejected');

    if (hasErrors) {
      setErrorMessage(ERROR_MESSAGE.errorDeleteFailed);
    }

    input.current?.focus();
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">{MAIN_PHRASES.headerTitle}</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this button should have `active` class only if all todos are completed */}
          {todos.length > 0 && (
            <button
              type="button"
              className={cn('todoapp__toggle-all', {
                active: allCompleted,
              })}
              data-cy="ToggleAllButton"
              onClick={handleToggleAll}
            />
          )}

          {/* Add a todo on form submit */}
          <form onSubmit={handleFormSubmit}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder={MAIN_PHRASES.inputPlaceholder}
              ref={input}
            />
          </form>
        </header>

        {todos.length > 0 && (
          <TodoList
            todos={filteredTodos}
            onUpdate={handleUpdateTodo}
            onDelete={handleDeleteTodo}
            tempTodo={tempTodo}
            processingIds={processingIds}
          />
        )}

        {todos.length > 0 && (
          <TodoFooter
            activeTodosCount={activeTodosCount}
            completedTodosCount={todos.length - activeTodosCount}
            filter={filter}
            onFilterChange={setFilter}
            onDeleteCompleted={handleDeleteCompleted}
          />
        )}
      </div>

      <ErrorNotification
        error={errorMessage}
        onClose={() => setErrorMessage(ERROR_MESSAGE.default)}
      />
    </div>
  );
};
