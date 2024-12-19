import { FC, useEffect, useRef } from 'react';
import { Todo } from '../../types/Todo';
import cn from 'classnames';
import { ErrorMessages } from '../../types/ErrorMessages';
import { USER_ID } from '../../api/todos';

interface Props {
  todos: Todo[];
  onAddTodo: (newTodo: Todo) => void;
  onCheckForErrors: (error: ErrorMessages) => void;
  receivingAnswer: boolean;
  newTitle: string;
  setNewTitle: (newTitle: string) => void;
  onToggleAll: () => void;
}

export const Header: FC<Props> = ({
  todos,
  onAddTodo,
  onCheckForErrors,
  receivingAnswer,
  newTitle,
  setNewTitle,
  onToggleAll,
}) => {
  const areAllCompleted = todos.every(todo => todo.completed);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!newTitle) {
      onCheckForErrors(ErrorMessages.TITLE_SHOULD_NOT_BE_EMPTY);

      return;
    }

    const newTodo: Todo = {
      id: 0,
      userId: USER_ID,
      title: newTitle.trim(),
      completed: false,
    };

    onAddTodo(newTodo);
  };

  useEffect(() => {
    if (!receivingAnswer && inputRef.current) {
      inputRef.current.focus();
    }
  }, [receivingAnswer]);

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: areAllCompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={onToggleAll}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          disabled={receivingAnswer}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTitle}
          onChange={event => setNewTitle(event.target.value.trimStart())}
        />
      </form>
    </header>
  );
};
