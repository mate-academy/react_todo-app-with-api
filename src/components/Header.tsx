import {
  FC, useEffect, useRef, useState, ChangeEvent, FormEvent,
} from 'react';
import cn from 'classnames';
import { useAppContext } from '../context/AppContext';

export const Header: FC = () => {
  const [inputValue, setInputValue] = useState<string>('');

  const todoInputRef = useRef<HTMLInputElement | null>(null);

  const {
    tempTodo,
    todos,
    completedTodosNum,
    addTodo,
    toggleAllStatus,
  } = useAppContext();

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleInputSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    addTodo(inputValue, setInputValue);
  };

  useEffect(() => {
    if (todoInputRef.current && tempTodo === null) {
      todoInputRef.current.focus();
    }
  }, [todos, tempTodo]);

  return (
    <header className="todoapp__header">
      {
        todos.length > 0 && (
          // eslint-disable-next-line jsx-a11y/control-has-associated-label
          <button
            type="button"
            className={cn('todoapp__toggle-all', {
              active: completedTodosNum === todos.length,
            })}
            data-cy="ToggleAllButton"
            onClick={toggleAllStatus}
          />
        )
      }

      {/* Add a todo on form submit */}
      <form
        onSubmit={handleInputSubmit}
      >
        <input
          value={inputValue}
          onChange={handleInputChange}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={todoInputRef}
          disabled={tempTodo !== null}
        />
      </form>
    </header>
  );
};
