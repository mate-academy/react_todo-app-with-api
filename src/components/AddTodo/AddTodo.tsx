import {
  ChangeEvent, FC, FormEvent, useEffect, useRef, useState,
} from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

interface AddTodoProps {
  todos: Todo[];
  onDisable: boolean;
  onAddTodo: (query: string) => void;
  activeTodosCount: number
  onChangeAllStatus: () => void;
}

export const AddTodo: FC<AddTodoProps> = ({
  onAddTodo,
  onDisable,
  activeTodosCount,
  onChangeAllStatus,
  todos,
}) => {
  const [title, setTitle] = useState('');

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current !== null) {
      inputRef.current.focus();
    }
  }, [onDisable]);

  const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onAddTodo(title);
    setTitle('');
  };

  return (
    <header className="todoapp__header">
      {todos.length !== 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: !activeTodosCount,
          })}
          aria-label="all"
          onClick={onChangeAllStatus}
        />
      )}

      <form onSubmit={handleFormSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={handleTitleChange}
          disabled={onDisable}
          ref={inputRef}
        />
      </form>
    </header>
  );
};
