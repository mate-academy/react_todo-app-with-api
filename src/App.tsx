/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */

import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import * as todoService from './api/todos';
import { Header } from './components/Header/Header';
import { Footer } from './components/Footer/Footer';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList/TodoList';
import { TodoStatus } from './types/TodoStatus';
// eslint-disable-next-line max-len
import { ErrorNotification } from './components/ErrorNotification/ErrorNotification';
import { TodoFilter } from './types/TodoFilter';

export const App: React.FC = () => {
  // #region States
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isEdited, setIsEdited] = useState(0);
  const [error, setErrorMessage] = useState<TodoStatus>(null);
  const [filter, setFilter] = useState<TodoFilter>('all');
  const [loadingIds, setLoadingIds] = useState<number[]>([]);
  const [title, setTitle] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  // #endregion

  // #region useEffect

  // getting todo
  useEffect(() => {
    todoService
      .getTodos()
      .then(data => {
        setTodos(data);
      })
      .catch(() => setErrorMessage('Unable to load todos'));
  }, []);

  // setting an error
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setErrorMessage(null);
      }, 3000);

      return () => clearTimeout(timer);
    }

    return;
  }, [error]);

  // setting focus
  useEffect(() => {
    if (!isCreating) {
      inputRef.current?.focus();
    }
  }, [isCreating]);
  // #endregion

  if (!todoService.USER_ID) {
    return <UserWarning />;
  }

  // #region handler and functions

  // filter Todo
  const visibleTodos = todos.filter(todo => {
    if (filter === 'active') {
      return !todo.completed;
    }

    if (filter === 'completed') {
      return todo.completed;
    }

    return true;
  });

  // create a Todo
  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedTitle = title.trim();

    if (trimmedTitle.length === 0) {
      setErrorMessage('Title should not be empty');

      return;
    }

    setIsCreating(true);

    const newTodo: Todo = {
      id: 0,
      userId: todoService.USER_ID,
      title: trimmedTitle,
      completed: false,
    };

    todoService
      .createTodo(newTodo)
      .then(data => {
        setTodos(prev => [...prev, data]);
        setTitle('');
      })
      .catch(() => {
        setErrorMessage('Unable to add a todo');
      })
      .finally(() => {
        setIsCreating(false);
        inputRef.current?.focus();
      });
  };

  // delete Todo
  const handleDelete = (todo: Todo) => {
    setLoadingIds(prev => [...prev, todo.id]);

    todoService
      .deleteTodo(todo.id)
      .then(() => {
        setTodos(prev => prev.filter(t => t.id !== todo.id));
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
      })
      .finally(() => {
        setLoadingIds(prev => prev.filter(id => id !== todo.id));
        inputRef.current?.focus();
      });
  };

  // clear All completed Todo
  const handleClearCompleted = async () => {
    const completedIds = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    setLoadingIds(prev => [...prev, ...completedIds]);

    try {
      const results = await Promise.allSettled(
        completedIds.map(id => todoService.deleteTodo(id)),
      );

      const successfulIds = results
        .map((res, index) =>
          res.status === 'fulfilled' ? completedIds[index] : null,
        )
        .filter((id): id is number => id !== null);

      if (successfulIds.length > 0) {
        setTodos(prev => prev.filter(todo => !successfulIds.includes(todo.id)));
      }

      if (results.some(res => res.status === 'rejected')) {
        setErrorMessage('Unable to delete a todo');
      }
    } catch {
      setErrorMessage('Unable to load todos');
    } finally {
      setLoadingIds(prev => prev.filter(id => !completedIds.includes(id)));
      inputRef.current?.focus();
    }
  };

  // update Todos
  const handleToggle = (todo: Todo) => {
    setLoadingIds(prev => [...prev, todo.id]);

    todoService
      .updateTodo(todo.id, { completed: !todo.completed })
      .then(updatedTodo => {
        setTodos(prev =>
          prev.map(t => (t.id === updatedTodo.id ? updatedTodo : t)),
        );
      })
      .catch(() => {
        setErrorMessage('Unable to update a todo');
      })
      .finally(() => {
        setLoadingIds(prev => prev.filter(id => id !== todo.id));
      });
  };

  // to toggle All
  const handleToggleAll = () => {
    const allCompleted = todos.every(todo => todo.completed);
    const newStatus = !allCompleted;

    const todosToUpdate = todos.filter(todo => todo.completed !== newStatus);
    const idsToUpdate = todosToUpdate.map(t => t.id);

    setLoadingIds(prev => [...prev, ...idsToUpdate]);

    const promises = todosToUpdate.map(todo =>
      todoService.updateTodo(todo.id, { completed: newStatus }),
    );

    Promise.allSettled(promises)
      .then(results => {
        const successfulUpdates = results
          .map(res =>
            res.status === 'fulfilled'
              ? (res as PromiseFulfilledResult<Todo>).value
              : null,
          )
          .filter((todo): todo is Todo => todo !== null);

        setTodos(prev =>
          prev.map(todo => {
            const updated = successfulUpdates.find(upd => upd.id === todo.id);

            return updated || todo;
          }),
        );
      })
      .finally(() => {
        setLoadingIds(prev => prev.filter(id => !idsToUpdate.includes(id)));
      });
  };

  const handleUpdateTitle = (todo: Todo, newTitle: string) => {
    const normalizedTitle = newTitle.trim();

    if (normalizedTitle === todo.title) {
      setIsEdited(0);

      return;
    }

    if (!normalizedTitle) {
      handleDelete(todo);

      return;
    }

    setLoadingIds(prev => [...prev, todo.id]);

    todoService
      .updateTodo(todo.id, { title: normalizedTitle })
      .then(updatedTodo => {
        setTodos(prev =>
          prev.map(t => (t.id === updatedTodo.id ? updatedTodo : t)),
        );
        setIsEdited(0);
      })
      .catch(() => {
        setErrorMessage('Unable to update a todo');
      })
      .finally(() => {
        setLoadingIds(prev => prev.filter(id => id !== todo.id));
      });
  };
  // #endregion

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          onToggleAll={handleToggleAll}
          allCompleted={todos.length > 0 && todos.every(todo => todo.completed)}
          onCreate={handleCreate}
          title={title}
          onTitle={setTitle}
          isCreating={isCreating}
          inputRef={inputRef}
        />

        <TodoList
          todos={visibleTodos}
          isEdited={isEdited}
          onEdited={setIsEdited}
          onUpdate={handleToggle}
          onUpdateTitle={handleUpdateTitle}
          loadingIds={loadingIds}
          isCreating={isCreating}
          onDelete={handleDelete}
          tempTitle={title}
        />

        {/* Hide the footer if there are no todos */}
        {todos.length > 0 && (
          <Footer
            todos={todos}
            filter={filter}
            onFilter={setFilter}
            onClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <ErrorNotification onErrorMessage={setErrorMessage} error={error} />
    </div>
  );
};
