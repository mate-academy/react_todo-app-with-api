/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';
import { UserWarning } from './UserWarning';
import {
  createTodos, deleteTodos, getTodos, updateTodos,
} from './api/todos';
import { Todo } from './types/Todo';
import { Sort } from './types/Sort';
import { ErrorMessage } from './types/ErrorMessage';
import { TodoList } from './components/TodoList';
import { TodosFilter } from './components/TodoFilter';

const USER_ID = 11932;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<Sort>(Sort.All);
  const [value, setValue] = useState<string>('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [errorMessage, setErrorMessage] = useState<ErrorMessage | null>(null);
  const [hasErrorMessage, setHasErrorMessage] = useState<boolean>(false);
  const [loading, setLoading] = useState<number[]>([]);

  const isShownError = (errorType: ErrorMessage) => {
    setHasErrorMessage(true);
    setErrorMessage(errorType);
    setTimeout(() => {
      setHasErrorMessage(false);
      setErrorMessage(null);
    }, 3000);
  };

  useEffect(() => {
    getTodos(USER_ID)
      .then(data => {
        const todosData = data as Todo[];

        setTodos(todosData);
      })
      .catch(() => {
        isShownError(ErrorMessage.load);
      });
  }, []);

  const filteredTodos = useMemo(() => {
    switch (selectedFilter) {
      case Sort.Active:
        return todos.filter(todo => !todo.completed);
      case Sort.Completed:
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  }, [selectedFilter, todos]);

  const isCompleted
    = todos.filter(todo => todo.completed).length === todos.length;

  const isUncompleted
    = todos.filter(todo => !todo.completed).length === todos.length;

  const clearValue = (): void => {
    setValue('');
    setHasErrorMessage(false);
    setErrorMessage(null);
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  const handleSetTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  const handleDeleteTodo = (todoId: number) => {
    setLoading(current => [...current, todoId]);
    deleteTodos(todoId)
      .then(() => setTodos(
        currentTodos => currentTodos.filter(todo => todo.id !== todoId),
      ))
      .catch(() => {
        isShownError(ErrorMessage.delete);
      })
      .finally(() => setLoading([]));
  };

  const handleUpdateTodo = (todo: Todo) => {
    setLoading(current => [...current, todo.id]);
    const currentTodo = todos.filter(toDo => toDo.id === todo.id)[0];
    const indexOfTodo = todos.indexOf(currentTodo);

    updateTodos(todo)
      .then(() => setTodos(
        currentTodos => [
          ...currentTodos.slice(0, indexOfTodo),
          todo,
          ...currentTodos.slice(indexOfTodo + 1),
        ],
      ))
      .catch(() => {
        isShownError(ErrorMessage.update);
      })
      .finally(() => setLoading([]));
  };

  const clearCompleted = () => {
    todos.map(todo => {
      if (todo.completed) {
        setLoading(current => [...current, todo.id]);
        handleDeleteTodo(todo.id);
      }

      return todo;
    });
  };

  const handleToggleAll = () => {
    if (isCompleted || isUncompleted) {
      todos.map(todo => handleUpdateTodo({
        ...todo,
        completed: !todo.completed,
      }));
    } else {
      todos.map(todo => !todo.completed && handleUpdateTodo({
        ...todo,
        completed: !todo.completed,
      }));
    }
  };

  const handleAddTodo = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!value.trim()) {
      isShownError(ErrorMessage.emptyTitle);

      return;
    }

    const newTodo: Todo = {
      id: Math.max(...todos.map(todo => todo.id)) + 1,
      title: value,
      userId: USER_ID,
      completed: false,
    };

    setTempTodo({ ...newTodo, id: 0 });

    setLoading(current => [...current, 0]);
    createTodos(newTodo)
      .then(newToDo => {
        setTodos(currentTodos => [...currentTodos, newToDo]);
        clearValue();
      })
      .catch(() => {
        setTempTodo(null);
        isShownError(ErrorMessage.add);
      })
      .finally(() => {
        setTempTodo(null);
        setLoading([]);
      });

    clearValue();
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
                active: isCompleted,
              })}
              data-cy="ToggleAllButton"
              onClick={handleToggleAll}
            />
          )}

          <form onSubmit={handleAddTodo}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={value}
              onChange={handleSetTitle}
            />
          </form>
        </header>

        <TodoList
          todos={filteredTodos}
          onUpdate={handleUpdateTodo}
          onDelete={handleDeleteTodo}
          loading={loading}
          tempTodo={tempTodo}
        />

        {todos.length > 0 && (
          <TodosFilter
            todos={todos}
            selectedFilter={selectedFilter}
            setSelectedFilter={setSelectedFilter}
            clearCompleted={clearCompleted}
          />
        )}

      </div>
      {hasErrorMessage && (
        <div className="notification is-danger is-light has-text-weight-normal">
          <button
            data-cy="HideErrorButton"
            type="button"
            className="delete"
            onClick={() => setHasErrorMessage(false)}
          />
          {errorMessage}
        </div>
      )}
    </div>
  );
};
