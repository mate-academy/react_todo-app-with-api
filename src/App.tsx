/* eslint-disable array-callback-return */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  FormEvent, useCallback,
  useContext, useEffect, useRef, useState,
} from 'react';
import classNames from 'classnames';
import { Todo } from './types/Todo';
import { AuthContext } from './components/Auth/AuthContext';
import {
  getTodos, postTodo, deleteTodo, patchTodo,
} from './api/todos';
import { TodoItem } from './components/Auth/TodoItem/TodoItem';
import { Footer } from './components/Footer/Footer';

export const App: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [userId, setUserId] = useState(0);
  const [value, setValue] = useState('');
  const [allCompleted, setAllCompleted] = useState(false);
  const [filterTodos, setFilterTodos] = useState('all');
  const [errorMessage, setErrorMessage] = useState('');

  const handlerDeleteTodo = useCallback((element: Todo) => {
    deleteTodo(element.id)
      .then(() => todos.filter(todo => todo.id !== element.id))
      .then(res => {
        setTodos(res);
        setValue('');
      }).catch(() => setErrorMessage('Unable to delete a todo'));
  }, [todos]);

  const deleteCompleted = () => {
    todos.map(todo => {
      if (todo.completed) {
        deleteTodo(todo.id)
          .then(() => todos.filter(element => element.completed !== true))
          .then(res => {
            setTodos(res);
          });
      }
    });
  };

  const createTodo = useCallback((event: FormEvent) => {
    event.preventDefault();
    if (value.replace(/\s/g, '').length > 0) {
      postTodo({
        title: value,
        userId,
        completed: false,
      }).then(() => getTodos(userId).then(res => {
        setTodos(res);
        setValue('');
      })).catch(() => setErrorMessage('Unable to add a todo'));
    }
  }, [value]);

  const changedTodos = useCallback((todo: Todo) => {
    const newTodos = [...todos];
    const index = todos.findIndex(el => el.id === todo.id);

    newTodos.splice(index, 1, todo);

    setTodos(newTodos);
  }, [todos]);

  const handlerAllCompleted = () => {
    const newTodos = todos.map(todo => ({
      ...todo,
      completed: !allCompleted,
    }));

    newTodos.map(todo => {
      patchTodo(todo.id, todo).then(() => {
        setTodos(newTodos);
        setAllCompleted(true);
      });
    });
  };

  const fitteredTodos = () => {
    switch (filterTodos) {
      case 'active':
        return todos.filter(todo => todo.completed === false);
      case 'completed':
        return todos.filter(todo => todo.completed === true);
      default:
        return todos;
    }
  };

  useEffect(() => {
    const isAllCompleted = todos.every(element => element.completed === true);

    if (isAllCompleted) {
      setAllCompleted(true);
    } else {
      setAllCompleted(false);
    }
  }, [todos]);

  useEffect(() => {
    const errorDisplayInterval = () => {
      setErrorMessage('');
    };

    setTimeout(errorDisplayInterval, 3000);
  }, [errorMessage]);

  useEffect(() => {
    // focus the element with `ref={newTodoField}`
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

  useEffect(() => {
    if (user) {
      setUserId(user.id);
      getTodos(user.id).then(res => setTodos(res));
    }
  }, []);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            data-cy="ToggleAllButton"
            type="button"
            className={classNames('todoapp__toggle-all',
              { active: allCompleted })}
            onClick={() => handlerAllCompleted()}
          />

          <form
            onSubmit={(event) => (createTodo(event))}
          >
            <input
              data-cy="NewTodoField"
              type="text"
              ref={newTodoField}
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={value}
              onChange={(event) => setValue(event.target.value)}
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          {fitteredTodos().map(todo => (
            <TodoItem
              todo={todo}
              key={todo.id}
              deleteTodo={handlerDeleteTodo}
              changedTodos={changedTodos}
              setErrorMessage={setErrorMessage}
            />
          ))}
        </section>
        {todos.length > 0
          && (
            <Footer
              todosLength={todos.length}
              deleteCompleted={deleteCompleted}
              setFilterTodos={setFilterTodos}
            />
          )}
      </div>

      <div
        data-cy="ErrorNotification "
        className={
          classNames('notification is-danger is-light has-text-weight-normal',
            { hidden: errorMessage === '' })
        }
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessage('')}
        />

        {errorMessage === 'Unable to add a todo'
          && 'Unable to add a todo'}
        {errorMessage === 'Unable to delete a todo'
          && 'Unable to delete a todo'}
        {errorMessage === 'Unable to update a todo'
          && 'Unable to update a todo'}
      </div>
    </div>
  );
};
