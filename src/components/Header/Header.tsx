import {
  ChangeEventHandler,
  FC,
  FormEvent,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useTodos } from '../../providers';
import classNames from 'classnames';

export const Header: FC = () => {
  const [inputValue, setInputValue] = useState('');
  const {
    onAddTodo: addTodo,
    isLoading,
    error,
    allTodos,
    activeTodos,
    completedTodos,
    onUpdateTodo,
  } = useTodos();
  const input = useRef<HTMLInputElement>(null);

  const isAllCompleted = allTodos.length === completedTodos.length;

  const handleToggleAll = () => {
    onUpdateTodo(
      ...(isAllCompleted
        ? completedTodos.map(t => ({ ...t, completed: !isAllCompleted }))
        : activeTodos.map(t => ({ ...t, completed: !isAllCompleted }))),
    );
  };

  useEffect(() => {
    if (!isLoading) {
      if (!error) {
        setInputValue('');
      }

      input.current?.focus();
    }
  }, [input, isLoading]);

  const handleInputChange: ChangeEventHandler<HTMLInputElement> = ({
    target: { value },
  }) => setInputValue(value);

  const handleAddTodo = (e: FormEvent) => {
    e.preventDefault();
    addTodo(inputValue.trim());
  };

  return (
    <header className="todoapp__header">
      {!isLoading && !!allTodos.length && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: isAllCompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={handleToggleAll}
          disabled={isLoading}
        />
      )}

      <form onSubmit={handleAddTodo}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={inputValue}
          onChange={handleInputChange}
          disabled={isLoading}
          autoFocus
          ref={input}
        />
      </form>
    </header>
  );
};
