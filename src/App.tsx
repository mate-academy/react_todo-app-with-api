/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-console */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState, useRef, useMemo } from 'react';
import { UserWarning } from './UserWarning';
import {
  deleteTodos,
  getTodos,
  postTodos,
  updateTodos,
  USER_ID,
} from './api/todos';
import { Todo } from './types/Todo';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { Filter } from './types/Filter';
import { ErrorType } from './types/ErrorType';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState('');

  const [loading, setLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>(Filter.All);
  const [processingIds, setProcessingIds] = useState<number[]>([]);

  const activeTodos = todos.filter(todo => !todo.completed).length;

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const filteredTodos = useMemo(() => {
    return todos.filter(todo => {
      switch (filter) {
        case Filter.Active:
          return !todo.completed;
        case Filter.Completed:
          return todo.completed;
        default:
          return true;
      }
    });
  }, [todos, filter]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  useEffect(() => {
    setLoading(true);
    getTodos()
      .then(data => {
        setTodos(data);
        setError(null);
      })
      .catch(() => {
        setError(ErrorType.LOAD);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newTitle.trim()) {
      setError(ErrorType.EMPTY_TITLE);

      return;
    }

    const temp: Todo = {
      id: 0,
      userId: USER_ID,
      title: newTitle.trim(),
      completed: false,
    };

    setTempTodo(temp);
    setIsAdding(true);

    try {
      const newTodo = await postTodos({
        title: newTitle.trim(),
        completed: false,
        userId: USER_ID,
      });

      setTodos(prev => [...prev, newTodo]);
      setNewTitle('');
      setError('');
    } catch {
      setError(ErrorType.ADD);
    } finally {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
      setTempTodo(null);
      setIsAdding(false);
    }
  };

  useEffect(() => {
    if (!error) {
      return;
    }

    const timer = setTimeout(() => {
      setError(null);
    }, 3000);

    return () => clearTimeout(timer);
  }, [error]);

  const handleDeleteTodo = async (todoId: number) => {
    setProcessingIds(prev => [...prev, todoId]);

    try {
      await deleteTodos(todoId);
      setTodos(prev => prev.filter(todo => todo.id !== todoId));
      inputRef.current?.focus();
    } catch {
      setError(ErrorType.DELETE);
    } finally {
      setProcessingIds(prev => prev.filter(id => id !== todoId));
    }
  };

  const handleDeleteCompleted = () => {
    const completed = todos.filter(todo => todo.completed);

    completed.forEach(todo => handleDeleteTodo(todo.id));
  };

  const handleToggleTodo = async (todo: Todo) => {
    setProcessingIds(prev => [...prev, todo.id]);

    try {
      const updatedTodo = await updateTodos(todo.id, {
        completed: !todo.completed,
      });

      setTodos(prev =>
        prev.map(item =>
          item.id === todo.id
            ? { ...item, completed: updatedTodo.completed }
            : item,
        ),
      );
    } catch {
      setError(ErrorType.UPDATE);
    } finally {
      setProcessingIds(prev => prev.filter(id => id !== todo.id));
    }
  };

  const handleToggleAll = async () => {
    const areAllCompleted = todos.every(todo => todo.completed);
    const todosToUpdate = todos.filter(
      todo => todo.completed === areAllCompleted,
    );

    await Promise.all(
      todosToUpdate.map(async todo => {
        setProcessingIds(prev => [...prev, todo.id]);

        try {
          const updatedTodo = await updateTodos(todo.id, {
            completed: !areAllCompleted,
          });

          setTodos(prev =>
            prev.map(item =>
              item.id === todo.id
                ? { ...item, completed: updatedTodo.completed }
                : item,
            ),
          );
        } catch {
          setError(ErrorType.UPDATE);
        } finally {
          setProcessingIds(prev => prev.filter(id => id !== todo.id));
        }
      }),
    );
  };

  const handleUpdateTodo = async (todoId: number, newTitl: string) => {
    const trimmedTitle = newTitl.trim();

    if (!trimmedTitle) {
      await handleDeleteTodo(todoId);

      return;
    }

    if (todos.find(todo => todo.id === todoId)?.title === trimmedTitle) {
      setEditingId(null);

      return;
    }

    setProcessingIds(prev => [...prev, todoId]);

    try {
      await updateTodos(todoId, { title: trimmedTitle });
      setTodos(prev =>
        prev.map(todo =>
          todo.id === todoId ? { ...todo, title: trimmedTitle } : todo,
        ),
      );
      setEditingId(null);
    } catch {
      setError(ErrorType.UPDATE);
    } finally {
      setProcessingIds(prev => prev.filter(id => id !== todoId));
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          newTitle={newTitle}
          onChange={setNewTitle}
          onSubmit={handleAddTodo}
          allCompleted={todos.length > 0 && todos.every(todo => todo.completed)}
          isAdding={isAdding}
          inputRef={inputRef}
          handleToggleAll={handleToggleAll}
          todos={todos}
          loading={loading}
        />

        <TodoList
          todos={filteredTodos}
          tempTodo={tempTodo}
          handleDeleteTodo={handleDeleteTodo}
          processingIds={processingIds}
          handleToggleTodo={handleToggleTodo}
          editingId={editingId}
          editingTitle={editingTitle}
          setEditingTitle={setEditingTitle}
          handleUpdateTodo={handleUpdateTodo}
          setEditingId={setEditingId}
        />

        {/* Hide the footer if there are no todos */}
        {todos.length > 0 && (
          <Footer
            activeTodos={activeTodos}
            filter={filter}
            onChangeFilter={setFilter}
            hasCompleted={todos.some(todo => todo.completed)}
            handleDeleteCompleted={handleDeleteCompleted}
          />
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <div
        data-cy="ErrorNotification"
        className={`notification is-danger is-light has-text-weight-normal ${
          error ? '' : 'hidden'
        }`}
      >
        <button data-cy="HideErrorButton" type="button" className="delete" />
        {/* show only one message at a time */}
        {error}
      </div>
    </div>
  );
};
