/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect, useMemo } from 'react';
import classNames from 'classnames';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import {
  USER_ID,
  getTodos,
  addTodo,
  deleteTodo,
  updateTodo,
} from './api/todos';
import { TodoList } from './components/TodoList';
import { Filter, FilterStatus } from './components/Filter';
import { NewTodoForm } from './components/NewTodoForm';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [filter, setFilter] = useState<FilterStatus>(FilterStatus.All);
  const [title, setTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [processingIds, setProcessingIds] = useState<number[]>([]);
  const [focusTrigger, setFocusTrigger] = useState(0);

  const showErrorMessage = (message: string) => {
    setErrorMessage(message);
    setTimeout(() => setErrorMessage(''), 3000);
  };

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        showErrorMessage('Unable to load todos');
      });
  }, []);

  const visibleTodos = useMemo(() => {
    return todos.filter(todo => {
      switch (filter) {
        case FilterStatus.Active:
          return !todo.completed;
        case FilterStatus.Completed:
          return todo.completed;
        default:
          return true;
      }
    });
  }, [todos, filter]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      showErrorMessage('Title should not be empty');

      return;
    }

    setIsSubmitting(true);

    setTempTodo({
      id: 0,
      title: trimmedTitle,
      userId: USER_ID,
      completed: false,
    });

    addTodo({
      title: trimmedTitle,
      userId: USER_ID,
      completed: false,
    })
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
        setTitle('');
      })
      .catch(() => {
        showErrorMessage('Unable to add a todo');
      })
      .finally(() => {
        setTempTodo(null);
        setIsSubmitting(false);
      });
  };

  const handleDelete = (todoId: number) => {
    setProcessingIds(current => [...current, todoId]);

    deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(() => {
        showErrorMessage('Unable to delete a todo');
      })
      .finally(() => {
        setProcessingIds(current => current.filter(id => id !== todoId));
        setFocusTrigger(current => current + 1);
      });
  };

  const handleClearCompleted = () => {
    const completedIds = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    setProcessingIds(current => [...current, ...completedIds]);

    Promise.allSettled(
      completedIds.map(id => deleteTodo(id).then(() => id)),
    ).then(results => {
      const deletedIds: number[] = [];
      let hasError = false;

      results.forEach(result => {
        if (result.status === 'fulfilled') {
          deletedIds.push(result.value);
        } else {
          hasError = true;
        }
      });

      setTodos(currentTodos =>
        currentTodos.filter(todo => !deletedIds.includes(todo.id)),
      );

      if (hasError) {
        showErrorMessage('Unable to delete a todo');
      }

      setProcessingIds(current =>
        current.filter(id => !completedIds.includes(id)),
      );
      setFocusTrigger(current => current + 1);
    });
  };

  const handleToggle = (todo: Todo) => {
    setProcessingIds(current => [...current, todo.id]);

    updateTodo({ ...todo, completed: !todo.completed })
      .then(updatedTodo => {
        setTodos(currentTodos =>
          currentTodos.map(t => (t.id === updatedTodo.id ? updatedTodo : t)),
        );
      })
      .catch(() => {
        showErrorMessage('Unable to update a todo');
      })
      .finally(() => {
        setProcessingIds(current => current.filter(id => id !== todo.id));
      });
  };

  const handleRename = (todo: Todo, newTitle: string) => {
    setProcessingIds(current => [...current, todo.id]);

    return updateTodo({ ...todo, title: newTitle })
      .then(updatedTodo => {
        setTodos(currentTodos =>
          currentTodos.map(t => (t.id === updatedTodo.id ? updatedTodo : t)),
        );
      })
      .catch(error => {
        showErrorMessage('Unable to update a todo');

        throw error;
      })
      .finally(() => {
        setProcessingIds(current => current.filter(id => id !== todo.id));
      });
  };

  const handleToggleAll = () => {
    const allCompleted = todos.every(todo => todo.completed);
    const targetStatus = !allCompleted;

    const todosToUpdate = todos.filter(todo => todo.completed !== targetStatus);
    const idsToUpdate = todosToUpdate.map(todo => todo.id);

    setProcessingIds(current => [...current, ...idsToUpdate]);

    Promise.allSettled(
      todosToUpdate.map(todo =>
        updateTodo({ ...todo, completed: targetStatus }),
      ),
    ).then(results => {
      const updatedTodos: Todo[] = [];
      let hasError = false;

      results.forEach(result => {
        if (result.status === 'fulfilled') {
          updatedTodos.push(result.value);
        } else {
          hasError = true;
        }
      });

      setTodos(currentTodos =>
        currentTodos.map(todo => {
          const updated = updatedTodos.find(u => u.id === todo.id);

          return updated ?? todo;
        }),
      );

      if (hasError) {
        showErrorMessage('Unable to update a todo');
      }

      setProcessingIds(current =>
        current.filter(id => !idsToUpdate.includes(id)),
      );
    });
  };

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
              onClick={handleToggleAll}
            />
          )}

          <NewTodoForm
            title={title}
            onTitleChange={setTitle}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            focusTrigger={focusTrigger}
          />
        </header>

        {(todos.length > 0 || tempTodo) && (
          <>
            <TodoList
              todos={visibleTodos}
              tempTodo={tempTodo}
              processingIds={processingIds}
              onDelete={handleDelete}
              onToggle={handleToggle}
              onRename={handleRename}
            />

            <footer className="todoapp__footer" data-cy="Footer">
              <span className="todo-count" data-cy="TodosCounter">
                {todos.filter(todo => !todo.completed).length} items left
              </span>

              <Filter filter={filter} onFilterChange={setFilter} />

              <button
                type="button"
                className="todoapp__clear-completed"
                data-cy="ClearCompletedButton"
                disabled={!todos.some(todo => todo.completed)}
                onClick={handleClearCompleted}
              >
                Clear completed
              </button>
            </footer>
          </>
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !errorMessage },
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
