import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';
import { TodoResponse } from '../../types/TodoResponse';
import { postTodo } from '../../api/todos';
import { formatTodo } from '../../utils/formatResponse';

type Props = {
  todos: Todo[];
  showError: (title: string) => void;
  setTempTodo: (todo: Todo | null) => void;
  setIsTempLoading: (val: boolean) => void;
  setTodos: (arr: Todo[]) => void;
  setIsToggleAll: (val: boolean) => void;
};

export const Header: React.FC<Props> = ({
  todos,
  showError,
  setTempTodo,
  setIsTempLoading,
  setTodos,
  setIsToggleAll,
}) => {
  const [value, setValue] = useState('');
  const [isDisabled, setIsDisabled] = useState(false);
  const [focus, setFocus] = useState(false);
  const refInput = useRef<HTMLInputElement>(null);

  const onInputChange = (str: string) => {
    setValue(() => str);
  };

  const onFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!value) {
      showError('Title can\'t be empty');

      return;
    }

    const rawTodo = {
      title: value,
      completed: false,
    };

    setIsDisabled(true);
    setTempTodo({ id: 0, ...rawTodo });
    setIsTempLoading(true);

    postTodo({ ...rawTodo, userId: 10222 })
      .then(res => {
        setTodos([...todos, {
          ...formatTodo(res as TodoResponse),
        }]);
        setValue('');
      })
      .catch(() => {
        showError('Unable to add a todo');
      })
      .finally(() => {
        setTempTodo(null);
        setIsDisabled(false);
        setFocus(true);
      });
  };

  useEffect(() => {
    if (focus) {
      refInput.current?.focus();
    }
  }, [focus]);

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={`todoapp__toggle-all${todos.every(todo => todo.completed) ? ' active' : ''}`}
        onClick={() => setIsToggleAll(true)}
        aria-label="Toggle all"
      />

      <form onSubmit={onFormSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={value}
          onChange={(e) => onInputChange(e.target.value)}
          disabled={isDisabled}
          ref={refInput}
        />
      </form>
    </header>
  );
};
