/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  createTodo,
  deleteTodo,
  getTodos,
  updateTodo,
  USER_ID,
} from './api/todos';
import { Todo } from './types/Todo';
import { Footer } from './components/Footer';
import { TodoList } from './components/TodoList';
import { Header } from './components/Header';
import { Error as ErrorNotification } from './components/Error';
import { TodoItem } from './components/TodoItem';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deletingTodoIds, setDeletingTodoIds] = useState<number[]>([]);
  const [updatingTodoIds, setUpdatingTodoIds] = useState<number[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setError('');
    setIsLoading(true);

    getTodos()
      .then(setTodos)
      .catch(() => setError('Unable to load todos'))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (!error) {
      return;
    }

    const timer = setTimeout(() => {
      setError('');
    }, 3000);

    return () => clearTimeout(timer);
  }, [error]);

  useEffect(() => {
    if (inputRef.current && !isLoading) {
      inputRef.current.focus();
    }
  }, [isLoading]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const handleStatusToggle = (todo: Todo) => {
    setUpdatingTodoIds(prev => [...prev, todo.id]);

    updateTodo({ ...todo, completed: !todo.completed })
      .then(updatedTodo => {
        setTodos(prev =>
          prev.map(t => (t.id === updatedTodo.id ? updatedTodo : t)),
        );
      })
      .catch(() => {
        setError('Unable to update a todo');
      })
      .finally(() => {
        setUpdatingTodoIds(prev => prev.filter(id => id !== todo.id));
      });
  };

  const handleToggleAll = () => {
    const areAllCompleted = todos.every(todo => todo.completed);
    const newStatus = !areAllCompleted;

    const todosToUpdate = todos.filter(todo => todo.completed !== newStatus);

    const idsToUpdate = todosToUpdate.map(todo => todo.id);

    setUpdatingTodoIds(prev => [...prev, ...idsToUpdate]);

    Promise.all(
      todos
        .filter(todo => todo.completed !== newStatus)
        .map(todo =>
          updateTodo({ ...todo, completed: newStatus })
            .then(updated => {
              setTodos(prev =>
                prev.map(t => (t.id === updated.id ? updated : t)),
              );
            })
            .catch(() => {
              setError('Unable to update a todo');
            }),
        ),
    ).finally(() => {
      setUpdatingTodoIds(prev => prev.filter(id => !idsToUpdate.includes(id)));
    });
  };

  const handleAddTodo = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedTitle = newTodoTitle.trim();

    if (!trimmedTitle) {
      setError('Title should not be empty');

      return;
    }

    setError('');

    setTempTodo({
      id: 0,
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    });

    setIsLoading(true);

    const newTodo = {
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    };

    createTodo(newTodo)
      .then(createdTodo => {
        setTodos(prevTodos => [...prevTodos, createdTodo]);
        setTempTodo(null);
        setNewTodoTitle('');
      })
      .catch(() => {
        setError('Unable to add a todo');
        setTempTodo(null);
      })
      .finally(() => {
        setIsLoading(false);
        if (inputRef.current) {
          inputRef.current.focus();
        }
      });
  };

  const handleTodoDeleteButton = (todoId: number) => {
    setDeletingTodoIds(current => [...current, todoId]);

    deleteTodo(todoId)
      .then(() => {
        setTodos(current => current.filter(todo => todo.id !== todoId));
      })
      .catch(() => {
        setError('Unable to delete a todo');
      })
      .finally(() => {
        setDeletingTodoIds(current => current.filter(id => id !== todoId));
        if (inputRef.current) {
          inputRef.current.focus();
        }
      });
  };

  const handleTitleUpdate = (todo: Todo, newTitle: string) => {
    setUpdatingTodoIds(prev => [...prev, todo.id]);

    return updateTodo({ ...todo, title: newTitle })
      .then(updatedTodo => {
        setTodos(prev =>
          prev.map(t => (t.id === updatedTodo.id ? updatedTodo : t)),
        );
      })
      .catch(() => {
        setError('Unable to update a todo');
        throw new Error();
      })
      .finally(() => {
        setUpdatingTodoIds(prev => prev.filter(id => id !== todo.id));
      });
  };

  const handleClearCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    setDeletingTodoIds(current => [
      ...current,
      ...completedTodos.map(todo => todo.id),
    ]);

    Promise.allSettled(
      completedTodos.map(todo =>
        deleteTodo(todo.id)
          .then(() => {
            setTodos(current => current.filter(t => t.id !== todo.id));
          })
          .catch(() => {
            setError('Unable to delete a todo');
          }),
      ),
    ).finally(() => {
      setDeletingTodoIds(current =>
        current.filter(id => !completedTodos.some(todo => todo.id === id)),
      );

      if (inputRef.current) {
        inputRef.current.focus();
      }
    });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          isLoading={isLoading}
          handleAddTodo={handleAddTodo}
          setNewTodoTitle={setNewTodoTitle}
          newTodoTitle={newTodoTitle}
          inputRef={inputRef}
          onToggleAll={handleToggleAll}
        />

        {todos.length > 0 && (
          <TodoList
            todos={todos}
            filter={filter}
            onDelete={handleTodoDeleteButton}
            deletingTodoIds={deletingTodoIds}
            updatingTodoIds={updatingTodoIds}
            onStatusToggle={handleStatusToggle}
            onTitleUpdate={handleTitleUpdate}
          />
        )}

        {tempTodo && (
          <div className="todoapp__temp-todo">
            <TodoItem todo={tempTodo} isLoading={true} />
          </div>
        )}

        {todos.length > 0 && (
          <Footer
            todos={todos}
            filter={filter}
            setFilter={setFilter}
            handleClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      <ErrorNotification error={error} onClose={() => setError('')} />
    </div>
  );
};
