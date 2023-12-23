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

const USER_ID = 12042;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>(Status.all);
  const [todoTitle, setTodoTitle] = useState<string>('');
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const titleField = useRef<HTMLInputElement>(null);

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
    setTimeout(() => {
      setError(null);
    }, 3000);
  };

  useEffect(() => {
    if (titleField.current) {
      titleField.current.focus();
    }
  }, [loadingTodoIds]);

  useEffect(() => {
    todosService.getTodos(USER_ID)
      .then(setTodos)
      .catch(() => (handleError('Unable to load todos')));
  }, []);

  const filteredTodos = useMemo(() => {
    switch (status) {
      case Status.all: {
        return todos;
      }

      case Status.active: {
        return todos.filter(todo => !todo.completed);
      }

      case Status.completed: {
        return todos.filter(todo => todo.completed);
      }

      default: {
        return todos;
      }
    }
  }, [todos, status]);

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
            const maxId = Math.max(0, ...currentTodos.map(todo => todo.id));
            const id = maxId + 1;

            return [...currentTodos, { ...newTodo, id }];
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
        todosService.deleteTodo(todo.id);
      }

      return 1;
    });

    setTodos(
      currentTodos => currentTodos.filter(todo => todo.completed !== true),
    );
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
      .catch(() => handleError('Unable to update a todo'))
      .finally(() => {
        setLoadingTodoIds([]);
      });
  };

  const updateTodoComplete = (todo: Todo) => {
    const todoUpdated = { ...todo, completed: !todo.completed };

    updateTodo(todoUpdated);
  };

  const toggleAllTodos = () => {
    todos.map(todo => {
      updateTodoComplete(todo);

      return 1;
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
              ref={titleField}
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
              todos={filteredTodos}
              tempTodo={tempTodo}
              title={todoTitle}
              onDelete={deleteTodo}
              onComplete={updateTodoComplete}
              loadingTodos={loadingTodoIds}
              updateTodo={updateTodo}
            />

            <TodoFooter
              todos={filteredTodos}
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
