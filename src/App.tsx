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
import { TodoList } from './components/TodoList';
import { Todo } from './types/Todo';
import classNames from 'classnames';
import { Footer } from './components/Footer';
import { Filter } from './utils/Enums';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>(todos);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingTodoIds, setLoadingTodoIds] = useState<Set<number>>(new Set());
  const [errorMessage, setErrorMessage] = useState('');
  const [filter, setFilter] = useState(Filter.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [titleEditingId, setTitleEditingId] = useState<null | number>(null);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const completedTodos = todos.filter(todo => todo.completed);
  const notCompletedTodos = todos.filter(todo => !todo.completed);

  // eslint-disable-next-line @typescript-eslint/no-shadow
  const filterTodos = (todos: Todo[], filter: string) => {
    const todosCopy = [...todos];

    return todosCopy.filter(todo => {
      switch (filter) {
        case Filter.Active:
          return !todo.completed;

        case Filter.Completed:
          return todo.completed;

        default:
          return true;
      }
    });
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [loading]);

  useEffect(() => {
    setFilteredTodos(() => filterTodos(todos, filter));
  }, [filter, todos]);

  useEffect(() => {
    setErrorMessage('');
    setLoading(true);

    getTodos()
      .then(setTodos)
      .catch(error => {
        setErrorMessage('Unable to load todos');

        throw error;
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setErrorMessage('');
    }, 3000);

    return () => clearTimeout(timerId);
  }, [errorMessage]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage('');
    setTitle(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage('');

    if (title.trim().length === 0) {
      setErrorMessage('Title should not be empty');

      return;
    }

    setTempTodo({
      id: 0,
      userId: 2391,
      title: title.trim(),
      completed: false,
    });

    setLoading(true);
    setLoadingTodoIds(prev => new Set(prev).add(0));
    createTodo({ title: title.trim(), completed: false })
      .then(newTodo => {
        setTempTodo(null);

        setTodos(currentTodos => [...currentTodos, newTodo]);
        setTitle('');
      })
      .catch(error => {
        setErrorMessage('Unable to add a todo');
        throw error;
      })
      .finally(() => {
        setLoading(false);
        setLoadingTodoIds(prevSet => {
          const newSet = new Set(prevSet);

          newSet.delete(0);

          return newSet;
        });
        setTempTodo(null);
      });
  };

  const onDeleteTodo = (todoId: number) => {
    setErrorMessage('');
    setLoading(true);
    setLoadingTodoIds(prev => new Set(prev).add(todoId));

    deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(error => {
        setErrorMessage('Unable to delete a todo');
        throw error;
      })
      .finally(() => {
        setLoading(false);
        setLoadingTodoIds(prevSet => {
          const newSet = new Set(prevSet);

          newSet.delete(todoId);

          return newSet;
        });
      });
  };

  const clearCompletedTodos = () => {
    completedTodos.forEach(todo => {
      onDeleteTodo(todo.id);
    });
  };

  const onToggle = (todo: Todo) => {
    setErrorMessage('');
    setLoadingTodoIds(prev => new Set(prev).add(todo.id));

    updateTodo({ ...todo, completed: !todo.completed })
      .then(updatedTodo => {
        setTodos(prevTodos =>
          prevTodos.map(t => (t.id === updatedTodo.id ? updatedTodo : t)),
        );
      })
      .catch(error => {
        setErrorMessage('Unable to update a todo');
        throw error;
      })
      .finally(() => {
        setLoadingTodoIds(prevSet => {
          const newSet = new Set(prevSet);

          newSet.delete(todo.id);

          return newSet;
        });
      });
  };

  const toggleAll = () => {
    const shouldCompleteAll = todos.some(todo => !todo.completed);

    const todoToUpdate = todos.filter(
      todo => todo.completed !== shouldCompleteAll,
    );

    if (todoToUpdate.length === 0) {
      return;
    }

    setErrorMessage('');
    setLoadingTodoIds(prev => {
      const newSet = new Set(prev);

      todoToUpdate.forEach(todo => newSet.add(todo.id));

      return newSet;
      // new Set([...prev, ...todoToUpdate.map(t => t.id)])
    });

    Promise.all(
      todoToUpdate.map(todo => {
        return updateTodo({ ...todo, completed: shouldCompleteAll });
      }),
    )
      .then(updatedTodos => {
        setTodos(currentTodos =>
          currentTodos.map(
            todo =>
              updatedTodos.find(updated => updated.id === todo.id) || todo,
          ),
        );
      })
      .catch(error => {
        setErrorMessage('Unable to update todos');
        throw error;
      })
      .finally(() => {
        setLoadingTodoIds(prevSet => {
          const newSet = new Set(prevSet);

          todoToUpdate.forEach(todo => newSet.delete(todo.id));

          return newSet;
        });
      });
  };

  const editTodo = (todo: Todo, newTodoTitle: string) => {
    if (todo.title === newTodoTitle) {
      setTitleEditingId(null);

      return;
    }

    if (newTodoTitle.length === 0) {
      onDeleteTodo(todo.id);

      return;
    }

    setLoadingTodoIds(prev => new Set(prev).add(todo.id));
    updateTodo({ ...todo, title: newTodoTitle })
      .then(updatedTodo => {
        setTodos(currentTodos =>
          currentTodos.map(t => (t.id === updatedTodo.id ? updatedTodo : t)),
        );
        setTitleEditingId(null);
      })
      .catch(error => {
        setErrorMessage('Unable to update a todo');
        setTitleEditingId(todo.id);
        throw error;
      })
      .finally(() => {
        setLoadingTodoIds(prevSet => {
          const newSet = new Set(prevSet);

          newSet.delete(todo.id);

          return newSet;
        });
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
          {todos.length !== 0 && (
            <button
              type="button"
              className={classNames('todoapp__toggle-all', {
                active: completedTodos.length === todos.length,
              })}
              data-cy="ToggleAllButton"
              onClick={toggleAll}
            />
          )}

          <form onSubmit={handleSubmit}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={title}
              onChange={handleChange}
              ref={inputRef}
              disabled={loading}
            />
          </form>
        </header>

        {todos.length !== 0 && (
          <TodoList
            todos={filteredTodos}
            tempTodo={tempTodo}
            onDeleteTodo={onDeleteTodo}
            loadingTodoIds={loadingTodoIds}
            onToggle={onToggle}
            editTodo={editTodo}
            titleEditingId={titleEditingId}
            setTitleEditingId={setTitleEditingId}
          />
        )}

        {todos.length !== 0 && (
          <Footer
            filter={filter}
            setFilter={setFilter}
            completedTodos={completedTodos}
            notCompletedTodos={notCompletedTodos}
            clearCompletedTodos={clearCompletedTodos}
          />
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
