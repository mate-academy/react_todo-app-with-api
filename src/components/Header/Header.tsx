import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';

import { addTodos, patchTodos } from '../../api/todos';
import { ErrorType } from '../../types/type';
import { Todo } from '../../types/Todo';

type Props = {
  posts: Todo[];
  setError: React.Dispatch<React.SetStateAction<ErrorType>>;
  USER_ID: number;
  setPosts: React.Dispatch<React.SetStateAction<Todo[]>>;
  resetError: () => void;
};

export const Header: React.FC<Props> = ({
  setError, USER_ID, setPosts, resetError, posts,
}) => {
  const [change, setChange] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);
  const completedTodos = posts.filter(todo => !todo.completed);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let newValue: string = event.target.value;

    newValue = newValue.replace(/[^a-zA-Zа-яА-Я0-9\s]/g, '');

    setError((prevState: ErrorType) => ({
      ...prevState,
      titleEmpty: false,
    }));

    setChange(newValue);
    resetError();
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (change.trim().length === 0) {
      setError((prevState: ErrorType) => ({
        ...prevState,
        titleEmpty: true,
      }));
      resetError();

      return;
    }

    addTodos({
      userId: USER_ID,
      title: change,
      completed: false,
    })
      .then((newPost: Todo) => {
        setPosts((prevState: Todo[]) => [...prevState, newPost]);
      })
      .catch((error) => {
        setError((prevState: ErrorType) => ({
          ...prevState,
          addTodo: true,
        }));
        resetError();
        throw error;
      });

    setChange('');
  };

  const handleCheckboxClickAll = () => {
    const allCompleted = posts.every((todo) => todo.completed);

    const newTodos: Todo[] = posts.map((todo) => ({
      ...todo,
      completed: !allCompleted,
    }));

    setPosts([...newTodos]);

    return [...newTodos]
      .forEach((todo: Todo) => patchTodos(todo.id, {
        ...todo, completed: todo.completed,
      })
        .catch((error) => {
          setPosts(posts);
          setError((prevState: ErrorType) => ({
            ...prevState,
            updateTodo: true,
          }));
          resetError();
          throw error;
        }));
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={classNames(
          'todoapp__toggle-all',
          { active: !completedTodos.length },
        )}
        data-cy="ToggleAllButton"
        aria-label="Toggle All"
        onClick={handleCheckboxClickAll}
      />

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={inputRef}
          onChange={handleChange}
          value={change}
        />
      </form>
    </header>
  );
};
