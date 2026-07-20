/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { getTodos, updateTodo, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import classNames from 'classnames';
import { ErrorMessage } from './types/ErrorMessage';
import { FilterType } from './types/FilterType';
import { useAddTodo } from './hooks/useAddTodo';
import { useDeleteTodo } from './hooks/useDeleteTodo';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [updatingTodoIds, setUpdatingTodoIds] = useState<number[]>([]);
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');

  const newTodoFieldRef = useRef<HTMLInputElement>(null);

  const { newTodoTitle, setNewTodoTitle, handleSubmit, isAdding, tempTodo } =
    useAddTodo({
      setTodos,
      setErrorMessage,
      mainInputRef: newTodoFieldRef,
    });

  const { handleDelete, deletingTodoIds, clearCompleted } = useDeleteTodo({
    todos,
    setTodos,
    setErrorMessage,
    mainInputRef: newTodoFieldRef,
  });

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage(ErrorMessage.LOAD);
      });
  }, []);

  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    const timer = setTimeout(() => {
      setErrorMessage('');
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, [errorMessage]);

  useEffect(() => {
    if (newTodoFieldRef.current) {
      newTodoFieldRef.current.focus();
    }
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const visibleTodos = todos.filter(todo => {
    switch (filter) {
      case 'active':
        return !todo.completed;
      case 'completed':
        return todo.completed;
      default:
        return true;
    }
  });

  const activeTodosCount = todos.filter(todo => !todo.completed).length;
  const isAllCompleted = todos.length > 0 && todos.every(t => t.completed);

  const handleToggle = (todo: Todo) => {
    setUpdatingTodoIds(prevIds => [...prevIds, todo.id]);

    updateTodo(todo.id, { completed: !todo.completed })
      .then(updatedTodo => {
        setTodos(prevTodos =>
          prevTodos.map(t => (t.id === todo.id ? updatedTodo : t)),
        );
      })
      .catch(() => setErrorMessage(ErrorMessage.UPDATE))
      .finally(() => {
        setUpdatingTodoIds(prevIds => prevIds.filter(id => id !== todo.id));
      });
  };

  const handleRename = (todo: Todo) => {
    if (todo.id !== editingTodoId) {
      return;
    }

    const trimmedTitle = editTitle.trim();

    if (trimmedTitle === todo.title) {
      setEditingTodoId(null);
      newTodoFieldRef.current?.focus();

      return;
    }

    if (!trimmedTitle) {
      handleDelete(todo.id);

      return;
    }

    setUpdatingTodoIds(prevIds => [...prevIds, todo.id]);

    updateTodo(todo.id, { title: trimmedTitle })
      .then(updatedTodo => {
        setTodos(prevTodos =>
          prevTodos.map(t => (t.id === todo.id ? updatedTodo : t)),
        );
        setEditingTodoId(null);
      })
      .catch(() => setErrorMessage(ErrorMessage.UPDATE))
      .finally(() => {
        setUpdatingTodoIds(prevIds => prevIds.filter(id => id !== todo.id));
        newTodoFieldRef.current?.focus();
      });
  };

  const handleToggleAll = () => {
    const targetStatus = !isAllCompleted;
    const todosToUpdate = todos.filter(t => t.completed !== targetStatus);

    todosToUpdate.forEach(t => handleToggle(t));
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          newTodoTitle={newTodoTitle}
          setNewTodoTitle={setNewTodoTitle}
          isAdding={isAdding}
          onSubmit={handleSubmit}
          inputRef={newTodoFieldRef}
          todosLength={todos.length}
          isAllCompleted={isAllCompleted}
          onToggleAll={handleToggleAll}
        />

        {todos.length > 0 && (
          <>
            <TodoList
              visibleTodos={visibleTodos}
              tempTodo={tempTodo}
              deletingTodoIds={deletingTodoIds}
              updatingTodoIds={updatingTodoIds}
              editingTodoId={editingTodoId}
              editTitle={editTitle}
              setEditTitle={setEditTitle}
              setEditingTodoId={setEditingTodoId}
              onDelete={handleDelete}
              onToggle={handleToggle}
              onRename={handleRename}
              mainInputRef={newTodoFieldRef}
            />

            <Footer
              activeTodosCount={activeTodosCount}
              filter={filter}
              setFilter={setFilter}
              todos={todos}
              onClearCompleted={clearCompleted}
            />
          </>
        )}
      </div>

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
        {errorMessage}
      </div>
    </div>
  );
};
