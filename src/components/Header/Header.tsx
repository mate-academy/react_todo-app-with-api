import { useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  activeTodoId: number,
  onErrorMessage: (error: string) => void,
  userId: number,
  onAdd: (todo: Omit<Todo, 'id'>) => void,
  isDisabledInput: boolean,
  onToggle: () => void
};

export const Header: React.FC<Props> = ({
  activeTodoId,
  userId,
  onAdd,
  isDisabledInput,
  onToggle,
  onErrorMessage,
}) => {
  const [title, setTitle] = useState('');

  const handleNewTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleOnSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const newTodo = {
      title,
      completed: false,
      userId,
    };

    setTitle('');

    if (title) {
      onAdd(newTodo);
    } else {
      onErrorMessage('Title can`t be empty');
      setTimeout(() => {
        onErrorMessage('');
      }, 3000);
    }
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={classNames(
          'todoapp__toggle-all',
          { active: !activeTodoId },
        )}
        onClick={onToggle}
      >
        {}
      </button>

      <form
        onSubmit={handleOnSubmit}
      >
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={handleNewTitle}
          disabled={isDisabledInput}
        />
      </form>
    </header>
  );
};
