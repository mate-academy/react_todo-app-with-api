import { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { UpdateTodo } from '../types/UpdateTodo';

interface Props {
  todos: Todo[];
  handleAddingNewTodo: (title: string) => void;
  isLoading: boolean;
  isAllTodosCompleted: boolean;
  handleUpdatingTodo: (todoId: number, args: UpdateTodo) => void;
}

export const Header: React.FC<Props> = ({
  todos,
  handleAddingNewTodo,
  isLoading,
  isAllTodosCompleted,
  handleUpdatingTodo,
}) => {
  const [newTodo, setNewTodo] = useState<string>('');

  const inputField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputField.current) {
      inputField.current.focus();
    }
  }, []);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleAddingNewTodo(newTodo);
    setNewTodo('');
  };

  const handleResetingCompletedTodos = () => {
    todos.map(todo => {
      if (todo.completed) {
        handleUpdatingTodo(todo.id, { completed: !todo.completed });
      }

      return null;
    });
  };

  return (
    <header className="todoapp__header">
      {todos.length > 0
      && (
        // eslint-disable-next-line jsx-a11y/control-has-associated-label
        <button
          type="button"
          className={classNames(
            'todoapp__toggle-all', { active: isAllTodosCompleted },
          )}
          onClick={() => handleResetingCompletedTodos()}
        />
      )}

      <form
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          disabled={isLoading}
          value={newTodo}
          ref={inputField}
          onChange={event => setNewTodo(event.target.value)}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
        />
      </form>
    </header>
  );
};
