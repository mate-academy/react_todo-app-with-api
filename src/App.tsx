/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */

import React, { useEffect, useState } from 'react';
import cn from 'classnames';

import { UserWarning } from './UserWarning';
import {
  addTodos,
  changeTodos,
  deleteTodos,
  editTodos,
  getTodos,
  USER_ID,
} from './api/todos';

import { FilterType, Todo } from './types/Todo';

import { NewTodo } from './components/NewTodo/NewTodo';
import { TodoList } from './components/TodoList/TodoList';
import { Filter } from './components/Filter/Filter';
import { Todo as TodoComp } from './components/Todo/Todo';

export const App: React.FC = () => {
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState('');
  const [title, setTitle] = useState('');
  const [edit, setEdit] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');

  const [loadingTodoId, setLoadingTodoId] = useState<number | null>(null);
  const [loadingAdd, setLoadingAdd] = useState(false);
  const [loadingClear, setLoadingClear] = useState(false);
  const [loadingToggleAll, setLoadingToggleAll] = useState(false);

  const showError = (message: string) => {
    setError(message);

    setTimeout(() => {
      setError('');
    }, 3000);
  };

  const hideError = () => {
    setError('');
  };

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        showError('Unable to load todos');
      });
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

  const toggleTodo = (todo: Todo) => {
    if (
      loadingTodoId !== null ||
      loadingAdd ||
      loadingClear ||
      loadingToggleAll
    ) {
      return;
    }

    hideError();
    setLoadingTodoId(todo.id);

    changeTodos(todo)
      .then(updatedTodo => {
        setTodos(currentTodos =>
          currentTodos.map(currentTodo =>
            currentTodo.id === updatedTodo.id ? updatedTodo : currentTodo,
          ),
        );
      })
      .catch(() => {
        showError('Unable to update a todo');
      })
      .finally(() => {
        setLoadingTodoId(null);
      });
  };

  const handleToggleAll = () => {
    if (
      loadingTodoId !== null ||
      loadingAdd ||
      loadingClear ||
      loadingToggleAll ||
      todos.length === 0
    ) {
      return;
    }

    const shouldCompleteAll = todos.some(todo => !todo.completed);

    const todosToChange = todos.filter(
      todo => todo.completed !== shouldCompleteAll,
    );

    hideError();
    setLoadingToggleAll(true);

    Promise.all(todosToChange.map(todo => changeTodos(todo)))
      .then(updatedTodos => {
        setTodos(currentTodos =>
          currentTodos.map(todo => {
            const updatedTodo = updatedTodos.find(
              updated => updated.id === todo.id,
            );

            return updatedTodo || todo;
          }),
        );
      })
      .catch(() => {
        showError('Unable to update todos');
      })
      .finally(() => {
        setLoadingToggleAll(false);
      });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      showError('Title should not be empty');

      return;
    }

    if (
      loadingTodoId !== null ||
      loadingAdd ||
      loadingClear ||
      loadingToggleAll
    ) {
      return;
    }

    const newTodo = {
      id: Math.floor(Math.random() * 1000),
      title: trimmedTitle,
      completed: false,
      userId: USER_ID,
    };

    setTempTodo(newTodo);
    hideError();
    setLoadingAdd(true);

    addTodos(trimmedTitle)
      .then(createdTodo => {
        setTodos(currentTodos => [...currentTodos, createdTodo]);
        setTitle('');
      })
      .catch(() => {
        showError('Unable to add a todo');
      })
      .finally(() => {
        setTempTodo(null);
        setLoadingAdd(false);

        setTimeout(() => {
          document
            .querySelector<HTMLInputElement>('[data-cy="NewTodoField"]')
            ?.focus();
        }, 0);
      });
  };

  const handleEditClick = (todo: Todo) => {
    if (
      loadingTodoId !== null ||
      loadingAdd ||
      loadingClear ||
      loadingToggleAll
    ) {
      return;
    }

    hideError();
    setEditTitle(todo.title);
    setEdit(todo.id);
  };

  const handleEdit = (todo: Todo) => {
    if (
      loadingTodoId !== null ||
      loadingAdd ||
      loadingClear ||
      loadingToggleAll
    ) {
      return;
    }

    const trimmedTitle = editTitle.trim();

    if (trimmedTitle === todo.title) {
      setEdit(null);
      setEditTitle('');

      return;
    }

    hideError();
    setLoadingTodoId(todo.id);

    if (!trimmedTitle) {
      deleteTodos(todo)
        .then(() => {
          setTodos(currentTodos =>
            currentTodos.filter(currentTodo => currentTodo.id !== todo.id),
          );
          setEdit(null);
          setEditTitle('');
        })
        .catch(() => {
          showError('Unable to delete a todo');
        })
        .finally(() => {
          setLoadingTodoId(null);
        });

      return;
    }

    editTodos(todo, trimmedTitle)
      .then(updatedTodo => {
        setTodos(currentTodos =>
          currentTodos.map(currentTodo =>
            currentTodo.id === updatedTodo.id ? updatedTodo : currentTodo,
          ),
        );
        setEdit(null);
        setEditTitle('');
      })
      .catch(() => {
        showError('Unable to update a todo');
      })
      .finally(() => {
        setLoadingTodoId(null);
      });
  };

  const handleDelete = (todo: Todo) => {
    if (
      loadingTodoId !== null ||
      loadingClear ||
      loadingAdd ||
      loadingToggleAll
    ) {
      return;
    }

    hideError();
    setLoadingTodoId(todo.id);

    deleteTodos(todo)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(currentTodo => currentTodo.id !== todo.id),
        );
      })
      .catch(() => {
        showError('Unable to delete a todo');
      })
      .finally(() => {
        setLoadingTodoId(null);

        setTimeout(() => {
          document
            .querySelector<HTMLInputElement>('[data-cy="NewTodoField"]')
            ?.focus();
        }, 0);
      });
  };

  const handleClearCompleted = () => {
    if (
      loadingClear ||
      loadingTodoId !== null ||
      loadingAdd ||
      loadingToggleAll
    ) {
      return;
    }

    const completedTodos = todos.filter(todo => todo.completed);

    if (completedTodos.length === 0) {
      return;
    }

    hideError();
    setLoadingClear(true);

    Promise.allSettled(completedTodos.map(todo => deleteTodos(todo)))
      .then(results => {
        const successfulIds = completedTodos
          .filter((_, index) => results[index].status === 'fulfilled')
          .map(todo => todo.id);

        setTodos(currentTodos =>
          currentTodos.filter(todo => !successfulIds.includes(todo.id)),
        );

        if (results.some(result => result.status === 'rejected')) {
          showError('Unable to delete a todo');
        }
      })
      .finally(() => {
        setLoadingClear(false);

        setTimeout(() => {
          document
            .querySelector<HTMLInputElement>('[data-cy="NewTodoField"]')
            ?.focus();
        }, 0);
      });
  };

  const handleFilter = (
    event: React.MouseEvent<HTMLAnchorElement>,
    newFilter: FilterType,
  ) => {
    event.preventDefault();
    setFilter(newFilter);
  };

  const allCompleted = todos.length > 0 && todos.every(todo => todo.completed);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length > 0 && (
            <button
              type="button"
              className={cn('todoapp__toggle-all', {
                active: allCompleted,
              })}
              data-cy="ToggleAllButton"
              onClick={handleToggleAll}
              disabled={
                loadingTodoId !== null ||
                loadingAdd ||
                loadingClear ||
                loadingToggleAll
              }
            />
          )}

          <NewTodo
            title={title}
            setTitle={setTitle}
            handleSubmit={handleSubmit}
            loadingAdd={loadingAdd}
          />
        </header>

        {todos.length > 0 && (
          <TodoList
            edit={edit}
            editTitle={editTitle}
            visibleTodos={visibleTodos}
            toggleTodo={toggleTodo}
            loadingTodoId={loadingTodoId}
            loadingClear={loadingClear}
            handleEdit={handleEdit}
            setEditTitle={setEditTitle}
            handleEditClick={handleEditClick}
            handleDelete={handleDelete}
            setEdit={setEdit}
          />
        )}

        {tempTodo && (
          <TodoComp
            todo={tempTodo}
            edit={edit}
            editTitle={editTitle}
            toggleTodo={toggleTodo}
            loadingTodoId={loadingAdd ? tempTodo.id : null}
            loadingClear={loadingClear}
            handleEdit={handleEdit}
            setEditTitle={setEditTitle}
            handleEditClick={handleEditClick}
            handleDelete={handleDelete}
            setEdit={setEdit}
          />
        )}

        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {activeTodosCount} items left
            </span>

            <Filter filter={filter} handleFilter={handleFilter} />

            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              disabled={
                !todos.some(todo => todo.completed) ||
                loadingClear ||
                loadingToggleAll
              }
              onClick={handleClearCompleted}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={cn(
          'notification is-danger is-light has-text-weight-normal',
          {
            hidden: !error,
          },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={hideError}
        />

        {error}
      </div>
    </div>
  );
};
