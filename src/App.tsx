import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { ErrorType } from './types/ErrorType';
import { StatusFilter } from './types/StatusFilter';
import { TodoList } from './components/TodoList';
import { TodoFilter } from './components/TodoFilter';
import { TodoItem } from './components/TodoItem';
import * as todoService from './api/todos';
import { getFilterTodos } from './utils/getFilterTodos';

const USER_ID = 11465;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<StatusFilter>(StatusFilter.All);
  const [todoError, setTodoError] = useState<ErrorType | null>(null);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isRequesting, setIsRequesting] = useState(false);
  const [processingTodoIds, setProcessingTodoIds] = useState<number[]>([0]);

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setIsLoading(true);

    todoService.getTodos(USER_ID)
      .then(todoFromServer => {
        setTodos(todoFromServer);
        setIsLoading(false);
      })
      .catch(error => {
        // eslint-disable-next-line no-console
        console.warn(error);
        setTodoError(ErrorType.GetData);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setTodoError(null);
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [todos, tempTodo]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const visibleTodos = getFilterTodos(todos, status);
  const countActiveTodos = todos
    .filter(todo => todo.completed === false)
    .length;
  const countCompletedTodos = todos
    .filter(todo => todo.completed)
    .length;

  const handleStatusChange = (filteredKey: StatusFilter) => {
    setStatus(filteredKey);
  };

  const showError = (error: ErrorType) => {
    setTodoError(error);

    setTimeout(() => {
      setTodoError(null);
    }, 3000);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!newTodoTitle.trim()) {
      showError(ErrorType.Title);
    } else {
      const newTodo = {
        title: newTodoTitle.trim(),
        userId: USER_ID,
        completed: false,
      };

      const temp: Todo = Object.assign(newTodo, { id: 0 });

      setTempTodo(temp);
      todoService.addTodo(newTodo)
        .then((createdTodo) => {
          setTodos((prevState) => [...prevState, createdTodo]);
          setNewTodoTitle('');
        })
        .catch(() => {
          showError(ErrorType.Add);
        })
        .finally(() => {
          setIsRequesting(false);
          setTempTodo(null);
        });

      setIsRequesting(true);
    }
  };

  const handleDeleteTodo = (todoId: number) => {
    setProcessingTodoIds(prevState => [...prevState, todoId]);
    todoService.deleteTodo(todoId)
      .then(() => {
        setTodos((prevState) => {
          return prevState.filter(todo => todo.id !== todoId);
        });
      })
      .catch(() => {
        showError(ErrorType.Delete);
      })
      .finally(() => {
        return setProcessingTodoIds(prevState => prevState
          .filter(id => id !== todoId));
      });
  };

  const handleStatusUpdate = (todo: Todo) => {
    setProcessingTodoIds(prevState => [...prevState, todo.id]);
    todoService.updateTodo({
      id: todo.id,
      title: todo.title,
      userId: USER_ID,
      completed: !todo.completed,
    })
      .then(updatedTodo => setTodos(prevState => {
        return prevState.map(currentTodo => {
          return currentTodo.id !== updatedTodo.id
            ? currentTodo
            : updatedTodo;
        });
      }))
      .catch(() => {
        showError(ErrorType.Update);
      })
      .finally(() => {
        setProcessingTodoIds(prevState => prevState
          .filter(id => id !== todo.id));
      });
  };

  const handleTitleUpdate = (todo: Todo, updatedTitle: string) => {
    setProcessingTodoIds(prevState => [...prevState, todo.id]);

    return todoService.updateTodo({
      id: todo.id,
      title: updatedTitle,
      userId: USER_ID,
      completed: todo.completed,
    })
      .then(updatedTodo => {
        setTodos(prevState => {
          return prevState.map(currentTodo => {
            return currentTodo.id !== updatedTodo.id
              ? currentTodo
              : updatedTodo;
          });
        });
      })
      .catch((error) => {
        showError(ErrorType.Update);
        throw error;
      })
      .finally(() => {
        return setProcessingTodoIds(prevState => prevState
          .filter(id => id !== todo.id));
      });
  };

  const handleClearCompleted = () => {
    const allCompletedTodos = todos.filter(todo => todo.completed);

    allCompletedTodos.forEach(todo => {
      handleDeleteTodo(todo.id);
    });
  };

  const handleChangeTodoTitle = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setNewTodoTitle(event.target.value);
  };

  const handleToggleTodo = () => {
    if (countCompletedTodos !== todos.length) {
      const activeTodos = todos.filter(todo => !todo.completed);

      activeTodos.forEach(handleStatusUpdate);
    } else {
      todos.forEach(handleStatusUpdate);
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {!!todos.length && (
            <button
              type="button"
              className={classNames('todoapp__toggle-all',
                { active: !countActiveTodos })}
              data-cy="ToggleAllButton"
              onClick={handleToggleTodo}
              aria-label="ToggleAllButton"
            />
          )}

          <form onSubmit={handleSubmit}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              ref={inputRef}
              value={newTodoTitle}
              onChange={handleChangeTodoTitle}
              disabled={isRequesting}
            />
          </form>
        </header>

        {!isLoading && (
          <>
            <TodoList
              todos={visibleTodos}
              handleDeleteTodo={handleDeleteTodo}
              handleStatusUpdate={handleStatusUpdate}
              handleTitleUpdate={handleTitleUpdate}
              processingTodoIds={processingTodoIds}
            />
            {tempTodo && (
              <TodoItem
                todo={tempTodo}
                handleDeleteTodo={handleDeleteTodo}
                handleStatusUpdate={handleStatusUpdate}
                handleTitleUpdate={handleTitleUpdate}
                isProcessing={processingTodoIds.includes(tempTodo.id)}
              />
            )}
            {!!todos.length && (
              <TodoFilter
                status={status}
                handleStatusChange={handleStatusChange}
                countActiveTodos={countActiveTodos}
                countCompletedTodos={countCompletedTodos}
                handleClearCompleted={handleClearCompleted}
              />
            )}
          </>
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification',
          'is-danger',
          'is-light',
          'has-text-weight-normal',
          { hidden: !todoError },
        )}
      >

        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setTodoError(null)}
          aria-label="HideErrorButton"
        />
        {todoError}
      </div>
    </div>
  );
};
