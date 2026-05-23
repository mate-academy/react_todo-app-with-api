import { RefObject } from 'react';
import classNames from 'classnames';
import { CreateTodoForm } from '../CreateTodoForm';
import { ValidationError } from '../../types/Error';

interface Props {
  inputRef: RefObject<HTMLInputElement>;
  hasTodos: boolean;
  allCompleted: boolean;
  onCreate: (title: string) => Promise<void>;
  onToggle: () => void;
  onError: (message: ValidationError) => void;
}

export const TodoAppHeader = ({
  hasTodos,
  allCompleted,
  inputRef,
  onCreate,
  onToggle,
  onError,
}: Props) => (
  <header className="todoapp__header">
    {hasTodos && (
      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: allCompleted,
        })}
        data-cy="ToggleAllButton"
        onClick={onToggle}
      />
    )}

    <CreateTodoForm onCreate={onCreate} onError={onError} inputRef={inputRef} />
  </header>
);
