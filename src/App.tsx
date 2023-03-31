import React, { useCallback, useEffect, useState } from 'react';
import classNames from 'classnames';
import {
  patchTodo, deleteTodo, getTodos, postTodo, patchTodoTitle,
} from './api/todos';
import { Error } from './components/Error/Error';
import { TypeFilter, Filter } from './components/Filter/Filter';
import { Item } from './components/Todo/Todo';
import { Todo } from './types/Todo';
import { UserWarning } from './UserWarning';

const USER_ID = 123111;

export const App: React.FC = () => {
  const [listTodo, setListTodo] = useState<Todo[]>([]);
  const [error, setError] = useState('');
  const [titleTodo, setTitleTodo] = useState('');
  const [isEditing, setEditTodo] = useState(false);
  const [filterTodo, setFilterTodo] = useState(TypeFilter.ALL);
  const [selectedTodo, setSelectedTodo] = useState<Todo>();

  const handleTodoClick = (todo: Todo) => {
    setSelectedTodo(todo);
    setEditTodo(true);
  };

  const getListTodo = useCallback(async (filter = TypeFilter.ALL) => {
    try {
      if (filter) {
        const result = await getTodos(USER_ID, filter);

        setFilterTodo(filter);
        setListTodo(result);
      }
    } catch (e) {
      setError('Something were wrong, please try again later');
    }
  }, []);

  useEffect(() => {
    getListTodo();
  }, []);

  const clearError = useCallback(() => setError(''), []);

  const onSubmitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (titleTodo) {
      try {
        await postTodo(
          { title: titleTodo, userId: USER_ID, completed: false },
        );

        getListTodo();
        setTitleTodo('');
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

  const changeTodoCompleted = (id: number, completed: boolean) => {
    patchTodo(id, completed).then(() => getListTodo());
  };

  const changeTodoTitle = (id: number, title: string) => {
    patchTodoTitle(id, title).then(() => getListTodo());
  };

  const clearCompleated = (todos: Todo[]) => {
    return todos.filter(todo => todo.completed);
  };

  // const clearActive = (list: Todo[]) => {
  //   return list.filter(obj => !obj.completed);
  // };

  const completedTodo = clearCompleated(listTodo);
  // const activeTodo = clearActive(listTodo);

  function deleteAllTodosHandler(todos: Todo[]) {
    const promises = todos.map((todo) => deleteTodoHandler(todo.id));

    return Promise.all(promises);
  }

  function changeAllTodosHandler(todos: Todo[]) {
    const promises = todos.map((todo) => changeTodoCompleted(todo.id, false));

    return Promise.all(promises);
  }

  const handleTodoKeyPress = (
    key: string, id: number, title: string,
  ) => {
    if (key === 'Enter') {
      changeTodoTitle(id, title);
      setEditTodo(false);
    }

    if (key === 'Escape') {
      setEditTodo(false);
    }
  };

  const handleTodoBlur = (id: number, title: string) => {
    changeTodoTitle(id, title);
    setEditTodo(false);
  };

  // function changeTodoTitleHandler(id: number, title: string) {
  //   changeTodoTitle(id, title);

  //   // return Promise.all(promises);
  // }

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
            className={classNames('todoapp__toggle-all',
              {
                active: listTodo.length === completedTodo.length,
              })}
            onClick={() => changeAllTodosHandler(completedTodo)}
            aria-label="Get all todos done"
          />
          <form onSubmit={onSubmitHandler}>
            <input
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={titleTodo}
              onChange={onChangeHandler}
            />
          </form>
        </header>

        <section className="todoapp__main">
          {listTodo.map((todo: Todo) => (
            <Item
              todo={todo}
              key={todo.id}
              deleteTodo={deleteTodoHandler}
              changeTodo={changeTodoCompleted}
              handleTodoClick={handleTodoClick}
              isEditing={isEditing}
              changeTodoTitle={changeTodoTitle}
              selectedTodo={selectedTodo}
              handleTodoKeyPress={handleTodoKeyPress}
              handleTodoBlur={handleTodoBlur}
            />
          ))}
        </section>

        {!!listTodo.length || filterTodo !== TypeFilter.ALL
          ? (
            <footer className="todoapp__footer">
              <span className="todo-count">
                {`${listTodo.length} items left`}
              </span>
              <Filter setFilter={getListTodo} />
              <button
                type="button"
                className={classNames('todoapp__clear-completed',
                  {
                    'todoapp__clear-completed__hidden':
                      completedTodo.length < 1,
                  })}
                onClick={() => deleteAllTodosHandler(completedTodo)}
              >
                Clear completed
              </button>
            </footer>
          )
          : ''}
      </div>

      {error && <Error errorText={error} errorClear={clearError} />}
    </div>
  );
};
