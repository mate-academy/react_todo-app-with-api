/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
} from 'react';
import classNames from 'classnames';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import * as postService from './api/todos';
import { ErrorType } from './types/Errors';
import { StatusFilter } from './types/StatusFilter';

const USER_ID = 11636;

export const App: React.FC = () => {
  const [textTodo, setTextTodo] = useState('');
  const [status, setStatus] = useState<StatusFilter>(StatusFilter.ALL);
  const [todos, setTodos] = useState<Todo[] | []>([]);
  const [error, setError] = useState<ErrorType | null>(null);
  const [statusResponse, setStatusResponse] = useState(false);
  const [todoItem, setTodoItem] = useState<Todo | null>(null);
  const [currentTodoLoading, setCurrentTodoLoading] = useState<number[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredTodos = useMemo(() => {
    if (status === StatusFilter.ALL) {
      return todos;
    }

    return todos.filter(({ completed }) => {
      if (status === StatusFilter.ACTIVE) {
        return !completed;
      }

      return completed;
    });
  }, [todos, status]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setError(null);
    }, 3000);

    return () => clearTimeout(timer);
  }, [error]);

  useEffect(() => {
    setStatusResponse(true);
    postService.getTodos(USER_ID)
      .then(todo => {
        setTodos(todo);
      })
      .catch(() => {
        setError(ErrorType.UnableToLoadTodos);
      }).finally(() => {
        setStatusResponse(false);
      });
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const handleTextUpdate = (todoId: number) => {
    const clickedTodo = todos.find((todo) => todo.id === todoId);

    if (clickedTodo) {
      setCurrentTodoLoading(prev => {
        return [...prev, todoId];
      });
      postService.updateTodo({
        id: todoId,
        completed: !clickedTodo.completed,
      })
        .then((response) => {
          setTodos(prevTodos => {
            return prevTodos.map((todo) => {
              if (todo.id === response.id) {
                return response as Todo;
              }

              return todo;
            });
          });
        })
        .catch(() => {
          setError(ErrorType.UnableToUpdateTodo);
        })
        .finally(() => {
          setCurrentTodoLoading(current => current.filter((
            id: number,
          ) => id !== todoId));
        });
    }
  };

  const deleteTodo = (todo: Todo) => {
    setStatusResponse(true);
    setCurrentTodoLoading(current => [...current, todo.id]);

    postService.deleteTodo(todo.id)
      .then(() => {
        setTodos(
          prevTodos => [...prevTodos].filter(item => item.id !== todo.id),
        );
      })
      .catch((err) => {
        setError(ErrorType.UnableToDeleteTodo);
        throw err;
      });
  };

  const clearComponent = () => {
    todos.forEach(todo => {
      if (todo.completed) {
        deleteTodo(todo);
      }
    });
  };

  const addTodo = (event: React.FormEvent<Element>) => {
    event.preventDefault();

    if (!textTodo.trim()) {
      setError(ErrorType.EmptyText);

      return;
    }

    const newTodos = {
      id: 0,
      userId: USER_ID,
      title: textTodo.trim(),
      completed: false,
    };

    setTodoItem(newTodos);
    setStatusResponse(true);

    postService.createTodo(newTodos)
      .then(newTodo => {
        setTextTodo('');
        setTodos(currentTodo => [...currentTodo, newTodo]);
      })
      .catch(() => {
        setError(ErrorType.UnableToAddTodo);
      })
      .finally(() => {
        setTodoItem(null);
        setStatusResponse(false);
      });
  };

  const changeFilterStatus = (type: StatusFilter) => {
    setStatus(type);
  };

  const completedTodo = todos.filter(todo => !todo.completed);

  const toggleAll = async () => {
    setStatusResponse(true);

    try {
      const allCompleted = todos.every((todo) => todo.completed);

      const todosToUpdate = todos.filter((todo) => !todo.completed);

      const updatedTodos = todosToUpdate.map((todo) => ({
        ...todo,
        completed: !allCompleted,
      }));

      await Promise.all(
        updatedTodos.map(async (todo) => {
          await postService.updateTodo(todo);
        }),
      );

      const newTodos = todos.map((todo) => {
        const updatedTodo = updatedTodos.find(
          (updated) => updated.id === todo.id,
        );

        return updatedTodo || todo;
      });

      setTodos(newTodos);
    } finally {
      setStatusResponse(false);
    }
  };

  const handleEdit = async (todo: Todo) => {
    setCurrentTodoLoading(current => [...current, todo.id]);
    try {
      const actualTodo = await
      postService.updateTodo(todo);

      setTodos((prev) => prev.map((event) => (todo.id === event.id
        ? actualTodo as Todo
        : event
      )));
    } catch (err) {
      setError(ErrorType.UnableToUpdateTodo);
    } finally {
      setCurrentTodoLoading(current => current.filter((
        id: number,
      ) => id !== todo.id));
    }
  };

  const isAllCompleted = todos.length > 0
  && todos.every((todo) => todo.completed);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length && (
            // eslint-disable-next-line jsx-a11y/control-has-associated-label
            <button
              type="button"
              className={`todoapp__toggle-all ${isAllCompleted ? '' : 'active'}`}
              data-cy="ToggleAllButton"
              aria-label="toggle all active"
              onClick={toggleAll}
            />
          )}

          <form onSubmit={addTodo}>
            <input
              disabled={statusResponse}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={textTodo}
              onChange={(event) => {
                setTextTodo(event.target.value);
              }}
              ref={inputRef}
            />
          </form>
        </header>

        {filteredTodos.length > 0 && (
          <TodoList
            currentTodoLoading={currentTodoLoading}
            todoItem={todoItem}
            todos={filteredTodos}
            deleteTodo={deleteTodo}
            handleTextUpdate={handleTextUpdate}
            handleToggleComplete={handleEdit}
          />
        )}

        {todos.length > 0 && (
          <Footer
            status={status}
            todos={completedTodo}
            clearCompleted={clearComponent}
            changeFilterStatus={changeFilterStatus}
          />
        )}

      </div>

      {/* Notification is shown in case of any error */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <div
        data-cy="ErrorNotification"
        className={classNames(
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
          onClick={() => setError(null)}
        />
        {error}
      </div>
    </div>
  );
};
