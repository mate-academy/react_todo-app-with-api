import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { useState } from 'react';
import { TodoError } from '../../types/TodoError';

type Props = {
  todos: Todo[];
  isLoading: boolean;
  inputRef: { current: null | HTMLInputElement };
  setError: (error: TodoError) => void;
  onAdd: (title: string) => Promise<boolean>;
  error: string | null;
  onToggleAll: () => void;
};

export const TodoHeader: React.FC<Props> = ({
  todos,
  isLoading,
  inputRef,
  setError,
  onAdd,
  onToggleAll,
}) => {
  const [newTitle, setNewTitle] = useState('');

  const submitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!newTitle.trim().length) {
      setError(TodoError.TitleIsNotEmpty);

      return;
    }

    try {
      const addedTodo = await onAdd(newTitle.trim());

      if (addedTodo) {
        setNewTitle('');
      }
    } finally {
      inputRef.current?.focus();
    }
  };

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      {!isLoading && todos.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: todos.every(todo => todo.completed),
          })}
          data-cy="ToggleAllButton"
          onClick={onToggleAll}
        />
      )}

      {/* Add a todo on form submit */}
      <form onSubmit={submitHandler}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTitle}
          onChange={event => setNewTitle(event.target.value)}
        />
      </form>
    </header>
  );
};
