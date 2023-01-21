import classNames from 'classnames';
import {
  FC, FormEvent, useEffect, useMemo, useRef, useState,
} from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[],
  activeTodosAmount: number,
  onAddTodo: (title: string) => void,
  isAdding?: boolean,
  onToggleAll: (toggle: boolean) => void,
};

export const TodosHeader: FC<Props> = ({
  todos,
  activeTodosAmount,
  onAddTodo,
  isAdding = false,
  onToggleAll,
}) => {
  const newTodoField = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState('');
  const toggleAllActive
    = useMemo(() => activeTodosAmount === 0, [activeTodosAmount]);
  const handleFormSubmit = (title: string, event: FormEvent) => {
    event.preventDefault();
    onAddTodo(title);
    setInputValue('');
  };

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          data-cy="ToggleAllButton"
          type="button"
          className={classNames(
            'todoapp__toggle-all',
            { active: toggleAllActive },
          )}
          aria-label="Toggle all Todos"
          onClick={() => onToggleAll(toggleAllActive)}
        />
      )}

      <form
        onSubmit={(event => handleFormSubmit(inputValue, event))}
      >
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          disabled={isAdding}
          value={inputValue}
          onChange={(event) => setInputValue(event.currentTarget.value)}
          placeholder="What needs to be done?"
        />
      </form>
    </header>
  );
};
