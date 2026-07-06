import React, { useState, useEffect, useRef } from 'react';
import { UserWarning } from './UserWarning';
import {
  USER_ID,
  getTodos,
  addTodo,
  deleteTodo,
  updateTodo,
} from './api/todos';
import { Todo } from './types/Todo';
import { ErrorNotification } from './components/ErrorNotification';
import { TodoList } from './components/TodoList';
import { TodoFilter } from './components/TodoFilter';
import { FilterStatus } from './types/FilterStatus';

enum ErrorMessage {
  Load = 'Unable to load todos',
  Empty = 'Title should not be empty',
  Add = 'Unable to add a todo',
  Delete = 'Unable to delete a todo',
  Update = 'Unable to update a todo',
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [filter, setFilter] = useState<FilterStatus>(FilterStatus.All);
  const [newTitle, setNewTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingIds, setLoadingIds] = useState<number[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const newTodoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage(ErrorMessage.Load);
        setTimeout(() => setErrorMessage(''), 3000);
      });
  }, []);

  useEffect(() => {
    if (!isSubmitting) {
      newTodoField.current?.focus();
    }
  }, [isSubmitting]);

  const visibleTodos = todos.filter(todo => {
    if (filter === FilterStatus.Active) {
      return !todo.completed;
    } else if (filter === FilterStatus.Completed) {
      return todo.completed;
    }

    return true;
  });

  const activeTodosCount = todos.filter(todo => !todo.completed).length;
  const completedTodos = todos.filter(todo => todo.completed);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedTitle = newTitle.trim();

    if (trimmedTitle === '') {
      setErrorMessage(ErrorMessage.Empty);
      setTimeout(() => setErrorMessage(''), 3000);

      return;
    }

    setIsSubmitting(true);
    setTempTodo({
      userId: USER_ID,
      id: 0,
      title: trimmedTitle,
      completed: false,
    });
    addTodo(trimmedTitle)
      .then(newTodo => {
        setTodos(prevTodos => [...prevTodos, newTodo]);
        setNewTitle('');
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.Add);
        setTimeout(() => setErrorMessage(''), 3000);
      })
      .finally(() => {
        setIsSubmitting(false);
        setTempTodo(null);
      });
  };

  const handleDelete = (id: number) => {
    setLoadingIds(prevIds => [...prevIds, id]);

    return deleteTodo(id)
      .then(() => {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.Delete);
        setTimeout(() => setErrorMessage(''), 3000);
        throw new Error();
      })
      .finally(() => {
        setLoadingIds(prevIds => prevIds.filter(todoId => todoId !== id));
        newTodoField.current?.focus();
      });
  };

  const handleClearCompleted = () => {
    Promise.all(
      completedTodos.map(todo => handleDelete(todo.id).catch(() => {})),
    );
  };

  const handleToggleTodo = (todo: Todo) => {
    setLoadingIds(current => [...current, todo.id]);

    return updateTodo({ ...todo, completed: !todo.completed })
      .then(updated => {
        setTodos(prev => prev.map(t => (t.id === updated.id ? updated : t)));
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.Update);
        setTimeout(() => setErrorMessage(''), 3000);
      })
      .finally(() => {
        setLoadingIds(current => current.filter(id => id !== todo.id));
      });
  };

  const handleToggleAll = () => {
    const allCompleted = todos.every(todo => todo.completed);
    const newStatus = !allCompleted;
    const todosToUpdate = todos.filter(todo => todo.completed !== newStatus);

    Promise.all(todosToUpdate.map(todo => handleToggleTodo(todo)));
  };

  const startEditing = (todo: Todo) => {
    setEditingId(todo.id);
    setEditTitle(todo.title);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditTitle('');
  };

  const saveEditing = (todo: Todo) => {
    const trimmedTitle = editTitle.trim();

    if (trimmedTitle === todo.title) {
      cancelEditing();

      return;
    }

    if (trimmedTitle === '') {
      handleDelete(todo.id)
        .then(() => cancelEditing())
        .catch(() => {});

      return;
    }

    setLoadingIds(current => [...current, todo.id]);
    updateTodo({ ...todo, title: trimmedTitle })
      .then(updated => {
        setTodos(prev => prev.map(t => (t.id === updated.id ? updated : t)));
        cancelEditing();
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.Update);
        setTimeout(() => setErrorMessage(''), 3000);
      })
      .finally(() => {
        setLoadingIds(current => current.filter(id => id !== todo.id));
      });
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length > 0 && (
            <button
              type="button"
              className={
                todos.every(todo => todo.completed)
                  ? 'todoapp__toggle-all active'
                  : 'todoapp__toggle-all'
              }
              data-cy="ToggleAllButton"
              onClick={handleToggleAll}
            />
          )}

          <form onSubmit={handleSubmit}>
            <input
              ref={newTodoField}
              value={newTitle}
              onChange={event => setNewTitle(event.target.value)}
              disabled={isSubmitting}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
            />
          </form>
        </header>

        {(todos.length > 0 || tempTodo) && (
          <TodoList
            todos={visibleTodos}
            tempTodo={tempTodo}
            loadingTodoIds={loadingIds}
            editingId={editingId}
            editTitle={editTitle}
            onDelete={id => handleDelete(id).catch(() => {})}
            onToggle={handleToggleTodo}
            onStartEditing={startEditing}
            onEditTitleChange={setEditTitle}
            onSaveEditing={saveEditing}
            onCancelEditing={cancelEditing}
          />
        )}

        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {activeTodosCount} items left
            </span>

            <TodoFilter filter={filter} onFilterChange={setFilter} />

            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              onClick={handleClearCompleted}
              disabled={completedTodos.length === 0}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      <ErrorNotification
        message={errorMessage}
        onClose={() => setErrorMessage('')}
      />
    </div>
  );
};
