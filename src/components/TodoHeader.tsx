/* eslint-disable jsx-a11y/control-has-associated-label */
import { memo, useState, FC } from 'react';

type Props = {
  newTodoField: React.RefObject<HTMLInputElement>,
  createTodo: (title: string) => void;
  toglleAll: () => void;
};

export const TodoHeader: FC<Props> = memo((props) => {
  const {
    createTodo,
    toglleAll,
  } = props;

  const [title, setTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const onSubmit = () => {
    setIsAdding(true);
    createTodo(title);
    setTitle('');
    setIsAdding(false);
  };

  return (
    <header className="todoapp__header">
      <button
        data-cy="ToggleAllButton"
        type="button"
        className="todoapp__toggle-all active"
        onClick={toglleAll}
      />

      <form onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
      >
        <input
          data-cy="NewTodoField"
          type="text"
          ref={props.newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          disabled={isAdding}
        />
      </form>
    </header>
  );
});
