/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { Dispatch, SetStateAction } from 'react';
import { USER_ID } from '../utils/userId';
import { Todo } from '../types/Todo';
import { getMax } from '../utils/getMax';
import { createTodo, updateTodo } from '../api/todos';

type Props = {
  setTodos: Dispatch<SetStateAction<Todo[]>>;
  setErrorMessage: (err: string) => void;
  inputTitle: string;
  setInputTitle: (title: string) => void;
  loadTodos: () => Promise<void>;
  setWasError: (wasErr: boolean) => void;
  todos: Todo[];
};

/* eslint-disable max-len */
export const Header:React.FC<Props> = ({
  setTodos,
  setErrorMessage,
  inputTitle,
  loadTodos,
  setInputTitle,
  setWasError,
  todos,
}) => {
  const clickHandler = () => {
    const isAllComplited = todos.filter(someTodo => someTodo.completed).length !== todos.length;

    let notCompletedTodos: Todo[] = [];

    if (isAllComplited) {
      notCompletedTodos = todos.filter(todo => !todo.completed);

      setTodos(someTodos => someTodos.map(todo => {
        if (notCompletedTodos.includes(todo)) {
          const completedTodo = { ...todo, isLoading: true };

          return completedTodo;
        }

        return todo;
      }));

      const promise = notCompletedTodos.map(todo => {
        return updateTodo(`/todos/${todo.id}?userId=${USER_ID}`, { completed: isAllComplited });
      });

      Promise.all(promise)
        .then(loadTodos)
        .catch((err) => setErrorMessage(err));
    } else {
      setTodos(someTodos => someTodos.map(todo => ({ ...todo, isLoading: true })));

      const promise = todos.map(todo => {
        return updateTodo(`/todos/${todo.id}?userId=${USER_ID}`, { completed: isAllComplited });
      });

      Promise.all(promise)
        .then(loadTodos)
        .catch((err) => setErrorMessage(err));
    }
  };

  const formSubmitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage('');

    if (inputTitle.trim() === '') {
      setErrorMessage('Enter a title');
    } else {
      setTodos((prevTodos: Todo[]) => [...prevTodos, {
        id: getMax(todos),
        title: inputTitle,
        completed: true,
        userId: USER_ID,
        isLoading: true,
      }]);
      createTodo(`/todos?userId=${USER_ID}`, { title: inputTitle, completed: false, userId: USER_ID })
        .then(loadTodos)
        .catch((err) => {
          setErrorMessage('Can\'t load a todo');
          setWasError(true);
          throw err;
        })
        .finally(() => setWasError(false))
        .then(() => setInputTitle(''));
    }
  };

  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}
      <button
        type="button"
        className="todoapp__toggle-all active"
        onClick={clickHandler}
      />

      {/* Add a todo on form submit */}
      <form
        onSubmit={formSubmitHandler}
      >
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={event => setInputTitle(event.target.value)}
          value={inputTitle}
        />
      </form>
    </header>
  );
};
