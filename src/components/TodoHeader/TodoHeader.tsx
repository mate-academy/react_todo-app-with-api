import {
  useContext,
  useEffect,
  useRef,
} from 'react';
import cn from 'classnames';
import { TodosContext } from '../TodoContext/TodoContext';
import { ErrorTypes } from '../../types/ErrorTypes';

export const TodoHeader: React.FC = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const {
    isDisabled,
    todos,
    addTodo,
    setError,
    setTodoTitle,
    todoTitle,
    updateTodo,
  } = useContext(TodosContext);

  const active = todos.filter(el => !el.completed);

  const hendlerToggleAll = () => {
    const arrOfTodos = active.length ? active : todos;
    const checkedArr = arrOfTodos.map(el => (
      { ...el, completed: !!active.length }
    ));

    checkedArr.forEach(todo => {
      updateTodo(todo);
    });
  };

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedTitle = todoTitle.trim();

    if (!trimmedTitle) {
      setError(ErrorTypes.Empty);
      setTodoTitle('');

      return;
    }

    addTodo(trimmedTitle);
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [isDisabled]);

  return (
    <header className="todoapp__header">
      {!!todos.length && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', { active: !active.length })}
          data-cy="ToggleAllButton"
          aria-label="Toggle"
          onClick={hendlerToggleAll}
        />
      )}

      <form onSubmit={handleAddTodo}>
        <input
          value={todoTitle}
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={isDisabled}
          onChange={(e) => setTodoTitle(e.target.value)}
        />
      </form>
    </header>
  );
};
