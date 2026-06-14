/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */

import React from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';
import { useState, useEffect, useRef } from 'react';
import { getTodos, deleteTodo, updateTodo, addTodo } from './api/todos';
import classNames from 'classnames';
import { Todo } from './types/Todo';
import { Header } from './components/Header/Header';
import { Footer, FilterType } from './components/Footer/Footer';
import { TodoItem } from './components/TodoItem/TodoItem';

// const USER_ID = 1344;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTitle, setNewTitle] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [filter, setFilter] = useState<FilterType>(FilterType.All);
  const inputRef = useRef<HTMLInputElement>(null);
  const editInputRef = useRef<HTMLInputElement>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [processingTodoIds, setProcessingTodoIds] = useState<number[]>([]);
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');

  function loadTodos() {
    setLoading(true);

    getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage('Unable to load todos'))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    inputRef.current?.focus();
  }, [loading]);

  useEffect(() => {
    loadTodos();
  }, []);

  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    const timer = setTimeout(() => {
      setErrorMessage('');
    }, 3000);

    return () => clearTimeout(timer);
  }, [errorMessage]);

  const handleAdd = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedTitle = newTitle.trim();

    if (!trimmedTitle) {
      setErrorMessage('Title should not be empty');

      return;
    }

    setIsAdding(true);

    const temp: Todo = {
      id: 0,
      title: trimmedTitle,
      completed: false,
      userId: USER_ID,
    };

    setTempTodo(temp);

    try {
      const newTodo = await addTodo({
        userId: USER_ID,
        title: trimmedTitle,
        completed: false,
      });

      setTodos(current => [...current, newTodo]);
      setNewTitle('');
      setTempTodo(null);
    } catch {
      setErrorMessage('Unable to add a todo');
      setTempTodo(null);
    } finally {
      setIsAdding(false);

      setTimeout(() => {
        inputRef.current?.focus();
      }, 1000);
    }
  };

  const handleDelete = async (todoId: number) => {
    setProcessingTodoIds(ids => [...ids, todoId]);

    try {
      await deleteTodo(todoId);

      setTodos(current => current.filter(todo => todo.id !== todoId));
    } catch {
      setErrorMessage('Unable to delete a todo');
    } finally {
      setProcessingTodoIds(ids => ids.filter(id => id !== todoId));

      setTimeout(() => {
        inputRef.current?.focus();
      }, 1000);
    }
  };

  const visibleTodos = todos.filter(todo => {
    if (filter === FilterType.Active) {
      return !todo.completed;
    }

    if (filter === FilterType.Completed) {
      return todo.completed;
    }

    return true;
  });

  const hasCompleted = todos.some(todo => todo.completed);

  const allCompleted = todos.length > 0 && todos.every(todo => todo.completed);

  const handleClearCompleted = async () => {
    await Promise.all(
      todos.filter(todo => todo.completed).map(todo => handleDelete(todo.id)),
    );
  };

  const handleToggle = async (todo: Todo) => {
    setProcessingTodoIds(ids => [...ids, todo.id]);

    try {
      const updatedTodo = await updateTodo(todo.id, {
        completed: !todo.completed,
      });

      setTodos(currentTodos =>
        currentTodos.map(t => (t.id === todo.id ? updatedTodo : t)),
      );
    } catch {
      setErrorMessage('Unable to update a todo');
    } finally {
      setProcessingTodoIds(ids => ids.filter(id => id !== todo.id));
    }
  };

  const handleToggleAll = async () => {
    const newCompletedStatus = !allCompleted;

    const todosToUpdate = todos.filter(
      todo => todo.completed !== newCompletedStatus,
    );

    await Promise.all(todosToUpdate.map(todo => handleToggle(todo)));
  };

  useEffect(() => {
    if (editingTodoId !== null) {
      editInputRef.current?.focus();
    }
  }, [editingTodoId]);

  const handleRename = async (todo: Todo) => {
    const trimmedTitle = editTitle.trim();

    setProcessingTodoIds(ids => [...ids, todo.id]);

    try {
      // 1. нічого не змінилось → просто закриваємо edit
      if (trimmedTitle === todo.title) {
        setEditingTodoId(null);

        return;
      }

      // 2. пустий title → DELETE
      if (!trimmedTitle) {
        try {
          await deleteTodo(todo.id);

          setTodos(current => current.filter(t => t.id !== todo.id));
          setEditingTodoId(null);
        } catch {
          setErrorMessage('Unable to delete a todo'); // 👈 ВАЖЛИВО
        }

        return;
      }

      // 3. UPDATE
      const updatedTodo = await updateTodo(todo.id, {
        title: trimmedTitle,
      });

      setTodos(current =>
        current.map(t => (t.id === todo.id ? updatedTodo : t)),
      );

      setEditingTodoId(null);
    } catch {
      setErrorMessage('Unable to update a todo');
    } finally {
      setProcessingTodoIds(ids => ids.filter(id => id !== todo.id));
    }
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todosLength={todos.length}
          allCompleted={allCompleted}
          newTitle={newTitle}
          isAdding={isAdding}
          inputRef={inputRef}
          onAdd={handleAdd}
          onTitleChange={setNewTitle}
          onToggleAll={handleToggleAll}
        />

        {/* <section className="todoapp__main" data-cy="TodoList">
          {/* This is a completed todo */}
        <section className="todoapp__main" data-cy="TodoList">
          {visibleTodos.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              isProcessing={processingTodoIds.includes(todo.id)}
              editingTodoId={editingTodoId}
              editTitle={editTitle}
              setEditingTodoId={setEditingTodoId}
              setEditTitle={setEditTitle}
              handleToggle={handleToggle}
              handleDelete={handleDelete}
              handleRename={handleRename}
              editInputRef={editInputRef}
            />
          ))}
          {tempTodo && (
            <TodoItem
              todo={tempTodo}
              isProcessing={true}
              editingTodoId={editingTodoId}
              editTitle={editTitle}
              setEditingTodoId={setEditingTodoId}
              setEditTitle={setEditTitle}
              handleToggle={handleToggle}
              handleDelete={handleDelete}
              handleRename={handleRename}
              editInputRef={editInputRef}
            />
          )}
        </section>
        {/* Hide the footer if there are no todos */}
        {todos.length > 0 && (
          <Footer
            todosLeft={todos.filter(todo => !todo.completed).length}
            hasCompleted={hasCompleted}
            filter={filter}
            setFilter={setFilter}
            handleClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          {
            hidden: !errorMessage,
          },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessage('')}
        />
        {/* show only one message at a time */}
        {errorMessage}
      </div>
    </div>
  );
};
