/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import { useEffect, useRef, useState } from 'react';
import { CurrentError } from '../../types/CurrentError';
import { Todo } from '../../types/Todo';
import { ToggleType } from '../../types/ToggleType';

type Props = {
  todos: Todo[],
  onAddNewTodo: (todoTitle: string) => Promise<boolean>,
  onSetErrorMessage: (error: CurrentError) => void,
  setToggleType: (toggleType: ToggleType) => void,
};

export const TodoHeader: React.FC<Props> = ({
  todos,
  onAddNewTodo,
  onSetErrorMessage,
  setToggleType,
}) => {
  const [title, setTitle] = useState('');
  const titleField = useRef<HTMLInputElement>(null);
  const [isDisabled, setIsDisabled] = useState(false);

  const activeTodosCount = todos.filter(({ completed }) => !completed).length;

  useEffect(() => {
    if (titleField.current) {
      titleField.current.focus();
    }
  }, [todos, isDisabled]);

  const handleSubmitForm = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim()) {
      onSetErrorMessage(CurrentError.EmptyTitleError);

      return;
    }

    try {
      setIsDisabled(true);

      const isSuccess = await onAddNewTodo(title.trim());

      if (isSuccess) {
        setTitle('');
      }

      setIsDisabled(false);
      titleField.current?.focus();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  };

  const handleSetTodoFilter = () => {
    if (activeTodosCount === 0) {
      setToggleType(ToggleType.ToggleOff);
    } else {
      setToggleType(ToggleType.ToggleOn);
    }
  };

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={classNames(
            'todoapp__toggle-all',
            {
              active: !activeTodosCount,
            },
          )}
          data-cy="ToggleAllButton"
          onClick={handleSetTodoFilter}
        />
      )}

      {/* Add a todo on form submit */}
      <form onSubmit={handleSubmitForm}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          ref={titleField}
          disabled={isDisabled}
          onChange={(event) => setTitle(event.target.value)}
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus
        />
      </form>
    </header>
  );
};
