/* eslint-disable no-console */
/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import React, {
  useContext, useEffect, useRef, useState,
} from 'react';

import {
  getTodos, postTodos, deleteTodos, patchTodos,
} from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import { Filter } from './components/React/Filter';
import { NewTodo } from './components/React/NewTodo';
import { TodoList } from './components/React/TodoList';
import { Todo } from './types/Todo';

enum Errors {
  Server = 'Unable to load data from the Server',
  Post = 'Unable to add the Todo',
  Add = 'Title can\'t be empty',
  Delete = 'Unable to delete a todo',
  Update = 'Unable to update a todo',
}

export const App: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState('all');
  const [error, setError] = useState('');
  const [input, setInput] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [todoOnload, setTodoOnLoad] = useState<Todo | null>(null);
  const [todoIdsOnRemove, setTodoIdsOnRemove] = useState<number[]>([]);
  const [isAnyCompleted, setCompletedTodos] = useState(false);
  const [toggle, setToggle] = useState(false);

  const focusInput = () => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  };

  const resetLoadingTodos = (id: number) => {
    const remainingIds = [...todoIdsOnRemove]
      .filter(todoId => todoId !== id);

    setTodoIdsOnRemove([...remainingIds]);
  };

  const putOnLoad = (loadingTodos: Todo[]) => {
    setTodoIdsOnRemove(
      [...todoIdsOnRemove, ...loadingTodos.map(todo => todo.id)],
    );
  };

  const downloadDataAPI = () => {
    if (user) {
      getTodos(user.id)
        .then(todosFromServer => {
          setTodos(todosFromServer);
          setTodoOnLoad(null);

          const someCompleted = todosFromServer.some(todo => todo.completed);
          const allCompleted = todosFromServer.every(todo => todo.completed);

          setCompletedTodos(someCompleted);

          if (allCompleted) {
            setToggle(true);
          } else {
            setToggle(false);
          }

          focusInput();
        })
        .catch(() => setError(Errors.Server))
        .finally(() => setTodoIdsOnRemove([]));
    }
  };

  const deleteDataAPI = (id: number) => {
    deleteTodos(id)
      .then(() => downloadDataAPI())
      .catch(() => {
        setError(Errors.Delete);
        console.log(todos.map(todo => todo.title));
      })
      .finally(() => {
        resetLoadingTodos(id);
      });
  };

  const updateDataAPI = (id: number, data: boolean | string) => {
    patchTodos(
      id,
      typeof data === 'string'
        ? { title: data }
        : { completed: !data },
    )
      .then(() => downloadDataAPI())
      .catch(() => {
        setError(Errors.Update);
      })
      .finally(() => resetLoadingTodos(id));
  };

  const handleTodoDeleteButton = (todoId: number) => {
    deleteDataAPI(todoId);
    setTodoIdsOnRemove([...todoIdsOnRemove, todoId]);
  };

  const handleClearButton = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    putOnLoad(completedTodos);

    completedTodos.map(todo => deleteDataAPI(todo.id));
  };

  const handleToggleAll = () => {
    setToggle(!toggle);
    putOnLoad(todos);

    todos.map(todo => updateDataAPI(todo.id, toggle));
  };

  const handleErrorCloser = () => setError('');

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!input) {
      setError(Errors.Add);
      setTimeout(() => setError(''), 3000);

      return;
    }

    if (user) {
      const newTodo = {
        id: 0,
        userId: user.id,
        title: input,
        completed: false,
      };

      setIsAdding(true);
      setTodoOnLoad(newTodo);

      postTodos(newTodo)
        .then(() => setIsAdding(false))
        .catch(() => setError(Errors.Post))
        .finally(() => downloadDataAPI());
    }

    setInput('');
  };

  const handleCompletedCheckBox = (todoId: number, completed: boolean) => {
    setTodoIdsOnRemove([...todoIdsOnRemove, todoId]);
    updateDataAPI(todoId, completed);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.currentTarget.value);
    setError('');
  };

  const handleExtraInputChange = (id: number, title: string) => {
    if (!title) {
      deleteDataAPI(id);
    }

    setTodoIdsOnRemove([...todoIdsOnRemove, id]);
    updateDataAPI(id, title);
  };

  const handleTodosFilter = (filterType: string) => setFilter(filterType);

  useEffect(() => {
    downloadDataAPI();
    focusInput();
  }, []);

  todos.map(todo => todo.title);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {!!todos.length && (
            <button
              data-cy="ToggleAllButton"
              type="button"
              className={classNames(
                'todoapp__toggle-all', { active: toggle },
              )}
              onClick={() => handleToggleAll()}
            />
          )}

          <NewTodo
            newTodoField={newTodoField}
            input={input}
            isAdding={isAdding}
            onInputChange={handleInputChange}
            onSubmit={handleFormSubmit}
          />
        </header>

        {!!todos.length && (
          <>
            <TodoList
              todos={todos}
              filter={filter}
              todoOnLoad={todoOnload}
              todoIdsOnRemove={todoIdsOnRemove}
              error={error}
              onTodoDelete={handleTodoDeleteButton}
              onTodoComplete={handleCompletedCheckBox}
              saveInputChange={handleExtraInputChange}
            />
            <Filter
              filter={filter}
              isAnyCompleted={isAnyCompleted}
              onFilterChange={handleTodosFilter}
              onCompletedClear={handleClearButton}
            />
          </>
        )}
      </div>

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
          onClick={() => handleErrorCloser()}
        />
        {error}
      </div>
    </div>
  );
};
