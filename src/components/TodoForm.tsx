import React, { useRef, useState } from 'react';
import { Todo } from '../types/Todo';
import { USER_ID } from '../constants';

type Props = {
  addTodo: (newTodo: Todo) => Promise<Todo>,
  setTempTodo: (newTodo: Todo | null) => void,
  onEmptyTitle: () => void,
};

export const TodoForm: React.FC<Props> = ({
  addTodo,
  setTempTodo,
  onEmptyTitle,
}) => {
  const [title, setTitle] = useState('');
  const [isDisabled, setIsDisabled] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const focusInput = () => {
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 0);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim()) {
      onEmptyTitle();
      focusInput();

      return;
    }

    const newTodo: Todo = {
      id: 0,
      title,
      completed: false,
      userId: USER_ID,
    };

    setIsDisabled(true);
    setTempTodo(newTodo);

    addTodo(newTodo)
      .then(() => setTitle(''))
      .finally(() => {
        setIsDisabled(false);
        setTempTodo(null);
        focusInput();
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        ref={inputRef}
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={title}
        onChange={event => setTitle(event.target.value)}
        disabled={isDisabled}
      />
    </form>
  );
};
