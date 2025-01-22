import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { RefObject } from 'react';

type Props = {
  todos: Todo[];
  handleToggleAllButton: () => void;
  handleSubmitButton: (event: React.FormEvent) => void;
  title: string;
  setTitle: (title: string) => void;
  isSubmitting: boolean;
  titleField: RefObject<HTMLInputElement>;
  serverTodosCount: number;
};

export const Header: React.FC<Props> = ({
  todos,
  handleToggleAllButton,
  handleSubmitButton,
  title,
  setTitle,
  isSubmitting,
  titleField,
  serverTodosCount,
}) => (
  <>
    {serverTodosCount > 0 && (
      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: !todos.find(todo => !todo.completed),
        })}
        data-cy="ToggleAllButton"
        onClick={handleToggleAllButton}
      />
    )}

    <form onSubmit={handleSubmitButton}>
      <input
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        ref={titleField}
        disabled={isSubmitting}
        value={title}
        onChange={event => {
          setTitle(event.target.value);
        }}
      />
    </form>
  </>
);
