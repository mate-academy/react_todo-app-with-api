import { RefObject } from 'react';
import { Todo } from '../../types/Todo';
import classNames from 'classnames';

type Props = {
  arrow: () => void;
  inputRef: RefObject<HTMLInputElement>;
  todos: Todo[];
  handleSubmit: (newTodoLabel: string) => void;
  inputValue: string;
  setInputValue: (value: string) => void;
  isLoadingAdd: boolean;
  isLoadingTodos: boolean;
};

export const Head = ({
  arrow,
  inputRef,
  todos,
  handleSubmit,
  inputValue,
  setInputValue,
  isLoadingAdd,
  isLoadingTodos,
}: Props) => {
  return (
    <header className="todoapp__header">
      {!isLoadingTodos && todos.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: todos.every(todo => todo.completed),
          })}
          data-cy="ToggleAllButton"
          onClick={() => arrow()}
        />
      )}

      <form
        onSubmit={event => {
          event.preventDefault();
          handleSubmit(inputValue);
        }}
      >
        <input
          data-cy="NewTodoField"
          type="text"
          defaultValue=""
          value={inputValue}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={event => setInputValue(event.target.value)}
          ref={inputRef}
          disabled={isLoadingAdd}
        />
      </form>
    </header>
  );
};
