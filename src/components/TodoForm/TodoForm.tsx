import { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';
import cn from 'classNames';

interface Props {
  todos: Todo[];
  todoTitle: string;
  isProcessing: boolean;
  tempTodo: Todo | null;
  onNewTodo: (event: React.FormEvent) => void;
  onTodoTitle: (title: string) => void;
  onToggleAll: () => void;
}

export const TodoForm: React.FC<Props> = ({
  todos,
  todoTitle,
  isProcessing,
  tempTodo,
  onNewTodo,
  onTodoTitle,
  onToggleAll,
}) => {
  const [isActive, setIsActive] = useState(false);
  const titleField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const currentField = titleField.current;

    if (currentField !== null) {
      currentField.focus();
    }
  }, [titleField, todos, tempTodo]);

  useEffect(() => {
    const isAllCompleted = todos.every(todo => todo.completed === true);

    if (isAllCompleted && todos.length > 0) {
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  }, [todos]);

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', { active: isActive })}
          data-cy="ToggleAllButton"
          onClick={onToggleAll}
        />
      )}

      <form onSubmit={onNewTodo}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={event => onTodoTitle(event.target.value)}
          value={todoTitle}
          ref={titleField}
          disabled={isProcessing}
        />
      </form>
    </header>
  );
};
