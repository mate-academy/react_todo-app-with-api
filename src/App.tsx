/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  createTodo,
  deleteTodo,
  getTodos,
  updateTodo,
  USER_ID,
} from './api/todos';
import { Todo } from './types/Todo';
import { TodoMain } from './components/TodoMain/TodoMain';
import { ErrorNotification } from './components/ErrorNotif/ErrorNotification';
import { TodoFooter } from './components/TodoFooter/TodoFooter';
import { filterTypes } from './utils/filterTypes';
import classNames from 'classnames';

enum FilterStatus {
  All = 'all',
  Active = 'active',
  Completed = 'completed',
}

enum ErrorMessage {
  LoadError = 'Unable to load todos',
  TitleError = 'Title should not be empty',
  AddError = 'Unable to add a todo',
  DeleteError = 'Unable to delete a todo',
  UpdateError = 'Unable to update a todo',
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);

  const [filterStatus, setFilterStatus] = useState('all');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isInputDisabled, setIsInputDisabled] = useState(false);
  const [query, setQuery] = useState('');
  const textInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getTodos()
      .then(data => {
        setTodos(data);
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.LoadError);
        setTimeout(() => setErrorMessage(null), 3000);
      });
  }, []);

  useEffect(() => {
    if (!isInputDisabled) {
      textInputRef.current?.focus();
    }
  }, [isInputDisabled]);

  const filteredTodos = todos.filter(todo => {
    if (filterStatus === FilterStatus.Active && todo.completed) {
      return false;
    }

    if (filterStatus === FilterStatus.Completed && !todo.completed) {
      return false;
    }

    return true;
  });

  const handleAddTodo = (title: string) => {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setErrorMessage(ErrorMessage.TitleError);
      setTimeout(() => setErrorMessage(null), 3000);

      return;
    }

    setIsInputDisabled(true);

    const tempTodoItem: Todo = {
      id: 0,
      title: trimmedTitle,
      completed: false,
      userId: USER_ID,
    };

    setTempTodo(tempTodoItem);

    createTodo({ title: trimmedTitle, userId: USER_ID })
      .then(newTodo => {
        setTempTodo(null);
        setTodos(current => [...current, newTodo]);
        setQuery('');
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.AddError);
        setTimeout(() => setErrorMessage(null), 3000);
        setTempTodo(null);
      })
      .finally(() => {
        setIsInputDisabled(false);
      });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    handleAddTodo(query);
  };

  const handleDeleteTodo = (todoId: number) => {
    const todoToDelete = todos.find(todo => todo.id === todoId);

    if (!todoToDelete) {
      return Promise.resolve();
    }

    setIsInputDisabled(true);

    setLoadingTodoIds(prev => [...prev, todoToDelete.id]);

    return deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.DeleteError);
        setTimeout(() => setErrorMessage(null), 3000);

        throw new Error(ErrorMessage.DeleteError);
      })
      .finally(() => {
        setLoadingTodoIds(current => current.filter(id => id !== todoId));
        setIsInputDisabled(false);
      });
  };

  const handleUpdateTodo = (todoId: number, newTitle: string) => {
    const todoToUpdate = todos.find(todo => todo.id === todoId);

    if (!todoToUpdate) {
      return Promise.resolve();
    }

    if (newTitle.trim().length === 0) {
      return handleDeleteTodo(todoToUpdate.id);
    }

    if (newTitle.trim() === todoToUpdate.title.trim()) {
      return Promise.resolve();
    }

    const updatedTodo = {
      ...todoToUpdate,
      title: newTitle,
    };

    setLoadingTodoIds(prev => [...prev, todoToUpdate.id]);

    return updateTodo(updatedTodo)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.map(todo =>
            todo.id === updatedTodo.id ? updatedTodo : todo,
          ),
        );
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.UpdateError);
        setTimeout(() => setErrorMessage(null), 3000);

        throw new Error(ErrorMessage.UpdateError);
      })
      .finally(() => {
        setLoadingTodoIds(current => current.filter(id => id !== todoId));
      });
  };

  const handleCheckBox = (todoId: number) => {
    const todoToComplete = todos.find(todo => todo.id === todoId);

    if (!todoToComplete) {
      return;
    }

    const updatedTodo = {
      ...todoToComplete,
      completed: !todoToComplete.completed,
    };

    setLoadingTodoIds(prev => [...prev, todoToComplete.id]);

    updateTodo(updatedTodo)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.map(todo => (todo.id === todoId ? updatedTodo : todo)),
        );
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.UpdateError);
        setTimeout(() => setErrorMessage(null), 3000);
      })
      .finally(() => {
        setLoadingTodoIds(current => current.filter(id => id !== todoId));
      });
  };

  const handleClearCompleted = () => {
    setIsInputDisabled(true);

    const completed = todos.filter(todo => todo.completed);
    const completedIds = completed.map(t => t.id);

    setLoadingTodoIds(prev => [...prev, ...completedIds]);

    Promise.allSettled(
      completed.map(todo => deleteTodo(todo.id).then(() => todo.id)),
    )
      .then(results => {
        const successfulIds: number[] = [];
        let hasError = false;

        results.forEach(result => {
          if (result.status === 'fulfilled') {
            successfulIds.push(result.value);
          } else {
            hasError = true;
          }
        });

        setTodos(current =>
          current.filter(todo => !successfulIds.includes(todo.id)),
        );

        if (hasError) {
          setErrorMessage(ErrorMessage.DeleteError);
          setTimeout(() => setErrorMessage(null), 3000);
        }
      })
      .finally(() => {
        setLoadingTodoIds(current =>
          current.filter(id => !completedIds.includes(id)),
        );
        setIsInputDisabled(false);
      });
  };

  const handleToggleAll = () => {
    const areAllCompleted = todos.every(todo => todo.completed);
    const newStatus = !areAllCompleted;

    const todoToUpdate = todos.filter(todo => todo.completed !== newStatus);
    const todoToUpdateIds = todoToUpdate.map(t => t.id);

    setLoadingTodoIds(prev => [...prev, ...todoToUpdateIds]);

    Promise.allSettled(
      todoToUpdate.map(todo => {
        const updatedTodo = { ...todo, completed: newStatus };

        return updateTodo(updatedTodo).then(() => updatedTodo);
      }),
    )
      .then(results => {
        const successfulUpdates: Todo[] = [];
        let hasError = false;

        results.forEach(result => {
          if (result.status === 'fulfilled') {
            successfulUpdates.push(result.value);
          } else {
            hasError = true;
          }
        });

        setTodos(currentTodos =>
          currentTodos.map(todo => {
            const updated = successfulUpdates.find(u => u.id === todo.id);

            return updated ?? todo;
          }),
        );

        if (hasError) {
          setErrorMessage(ErrorMessage.UpdateError);
          setTimeout(() => setErrorMessage(null), 3000);
        }
      })
      .finally(() => {
        setLoadingTodoIds(current =>
          current.filter(id => !todoToUpdateIds.includes(id)),
        );
      });
  };

  const activeTodos = () => {
    const active = todos.filter(todo => !todo.completed);

    return active.length;
  };

  const completedTodos = () => {
    const completed = todos.filter(todo => todo.completed);

    return completed.length;
  };

  const handleFilterChange = (type: string) => {
    if (type === FilterStatus.All) {
      setFilterStatus(FilterStatus.All);
    }

    if (type === FilterStatus.Active) {
      setFilterStatus(FilterStatus.Active);
    }

    if (type === FilterStatus.Completed) {
      setFilterStatus(FilterStatus.Completed);
    }
  };

  const handleHideBtn = () => {
    setErrorMessage(null);
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
              className={classNames('todoapp__toggle-all', {
                active: todos.every(todo => todo.completed),
              })}
              data-cy="ToggleAllButton"
              onClick={() => handleToggleAll()}
            />
          )}

          <form onSubmit={handleSubmit}>
            <input
              ref={textInputRef}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              disabled={isInputDisabled}
              value={query}
              onChange={event => {
                setQuery(event.target.value);
              }}
              autoFocus
            />
          </form>
        </header>

        <TodoMain
          todos={filteredTodos}
          tempTodo={tempTodo}
          handleDelete={handleDeleteTodo}
          loadingTodoIds={loadingTodoIds}
          onCheck={handleCheckBox}
          onUpdate={handleUpdateTodo}
        />

        {todos.length > 0 && (
          <TodoFooter
            active={activeTodos}
            completed={completedTodos}
            status={filterStatus}
            onFilterChange={handleFilterChange}
            filterTypes={filterTypes}
            clearCompleted={handleClearCompleted}
          />
        )}
      </div>

      <ErrorNotification onHide={handleHideBtn} errorMessage={errorMessage} />
    </div>
  );
};
