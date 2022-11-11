/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback, useContext,
  useEffect, useRef, useState,
} from 'react';
import classNames from 'classnames';
import { AuthContext } from './components/Auth/AuthContext';
import { Todo } from './types/Todo';
import {
  addTodo, deleteTodo, getTodos, toggleTodo,
} from './api/todos';
import { ErrorMessages } from './components/ErrorMessages/ErrorMessages';
import { TodoList } from './components/TodoList/TodoList';
import { TodoOnAdd } from './components/TodoOnAdd/TodoOnAdd';
import { TodoFooter } from './components/TodoFooter/TodoFooter';

export const App: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [visibleTodos, setVisibleTodos] = useState<Todo[]>([]);
  const [filterBy, setFilterBy] = useState('all');
  const [isError, setIsError] = useState('');
  const [title, setTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [isDeletingAll, setIsDeletingAll] = useState(false);
  const [isTogglingAll, setIsTogglingAll] = useState(false);

  useEffect(() => {
    const getTodosFromApi = async () => {
      if (user) {
        try {
          const response = await getTodos(user?.id);

          setTodos(response);
        } catch {
          setIsError('load');
          throw new Error('Todos not found');
        }
      }
    };
    // focus the element with `ref={newTodoField}`

    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    getTodosFromApi();
  }, [todos]);

  const onAddTodo = useCallback(async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!title.trim().length) {
      setIsError('length');
      setIsAdding(false);
      setTitle('');

      return;
    }

    if (user) {
      try {
        await addTodo(title, user.id);
      } catch {
        setIsError('add');
      }
    }

    setTitle('');
    setIsAdding(false);
  }, [user, title]);

  const onDeleteCompleted = useCallback(async () => {
    setIsDeletingAll(true);

    try {
      await Promise.all(todos.map(todo => {
        if (todo.completed) {
          return deleteTodo(todo.id);
        }

        return null;
      }));
    } catch {
      setIsError('deleteAll');
    }

    setIsDeletingAll(false);
  }, [todos]);

  const onUpdateAll = async () => {
    if (todos.every(item => item.completed)) {
      setIsDeletingAll(true);

      try {
        await Promise.all(todos.map(todoItem => {
          return toggleTodo(todoItem);
        }));

        setTodos(prevState => (
          prevState.map(todoItem => ({
            ...todoItem,
            completed: !todoItem.completed,
          }))
        ));
      } catch (e) {
        setIsError('updateAll');
      }
    } else {
      setIsTogglingAll(true);

      try {
        await Promise.all(todos.map(todoItem => {
          if (!todoItem.completed) {
            return toggleTodo(todoItem);
          }

          return null;
        }));

        setTodos(prevState => (
          prevState.map(todoItem => {
            if (!todoItem.completed) {
              return {
                ...todoItem,
                completed: !todoItem.completed,
              };
            }

            return todoItem;
          })
        ));
      } catch (e) {
        setIsError('updateAll');
      }
    }

    setIsDeletingAll(false);
    setIsTogglingAll(false);
  };

  useEffect(() => {
    const newVisibleTodos = todos.filter(todoFilter => {
      switch (filterBy) {
        case 'active':
          return !todoFilter.completed;

        case 'completed':
          return todoFilter.completed;

        default:
          return todoFilter;
      }
    });

    setVisibleTodos(newVisibleTodos);
  }, [filterBy, todos]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {visibleTodos.length > 0 && (
            <button
              data-cy="ToggleAllButton"
              type="button"
              className={classNames('todoapp__toggle-all', {
                active: todos.every(item => item.completed),
              })}
              onClick={onUpdateAll}
            />
          )}

          <form
            onSubmit={(event) => {
              onAddTodo(event);
            }}
          >
            <input
              disabled={isAdding}
              data-cy="NewTodoField"
              type="text"
              ref={newTodoField}
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </form>
        </header>
        <TodoList
          setError={setIsError}
          setVisibleTodos={setTodos}
          todos={visibleTodos}
          isDeletingAll={isDeletingAll}
          isTogglingAll={isTogglingAll}
        />

        {isAdding && (
          <TodoOnAdd title={title} />
        )}

        {(todos.length > 0 || isAdding) && (
          <TodoFooter
            todos={visibleTodos}
            filterBy={filterBy}
            setFilterBy={setFilterBy}
            onDeleteCompleted={onDeleteCompleted}
          />
        )}
      </div>

      {isError && (
        <ErrorMessages
          setError={setIsError}
          error={isError}
          onClose={() => setIsError('')}
        />
      )}
    </div>
  );
};
