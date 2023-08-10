import classNames from 'classnames';

import { useEffect, useRef } from 'react';
import { Todo } from '../../types/Todo';
import { ErrorText } from '../../types/ErrorText';

type Props = {
  title: string,
  onSetTitle: (newTitle: string) => void,
  todos: Todo[],
  onAddTodos: () => void,
  onSetErrorMessage: (text: ErrorText) => void,
  isDisabledInput: boolean,
  onUpdateTodos: (newTodos: Todo[]) => void,
  onIsFocusedHeader: boolean,
};

function getChangeTodosCompleted(todos: Todo[]) {
  const changeTodosCompleted = todos.map(todo => {
    return { ...todo, completed: !todo.completed };
  });

  return changeTodosCompleted;
}

export const Header: React.FC<Props> = ({
  title,
  onSetTitle,
  todos,
  onAddTodos,
  onSetErrorMessage,
  isDisabledInput,
  onUpdateTodos,
  onIsFocusedHeader,
}) => {
  const activeTodos = todos.filter(t => t.completed === false);

  const handlerCompletedAll = () => {
    const newTodos = (activeTodos.length < 1)
      ? getChangeTodosCompleted(todos)
      : getChangeTodosCompleted(activeTodos);

    return onUpdateTodos(newTodos);
  };

  const handlerCreatedTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    onSetTitle(value);
  };

  const handlerSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (title.length < 1) {
      onSetErrorMessage(ErrorText.EmptyTitle);

      return;
    }

    onAddTodos();
  };

  const editedCompletedInput = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (editedCompletedInput.current !== null && onIsFocusedHeader) {
      editedCompletedInput.current.focus();
    }
  }, [todos]);

  return (
    <header className="todoapp__header">
      <button
        aria-label="Select-all-or-Deselect-all"
        type="button"
        className={classNames(
          'todoapp__toggle-all', { active: activeTodos.length < 1 },
        )}
        onClick={handlerCompletedAll}
      />

      <form onSubmit={handlerSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={isDisabledInput}
          value={title}
          onChange={handlerCreatedTitle}
          ref={editedCompletedInput}
        />
      </form>
    </header>
  );
};
