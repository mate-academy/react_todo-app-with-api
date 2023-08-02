import classNames from 'classnames';
import React, {
  FormEvent, useEffect, useRef, useState,
} from 'react';
import { updateComplete } from '../../api/todos';
import { Error, Todo } from '../../types/todo';

type Props = {
  todos: Todo[];
  setTodos: (todos: Todo[] | ((todos: Todo[]) => void)) => void;
  setHasError: (value: Error) => void;
  isLoading: boolean;
  onTodo: (title: string) => Promise<void>;
};

export const Header: React.FC<Props> = ({
  todos,
  setTodos,
  setHasError,
  isLoading,
  onTodo,
}) => {
  const [todoTitle, setTodoTitle] = useState('');

  const isBtnActive = todos.every(todo => todo.completed);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [todos.length]);

  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!todoTitle.trim().length) {
      setHasError(Error.Empty);

      return;
    }

    onTodo(todoTitle)
      .then(() => {
        setTodoTitle('');
      });
  };

  const togglerAllCompleteHandler = () => {
    todos.forEach(todo => {
      updateComplete(todo.id, { completed: !isBtnActive })
        .then(() => {
          setTodos(todos.map(t => ({
            ...t,
            completed: !isBtnActive,
          })));
        })
        .catch(() => {
          setHasError(Error.Update);
        });
    });
  };

  return (
    <header className="todoapp__header">
      {!!todos.length && (
        /* eslint-disable-next-line */
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: isBtnActive,
          })}
          onClick={togglerAllCompleteHandler}
        />
      )}

      <form onSubmit={submitHandler}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={isLoading}
          ref={inputRef}
          value={todoTitle}
          onChange={e => setTodoTitle(e.target.value)}
        />
      </form>
    </header>
  );
};
