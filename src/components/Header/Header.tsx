import classNames from 'classnames';
import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

type Props = {
  addTodo: (title: string) => void;
  hasActive: boolean;
  isInputActive: boolean;
  hasTodos: boolean;
  toggleAll: () => void;
};

export const Header: React.FC<Props> = ({
  addTodo,
  hasActive,
  isInputActive,
  hasTodos,
  toggleAll,
}) => {
  const [title, setTitle] = useState('');
  const todoInput = useRef<HTMLInputElement | null>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    addTodo(title);
    setTitle('');
  };

  useEffect(() => {
    if (todoInput.current) {
      todoInput.current.focus();
    }
  }, [isInputActive]);

  const handleChangeTitle = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setTitle(event.target.value);
    }, [title],
  );

  return (
    <header className="todoapp__header">
      {hasTodos && (
        <button
          type="button"
          aria-label="All"
          className={classNames(
            'todoapp__toggle-all',
            { active: !hasActive },
          )}
          onClick={toggleAll}
        />
      )}
      <form onSubmit={handleSubmit}>
        <input
          ref={todoInput}
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={handleChangeTitle}
          disabled={!isInputActive}
        />
      </form>
    </header>
  );
};
