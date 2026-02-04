import React, { useCallback, useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';

import { TodoList } from './components/TodoList/TodoList';
import { Todo } from './type/Todo';
import { Header } from './components/Header/Header';

import { Footer } from './components/Footer/Footer';
import { FilterOptions } from './type/filterOptions';
import { ErrorOptions } from './type/errorOptions';

import { ErrorNotification } from './components/ErrorNotification';

import {
  addTodo,
  deleteTodo,
  getTodos,
  updateTodo,
  USER_ID,
} from './api/todos';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<ErrorOptions>(ErrorOptions.Default);
  const [filter, setFilter] = useState<FilterOptions>(FilterOptions.All);

  const [newtitle, setNewTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const [processingsIds, setProcessingsIds] = useState<number[]>([]);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const activeTodo = todos.every(todo => todo.completed);

  const hasCompletedTodos = todos.some(todo => todo.completed);

  const activeTodoCount = todos.filter(todo => !todo.completed).length;

  function filteringByStatus(todo: Todo, currentFilter: FilterOptions) {
    switch (currentFilter) {
      case FilterOptions.Completed:
        return todo.completed;
      case FilterOptions.Active:
        return !todo.completed;
      default:
        return true;
    }
  }

  const filteredTodos = todos.filter(todo => filteringByStatus(todo, filter));

  useEffect(() => {
    setError(ErrorOptions.Default);
    setIsLoading(true);

    getTodos()
      .then(setTodos)
      .catch(() => {
        setError(ErrorOptions.LoadingError);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!isLoading) {
      inputRef.current?.focus();
    }
  }, [isLoading]);

  const closeError = useCallback(() => setError(ErrorOptions.Default), []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  function handleAddPost({ userId = USER_ID, title, completed = false }: Todo) {
    setIsLoading(true);

    addTodo({ userId, title, completed })
      .then(newTodo => {
        setTodos(prevTodos => [...prevTodos, newTodo]);
        setNewTitle('');
      })
      .catch(() => setError(ErrorOptions.AddingError))
      .finally(() => {
        setIsLoading(false);
        setTempTodo(null);
      });
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    const trimmedTitle = newtitle.trim();

    if (!trimmedTitle) {
      return setError(ErrorOptions.TitleError);
    }

    setIsLoading(true);

    const templateNewTodo: Todo = {
      userId: USER_ID,
      id: 0,
      title: trimmedTitle,
      completed: false,
    };

    setTempTodo(templateNewTodo);

    handleAddPost(templateNewTodo);
  }

  function handleDeletePost(todoId: number) {
    setProcessingsIds(currentIds => [...currentIds, todoId]);

    deleteTodo(todoId)
      .then(() => {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
        inputRef.current?.focus();
      })
      .catch(() => {
        setError(ErrorOptions.DeletingError);
      })
      .finally(() => {
        setProcessingsIds(prev =>
          prev.filter(prevTodoId => prevTodoId !== todoId),
        );
      });
  }

  function handleUpdateTodo(todo: Todo) {
    setProcessingsIds(ids => [...ids, todo.id]);

    return updateTodo(todo)
      .then(updatedTodo => {
        setTodos(prevTodos =>
          prevTodos.map(prevTodo =>
            prevTodo.id === todo.id ? updatedTodo : prevTodo,
          ),
        );
      })
      .catch(errors => {
        setError(ErrorOptions.UpdatingError);
        throw errors;
      })
      .finally(() => {
        setProcessingsIds(ids => ids.filter(id => id !== todo.id));
      });
  }

  function handleToggle(postId: number) {
    const neededTodo = todos.find(todo => todo.id === postId);

    if (!neededTodo) {
      return;
    }

    handleUpdateTodo({ ...neededTodo, completed: !neededTodo.completed });
  }

  function handleToggleAll() {
    const completedTodos = !activeTodo;

    const todosToUpdate = todos.filter(
      todo => todo.completed !== completedTodos,
    );

    const idsToUpdate = todosToUpdate.map(t => t.id);

    setProcessingsIds(prev => [...prev, ...idsToUpdate]);

    Promise.allSettled(
      todosToUpdate.map(todo =>
        updateTodo({ ...todo, completed: completedTodos }),
      ),
    )
      .then(results => {
        const hasError = results.some(result => result.status === 'rejected');

        if (hasError) {
          setError(ErrorOptions.UpdatingError);

          return;
        }

        setTodos(curTodo =>
          curTodo.map(todo => {
            if (idsToUpdate.includes(todo.id)) {
              return { ...todo, completed: completedTodos };
            }

            return todo;
          }),
        );
      })
      .finally(() => {
        setProcessingsIds(prev => prev.filter(id => !idsToUpdate.includes(id)));
      });
  }

  function handleClearCompleted() {
    todos.map(todo => {
      if (todo.completed) {
        handleDeletePost(todo.id);
      }
    });
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          hasTodos={todos}
          activeTodo={activeTodo}
          title={newtitle}
          setTitle={setNewTitle}
          inputRef={inputRef}
          onSubmit={handleSubmit}
          loading={isLoading}
          onToggleAll={handleToggleAll}
        />

        {todos.length > 0 && (
          <TodoList
            todos={filteredTodos}
            tempTodo={tempTodo}
            onDelete={handleDeletePost}
            processingsIds={processingsIds}
            onUpdate={handleUpdateTodo}
            onToggle={handleToggle}
          />
        )}

        {todos.length > 0 && (
          <Footer
            filter={filter}
            setFilter={setFilter}
            hasCompletedTodos={hasCompletedTodos}
            activeTodoCount={activeTodoCount}
            onClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      <ErrorNotification error={error} onClose={closeError} />
    </div>
  );
};
