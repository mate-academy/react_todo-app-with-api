import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  inputREf: React.RefObject<HTMLInputElement>;
  todos: Todo[];
  inputValue: string;
  isDisabled: boolean;
  handleInput: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmitForm: (event: React.FormEvent<HTMLFormElement>) => void;
  handelResetallCompleted: () => void;
};

export const Header = ({
  inputREf,
  todos,
  handleInput,
  handleSubmitForm,
  handelResetallCompleted,
  inputValue,
  isDisabled,
}: Props) => {
  const allCopleatedTrue = todos.every(todo => todo.completed);

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      {todos.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: allCopleatedTrue,
          })}
          data-cy="ToggleAllButton"
          onClick={handelResetallCompleted}
        />
      )}

      {/* Add a todo on form submit */}
      <form onSubmit={handleSubmitForm}>
        <input
          value={inputValue}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={handleInput}
          autoFocus
          disabled={isDisabled}
          ref={inputREf}
        />
      </form>
    </header>
  );
};

export default Header;
