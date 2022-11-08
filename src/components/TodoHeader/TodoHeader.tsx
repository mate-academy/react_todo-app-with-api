import classNames from 'classnames';
import {
  useEffect,
  useRef,
} from 'react';

/* eslint-disable jsx-a11y/control-has-associated-label */

type Props = {
  isAdding: boolean,
  newTodoTitle: string,
  setNewTodoTitle: (value: string) => void,
  handlerSubmitForm: (event: React.FormEvent<HTMLFormElement>) => void,
  isAllTodosCompleted: boolean,
  handlerClickToggleAll: () => void,
};

export const TodoHeader:React.FC<Props> = ({
  isAdding,
  newTodoTitle,
  isAllTodosCompleted,
  setNewTodoTitle,
  handlerSubmitForm,
  handlerClickToggleAll,
}) => {
  const newTodoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

  return (
    <header className="todoapp__header">
      <button
        data-cy="ToggleAllButton"
        type="button"
        className={classNames(
          'todoapp__toggle-all',
          { active: isAllTodosCompleted },
        )}
        onClick={handlerClickToggleAll}
      />

      <form onSubmit={handlerSubmitForm}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodoTitle}
          onChange={(event) => setNewTodoTitle(event.target.value)}
          disabled={isAdding}
        />
      </form>
    </header>
  );
};
