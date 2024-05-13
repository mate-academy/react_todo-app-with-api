/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import { Todo } from './types/Todo';
import { createTodo, deleteTodo, getTodos, updateTodo } from './api/todos';
import { useEffect } from 'react';
import classNames from 'classnames';
import { TodoItem } from './components/TodoItem';
import { ErrorNotification } from './components/ErrorNotification';
import { Footer } from './components/Footer';
import { FilterStatus } from './types/FilterStatus';

export const App: React.FC = () => {
  const [todos, setTodos] = React.useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = React.useState('');
  const [status, setStatus] = React.useState(FilterStatus.all);
  const [temptTodo, setTemptTodo] = React.useState<Todo | null>(null);
  const [processingIds, setProcessingIds] = React.useState<number[]>([]);

  const inputRef = React.useRef<HTMLInputElement>(null);

  const [title, setTitle] = React.useState('');

  let visibleTodos = todos;
  const activeTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);

  if (status === FilterStatus.active) {
    visibleTodos = activeTodos;
  } else if (status === FilterStatus.completed) {
    visibleTodos = completedTodos;
  }

  useEffect(() => {
    inputRef.current?.focus();

    getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage('Unable to load todos'));
  }, []);

  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    const timerID = setTimeout(() => {
      setErrorMessage('');
    }, 3000);

    return () => clearTimeout(timerID);
  }, [errorMessage]);

  useEffect(() => {
    if (!temptTodo) {
      inputRef.current?.focus();
    }
  }, [temptTodo]);

  const setParams = (todoId: number) => {
    setErrorMessage('');
    setProcessingIds(prevIds => [...prevIds, todoId]);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedTitle = title.trim();

    if (!normalizedTitle) {
      setErrorMessage('Title should not be empty');

      return;
    }

    setTemptTodo({
      id: 0,
      title: normalizedTitle,
      completed: false,
      userId: 0,
    });

    setErrorMessage('');

    createTodo(normalizedTitle)
      .then(todo => {
        setTodos((prevTodos: Todo[]) => [...prevTodos, todo]);
        setTitle('');
      })
      .catch(() => setErrorMessage('Unable to add a todo'))
      .finally(() => setTemptTodo(null));
  };

  const handleDeletingTodo = (todoIdDelete: number) => {
    setParams(todoIdDelete);

    deleteTodo(todoIdDelete)
      .then(() => {
        setTodos(prevTodos =>
          prevTodos.filter(todo => todo.id !== todoIdDelete),
        );
      })
      .catch(() => setErrorMessage('Unable to delete a todo'))
      .finally(() => {
        setProcessingIds(prevIds => prevIds.filter(id => id !== todoIdDelete));
        inputRef.current?.focus();
      });
  };

  const handleClearComplitedTodos = () => {
    completedTodos.forEach(todo => handleDeletingTodo(todo.id));
  };

  const toggleTodo = (todoToUpdate: Todo) => {
    setParams(todoToUpdate.id);

    updateTodo({
      ...todoToUpdate,
      completed: !todoToUpdate.completed,
    })
      .then(updatedTodo => {
        setTodos(prevTodos =>
          prevTodos.map(todo =>
            todo.id === updatedTodo.id ? updatedTodo : todo,
          ),
        );
      })
      .catch(() => setErrorMessage('Unable to update a todo'))
      .finally(() => {
        setProcessingIds(prevIds => {
          return prevIds.filter(id => id !== todoToUpdate.id);
        });
      });
  };

  const toggloAll = () => {
    if (activeTodos.length !== 0) {
      activeTodos.forEach(todo => toggleTodo(todo));
    } else {
      completedTodos.forEach(todo => toggleTodo(todo));
    }
  };

  const renameTodo = (todoRename: Todo, newTitle: string) => {
    setParams(todoRename.id);

    return updateTodo({
      ...todoRename,
      title: newTitle,
    })
      .then(updatedTodo => {
        setTodos(prevTodos =>
          prevTodos.map(todo =>
            todo.id === updatedTodo.id ? updatedTodo : todo,
          ),
        );
      })
      .catch(error => {
        setErrorMessage('Unable to update a todo');
        throw error;
      })
      .finally(() => {
        setProcessingIds(prevIds => {
          return prevIds.filter(id => id !== todoRename.id);
        });
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
                active: activeTodos.length === 0,
              })}
              data-cy="ToggleAllButton"
              onClick={toggloAll}
            />
          )}

          <form onSubmit={handleSubmit}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={title}
              onChange={event => setTitle(event.target.value)}
              ref={inputRef}
              disabled={temptTodo !== null}
            />
          </form>
        </header>

        {todos.length === 0 ? null : (
          <>
            <section className="todoapp__main" data-cy="TodoList">
              {visibleTodos.map(todo => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onDelete={() => handleDeletingTodo(todo.id)}
                  onToggle={() => toggleTodo(todo)}
                  onRename={newTitle => renameTodo(todo, newTitle)}
                  loading={processingIds.includes(todo.id)}
                />
              ))}

              {temptTodo && <TodoItem todo={temptTodo} loading={true} />}
            </section>

            <Footer
              activeTodos={activeTodos}
              completedTodos={completedTodos}
              status={status}
              setStatus={setStatus}
              handleClearComplitedTodos={handleClearComplitedTodos}
            />
          </>
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
