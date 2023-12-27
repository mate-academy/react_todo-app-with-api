import {
  memo,
  useRef,
  useEffect,
  useState,
} from 'react';
import cn from 'classnames';
import { ErrorType } from '../types/errors-enum';
import { Todo } from '../types/Todo';

interface Props {
  onTitle: (e: React.ChangeEvent<HTMLInputElement>) => void,
  title: string,
  onCreateTodo: () => void,
  onError: (error: ErrorType.EmptyInput) => void,
  isLoading: boolean,
  onStatusChange: (id: number) => void,
  todosForMap: Todo [],
  hasDeleted: boolean,
  hasTodosFromServer: boolean,
}

export const Header: React.FC<Props> = memo(({
  onTitle,
  title,
  onCreateTodo,
  onError,
  isLoading,
  onStatusChange,
  todosForMap,
  hasDeleted,
  hasTodosFromServer,
}) => {
  const [isAllToggled, setAllToggled] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [isLoading, hasDeleted]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (title.trim()) {
      onCreateTodo();
    } else {
      onError(ErrorType.EmptyInput);
    }
  };

  const completedTodos = todosForMap.filter(({ completed }) => completed);
  const hasOnlyComleted = completedTodos.length === todosForMap.length;

  useEffect(() => {
    if (hasOnlyComleted) {
      setAllToggled(true);
    } else {
      setAllToggled(false);
    }
  }, [hasOnlyComleted]);

  const onToggleAll = () => {
    const uncompletedTodos = todosForMap.filter(({ completed }) => !completed);

    if (!isAllToggled) {
      uncompletedTodos.forEach(({ id }) => {
        onStatusChange(id);
      });

      setAllToggled(true);
    } else {
      todosForMap.forEach(({ id }) => {
        onStatusChange(id);
      });
    }
  };

  return (
    <header className="todoapp__header">
      {hasTodosFromServer
        && (
          <button
            type="button"
            className={cn('todoapp__toggle-all', {
              active: isAllToggled,
            })}
            data-cy="ToggleAllButton"
            aria-label="Toggle All Button"
            onClick={onToggleAll}
          />
        )}

      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={(e) => onTitle(e)}
          disabled={isLoading}
        />
      </form>
    </header>
  );
});
