/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import { useRef, useState, useEffect, useMemo } from 'react';
import { UserWarning } from './UserWarning';
import {
  addTodo,
  deleteTodo,
  getTodos,
  updateTodo,
  USER_ID,
} from './api/todos';

import type { Todo } from './types/Todo';
import type { FilterType } from './types/FilterType';

import TodoList from './components/TodoList/TodoList';
import TodoItem from './components/TodoItem/TodoItem';
import Footer from './components/Footer/Footer';
import ErrorNotification from './components/ErrorNotification';

import './styles/index.scss';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('all');
  const [errorMessage, setErrorMessage] = useState('');
  const [isErrorVisible, setIsErrorVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deletingTodoIds, setDeletingTodoIds] = useState<number[]>([]);
  const [updatingTodoIds, setUpdatingTodoIds] = useState<number[]>([]);
  const [isLoadingTodos, setIsLoadingTodos] = useState(true);
  const newTodoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!USER_ID) {
      return;
    }

    getTodos()
      .then(data => {
        setTodos(data);
      })
      .catch(error => {
        /* eslint-disable no-console */
        console.error('Error fetching todos:', error);
        setErrorMessage('Unable to load todos');
        setIsErrorVisible(true);
      })
      .finally(() => {
        setIsLoadingTodos(false);
      });
  }, []);

  useEffect(() => {
    if (!errorMessage) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setIsErrorVisible(false);
    }, 3000);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [errorMessage]);

  useEffect(() => {
    if (!isSubmitting) {
      newTodoInputRef.current?.focus();
    }
  }, [isSubmitting]);

  const filter = (value: FilterType) => {
    setSelectedFilter(value);
  };

  const visibleTodos = useMemo(() => {
    switch (selectedFilter) {
      case 'active':
        return todos.filter(todo => !todo.completed);
      case 'completed':
        return todos.filter(todo => todo.completed);
      case 'all':
      default:
        return todos;
    }
  }, [todos, selectedFilter]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setErrorMessage('Title should not be empty');
      setIsErrorVisible(true);

      return;
    }

    setErrorMessage('');
    setIsErrorVisible(false);
    setIsSubmitting(true);
    setTempTodo({
      id: 0,
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    });

    addTodo({ title: trimmedTitle })
      .then(newTodo => {
        setTodos(prevTodos => [...prevTodos, newTodo]);
        setTempTodo(null);
        setTitle('');
      })
      .catch(error => {
        console.error('Error adding todo:', error);
        setTempTodo(null);
        setErrorMessage('Unable to add a todo');
        setIsErrorVisible(true);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const handleDelete = (todoId: number) => {
    if (deletingTodoIds.includes(todoId)) {
      return;
    }

    setErrorMessage('');
    setIsErrorVisible(false);
    setDeletingTodoIds(prevIds => [...prevIds, todoId]);

    deleteTodo(todoId)
      .then(() => {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
      })
      .catch(error => {
        console.error('Error deleting todo:', error);
        setErrorMessage('Unable to delete a todo');
        setIsErrorVisible(true);
      })
      .finally(() => {
        setDeletingTodoIds(prevIds =>
          prevIds.filter(currentId => currentId !== todoId),
        );
        newTodoInputRef.current?.focus();
      });
  };

  const handleClearCompleted = () => {
    setErrorMessage('');
    setIsErrorVisible(false);

    const completedTodoIds = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id)
      .filter(todoId => !deletingTodoIds.includes(todoId));

    setDeletingTodoIds(prevIds => [
      ...prevIds,
      ...completedTodoIds.filter(todoId => !prevIds.includes(todoId)),
    ]);

    completedTodoIds.forEach(todoId => {
      deleteTodo(todoId)
        .then(() => {
          setTodos(prevTodos =>
            prevTodos.filter(currentTodo => currentTodo.id !== todoId),
          );
        })
        .catch(error => {
          console.error(`Error deleting todo ${todoId}:`, error);
          setErrorMessage('Unable to delete a todo');
          setIsErrorVisible(true);
        })
        .finally(() => {
          setDeletingTodoIds(prevIds =>
            prevIds.filter(currentId => currentId !== todoId),
          );
          newTodoInputRef.current?.focus();
        });
    });
  };

  const handleToggle = (todoId: number) => {
    const todo = todos.find(currentTodo => currentTodo.id === todoId);

    if (!todo || updatingTodoIds.includes(todoId)) {
      return;
    }

    const completed = !todo.completed;

    setErrorMessage('');
    setIsErrorVisible(false);
    setUpdatingTodoIds(prevIds => [...prevIds, todoId]);

    updateTodo(todoId, { completed })
      .then(updatedTodo => {
        setTodos(prevTodos =>
          prevTodos.map(currentTodo =>
            currentTodo.id === updatedTodo.id ? updatedTodo : currentTodo,
          ),
        );
      })
      .catch(error => {
        console.error('Error updating todo:', error);
        setErrorMessage('Unable to update a todo');
        setIsErrorVisible(true);
      })
      .finally(() => {
        setUpdatingTodoIds(prevIds =>
          prevIds.filter(currentId => currentId !== todoId),
        );
      });
  };

  const handleUpdate = (todoId: number, newTitle: string) => {
    setErrorMessage('');
    setIsErrorVisible(false);
    setUpdatingTodoIds(prevIds => [...prevIds, todoId]);

    return updateTodo(todoId, { title: newTitle })
      .then(updatedTodo => {
        setTodos(prevTodos =>
          prevTodos.map(currentTodo =>
            currentTodo.id === updatedTodo.id ? updatedTodo : currentTodo,
          ),
        );
      })
      .catch(error => {
        console.error('Error updating todo:', error);
        setErrorMessage('Unable to update a todo');
        setIsErrorVisible(true);
        throw error;
      })
      .finally(() => {
        setUpdatingTodoIds(prevIds =>
          prevIds.filter(currentId => currentId !== todoId),
        );
      });
  };

  const handleToggleAll = () => {
    const completed = todos.some(todo => !todo.completed);
    const todosToUpdate = todos.filter(todo => todo.completed !== completed);

    if (todosToUpdate.length === 0) {
      return;
    }

    setErrorMessage('');
    setIsErrorVisible(false);
    setUpdatingTodoIds(todosToUpdate.map(todo => todo.id));

    Promise.allSettled(
      todosToUpdate.map(todo => updateTodo(todo.id, { completed })),
    ).then(results => {
      let hasError = false;

      results.forEach(result => {
        if (result.status === 'fulfilled') {
          setTodos(prevTodos =>
            prevTodos.map(todo =>
              todo.id === result.value.id ? result.value : todo,
            ),
          );
        } else {
          hasError = true;
          console.error('Error updating todo:', result.reason);
        }
      });

      if (hasError) {
        setErrorMessage('Unable to update a todo');
        setIsErrorVisible(true);
      }

      setUpdatingTodoIds([]);
    });
  };

  const areAllTodosCompleted =
    todos.length > 0 && todos.every(todo => todo.completed);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this button should have `active` class only if all todos are completed */}
          {!isLoadingTodos && todos.length > 0 && (
            <button
              type="button"
              className={`todoapp__toggle-all ${areAllTodosCompleted ? 'active' : ''}`}
              data-cy="ToggleAllButton"
              onClick={handleToggleAll}
            />
          )}

          {/* Add a todo on form submit */}
          <form onSubmit={handleSubmit}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={title}
              onChange={e => setTitle(e.target.value)}
              autoFocus
              disabled={isSubmitting}
              ref={newTodoInputRef}
            />
          </form>
        </header>

        {todos.length > 0 && (
          <TodoList
            todos={visibleTodos}
            onDelete={handleDelete}
            handleToggle={handleToggle}
            onUpdate={handleUpdate}
            deletingTodoIds={deletingTodoIds}
            updatingTodoIds={updatingTodoIds}
          />
        )}

        {tempTodo && (
          <TodoItem
            todo={tempTodo}
            isLoading
            onDelete={handleDelete}
            toggleTodo={handleToggle}
            onUpdate={handleUpdate}
          />
        )}

        {todos.length > 0 && (
          <Footer
            todos={todos}
            selectedFilter={selectedFilter}
            onFilterChange={filter}
            completedList={todos.filter(todo => todo.completed)}
            onClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      <ErrorNotification
        message={errorMessage}
        hidden={!isErrorVisible}
        onClose={() => setIsErrorVisible(false)}
      />
    </div>
  );
};
