/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Todo } from './types/Todo';
import { Status } from './types/Status';
import { Error } from './types/Error';
import { getTodos } from './api/todos';
import * as todosApi from './api/todos';
import { UserWarning } from './UserWarning';
import { TodoList } from './components/TodoList';
import { TodoItem } from './components/TodoItem';
import { TodoStatus } from './components/TodoStatus';
import { TodoError } from './components/TodoError';
import { USER_ID } from './api/userId';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [status, setStatus] = useState(Status.All);
  const [errorMessage, setErrorMessage] = useState(Error.None);
  const [value, setValue] = useState('');
  const [isSubmiting, setIsSubmiting] = useState(false);
  const [areSubmiting, setAreSubmiting] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deletingIds, setDeletingIds] = useState<number[]>([]);
  // eslint-disable-next-line
  const [togglingId, setTogglingId] = useState<number | null>(null);
  const [wasEdited, setWasEdited] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => setErrorMessage(Error.Load));
  });

  useEffect(() => {
    if (wasEdited) {
      inputRef.current?.focus();
    }
  }, [wasEdited]);

  const visibleTodos = todos.filter(todo => {
    switch (status) {
      case Status.Active:
        return !todo.completed;

      case Status.Completed:
        return todo.completed;

      case Status.All:
      default:
        return true;
    }
  });

  const activeTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);

  function addTodo({ userId, title, completed }: Todo): Promise<void> {
    setErrorMessage(Error.None);
    setWasEdited(false);

    return todosApi.createTodo({ userId, title, completed })
      .then((newTodo: Todo) => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
      })
      .catch(() => {
        setErrorMessage(Error.Add);
      })
      .finally(() => {
        setWasEdited(true);
      });
  }

  const handleSubmit = (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmiting(true);

    const todoTitle = value.trim();

    const newTodo: Todo = {
      id: todos.length + 1,
      title: todoTitle,
      completed: false,
      userId: USER_ID,
    };

    if (!todoTitle) {
      setErrorMessage(Error.EmptyTitle);
      setIsSubmiting(false);
    } else {
      addTodo(newTodo)
        .then(() => setValue(''))
        .finally(() => {
          setTempTodo(null);
          setIsSubmiting(false);
        });
    }
  };

  const onDelete = (todoId: number) => {
    setDeletingIds((ids) => [...ids, todoId]);
    todosApi.deleteTodo(todoId)
      .then(() => setTodos(
        currentTodos => currentTodos.filter(
          todo => todo.id !== todoId,
        ),
      ))
      .catch(() => setErrorMessage(Error.Delete))
      .finally(() => setDeletingIds((ids) => ids.filter(id => id !== todoId)));
  };

  const onDeleteCompleted = () => {
    todos.filter(todo => todo.completed).forEach((todo) => {
      onDelete(todo.id);
    });
  };

  const onToggle = (todoId: number) => {
    const todoToToggle = todos.find((todo) => todo.id === todoId);

    setIsSubmiting(true);
    setTogglingId(todoId);

    if (!todoToToggle) {
      return;
    }

    todosApi.updateTodo(todoId, { completed: !todoToToggle.completed })
      .catch(() => setErrorMessage(Error.Toggle))
      .finally(() => {
        setTogglingId(null);
        setIsSubmiting(false);
      });
  };

  const toggleAll = () => {
    const allTodosAreCompleted = todos.length === completedTodos.length;

    const promiseArray = (allTodosAreCompleted
      ? completedTodos
      : activeTodos).map((todo: { id: number; completed: boolean; }) => {
      return todosApi.updateTodo(todo.id, { completed: !todo.completed });
    });

    setAreSubmiting(true);

    Promise.all(promiseArray)
      .then(() => {
        setTodos(todos.map(todo => (
          { ...todo, completed: !allTodosAreCompleted }
        )));
      })
      .catch(() => setErrorMessage(Error.Toggle))
      .finally(() => setAreSubmiting(false));
  };

  const updateTodo = (todoId: number, data: Todo) => {
    return todosApi.updateTodo(todoId, data)
      .then(receivedTodo => {
        setTodos(todos.map(todo => (todo.id === todoId ? receivedTodo : todo)));
      })
      .catch(() => setErrorMessage(Error.Update))
      .finally(() => {
        setTogglingId(null);
        setIsSubmiting(false);
      });
  };

  function getItemsLeftCountMessage() {
    switch (activeTodos.length) {
      case 1:
        return '1 item left';

      case 0:
        return 'Everything is done';

      default:
        return `${activeTodos.length} items left`;
    }
  }

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
                active: todos.every(todo => todo.completed),
              })}
              onClick={toggleAll}
            />
          )}
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              ref={inputRef}
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={value}
              onChange={(event) => setValue(event.target.value)}
              disabled={isSubmiting}
              onBlur={() => setWasEdited(false)}
            />
          </form>
        </header>

        {!!todos.length && (
          <>
            <TodoList
              todos={visibleTodos}
              onDelete={onDelete}
              deletingIds={deletingIds}
              onToggle={onToggle}
              onUpdate={updateTodo}
              isSubmiting={isSubmiting}
              areSubmiting={areSubmiting}
            />

            {tempTodo && (
              <TodoItem
                tempTodo={tempTodo}
                isSubmiting={isSubmiting}
              />
            )}

            <footer className="todoapp__footer">
              <span className="todo-count">
                {getItemsLeftCountMessage()}
              </span>

              <TodoStatus
                status={status}
                onStatusChange={setStatus}
              />

              <button
                type="button"
                className={classNames('todoapp__clear-completed', {
                  'todoapp__clear-completed--hidden': !completedTodos.length,
                })}
                onClick={onDeleteCompleted}
              >
                Clear completed
              </button>
            </footer>
          </>
        )}
      </div>

      {errorMessage && (
        <TodoError
          error={errorMessage}
          onErrorChange={setErrorMessage}
        />
      )}
    </div>
  );
};

export default App;
