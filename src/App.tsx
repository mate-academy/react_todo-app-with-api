import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  USER_ID,
  addTodo,
  deleteTodo,
  getTodos,
  TodoChanges,
  updateTodo,
} from './api/todos';
import { Todo } from './types/Todo';
import { Filter } from './types/Filter';
import { TodoList } from './components/TodoList';
import { TodoFooter } from './components/TodoFooter';
import { TodoError } from './components/TodoError';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<Filter>(Filter.All);
  const [isLoading, setIsLoading] = useState(false);

  const [title, setTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const [deletingTodoIds, setDeletingTodoIds] = useState<number[]>([]);
  const [updatingTodoIds, setUpdatingTodoIds] = useState<number[]>([]);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsLoading(true);

    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to load todos');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    const timer = setTimeout(() => {
      setErrorMessage(null);
    }, 3000);

    return () => clearTimeout(timer);
  }, [errorMessage]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const visibleTodos = todos.filter(todo => {
    switch (filter) {
      case Filter.Active:
        return !todo.completed;

      case Filter.Completed:
        return todo.completed;

      default:
        return true;
    }
  });

  const activeTodosCount = todos.filter(todo => !todo.completed).length;
  const hasCompletedTodos = todos.some(todo => todo.completed);

  const allTodosCompleted =
    todos.length > 0 && todos.every(todo => todo.completed);

  const handleFilterChange = (nextFilter: Filter) => {
    setFilter(nextFilter);
  };

  const handleHideError = () => {
    setErrorMessage(null);
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleAddTodo = (event: React.FormEvent) => {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setErrorMessage('Title should not be empty');

      return;
    }

    const newTodo: Omit<Todo, 'id'> = {
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    };

    setTempTodo({
      id: 0,
      ...newTodo,
    });

    addTodo(newTodo)
      .then(todo => {
        setTodos(currentTodos => [...currentTodos, todo]);
        setTitle('');
      })
      .catch(() => {
        setErrorMessage('Unable to add a todo');
      })
      .finally(() => {
        setTempTodo(null);

        setTimeout(() => {
          inputRef.current?.focus();
        }, 0);
      });
  };

  const handleDeleteTodo = (todoId: number): Promise<boolean> => {
    setDeletingTodoIds(currentIds => {
      if (currentIds.includes(todoId)) {
        return currentIds;
      }

      return [...currentIds, todoId];
    });

    return deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );

        return true;
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');

        return false;
      })
      .finally(() => {
        setDeletingTodoIds(currentIds =>
          currentIds.filter(id => id !== todoId),
        );

        setTimeout(() => {
          inputRef.current?.focus();
        }, 0);
      });
  };

  const handleUpdateTodo = (
    todoId: number,
    changes: TodoChanges,
  ): Promise<boolean> => {
    const todo = todos.find(currentTodo => currentTodo.id === todoId);

    if (!todo) {
      return Promise.resolve(false);
    }

    setErrorMessage(null);

    setUpdatingTodoIds(currentIds => {
      if (currentIds.includes(todoId)) {
        return currentIds;
      }

      return [...currentIds, todoId];
    });

    return updateTodo(todoId, changes)
      .then(updatedTodo => {
        setTodos(currentTodos =>
          currentTodos.map(currentTodo =>
            currentTodo.id === todoId ? updatedTodo : currentTodo,
          ),
        );

        return true;
      })
      .catch(() => {
        setErrorMessage('Unable to update a todo');

        return false;
      })
      .finally(() => {
        setUpdatingTodoIds(currentIds =>
          currentIds.filter(id => id !== todoId),
        );
      });
  };

  const handleToggleAll = () => {
    const newCompleted = !allTodosCompleted;

    const todosToUpdate = todos.filter(todo => todo.completed !== newCompleted);

    if (todosToUpdate.length === 0) {
      return;
    }

    setErrorMessage(null);

    setUpdatingTodoIds(currentIds => [
      ...new Set([...currentIds, ...todosToUpdate.map(todo => todo.id)]),
    ]);

    Promise.all(
      todosToUpdate.map(todo =>
        updateTodo(todo.id, {
          completed: newCompleted,
        })
          .then(updatedTodo => ({
            success: true,
            todo: updatedTodo,
          }))
          .catch(() => ({
            success: false,
            todo,
          })),
      ),
    ).then(results => {
      const successfulTodos = results.filter(result => result.success);
      const hasErrors = results.some(result => !result.success);

      if (successfulTodos.length > 0) {
        setTodos(currentTodos =>
          currentTodos.map(todo => {
            const result = successfulTodos.find(
              item => item.todo.id === todo.id,
            );

            return result ? result.todo : todo;
          }),
        );
      }

      if (hasErrors) {
        setErrorMessage('Unable to update a todo');
      }

      setUpdatingTodoIds(currentIds =>
        currentIds.filter(id => !todosToUpdate.some(todo => todo.id === id)),
      );
    });
  };

  const handleClearCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    if (completedTodos.length === 0) {
      return;
    }

    const completedIds = completedTodos.map(todo => todo.id);

    setDeletingTodoIds(completedIds);

    Promise.all(
      completedTodos.map(todo =>
        deleteTodo(todo.id)
          .then(() => ({
            success: true,
            id: todo.id,
          }))
          .catch(() => ({
            success: false,
            id: todo.id,
          })),
      ),
    ).then(results => {
      const successfulIds = results
        .filter(result => result.success)
        .map(result => result.id);

      const hasErrors = results.some(result => !result.success);

      if (successfulIds.length > 0) {
        setTodos(currentTodos =>
          currentTodos.filter(todo => !successfulIds.includes(todo.id)),
        );
      }

      if (hasErrors) {
        setErrorMessage('Unable to delete a todo');
      }

      setDeletingTodoIds(currentIds =>
        currentIds.filter(id => !completedIds.includes(id)),
      );

      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {!isLoading && todos.length > 0 && (
            <button
              type="button"
              className={`todoapp__toggle-all ${
                allTodosCompleted ? 'active' : ''
              }`}
              data-cy="ToggleAllButton"
              onClick={handleToggleAll}
            />
          )}

          <form onSubmit={handleAddTodo}>
            <input
              ref={inputRef}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={title}
              onChange={handleTitleChange}
              disabled={tempTodo !== null}
            />
          </form>
        </header>

        {(todos.length > 0 || tempTodo !== null) && (
          <TodoList
            todos={visibleTodos}
            isLoading={isLoading}
            tempTodo={tempTodo}
            deletingTodoIds={deletingTodoIds}
            updatingTodoIds={updatingTodoIds}
            onDelete={handleDeleteTodo}
            onUpdate={handleUpdateTodo}
          />
        )}

        {todos.length > 0 && (
          <TodoFooter
            filter={filter}
            activeTodosCount={activeTodosCount}
            hasCompletedTodos={hasCompletedTodos}
            onFilterChange={handleFilterChange}
            onClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      <TodoError message={errorMessage || ''} onHide={handleHideError} />
    </div>
  );
};
