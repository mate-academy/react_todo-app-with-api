import classNames from 'classnames';
import { FormEvent, ForwardedRef, forwardRef } from 'react';

type Props = {
  allCompleted: boolean;
  isListEmpty: boolean;
  onToggleAll: () => Promise<void>;
  onSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
};

const Header = forwardRef<HTMLInputElement, Props>(function HeaderWithRef(
  { allCompleted, isListEmpty, onSubmit, onToggleAll },
  ref: ForwardedRef<HTMLInputElement>,
) {
  return (
    <header className="todoapp__header">
      {!isListEmpty && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all hidden', {
            active: allCompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={onToggleAll}
        />
      )}

      <form onSubmit={onSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          name="todo"
          ref={ref}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
        />
      </form>
    </header>
  );
});

export default Header;
