/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */

import {
  Dispatch, SetStateAction, useEffect, useRef, useState,
} from 'react';
import classNames from 'classnames';
import { Todo } from '../types/interfaces';

interface TodoHeaderProps {
  setTempTodo: Dispatch<SetStateAction<Todo | null>>
  setError: Dispatch<SetStateAction<string | null>>
  tempTodo: Todo | null
  error: string | null
  handleCheckAll: () => void
  todos: Todo[]
}

export const TodoHeader: React.FC<TodoHeaderProps> = ({
  setTempTodo,
  setError,
  tempTodo,
  error,
  handleCheckAll,
  todos,
}) => {
  const [onInput, setOnInput] = useState('');
  const [isInputDisabled, setIsInputDisabled] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && onInput.trim()) {
      event.preventDefault();
      setIsInputDisabled(true);

      setTempTodo({
        title: onInput.trim(),
        id: 0,
        completed: false,
        userId: 82,
      });
    } else if (event.key === 'Enter' && !onInput.trim()) {
      event.preventDefault();
      setError('Title should not be empty');
    }
  };

  if (!tempTodo && isInputDisabled) {
    if (!error) {
      setOnInput('');
    } else {
      setOnInput(prev => prev);
    }

    setIsInputDisabled(false);
  }

  useEffect(() => {
    inputRef.current?.focus();
  }, [onInput, error]);

  const toggleFlag = todos.filter(todo => todo.completed).length === todos.length;

  return (
    <header className="todoapp__header">
      {!!todos.length && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', { active: toggleFlag })}
          data-cy="ToggleAllButton"
          onClick={handleCheckAll}
        />
      )}

      <form>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={onInput}
          onKeyDown={handleKeyPress}
          onChange={(event) => setOnInput(event.target.value)}
          disabled={isInputDisabled}
        />
      </form>
    </header>
  );
};
