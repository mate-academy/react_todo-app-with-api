import React, { useCallback, useState } from 'react';
import cn from 'classnames';

type Props = {
  newTodoField: React.RefObject<HTMLInputElement>;
  addNewTodo: (todoTitle: string) => Promise<void>;
  isTodoAdding: boolean;
  isAllTodoActive: boolean;
  toggleAllHadler: (isAllActive: boolean) => void;
};

export const NewTodo: React.FC<Props> = React.memo(({
  newTodoField,
  addNewTodo,
  isTodoAdding,
  isAllTodoActive,
  toggleAllHadler,
}) => {
  const [titleField, setTitleField] = useState('');

  const handleInput = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setTitleField(event.target.value);
    }, [],
  );

  const onSubmitHandler = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (titleField.trim()) {
        addNewTodo(titleField);

        setTitleField('');
      }
    }, [titleField],
  );

  return (
    <header className="todoapp__header">
      <button
        aria-label="All todos active"
        data-cy="ToggleAllButton"
        type="button"
        className={cn('todoapp__toggle-all', { active: isAllTodoActive })}
        onClick={() => toggleAllHadler(isAllTodoActive)}
      />

      <form onSubmit={onSubmitHandler}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={titleField}
          onChange={handleInput}
          disabled={isTodoAdding}
        />
      </form>
    </header>
  );
});
