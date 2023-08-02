import { useState } from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';
import { ErrorType } from '../types/Error';

type Props = {
  todos: Todo[],
  setError: (value: ErrorType) => void;
  onAddTodo: (value: string) => Promise<void>;
  onStatusChange: (value: boolean)=>void;
};

export const NewTodo: React.FC<Props> = ({
  todos,
  setError,
  onAddTodo,
  onStatusChange,

}) => {
  const [newTodoTitle, setNewTodoTitle] = useState<string>('');
  const [disabledInput, setDisabledInput] = useState<boolean>(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!newTodoTitle.trim().length) {
      setError(ErrorType.Empty);

      return;
    }

    setDisabledInput(true);
    onAddTodo(newTodoTitle)
      .then(() => setNewTodoTitle(''))
      .finally(() => setDisabledInput(false));
  };

  const visibleTodos = todos.length;
  const completedTodos = todos.filter((todo) => todo.completed);

  return (
    <header className="todoapp__header">
      {visibleTodos > 0 && (
        // eslint-disable-next-line jsx-a11y/control-has-associated-label
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: completedTodos.length > 0,
          })}
          onClick={
            () => onStatusChange(completedTodos.length !== todos.length)
          }
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={disabledInput}
          value={newTodoTitle}
          onChange={(event) => setNewTodoTitle(event.target.value)}
        />
      </form>
    </header>
  );
};
