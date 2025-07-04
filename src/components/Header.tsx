import { Todo } from '../types/Todo';
import * as service from '../api/todos';
import classNames from 'classnames';

type Props = {
  todo: Todo | null;
  onAddTodo: (todo: Todo) => Promise<void>;
  title: string;
  setTitle: (title: string) => void;
  handleError: (msg: string) => void;
  onReset: () => void;
  inputRef: React.RefObject<HTMLInputElement>;
  isSubmiting: boolean;
  loading: boolean;
  setIsSubmiting: (value: boolean) => void;
  onToggleComplete: () => void;
  allCompleted: boolean;
  todosCount: number;
};

export const Header: React.FC<Props> = ({
  onAddTodo,
  title,
  setTitle,
  handleError,
  onReset,
  inputRef,
  isSubmiting,
  loading,
  setIsSubmiting,
  onToggleComplete,
  allCompleted,
  todosCount,
}) => {
  const handlSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const trimed = title.trim();

    if (!trimed) {
      handleError('Title should not be empty');

      return;
    }

    setIsSubmiting(true);
    onAddTodo({
      id: 0,
      userId: service.USER_ID,
      title: trimed,
      completed: false,
    })
      .then(() => {
        onReset();
      })
      .finally(() => setIsSubmiting(false));
  };

  return (
    <header className="todoapp__header">
      {!loading && todosCount > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: allCompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={onToggleComplete}
        />
      )}
      <form onSubmit={handlSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className={classNames('todoapp__new-todo', {
            'is-loading': isSubmiting,
          })}
          placeholder="What needs to be done?"
          ref={inputRef}
          disabled={isSubmiting}
          value={title}
          onChange={e => setTitle(e.target.value)}
          onBlur={e => {
            if (!e.target.value && !isSubmiting) {
              handleError('Title should not be empty');
            }
          }}
        />
      </form>
    </header>
  );
};
