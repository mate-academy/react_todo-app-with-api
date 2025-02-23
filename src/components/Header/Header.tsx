import { useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { USER_ID } from '../../api/todos';

type Props = {
  addTodo: ({ title, userId, completed }: Omit<Todo, 'id'>) => Promise<void>;
  isSubmiting: boolean;
  todos: Todo[];
  toggleStatus: (id: number) => void;
};

export const Header: React.FC<Props> = ({
  addTodo,
  isSubmiting,
  todos,
  toggleStatus,
}) => {
  const [title, setTitle] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSubmiting, todos]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const normalizedTitle = title.trim();

    const newTodo: Omit<Todo, 'id'> = {
      title: normalizedTitle,
      completed: false,
      userId: USER_ID,
    };

    return addTodo(newTodo).then(() => setTitle(''));
  };

  const activeTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);

  const onToggleStatusAll = () => {
    if (activeTodos.length > 0) {
      activeTodos.forEach(todo => toggleStatus(todo.id));
    } else {
      completedTodos.forEach(todo => toggleStatus(todo.id));
    }
  };

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: activeTodos.length === 0,
          })}
          data-cy="ToggleAllButton"
          onClick={onToggleStatusAll}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={event => setTitle(event.target.value)}
          disabled={isSubmiting}
        />
      </form>
    </header>
  );
};
