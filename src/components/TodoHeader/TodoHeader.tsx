import cn from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';
type Props = {
  todoList: Todo[];
  isSubmiting: boolean;
  isClearTitle: boolean;
  onSetIsClearTitle: (needClear: boolean) => void;
  onHandleAddingTodo: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onHandleToggleAllTodos: () => void;
};

export const TodoHeader: React.FC<Props> = ({
  todoList,
  isSubmiting,
  isClearTitle,
  onSetIsClearTitle,
  onHandleAddingTodo,
  onHandleToggleAllTodos,
}) => {
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  });

  useEffect(() => {
    if (isClearTitle) {
      setValue('');
      onSetIsClearTitle(false);
    }
  }, [isClearTitle]);

  const handleInputOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  const isAllTodosCompleted = todoList.every(({ completed }) => completed);

  return (
    <header className="todoapp__header">
      {todoList.length > 0 && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: isAllTodosCompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={onHandleToggleAllTodos}
        />
      )}

      <form>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={inputRef}
          disabled={isSubmiting}
          onKeyDown={onHandleAddingTodo}
          onChange={handleInputOnChange}
          value={value}
        />
      </form>
    </header>
  );
};
