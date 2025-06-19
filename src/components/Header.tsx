import cn from 'classnames';
import { AddTodoForm } from './AddTodoForm';
import { Dispatch, RefObject, SetStateAction } from 'react';
import { TodoError } from '../api/todos';

interface Props {
  onAdd: (title: string) => Promise<void>;
  onError: Dispatch<SetStateAction<TodoError | null>>;
  inputRef: RefObject<HTMLInputElement>;
  toggleAll: () => void;
  hasTodos: boolean;
  allCompleted: boolean;
}

export const Header: React.FC<Props> = ({
  onAdd,
  onError,
  toggleAll,
  hasTodos,
  allCompleted,
  inputRef,
}) => {
  return (
    <header className="todoapp__header">
      {hasTodos && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: allCompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={toggleAll}
        />
      )}

      <AddTodoForm ref={inputRef} onSubmit={onAdd} onError={onError} />
    </header>
  );
};
