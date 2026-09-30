/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState, useRef } from 'react';
import { UserWarning } from './UserWarning';
import {
  addTodo,
  deleteTodo,
  getTodos,
  updateTodo,
  USER_ID,
} from './api/todos';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList/TodoList';
import { Footer } from './components/Footer/Footer';
import { Filter } from './types/Filter';
import { TodoItem } from './components/Todo/TodoItem';
import { EditingTodo } from './types/EditingTodo';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorTodoMessage, setErrorTodoMessage] = useState<string>('');
  const [filterTodos, setFilterTodos] = useState<Filter>('all');
  // ADD TODO
  const [newTitleTodo, setNewTitleTodo] = useState<string>(''); // for input value
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  // DELETE TODO
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);
  // EDIT TODO
  const [editingTodo, setEditingTodo] = useState<EditingTodo | null>(null);

  useEffect(() => {
    setErrorTodoMessage('');
    getTodos()
      .then(setTodos)
      .catch(() => setErrorTodoMessage('Unable to load todos'));
  }, []);

  useEffect(() => {
    if (errorTodoMessage) {
      const timerId = setTimeout(() => {
        setErrorTodoMessage('');
      }, 3000);

      return () => clearTimeout(timerId);
    } else {
      return undefined;
    }
  }, [errorTodoMessage]);

  useEffect(() => {
    if (!isAdding && loadingTodoIds.length === 0) {
      inputRef.current?.focus();
    }
  }, [isAdding, loadingTodoIds.length]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const countActiveTodos = todos.filter(todo => !todo.completed).length;

  // CLEAR COMPLETED TODOS BUTTON
  const hasCompletedTodos = todos.some(todo => todo.completed);

  const visibleTodos = todos.filter(todo => {
    if (filterTodos === 'active') {
      return !todo.completed;
    }

    if (filterTodos === 'completed') {
      return todo.completed;
    }

    return true;
  });

  // HANDLE FUNCTION

  const handleDeleteNotification = () => {
    setErrorTodoMessage('');
  };

  const handleFilterTodos = (filter: Filter) => {
    setFilterTodos(filter);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorTodoMessage('');
    if (newTitleTodo.trim().length === 0) {
      return setErrorTodoMessage('Title should not be empty');
    }

    setIsAdding(true);
    setTempTodo({
      id: 0,
      userId: USER_ID,
      title: newTitleTodo.trim(),
      completed: false,
    });

    const todoData = {
      userId: USER_ID,
      title: newTitleTodo.trim(),
      completed: false,
    };

    addTodo(todoData)
      .then(addedTodo => {
        setTodos(currentTodos => [...currentTodos, addedTodo]);
        setNewTitleTodo('');
      })
      .catch(() => setErrorTodoMessage('Unable to add a todo'))
      .finally(() => {
        setTempTodo(null);
        setIsAdding(false);
      });
  };

  const handleDeleteTodo = (id: number, onSuccess?: () => void) => {
    setErrorTodoMessage('');
    setLoadingTodoIds(currentIds => [...currentIds, id]);

    deleteTodo(id)
      .then(() => {
        setTodos(currentTodos => currentTodos.filter(todo => todo.id !== id));

        onSuccess?.();
      })
      .catch(() => {
        setErrorTodoMessage('Unable to delete a todo');
      })
      .finally(() => {
        setLoadingTodoIds(currentIds =>
          currentIds.filter(currentId => currentId !== id),
        );
      });
  };

  const handleClearCompleted = () =>
    todos
      .filter(todo => todo.completed)
      .forEach(todo => {
        handleDeleteTodo(todo.id);
      });

  const handleToggleTodo = (todo: Todo) => {
    setErrorTodoMessage('');
    setLoadingTodoIds(currentTodoIds => [...currentTodoIds, todo.id]);
    updateTodo(todo.id, { completed: !todo.completed })
      .then(updatedTodo => {
        setTodos(currentTodos =>
          currentTodos.map(currentTodo =>
            currentTodo.id === updatedTodo.id ? updatedTodo : currentTodo,
          ),
        );
      })
      .catch(() => setErrorTodoMessage('Unable to update a todo'))
      .finally(() => {
        setLoadingTodoIds(currentIds =>
          currentIds.filter(currentId => currentId !== todo.id),
        );
      });
  };

  const areAllTodosCompleted =
    todos.length > 0 && todos.every(todo => todo.completed);

  const handleToggleAllTodos = () => {
    const status = !areAllTodosCompleted;

    todos
      .filter(todo => todo.completed !== status)
      .forEach(todo => handleToggleTodo(todo));
  };

  const handleEditTodo = (todo: Todo) => {
    setEditingTodo({
      id: todo.id,
      title: todo.title,
    });
  };

  const handleTitleChange = (title: string) => {
    setEditingTodo(current => (current ? { ...current, title } : null));
  };

  const saveEditedTodo = () => {
    if (!editingTodo) {
      return;
    }

    const newTitle = editingTodo.title.trim();

    const currentTodo = todos.find(todo => todo.id === editingTodo.id);

    if (!currentTodo) {
      return;
    }

    if (newTitle === currentTodo.title) {
      setEditingTodo(null);

      return;
    }

    if (!newTitle) {
      handleDeleteTodo(editingTodo.id, () => {
        setEditingTodo(null);
      });

      return;
    }

    setErrorTodoMessage('');
    setLoadingTodoIds(currentIds => [...currentIds, editingTodo.id]);

    updateTodo(editingTodo.id, { title: newTitle })
      .then(updatedTodo => {
        setTodos(currentTodos =>
          currentTodos.map(todo =>
            todo.id === updatedTodo.id ? updatedTodo : todo,
          ),
        );
        setEditingTodo(null);
      })
      .catch(() => {
        setErrorTodoMessage('Unable to update a todo');
      })
      .finally(() => {
        setLoadingTodoIds(currentIds =>
          currentIds.filter(id => id !== editingTodo.id),
        );
      });
  };

  const handleEditSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    saveEditedTodo();
  };

  const handleEditKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setEditingTodo(null);
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this button should have `active` class only if all todos are completed */}
          {todos.length > 0 && (
            <button
              type="button"
              className={`todoapp__toggle-all ${areAllTodosCompleted ? 'active' : ''}`}
              data-cy="ToggleAllButton"
              onClick={handleToggleAllTodos}
            />
          )}

          {/* Add a todo on form submit */}
          <form onSubmit={handleSubmit}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={newTitleTodo}
              onChange={event => setNewTitleTodo(event.target.value)}
              disabled={isAdding}
              ref={inputRef}
            />
          </form>
        </header>

        {todos.length > 0 && (
          <TodoList
            todos={visibleTodos}
            onDelete={handleDeleteTodo}
            deletingTodoIds={loadingTodoIds}
            onToggle={handleToggleTodo}
            onEditTodo={handleEditTodo}
            editingTodo={editingTodo}
            onEditTitleChange={handleTitleChange}
            onEditSubmit={handleEditSubmit}
            onEditBlur={saveEditedTodo}
            onEditKeyUp={handleEditKeyUp}
          />
        )}

        {tempTodo && <TodoItem todo={tempTodo} isLoading={isAdding} />}

        {todos.length > 0 && (
          <Footer
            onFilterChange={handleFilterTodos}
            filterTodos={filterTodos}
            countActiveTodos={countActiveTodos}
            hasCompletedTodos={hasCompletedTodos}
            onDelete={handleClearCompleted}
          />
        )}
      </div>
      <div
        data-cy="ErrorNotification"
        className={`notification is-danger is-light has-text-weight-normal ${errorTodoMessage.length ? '' : 'hidden'}`}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={handleDeleteNotification}
        />
        {errorTodoMessage}
      </div>
    </div>
  );
};
