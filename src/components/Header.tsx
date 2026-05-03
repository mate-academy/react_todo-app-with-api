import { RefObject } from 'react';
import { HeaderForm } from './HeaderForm';
import { Todo } from '../types/Todo';
import classNames from 'classnames';

type Props = {
  todos: Todo[];
  title: string;
  inputRef: RefObject<HTMLInputElement>;
  isSubmitting: boolean;
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  handleToggleAll: () => void;
};

export const Header = ({
  todos,
  title,
  inputRef,
  isSubmitting,
  handleInputChange,
  handleSubmit,
  handleToggleAll,
}: Props) => {
  const allCompleted = todos.every(todo => todo.completed);

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: allCompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={handleToggleAll}
        />
      )}

      <HeaderForm
        title={title}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        inputRef={inputRef}
        isSubmitting={isSubmitting}
      />
    </header>
  );
};
