import classNames from 'classnames';
import { useEffect, useRef, useState } from 'react';
import { ErrorMessages } from '../../types/ErrorMessages';
import { Todo } from '../../types/Todo';
import { ToggleType } from '../../types/ToggleType';

type Props = {
  todos: Todo[],
  onAddNewTodo: (todoTitle: string) => Promise<boolean>,
  onSetErrorMessage: (error: ErrorMessages) => void,
  setToggleType: (toggleType: ToggleType) => void,
};

export const TodoHeader: React.FC<Props> = ({
  todos,
  onAddNewTodo,
  onSetErrorMessage,
  setToggleType,
}) => {
  const [title, setTitle] = useState('');
  const titleFieldRef = useRef<HTMLInputElement>(null);
  const [isDisabled, setIsDisabled] = useState(false);

  const activeTodosAmount = todos.filter(({ completed }) => !completed).length;

  useEffect(() => {
    if (titleFieldRef.current) {
      titleFieldRef.current.focus();
    }
  }, [todos, isDisabled]);

  const handleSubmitForm = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim()) {
      onSetErrorMessage(ErrorMessages.EmptyTitleReceived);

      return;
    }

    try {
      setIsDisabled(true);

      const isSuccess = await onAddNewTodo(title.trim());

      if (isSuccess) {
        setTitle('');
      }

      setIsDisabled(false);
      titleFieldRef.current?.focus();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  };

  const handleSetTodoFilter = () => {
    setToggleType(activeTodosAmount
      ? ToggleType.ToggleOn
      : ToggleType.ToggleOff);
  };

  return (
    <header className="todoapp__header">
      {!!todos && (
        <button
          type="button"
          aria-label="Toggle All Todos"
          className={classNames(
            'todoapp__toggle-all',
            {
              active: !activeTodosAmount,
            },
          )}
          data-cy="ToggleAllButton"
          onClick={handleSetTodoFilter}
        />
      )}

      <form onSubmit={handleSubmitForm}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          ref={titleFieldRef}
          disabled={isDisabled}
          onChange={(event) => setTitle(event.target.value)}
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus
        />
      </form>
    </header>
  );
};
