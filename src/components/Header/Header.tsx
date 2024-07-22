import { Todo } from '../../types/Todo';
import { useRef, useEffect, useState } from 'react';
import { ErrorValues } from '../../types/errorValues';
import cn from 'classnames';

interface Props {
  creatTodo: (todo: Todo) => Promise<void>;
  loading: number[] | null;
  setLoading: (val: number[] | null) => void;
  showNewError: (str: string) => void;
  todos: Todo[];
  handleEditMultiple: () => void;
}

export const Header: React.FC<Props> = ({
  creatTodo,
  loading,
  setLoading,
  showNewError,
  todos,
  handleEditMultiple,
}) => {
  const [title, setTitle] = useState('');

  const isAllComplited = todos.every(todo => todo.completed);

  const newTodoFieldFocus = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (newTodoFieldFocus.current || loading === null) {
      newTodoFieldFocus.current?.focus();
    }
  }, [loading, todos.length]);

  const reset = () => {
    setTitle('');
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const normalizeTitle = title.trim();

    if (!normalizeTitle) {
      showNewError(ErrorValues.Empty);
      setLoading(null);

      return;
    }

    const todo: Todo = {
      id: 0,
      userId: 901,
      completed: false,
      title: normalizeTitle,
    };

    try {
      setLoading([todo.id]);
      await creatTodo(todo);
      reset();
    } catch (error) {
    } finally {
      setLoading(null);
    }
  };

  return (
    <header className="todoapp__header">
      {todos.length !== 0 && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', { active: isAllComplited })}
          data-cy="ToggleAllButton"
          onClick={() => handleEditMultiple()}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          ref={newTodoFieldFocus}
          value={title}
          disabled={!!loading}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={event => setTitle(event.target.value)}
        />
      </form>
    </header>
  );
};
