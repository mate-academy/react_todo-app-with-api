import React, { useEffect, useRef } from 'react';
import { Notifications } from '../types/Notifications';

interface Props {
  title: string,
  setTitle: (title: string) => void,
  addNewTodo: (title: string) => void,
  setNotification: (value: Notifications) => void,
  isAdding: boolean,
}

export const NewTodo:React.FC<Props> = ({
  title,
  setTitle,
  addNewTodo,
  setNotification,
  isAdding,
}) => {
  const newTodoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, [title]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim()) {
      setNotification(Notifications.TitleError);

      return;
    }

    addNewTodo(title);
  };

  useEffect(() => {
    if (!isAdding) {
      setTitle('');
    }
  }, [isAdding]);

  return (
    <form onSubmit={handleSubmit}>
      <input
        data-cy="NewTodoField"
        type="text"
        ref={newTodoField}
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        disabled={isAdding}
      />
    </form>
  );
};
