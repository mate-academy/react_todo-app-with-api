/* eslint-disable jsx-a11y/control-has-associated-label */
import { FC, FormEvent, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

interface Props {
  todos: Todo[];
  onSubmit: (todoTitle: string) => void;
  onError: (titleToError: string) => void;
  onCompleted: () => void;
}

export const Header: FC<Props> = ({
  todos,
  onSubmit: handleAddTodo,
  onError,
  onCompleted: handleChangeCompletedTodos,
}) => {
  const [title, setTitle] = useState('');
  const [isDisabled, setIsDisabled] = useState(false);

  const completedTodos = todos.filter(todo => !todo.completed);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (!title.trim()) {
      onError('Title can\'t be empty');
      setTitle('');

      return;
    }

    setIsDisabled(true);
    handleAddTodo(title);
    setTitle('');
    setIsDisabled(false);
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: !completedTodos.length,
        })}
        onClick={handleChangeCompletedTodos}
      />

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={isDisabled}
          value={title}
          onChange={event => setTitle(event.target.value)}
        />
      </form>
    </header>
  );
};
