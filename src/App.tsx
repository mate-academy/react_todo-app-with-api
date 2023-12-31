import React, {
  useEffect, useMemo, useRef, useState,
} from 'react';
import cn from 'classnames';
import { UserWarning } from './UserWarning';
import * as todosService from './api/todos';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList/TodoList';
import { TodoFooter } from './components/TodoFooter/TodoFooter';
import { Status } from './types/Status';
import { ErrorNotification } from './components/ErrorNotification';
import { filteredTodos } from './helpers';

const USER_ID = 12042;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>(Status.All);
  const [todoTitle, setTodoTitle] = useState<string>('');
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const titleRef = useRef<HTMLInputElement>(null);

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
    setTimeout(() => {
      setError(null);
    }, 3000);
  };

  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.focus();
    }
  }, [todos]);

  useEffect(() => {
    todosService.getTodos(USER_ID)
      .then(setTodos)
      .catch(() => (handleError('Unable to load todos')));
  }, []);

  const visibleTodos = useMemo(() => {
    return filteredTodos(todos, status);
  }, [status, todos]);

  const createTodo = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedTitle = todoTitle.trim();

    if (!trimmedTitle) {
      handleError('Title should not be empty');
    }

    if (trimmedTitle) {
      const tempTodoId = 0;

      setTempTodo({
        id: tempTodoId,
        userId: USER_ID,
        title: trimmedTitle,
        completed: false,
      });

      setLoadingTodoIds(curr => [...curr, tempTodoId]);

      todosService.addTodo({
        userId: USER_ID, title: trimmedTitle, completed: false,
      })
        .then(newTodo => {
          setTodos(currentTodos => {
            return [...currentTodos, newTodo];
          });
          setTodoTitle('');
        })
        .catch(() => handleError('Unable to add a todo'))
        .finally(() => {
          setTempTodo(null);
          setLoadingTodoIds(curr => curr.filter(id => id !== tempTodoId));
        });
    }
  };

  const deleteTodo = (todoId: number) => {
    setLoadingTodoIds(curr => [...curr, todoId]);

    todosService.deleteTodo(todoId)
      .then(() => setTodos(
        currentTodos => currentTodos.filter(todo => todo.id !== todoId),
      ))
      .catch(() => handleError('Unable to delete a todo'))
      .finally(() => {
        setLoadingTodoIds(curr => curr.filter(id => id !== todoId));
      });
  };

  const clearTodos = () => {
    todos.map(todo => {
      if (todo.completed) {
        deleteTodo(todo.id);
      }

      return 1;
    });
  };

  const updateTodo = (newTodo: Todo): Promise<void> => {
    setLoadingTodoIds(curr => [...curr, newTodo.id]);

    return todosService.updateTodo(newTodo)
      .then((todoFromServer) => setTodos(
        currentTodos => currentTodos.map((todo) => {
          const updatedTodo = todoFromServer as Todo;

          if (todo.id === updatedTodo.id) {
            return updatedTodo;
          }

          return todo;
        }),
      ))
      .catch(() => {
        handleError('Unable to update a todo');
        throw new Error();
      })
      .finally(() => {
        setLoadingTodoIds([]);
      });
  };

  const updateTodoComplete = (todo: Todo) => {
    const todoUpdated = { ...todo, completed: !todo.completed };

    updateTodo(todoUpdated);
  };

  const toggleAllTodos = () => {
    if (todos.every(todo => todo.completed)) {
      return todos.map(todo => updateTodoComplete(todo));
    }

    todos.map(todo => {
      if (!todo.completed) {
        return updateTodoComplete(todo);
      }

      return 1;
    });

    return 1;
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
              aria-label="Toggle Button"
              type="button"
              className={cn('todoapp__toggle-all', {
                active: todos.every(todo => todo.completed),
              })}
              data-cy="ToggleAllButton"
              onClick={toggleAllTodos}
            />
          )}

          <form onSubmit={createTodo}>
            <input
              ref={titleRef}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={todoTitle}
              onChange={(event) => setTodoTitle(event.target.value)}
              disabled={loadingTodoIds.length > 0}
            />
          </form>
        </header>

        {todos.length > 0 && (
          <>
            <TodoList
              todos={visibleTodos}
              tempTodo={tempTodo}
              title={todoTitle}
              onDelete={deleteTodo}
              onComplete={updateTodoComplete}
              loadingTodos={loadingTodoIds}
              updateTodo={updateTodo}
            />

            <TodoFooter
              allTodos={todos}
              visibleTodos={visibleTodos}
              status={status}
              onStatus={setStatus}
              onClear={clearTodos}
            />
          </>
        )}

      </div>

      <ErrorNotification
        error={error}
        onHideError={() => setError(null)}
      />
    </div>
  );
};
