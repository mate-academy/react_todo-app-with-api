/* eslint-disable jsx-a11y/control-has-associated-label */
import { memo, FormEvent } from 'react';

type Props = {
  newTodoField: React.RefObject<HTMLInputElement>,
  title: string,
  onSetTitle: (query: string) => void,
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  isAdding: boolean;
};

export const TodoHeader: React.FC<Props> = memo((props) => {
  const {
    title,
    onSetTitle,
    onSubmit,
    isAdding,
  } = props;

  return (
    <header className="todoapp__header">
      <button
        data-cy="ToggleAllButton"
        type="button"
        className="todoapp__toggle-all active"
      />

      <form onSubmit={(event) => onSubmit(event)}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={props.newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={(event) => onSetTitle(event.target.value)}
          disabled={isAdding}
        />
      </form>
    </header>
  );
});
