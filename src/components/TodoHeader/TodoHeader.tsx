import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';

type Props = {
  onAddTodo: (title: string) => Promise<void>;
  areAllTodosCompleted: boolean;
  activeTodos: number;
  areThereTodos: boolean;
  toggleAll: (isChecked: boolean) => void,
};

export const TodoHeader: React.FC<Props> = React.memo((({
  onAddTodo,
  areAllTodosCompleted,
  areThereTodos,
  toggleAll,
}) => {
  const [isCheckedToggler, setIsCheckedToggler]
    = useState(areAllTodosCompleted);
  const inputField = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setIsCheckedToggler(areAllTodosCompleted);
  }, [areAllTodosCompleted]);

  const handlerToggleAll = () => {
    setIsCheckedToggler(current => {
      toggleAll(current);

      return !current;
    });
  };

  const resetInput = () => {
    if (inputField.current) {
      inputField.current.disabled = false;
      inputField.current.value = '';
      inputField.current.focus();
    }
  };

  const submitNewTodo = () => {
    if (inputField.current) {
      inputField.current.disabled = true;
      onAddTodo(inputField.current.value)
        .then(resetInput)
        .finally(() => {
          if (inputField.current) {
            inputField.current.disabled = false;
            inputField.current.focus();
          }
        });
    }
  };

  const handlerPressedKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      submitNewTodo();
    }
  };

  return (
    <header className="todoapp__header">
      {areThereTodos && (
        <button
          type="button"
          className={cn(
            'todoapp__toggle-all',
            { active: isCheckedToggler },
          )}
          aria-label="Close"
          onClick={handlerToggleAll}
        />
      )}

      <form>
        <input
          ref={inputField}
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onKeyDown={handlerPressedKey}
        />
      </form>
    </header>
  );
}));
