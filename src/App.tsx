/* eslint-disable max-len */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { deleteTodo, getTodos, patchTodo, USER_ID } from './api/todos';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Todo } from './types/Todo';
import { ErrorMessage } from './types/ErrorMessage';
import { Filter } from './types/Filter';
import classNames from 'classnames';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<ErrorMessage | null>(null);
  const [filter, setFilter] = useState<Filter>(Filter.ALL);
  const [temporaryTodo, setTemporaryTodo] = useState<Todo | null>(null);
  const [updatingTodos, setUpdatingTodos] = useState<number[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadTodos = async () => {
      try {
        const loadedTodos = await getTodos();

        setTodos(loadedTodos);
      } catch (err) {
        setErrorMessage(ErrorMessage.LOAD_TODOS);
      } finally {
        setTimeout(() => {
          setErrorMessage(null);
        }, 3000);
      }
    };

    loadTodos();
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const handleSetFilter = (filterType: Filter) => {
    setFilter(filterType);
  };

  const handleAddTodo = (newTodo: Todo) => {
    setTemporaryTodo(null);
    setTodos(prevState => [...prevState, newTodo]);
  };

  const handleAddTemporaryTodo = (tempTodo: Todo | null) => {
    setTemporaryTodo(tempTodo);
  };

  const handleSetError = (error: ErrorMessage | null) => {
    setErrorMessage(error);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteTodo(id);
      setTodos(prevState => prevState.filter(todo => todo.id !== id));
    } catch (error) {
      setErrorMessage(ErrorMessage.DELETE_TODO);
      throw error;
    } finally {
      setTimeout(() => {
        setErrorMessage(null);
      }, 3000);
    }
  };

  const handleDeleteCompletedTodos = async () => {
    try {
      const completedTodos = todos.filter(todo => todo.completed);

      const results = await Promise.allSettled(
        completedTodos.map(todo => deleteTodo(todo.id)),
      );

      const successfullyDeletedIds = completedTodos
        .filter((_, index) => results[index].status === 'fulfilled')
        .map(todo => todo.id);

      setTodos(prevTodos =>
        prevTodos.filter(todo => !successfullyDeletedIds.includes(todo.id)),
      );

      const failedDeletes = completedTodos.filter(
        (_, index) => results[index].status === 'rejected',
      );

      if (failedDeletes.length > 0) {
        setErrorMessage(ErrorMessage.DELETE_TODO);
      }
    } catch {
      setErrorMessage(ErrorMessage.DELETE_TODO);
    } finally {
      inputRef.current?.focus();

      setTimeout(() => {
        setErrorMessage(null);
      }, 3000);
    }
  };

  const filteredTodos = todos.filter(todo => {
    switch (filter) {
      case Filter.ACTIVE:
        return !todo.completed;
      case Filter.COMPLETED:
        return todo.completed;
      default:
        return true;
    }
  });

  const handleToggleTodoStatus = async (id: number) => {
    const todoToUpdate = todos.find(todo => todo.id === id);

    if (!todoToUpdate) {
      throw new Error('Todo not found');
    }

    const updatedTodo = { ...todoToUpdate, completed: !todoToUpdate.completed };

    setUpdatingTodos(prev => [...prev, id]);

    try {
      await patchTodo(id, { completed: updatedTodo.completed });
      setTodos(prevState =>
        prevState.map(todo =>
          todo.id === id ? { ...todo, completed: !todo.completed } : todo,
        ),
      );
    } catch {
      setErrorMessage(ErrorMessage.UPDATE_TODO);
    } finally {
      setUpdatingTodos(prev => prev.filter(todoId => todoId !== id));
      setTimeout(() => {
        setErrorMessage(null);
      }, 3000);
    }
  };

  const handleUpdateTodoTitle = async (id: number, newTitle: string) => {
    try {
      setUpdatingTodos(prev => [...prev, id]);
      await patchTodo(id, { title: newTitle });
      setTodos(prevTodos =>
        prevTodos.map(todo =>
          todo.id === id ? { ...todo, title: newTitle } : todo,
        ),
      );
    } catch (error) {
      setErrorMessage(ErrorMessage.UPDATE_TODO);
      throw error;
    } finally {
      setUpdatingTodos(prev => prev.filter(todoId => todoId !== id));
      setTimeout(() => {
        setErrorMessage(null);
      }, 3000);
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          onAddTodo={handleAddTodo}
          onAddTemporaryTodo={handleAddTemporaryTodo}
          onError={handleSetError}
          inputRef={inputRef}
          onToggleTodoStatus={handleToggleTodoStatus}
        />
        <TodoList
          temporaryTodo={temporaryTodo}
          todos={filteredTodos}
          onDeleteTodo={handleDelete}
          inputRef={inputRef}
          onToggleTodoStatus={handleToggleTodoStatus}
          updatingTodos={updatingTodos}
          onUpdateTodoTitle={handleUpdateTodoTitle}
        />
        {todos.length > 0 && (
          <Footer
            todos={todos}
            filter={filter}
            onFilterChange={handleSetFilter}
            onClearCompleted={handleDeleteCompletedTodos}
          />
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !errorMessage },
        )}
      >
        <button data-cy="HideErrorButton" type="button" className="delete" />
        {errorMessage}
      </div>
    </div>
  );
};
