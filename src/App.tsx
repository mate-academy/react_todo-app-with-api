import React, { useState, useEffect, useRef } from 'react';
import { UserWarning } from './UserWarning';
import {
  getTodos,
  deleteTodo,
  createTodo,
  updateTodo,
  USER_ID,
} from './api/todos';
import { Todo } from './types/Todo';
import { FilterType } from './types/FilterType';
import { ErrorMessage } from './types/ErrorMessage';

import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { Notification } from './components/Notification';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState('');
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [filter, setFilter] = useState<FilterType>(FilterType.All);
  const [isLoading, setIsLoading] = useState(false);
  const [processingIds, setProcessingIds] = useState<number[]>([]);
  const newTodoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    newTodoField.current?.focus();

    getTodos()
      .then(setTodos)
      .catch(() => {
        setError(ErrorMessage.Load);
      });
  }, []);

  useEffect(() => {
    if (!error) {
      return;
    }

    const timerId = setTimeout(() => {
      setError('');
    }, 3000);

    return () => clearTimeout(timerId);
  }, [error]);

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const normalizedTitle = newTodoTitle.trim();

    if (!normalizedTitle) {
      setError(ErrorMessage.EmptyTitle);

      return;
    }

    const tempId = 0;
    const tempTodo: Todo = {
      id: tempId,
      title: normalizedTitle,
      completed: false,
      userId: USER_ID,
    };

    setTodos(prevTodos => [...prevTodos, tempTodo]);
    setProcessingIds(prev => [...prev, tempId]);
    setIsLoading(true);

    createTodo(normalizedTitle)
      .then(newTodoFromServer => {
        setNewTodoTitle('');
        setTodos(prevTodos =>
          prevTodos.map(todo =>
            todo.id === tempId ? newTodoFromServer : todo,
          ),
        );
      })
      .catch(() => {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== tempId));
        setError(ErrorMessage.Add);
      })
      .finally(() => {
        setProcessingIds(prev => prev.filter(id => id !== tempId));
        setIsLoading(false);
        setTimeout(() => newTodoField.current?.focus(), 0);
      });
  };

  const handleUpdate = (updatedTodo: Todo) => {
    setProcessingIds(prev => [...prev, updatedTodo.id]);

    return (
      updateTodo(updatedTodo)
        .then(() => {
          setTodos(prevTodos =>
            prevTodos.map(todo =>
              todo.id === updatedTodo.id ? updatedTodo : todo,
            ),
          );
        })
        // eslint-disable-next-line @typescript-eslint/no-shadow
        .catch(error => {
          setError(ErrorMessage.Update);
          throw error;
        })
        .finally(() => {
          setProcessingIds(prev => prev.filter(id => id !== updatedTodo.id));
        })
    );
  };

  const hideError = () => {
    setError('');
  };

  let filteredTodos = todos;

  switch (filter) {
    case FilterType.Active:
      filteredTodos = todos.filter(todo => !todo.completed);
      break;
    case FilterType.Completed:
      filteredTodos = todos.filter(todo => todo.completed);
      break;
    default:
      break;
  }

  const activeTodosCount = todos.filter(
    todo => !todo.completed && todo.id !== 0,
  ).length;

  const completedTodosCount = todos.filter(todo => todo.completed).length;

  const handleDelete = (todoId: number) => {
    setProcessingIds(prev => [...prev, todoId]);

    deleteTodo(todoId)
      .then(() => {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
        newTodoField.current?.focus();
      })
      .catch(() => {
        setError(ErrorMessage.Delete);
        newTodoField.current?.focus();
      })
      .finally(() => {
        setProcessingIds(prev => prev.filter(id => id !== todoId));
      });
  };

  const handleToggleAll = () => {
    const shouldBeCompleted = activeTodosCount > 0;

    const todosToUpdate = todos.filter(
      todo => todo.completed !== shouldBeCompleted,
    );

    if (todosToUpdate.length === 0) {
      return;
    }

    const idsToUpdate = todosToUpdate.map(todo => todo.id);

    setProcessingIds(prev => [...prev, ...idsToUpdate]);

    const updates = todosToUpdate.map(todo => {
      return updateTodo({ ...todo, completed: shouldBeCompleted })
        .then(updatedTodo => updatedTodo)
        .catch(() => null);
    });

    Promise.all(updates)
      .then(results => {
        const hasError = results.some(res => res === null);

        if (hasError) {
          setError(ErrorMessage.Update);
        }

        setTodos(prevTodos =>
          prevTodos.map(todo => {
            const updatedTodo = results.find(res => res && res.id === todo.id);

            return updatedTodo ? (updatedTodo as Todo) : todo;
          }),
        );
      })
      .finally(() => {
        setProcessingIds(prev => prev.filter(id => !idsToUpdate.includes(id)));
      });
  };

  const handleClearCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    const deletePromises = completedTodos.map(todo =>
      deleteTodo(todo.id)
        .then(() => todo.id)
        .catch(() => null),
    );

    setIsLoading(true);

    Promise.all(deletePromises)
      .then(results => {
        const hasErrors = results.some(id => id === null);

        if (hasErrors) {
          setError(ErrorMessage.Delete);
        }

        setTodos(prevTodos =>
          prevTodos.filter(todo => !results.includes(todo.id)),
        );
      })
      .finally(() => {
        setIsLoading(false);
        setTimeout(() => newTodoField.current?.focus(), 0);
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
              className={`todoapp__toggle-all ${activeTodosCount === 0 ? 'active' : ''}`}
              data-cy="ToggleAllButton"
              onClick={handleToggleAll}
            />
          )}
          <form onSubmit={handleFormSubmit}>
            <input
              ref={newTodoField}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              disabled={isLoading}
              value={newTodoTitle}
              onChange={e => setNewTodoTitle(e.target.value)}
            />
          </form>
        </header>
        <fieldset disabled={isLoading}>
          <TodoList
            todos={filteredTodos}
            onDelete={handleDelete}
            onUpdate={handleUpdate}
            processingIds={processingIds}
          />
        </fieldset>

        {todos.length > 0 && (
          <fieldset disabled={isLoading}>
            <Footer
              filter={filter}
              onFilterChange={setFilter}
              activeTodosCount={activeTodosCount}
              completedTodosCount={completedTodosCount}
              onClearCompleted={handleClearCompleted}
            />
          </fieldset>
        )}
      </div>

      <Notification error={error} onClose={hideError} />
    </div>
  );
};
