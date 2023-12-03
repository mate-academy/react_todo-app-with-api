import { useState, useRef, useEffect } from 'react';
import cn from 'classnames';

import { TyChangeEvtInputElmt } from '../types/General';
import { Todo } from '../types/Todo';
import { TodoError } from '../types/TodoError';

type Props = {
  onAddTodo: (todo: Omit<Todo, 'id' | 'userId'>) => Promise<Todo | void>;
  onToggleAll?: () => void;
  onErrorCreate?: (errMsg: TodoError) => void;
  isEachTodoComplete?: boolean;
};

export const TodoHeader: React.FC<Props> = ({
  onAddTodo,
  onToggleAll = () => { },
  onErrorCreate = () => { },
  isEachTodoComplete = false,
}) => {
  const [title, setTitle] = useState('');
  const titleInput = useRef<HTMLInputElement>(null);

  const handleInputChange = (event: TyChangeEvtInputElmt) => {
    setTitle(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const trimedTitle = title.trim();

    if (trimedTitle === '') {
      onErrorCreate(TodoError.EMPTY_TITLE);

      return;
    }

    if (titleInput.current?.disabled) {
      return;
    }

    if (titleInput.current) {
      titleInput.current.disabled = true;
    }

    onAddTodo({
      title: trimedTitle,
      completed: false,
    }).finally(() => {
      if (titleInput.current) {
        titleInput.current.disabled = false;
        titleInput.current.focus();
      }

      setTitle('');
    });
  };

  useEffect(() => {
    if (titleInput.current) {
      titleInput.current.focus();
    }
  }, [titleInput]);

  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}
      <button
        type="button"
        className={cn('todoapp__toggle-all', {
          active: isEachTodoComplete,
        })}
        data-cy="ToggleAllButton"
        aria-label="ToggleAllButton"
        onClick={onToggleAll}
      />

      {/* Add a todo on form submit */}
      <form
        onSubmit={handleSubmit}
      >
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={titleInput}
          value={title}
          onChange={handleInputChange}
        />
      </form>
    </header>
  );
};
