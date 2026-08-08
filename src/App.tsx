/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect, useRef } from 'react';
import {
  getTodos,
  createTodo,
  deleteTodo,
  updateTodo,
  USER_ID,
} from './api/todos';

import { Footer, FilterStatus } from './components/Footer';
import { Header } from './components/Header';
import { Todo } from './types/Todo';
import { Todo as TodoItem } from './components/Todo';
import { ErrorMessage } from './types/ErrorMessage';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filteringByCompleted, setFilteringByCompleted] = useState<FilterStatus>(
    FilterStatus.ALL,
  );
  const [errorMessage, setErrorMessage] = useState<ErrorMessage>(
    ErrorMessage.NONE,
  );
  const [title, setTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (errorMessage === ErrorMessage.NONE) return;

    const timer = setTimeout(() => {
      setErrorMessage(ErrorMessage.NONE);
    }, 3000);

    return () => clearTimeout(timer);
  }, [errorMessage]);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage(ErrorMessage.FAILED_LOAD);
      });
  }, []);

  useEffect(() => {
    if (!isSubmitting) {
      inputRef.current?.focus();
    }
  }, [isSubmitting, todos.length]);

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setErrorMessage(ErrorMessage.EMPTY_TITLE);
      return;
    }

    setIsSubmitting(true);

    setTempTodo({
      id: 0,
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    });

    createTodo({
      title: trimmedTitle,
      userId: USER_ID,
      completed: false,
    })
      .then(newTodo => {
        setTodos(prev => [...prev, newTodo]);
        setTitle('');
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.FAILED_ADD);
      })
      .finally(() => {
        setTempTodo(null);
        setIsSubmitting(false);
      });
  };

  const handleDeleteTodo = async (todoId: number): Promise<void> => {
    setLoadingTodoIds(prev => [...prev, todoId]);

    try {
      await deleteTodo(todoId);
      setTodos(prev => prev.filter(todo => todo.id !== todoId));
    } catch (error) {
      setErrorMessage(ErrorMessage.FAILED_DELETE);
      throw error;
    } finally {
      setLoadingTodoIds(prev => prev.filter(id => id !== todoId));
      inputRef.current?.focus();
    }
  };

  const handleUpdateTodo = async (updatedTodo: Todo): Promise<void> => {
    setLoadingTodoIds(prev => [...prev, updatedTodo.id]);

    try {
      const result = await updateTodo(updatedTodo);
      setTodos(prev =>
        prev.map(todo => (todo.id === result.id ? result : todo)),
      );
    } catch (error) {
      setErrorMessage(ErrorMessage.FAILED_UPDATE);
      throw error;
    } finally {
      setLoadingTodoIds(prev => prev.filter(id => id !== updatedTodo.id));
    }
  };

  const handleToggleAll = () => {
    const areAllCompleted = todos.every(todo => todo.completed);
    const targetStatus = !areAllCompleted;

    const todosToUpdate = todos.filter(
      todo => todo.completed !== targetStatus,
    );

    todosToUpdate.forEach(todo => {
      handleUpdateTodo({
        ...todo,
        completed: targetStatus,
      });
    });
  };

  const handleClearCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    completedTodos.forEach(todo => {
      handleDeleteTodo(todo.id);
    });
  };

  const filteredTodos = todos.filter(todo => {
    switch (filteringByCompleted) {
      case FilterStatus.ACTIVE:
        return !todo.completed;
      case FilterStatus.COMPLETED:
        return todo.completed;
      default:
        return true;
    }
  });

  const incompleteTodoQuantity = todos.filter(todo => !todo.completed).length;
  const areAllTodosCompleted =
    todos.length > 0 && todos.every(todo => todo.completed);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todosCount={todos.length}
          title={title}
          setTitle={setTitle}
          onSubmit={handleAddTodo}
          isSubmitting={isSubmitting}
          inputRef={inputRef}
          onToggleAll={handleToggleAll}
          areAllCompleted={areAllTodosCompleted}
        />

        {(!!todos.length || tempTodo) && (
          <section className="todoapp__main" data-cy="TodoList">
            {filteredTodos.map(todo => (
              <TodoItem
                key={todo.id}
                todo={todo}
                isLoading={loadingTodoIds.includes(todo.id)}
                onDelete={handleDeleteTodo}
                onUpdate={handleUpdateTodo}
              />
            ))}

            {tempTodo && (
              <TodoItem
                todo={tempTodo}
                isLoading={true}
              />
            )}
          </section>
        )}

        {!!todos.length && (
          <Footer
            incompleteTodoQuantity={incompleteTodoQuantity}
            onFilterSelect={setFilteringByCompleted}
            activeFiltering={filteringByCompleted}
            isAnyTodoCompleted={todos.length !== incompleteTodoQuantity}
            onClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      <div
        className={`notification is-danger is-light has-text-weight-normal ${
          errorMessage === ErrorMessage.NONE ? 'hidden' : ''
        }`}
        data-cy="ErrorNotification"
      >
        <button
          type="button"
          className="delete"
          data-cy="HideErrorButton"
          onClick={() => setErrorMessage(ErrorMessage.NONE)}
        />
        {errorMessage}
      </div>
    </div>
  );
};
