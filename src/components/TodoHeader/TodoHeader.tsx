import React, { useCallback, useState } from 'react';
import cn from 'classnames';

type Props = {
  activeButton: boolean,
  createNewTodo: (title: string) => Promise<void>
  updateAllTodoCheck: (areAllCompleted: boolean) => Promise<void>
  setSpinnerForAll: React.Dispatch<React.SetStateAction<boolean>>
};
const TodoHeader: React.FC<Props> = React.memo(({
  activeButton,
  createNewTodo,
  setSpinnerForAll,
  updateAllTodoCheck,
}) => {
  const [newTodoValue, setNewTodoValue] = useState<string>('');
  const [isInputDisabled, setIsInputDisabled] = useState<boolean>(false);

  const onChangeHandler = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setNewTodoValue(event.target.value);
    }, [],
  );

  const onSubmitHandler = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      setIsInputDisabled(true);
      e.preventDefault();

      createNewTodo(newTodoValue).finally(() => {
        setIsInputDisabled(false);
      });

      if (newTodoValue !== '') {
        setNewTodoValue('');
      }
    }, [newTodoValue],
  );

  const onUpdateAllHandler = useCallback(() => {
    setSpinnerForAll(true);

    updateAllTodoCheck(activeButton).finally(() => {
      setSpinnerForAll(false);
    });
  }, [updateAllTodoCheck, setSpinnerForAll]);

  return (
    <header className="todoapp__header">
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        type="button"
        onClick={onUpdateAllHandler}
        className={cn(
          'todoapp__toggle-all',
          { active: activeButton },
        )}
      />

      <form onSubmit={onSubmitHandler}>
        <input
          type="text"
          disabled={isInputDisabled}
          onChange={onChangeHandler}
          value={newTodoValue}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
        />
      </form>
    </header>
  );
});

export { TodoHeader };
