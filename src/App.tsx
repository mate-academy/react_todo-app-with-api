/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useRef } from 'react';
import { UserWarning } from './UserWarning';
import { useState, useEffect } from 'react';
import cn from 'classnames';

import {
  USER_ID,
  getTodos,
  addTodo,
  deleteTodo,
  updateTodo,
} from './api/todos';
import { Todo } from './types/Todo';
import { Filter } from './types/Filter';
import { Footer } from './components/Footer';
import { Error as Errorm } from './types/Error';
import { TodoList } from './components/TodoList';
import { Header } from './components/Header';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<Errorm>(Errorm.Default);
  const [filter, setFilter] = useState<Filter>(Filter.All);
  const [query, setQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingIds, setLoadingIds] = useState<number[]>([]);

  const todoFieldRef = useRef<HTMLInputElement>(null);

  const activeTodos = todos.filter(todo => !todo.completed);

  const isAllCompleted =
    todos.length > 0 && todos.every(todo => todo.completed);

  const hasCompleted = todos.some(todo => todo.completed);

  const filteredTodos = todos.filter(todo => {
    if (filter === Filter.Active) {
      return !todo.completed;
    } else if (filter === Filter.Completed) {
      return todo.completed;
    } else {
      return true;
    }
  });

  const completedIds = todos
    .filter(todo => todo.completed)
    .map(todo => todo.id);

  const removeTodo = (todoId: number) => {
    setErrorMessage(Errorm.Default);
    setLoadingIds(ids => [...ids, todoId]);

    deleteTodo(todoId)
      .then(() => {
        setTodos(prev => prev.filter(todo => todo.id !== todoId));
      })
      .catch(() => {
        setErrorMessage(Errorm.DeleteError);
      })
      .finally(() => {
        setLoadingIds(ids => ids.filter(id => id !== todoId));
      });
  };

  const clearCompleted = (completedTodosIds: number[]) => {
    for (const id of completedTodosIds) {
      removeTodo(id);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage(Errorm.Default);

    const validQuery = query.trim();

    if (validQuery.length === 0) {
      setErrorMessage(Errorm.TitleError);

      return;
    }

    setIsSubmitting(true);

    const todo: Todo = {
      id: 0,
      userId: USER_ID,
      title: validQuery,
      completed: false,
    };

    setTempTodo(todo);

    addTodo({ userId: USER_ID, title: validQuery, completed: false })
      .then(result => {
        setTodos(prev => [...prev, result]);
        setQuery('');
      })
      .catch(() => {
        setErrorMessage(Errorm.AddError);
      })
      .finally(() => {
        setIsSubmitting(false);
        setTempTodo(null);
      });
  };

  const updateTodoStatus = (todo: Todo, data: Partial<Todo>) => {
    setErrorMessage(Errorm.Default);
    setLoadingIds(prev => [...prev, todo.id]);

    return updateTodo({ id: todo.id, ...data })
      .then(res =>
        setTodos(prev =>
          prev.map(td => {
            if (todo.id === td.id) {
              return res;
            } else {
              return td;
            }
          }),
        ),
      )
      .catch(() => {
        setErrorMessage(Errorm.UpdateError);
        throw new Error();
      })
      .finally(() => setLoadingIds(prev => prev.filter(i => i !== todo.id)));
  };

  const handleToggleAll = () => {
    if (isAllCompleted) {
      for (const todo of todos) {
        updateTodoStatus(todo, { completed: false });
      }
    } else {
      for (const todo of activeTodos) {
        updateTodoStatus(todo, { completed: true });
      }
    }
  };

  useEffect(() => {
    setErrorMessage(Errorm.Default);

    getTodos()
      .then(result => setTodos(result))
      .catch(() => {
        setErrorMessage(Errorm.LoadError);
      });
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setErrorMessage(Errorm.Default);
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, [errorMessage]);

  useEffect(() => {
    if (!isSubmitting && loadingIds.length === 0) {
      todoFieldRef.current?.focus();
    }
  }, [isSubmitting, loadingIds]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          isAllCompleted={isAllCompleted}
          onToggleAll={handleToggleAll}
          onSubmit={handleSubmit}
          query={query}
          onQueryChange={setQuery}
          isSubmitting={isSubmitting}
          todoFieldRef={todoFieldRef}
        />

        {(todos.length > 0 || tempTodo) && (
          <>
            <TodoList
              filteredTodos={filteredTodos}
              tempTodo={tempTodo}
              onDelete={removeTodo}
              loadingIds={loadingIds}
              onUpdate={updateTodoStatus}
            />

            <Footer
              activeTodos={activeTodos}
              filter={filter}
              onClick={setFilter}
              hasCompleted={hasCompleted}
              completedTodosIds={completedIds}
              onClearCompleted={clearCompleted}
            />
          </>
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={cn(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: errorMessage === Errorm.Default },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessage(Errorm.Default)}
        />
        {errorMessage}
      </div>
    </div>
  );
};
