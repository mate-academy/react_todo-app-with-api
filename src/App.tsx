/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  deleteTodos,
  getTodos,
  postTodos,
  updateTodos,
  updateTodosTitle,
  USER_ID,
} from './api/todos';
import { Todo } from './types/Todo';
import { TodoList } from './TodoList';
import classNames from 'classnames';
import { Footer } from './Footer';
import { FilterType } from './types/FilterType';

export const App: React.FC = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filtered, setFiltered] = useState(FilterType.All);
  const [titleTodo, setTitleTodo] = useState('');
  const [inputTodo, setInputTodo] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const inputFocus = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to load todos');
      })
      .finally(() => {
        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
      });
  }, []);

  useEffect(() => {
    if (inputFocus.current && inputTodo) {
      inputFocus.current.focus();
    }
  }, [inputTodo]);

  const filteredTodos = todos.filter(todo => {
    if (filtered === FilterType.Active) {
      return !todo.completed;
    }

    if (filtered === FilterType.Completed) {
      return todo.completed;
    }

    return true;
  });

  const todosCounter = todos.filter(todo => !todo.completed).length;

  const deletePost = (todoId: number): Promise<void> => {
    setInputTodo(false);
    setIsLoading(true);

    return deleteTodos(todoId)
      .then(() =>
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        ),
      )
      .catch(err => {
        setErrorMessage('Unable to delete a todo');

        throw err;
      })
      .finally(() => {
        setInputTodo(true);
        setIsLoading(false);
      });
  };

  const addTodo = ({ userId, title, completed }: Todo) => {
    postTodos({ userId, title, completed })
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
        setTitleTodo('');
      })
      .catch(() => setErrorMessage('Unable to add a todo'))
      .finally(() => {
        setInputTodo(true);
        setTempTodo(null);
      });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!titleTodo.trim()) {
      setErrorMessage('Title should not be empty');

      return;
    }

    const newTempTodo = {
      id: 0,
      userId: USER_ID,
      title: titleTodo.trim(),
      completed: false,
    };

    setTempTodo(newTempTodo);

    setInputTodo(false);

    addTodo(newTempTodo);
  };

  const handleTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitleTodo(event.target.value);
  };

  const handleErrorClose = () => {
    setErrorMessage('');
  };

  const handleClearCompleted = () => {
    todos.map(todo => {
      if (todo.completed === true) {
        deletePost(todo.id);
      }
    });
  };

  const onSelect = (selectedTodo: Todo) => {
    setIsLoading(true);
    updateTodos(selectedTodo)
      .then(newTodo => {
        setTodos(currentTodos => {
          const newTodos = [...currentTodos];
          const index = newTodos.findIndex(todo => todo.id === selectedTodo.id);

          newTodos.splice(index, 1, newTodo);

          return newTodos;
        });
      })
      .catch(() => setErrorMessage('Unable to update a todo'))
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleToggleAll = () => {
    const notMixed = todosCounter === 0 || todosCounter === todos.length;

    todos.map(todo => {
      if (!notMixed) {
        if (!todo.completed) {
          return onSelect(todo);
        }

        return;
      }

      return onSelect(todo);
    });
  };

  const onEdit = (editTodo: Todo, editTitle: string) => {
    const newTitle = editTitle.trim();

    setIsLoading(true);

    if (newTitle === '') {
      return deleteTodos(editTodo.id)
        .then(() =>
          setTodos(currentTodos =>
            currentTodos.filter(todo => todo.id !== editTodo.id),
          ),
        )
        .catch(err => {
          setErrorMessage('Unable to delete a todo');

          throw err;
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      return updateTodosTitle(editTodo, newTitle)
        .then(newTodo => {
          setTodos(currentTodos => {
            const newTodos = [...currentTodos];
            const index = newTodos.findIndex(todo => todo.id === editTodo.id);

            newTodos.splice(index, 1, newTodo);

            return newTodos;
          });
        })
        .catch(err => {
          setErrorMessage('Unable to update a todo');

          throw err;
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this button should have `active` class only if all todos are completed */}
          {!!todos.length && (
            <button
              type="button"
              className={classNames('todoapp__toggle-all', {
                active: todosCounter === 0,
              })}
              data-cy="ToggleAllButton"
              onClick={handleToggleAll}
            />
          )}

          {/* Add a todo on form submit */}
          <form onSubmit={handleSubmit}>
            <input
              data-cy="NewTodoField"
              type="text"
              value={titleTodo}
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              onChange={handleTitle}
              ref={inputFocus}
              disabled={!inputTodo}
            />
          </form>
        </header>

        <TodoList
          inputFocus={inputFocus}
          onEdit={onEdit}
          onSelect={onSelect}
          isLoading={isLoading}
          tempTodo={tempTodo}
          onDelete={deletePost}
          todos={filteredTodos}
        />

        {/* Hide the footer if there are no todos */}
        {!!todos.length && (
          <Footer
            todosCounter={todosCounter}
            filtered={filtered}
            setFiltered={setFiltered}
            HandleClearCompleted={handleClearCompleted}
            todos={todos}
          />
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
          onClick={handleErrorClose}
          type="button"
          className="delete"
        />
        {/* show only one message at a time */}
        {errorMessage}
      </div>
    </div>
  );
};
