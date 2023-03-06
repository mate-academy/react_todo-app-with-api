/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import { v4 as uuid } from 'uuid';
import { deleteTodo, getTodos, postTodo } from './api/todos';
import { Error } from './components/Error/Error';
import { Filter } from './components/Filter/Filter';
import { Item } from './components/Todo/Todo';
import { Todo } from './types/Todo';
import { UserWarning } from './UserWarning';

const USER_ID = 6470;

export const App: React.FC = () => {
  const [titleTodo, setTitleTodo] = useState('');
  const [listTodo, setListTodo] = useState<Todo[]>([]);
  const [error, setError] = useState('');
  const [tempTodo, setTempTodo] = useState(false);
  const [showFooter, setShowFooter] = useState(true);
  const [length, setLength] = useState(0);

  const getListTodo = async (filter?: boolean, type?: string) => {
    try {
      const result = await getTodos(USER_ID, filter);

      if (type === 'active') {
        setListTodo(result.filter((el:Todo) => !el.completed));
      } else {
        setListTodo(result);
      }
    } catch (e) {
      setError('Oops, something were wrong, please try again later');
    }
  };

  useEffect(() => {
    getListTodo();
  }, []);

  useEffect(() => {
    getTodos(USER_ID).then(res => {
      setLength(res.length);
      if (!res.length) {
        setShowFooter(false);
      } else {
        setShowFooter(true);
      }
    });
  }, [listTodo]);

  const clearError = useCallback(() => {
    setTempTodo(false);
    setError('');
  }, []);

  const onSubmitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (titleTodo) {
      setTempTodo(true);
      try {
        await postTodo(
          { title: titleTodo, userId: USER_ID, completed: false },
        );

        getListTodo();
        setTitleTodo('');
        setTempTodo(false);
      } catch (e) {
        setError('Oops, something were wrong, please try again later');
      }
    }
  };

  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitleTodo(event.target.value);
  };

  const deleteTodoHandler = (id: number) => {
    deleteTodo(id).then(() => getListTodo());
  };

  const deleteAllCompleteTodo = () => {
    listTodo.forEach((todo: Todo) => {
      if (todo.completed) {
        deleteTodoHandler(todo.id);
      }
    });
  };

  const renderClearButton = useMemo(() => {
    if (listTodo.some((todo: Todo) => todo.completed)) {
      return (
        <button
          type="button"
          className="todoapp__clear-completed"
          onClick={deleteAllCompleteTodo}
        >
          Clear completed
        </button>
      );
    }

    return <></>;
  }, [listTodo]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            type="button"
            className="todoapp__toggle-all active"
          />
          <form onSubmit={onSubmitHandler}>
            <input
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={titleTodo}
              onChange={onChangeHandler}
              disabled={tempTodo}
            />
          </form>
        </header>

        <section className="todoapp__main">
          {
            listTodo.map((todo: Todo) => (
              <Item
                todo={todo}
                key={todo.id}
                deleteTodo={deleteTodoHandler}
                updateTodos={getListTodo}
              />
            ))
          }
          {tempTodo && (
            <Item
              todo={{
                id: +uuid(),
                userId: USER_ID,
                title: titleTodo,
                completed: false,
              }}
              temp
            />
          )}
        </section>

        {showFooter ? (
          <footer className="todoapp__footer">
            <span className="todo-count">
              {`${length} items left`}
            </span>

            <Filter setFilter={getListTodo} />

            {renderClearButton}
          </footer>
        ) : ''}
      </div>

      {error && <Error errorText={error} errorClear={clearError} />}
    </div>
  );
};
