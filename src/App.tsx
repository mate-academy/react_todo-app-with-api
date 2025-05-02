/* eslint-disable max-len */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */

import React, { useEffect, useState, useRef } from 'react';
import { UserWarning } from './UserWarning';
import { Todo, FilterStatus } from './types/Todo';
import {
  USER_ID,
  getTodos,
  addTodo,
  deleteTodo,
  updateTodo,
} from './api/todos';
import { Header } from './components/Header';
import { TodoList, TempTodo } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterStatus>(FilterStatus.ALL);
  const [isErrorHidden, setIsErrorHidden] = useState(true);
  const [title, setTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deletingIds, setDeletingIds] = useState<number[]>([]);
  const [updatingIds, setUpdatingIds] = useState<number[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');

  const editInputRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const showError = (message: string) => {
    setErrorMessage(message);
    setIsErrorHidden(false);
    setTimeout(() => setIsErrorHidden(true), 3000);
  };

  useEffect(() => {
    if (!USER_ID) {
      return;
    }

    const loadTodos = async () => {
      try {
        const loadedTodos = await getTodos();

        setTodos(loadedTodos);
      } catch (error) {
        showError('Unable to load todos');
      }
    };

    loadTodos();
  }, []);

  useEffect(() => {
    if (inputRef.current && !tempTodo) {
      inputRef.current.focus();
    }
  }, [todos, tempTodo, isErrorHidden]);

  useEffect(() => {
    if (editingId !== null && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [editingId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      showError('Title should not be empty');

      return;
    }

    const newTodo = {
      id: 0,
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    };

    setTempTodo(newTodo);
    setIsErrorHidden(true);

    try {
      const createdTodo = await addTodo({
        userId: USER_ID,
        title: trimmedTitle,
        completed: false,
      });

      setTodos(prev => [...prev, createdTodo]);
      setTitle('');
    } catch (error) {
      showError('Unable to add a todo');
    } finally {
      setTempTodo(null);
    }
  };

  const handleDelete = async (id: number) => {
    setDeletingIds(prev => [...prev, id]);
    setIsErrorHidden(true);

    try {
      await deleteTodo(id);
      setTodos(prev => prev.filter(todo => todo.id !== id));
    } catch (error) {
      showError('Unable to delete a todo');
    } finally {
      setDeletingIds(prev => prev.filter(deletingId => deletingId !== id));
    }
  };

  const handleToggle = async (id: number, completed: boolean) => {
    setUpdatingIds(prev => [...prev, id]);
    setIsErrorHidden(true);

    try {
      const updatedTodo = await updateTodo(id, { completed: !completed });

      setTodos(prev => prev.map(todo => (todo.id === id ? updatedTodo : todo)));
    } catch (error) {
      showError('Unable to update a todo');
    } finally {
      setUpdatingIds(prev => prev.filter(updatingId => updatingId !== id));
    }
  };

  const handleToggleAll = async () => {
    const allCompleted = todos.every(todo => todo.completed);
    const todosToUpdate = todos.filter(todo => todo.completed === allCompleted);

    if (!todosToUpdate.length) {
      return;
    }

    const newUpdatingIds = todosToUpdate.map(todo => todo.id);

    setUpdatingIds(prev => [...prev, ...newUpdatingIds]);
    setIsErrorHidden(true);

    try {
      const updatePromises = todosToUpdate.map(todo =>
        updateTodo(todo.id, { completed: !allCompleted }),
      );

      const updatedTodos = await Promise.all(updatePromises);
      const updatedIds = updatedTodos.map(todo => todo.id);

      setTodos(prev =>
        prev.map(todo => {
          if (updatedIds.includes(todo.id)) {
            return updatedTodos.find(updated => updated.id === todo.id) || todo;
          }

          return todo;
        }),
      );
    } catch (error) {
      showError('Unable to update todos');
    } finally {
      setUpdatingIds(prev => prev.filter(id => !newUpdatingIds.includes(id)));
    }
  };

  const handleEditStart = (id: number, todoTitle: string) => {
    setEditingId(id);
    setEditTitle(todoTitle);
  };

  const handleEditSubmit = async (id: number, oldTitle: string) => {
    const newTitle = editTitle.trim();

    if (newTitle === oldTitle) {
      setEditingId(null);

      return;
    }

    if (!newTitle) {
      await handleDelete(id);

      return;
    }

    setUpdatingIds(prev => [...prev, id]);
    setIsErrorHidden(true);

    try {
      const updatedTodo = await updateTodo(id, { title: newTitle });

      setTodos(prev => prev.map(todo => (todo.id === id ? updatedTodo : todo)));
      setEditingId(null);
    } catch (error) {
      showError('Unable to update a todo');
    } finally {
      setUpdatingIds(prev => prev.filter(updatingId => updatingId !== id));
    }
  };

  const handleEditKeyUp = (
    e: React.KeyboardEvent,
    id: number,
    oldTitle: string,
  ) => {
    if (e.key === 'Escape') {
      setEditingId(null);
    } else if (e.key === 'Enter') {
      handleEditSubmit(id, oldTitle);
    }
  };

  const handleClearCompleted = () => {
    todos.filter(todo => todo.completed).forEach(todo => handleDelete(todo.id));
  };

  const filteredTodos = todos.filter(todo => {
    switch (filter) {
      case FilterStatus.ACTIVE:
        return !todo.completed;
      case FilterStatus.COMPLETED:
        return todo.completed;
      default:
        return true;
    }
  });

  const activeTodosCount = todos.filter(todo => !todo.completed).length;
  const completedTodosCount = todos.filter(todo => todo.completed).length;

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todosLength={todos.length}
          activeTodosCount={activeTodosCount}
          onToggleAll={handleToggleAll}
          onSubmit={handleSubmit}
          title={title}
          setTitle={setTitle}
          tempTodo={tempTodo}
          inputRef={inputRef}
        />

        <TodoList
          todos={todos}
          filteredTodos={filteredTodos}
          deletingIds={deletingIds}
          updatingIds={updatingIds}
          editingId={editingId}
          editTitle={editTitle}
          setEditTitle={setEditTitle}
          handleEditStart={handleEditStart}
          handleEditSubmit={handleEditSubmit}
          handleEditKeyUp={handleEditKeyUp}
          handleToggle={handleToggle}
          handleDelete={handleDelete}
          editInputRef={editInputRef}
        />

        {tempTodo && <TempTodo todo={tempTodo} />}

        <Footer
          todosLength={todos.length}
          activeTodosCount={activeTodosCount}
          completedTodosCount={completedTodosCount}
          filter={filter}
          setFilter={setFilter}
          onClearCompleted={handleClearCompleted}
        />
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        isHidden={isErrorHidden}
        onHide={() => setIsErrorHidden(true)}
      />
    </div>
  );
};
