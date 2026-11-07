/* eslint-disable jsx-a11y/label-has-associated-control */

import React, { useEffect, useRef, useState } from 'react';

import { UserWarning } from './UserWarning';
import {
  USER_ID,
  getTodos,
  addTodo,
  deleteTodo,
  updateTodo,
} from './api/todos';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList';

type Filter = 'all' | 'active' | 'completed';

export const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [processingTodos, setProcessingTodos] = useState<number[]>([]);
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [filter, setFilter] = useState<Filter>('all');

  const inputRef = useRef<HTMLInputElement>(null);
  const errorTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const activeCount = todos.filter(todo => !todo.completed).length;
  const completedCount = todos.length - activeCount;

  const visibleTodos = todos.filter(todo => {
    if (filter === 'active') {
      return !todo.completed;
    }

    if (filter === 'completed') {
      return todo.completed;
    }

    return true;
  });

  const showError = (message: string) => {
    setErrorMessage(message);

    if (errorTimeout.current) {
      clearTimeout(errorTimeout.current);
    }

    errorTimeout.current = setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  };

  const addProcessing = (id: number) => {
    setProcessingTodos(current =>
      current.includes(id) ? current : [...current, id],
    );
  };

  const removeProcessing = (id: number) => {
    setProcessingTodos(current => current.filter(item => item !== id));
  };

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => showError('Unable to load todos'))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (!isAdding && editingTodoId === null) {
      inputRef.current?.focus();
    }
  }, [isAdding, editingTodoId]);

  useEffect(() => {
    return () => {
      if (errorTimeout.current) {
        clearTimeout(errorTimeout.current);
      }
    };
  }, []);

  // ADD TODO
  const handleAddTodo = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const title = newTodo.trim();

    if (!title) {
      showError('Title should not be empty');
      inputRef.current?.focus();

      return;
    }

    const temporaryTodo: Todo = {
      id: 0,
      userId: USER_ID,
      title,
      completed: false,
    };

    setIsAdding(true);
    setTempTodo(temporaryTodo);

    try {
      const addedTodo = await addTodo(title);

      setTodos(current => [...current, addedTodo]);
      setNewTodo('');
    } catch {
      showError('Unable to add a todo');
    } finally {
      setTempTodo(null);
      setIsAdding(false);
    }
  };

  // DELETE TODO
  const handleDeleteTodo = async (id: number) => {
    if (processingTodos.includes(id)) {
      return;
    }

    addProcessing(id);

    try {
      await deleteTodo(id);

      setTodos(current => current.filter(todo => todo.id !== id));

      inputRef.current?.focus();
    } catch {
      showError('Unable to delete a todo');
    } finally {
      removeProcessing(id);
    }
  };

  // TOGGLE ONE TODO
  const handleToggleTodo = async (todo: Todo) => {
    if (processingTodos.includes(todo.id)) {
      return;
    }

    addProcessing(todo.id);

    try {
      const updatedTodo = await updateTodo(todo.id, {
        completed: !todo.completed,
      });

      setTodos(current =>
        current.map(item => (item.id === todo.id ? updatedTodo : item)),
      );
    } catch {
      showError('Unable to update a todo');
    } finally {
      removeProcessing(todo.id);
    }
  };

  // TOGGLE ALL TODOS
  const handleToggleAll = async () => {
    const shouldComplete = activeCount > 0;

    const todosToUpdate = todos.filter(
      todo =>
        todo.completed !== shouldComplete && !processingTodos.includes(todo.id),
    );

    await Promise.all(
      todosToUpdate.map(async todo => {
        addProcessing(todo.id);

        try {
          const updatedTodo = await updateTodo(todo.id, {
            completed: shouldComplete,
          });

          setTodos(current =>
            current.map(item => (item.id === todo.id ? updatedTodo : item)),
          );
        } catch {
          showError('Unable to update a todo');
        } finally {
          removeProcessing(todo.id);
        }
      }),
    );
  };

  // START EDITING
  const handleStartEditing = (todo: Todo) => {
    if (processingTodos.includes(todo.id)) {
      return;
    }

    setEditingTodoId(todo.id);
    setEditingTitle(todo.title);
  };

  // SAVE EDIT
  const handleSaveEdit = async (todo: Todo) => {
    const title = editingTitle.trim();

    setEditingTodoId(null);

    if (title === todo.title) {
      return;
    }

    addProcessing(todo.id);

    try {
      if (!title) {
        await deleteTodo(todo.id);

        setTodos(current => current.filter(item => item.id !== todo.id));

        return;
      }

      const updatedTodo = await updateTodo(todo.id, { title });

      setTodos(current =>
        current.map(item => (item.id === todo.id ? updatedTodo : item)),
      );
    } catch {
      setEditingTodoId(todo.id);
      setEditingTitle(title);

      showError(title ? 'Unable to update a todo' : 'Unable to delete a todo');
    } finally {
      removeProcessing(todo.id);
    }
  };

  // CLEAR COMPLETED
  const handleClearCompleted = async () => {
    const completedTodos = todos.filter(
      todo => todo.completed && !processingTodos.includes(todo.id),
    );

    const results = await Promise.all(
      completedTodos.map(async todo => {
        addProcessing(todo.id);

        try {
          await deleteTodo(todo.id);

          return todo.id;
        } catch {
          showError('Unable to delete a todo');

          return null;
        } finally {
          removeProcessing(todo.id);
        }
      }),
    );

    const deletedIds = results.filter((id): id is number => id !== null);

    if (deletedIds.length > 0) {
      setTodos(current =>
        current.filter(todo => !deletedIds.includes(todo.id)),
      );

      inputRef.current?.focus();
    }
  };

  // CANCEL EDIT
  const handleCancelEdit = () => {
    setEditingTodoId(null);
    setEditingTitle('');
  };

  // HIDE ERROR
  const handleHideError = () => {
    setErrorMessage('');

    if (errorTimeout.current) {
      clearTimeout(errorTimeout.current);
    }
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {!isLoading && todos.length > 0 && (
            <button
              type="button"
              className={`todoapp__toggle-all ${
                activeCount === 0 ? 'active' : ''
              }`}
              data-cy="ToggleAllButton"
              onClick={handleToggleAll}
            />
          )}

          <form onSubmit={handleAddTodo}>
            <input
              ref={inputRef}
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={newTodo}
              onChange={event => setNewTodo(event.target.value)}
              disabled={isAdding}
              data-cy="NewTodoField"
            />
          </form>
        </header>

        {!isLoading && (
          <TodoList
            todos={visibleTodos}
            tempTodo={tempTodo}
            processingTodos={processingTodos}
            editingTodoId={editingTodoId}
            editingTitle={editingTitle}
            onToggle={handleToggleTodo}
            onDelete={handleDeleteTodo}
            onStartEditing={handleStartEditing}
            onEditTitleChange={setEditingTitle}
            onSaveEdit={handleSaveEdit}
            onCancelEdit={handleCancelEdit}
          />
        )}

        {isLoading && (
          <section className="todoapp__main">
            <div className="loader" />
          </section>
        )}

        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {activeCount} items left
            </span>

            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className={`filter__link ${filter === 'all' ? 'selected' : ''}`}
                data-cy="FilterLinkAll"
                onClick={() => setFilter('all')}
              >
                All
              </a>

              <a
                href="#/active"
                className={`filter__link ${
                  filter === 'active' ? 'selected' : ''
                }`}
                data-cy="FilterLinkActive"
                onClick={() => setFilter('active')}
              >
                Active
              </a>

              <a
                href="#/completed"
                className={`filter__link ${
                  filter === 'completed' ? 'selected' : ''
                }`}
                data-cy="FilterLinkCompleted"
                onClick={() => setFilter('completed')}
              >
                Completed
              </a>
            </nav>

            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              disabled={completedCount === 0}
              onClick={handleClearCompleted}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={`notification is-danger is-light ${
          errorMessage ? '' : 'hidden'
        }`}
      >
        <button
          type="button"
          className="delete"
          data-cy="HideErrorButton"
          onClick={handleHideError}
        />

        {errorMessage}
      </div>
    </div>
  );
};
