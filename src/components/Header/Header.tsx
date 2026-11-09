import cn from 'classnames';
import './Header.scss';
import { Todo } from '../../types/Todo';
import { useEffect, useState, useRef } from 'react';

type Props = {
  todos: Todo[] | undefined;
  handleSubmit: (title: string, setTitle: (newTitle: string) => void) => void;
  isLoading: boolean;
  onUpdate: (todoId: number, title: string | number, completed: boolean) => void;
};

export const Header = ({ todos, handleSubmit, isLoading, onUpdate }: Props) => {
  const [title, setTitle] = useState('');
  const newTodoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isLoading) {
      newTodoField.current?.focus();
    }
  }, [isLoading, todos]);

  return (
    <header className="todoapp__header">
      {todos && todos.length > 0 && (
        <button
          type="button"
          className={cn({
            'todoapp__toggle-all': true,
            active: todos?.every(todo => todo.completed),
          })}
          data-cy="ToggleAllButton"
          onClick={() => {
            const allCompleted = todos?.every(todo => todo.completed);
            const nextStatus = !allCompleted;
            todos
              .filter(todo => todo.completed !== nextStatus)
              .forEach(todo => {
                onUpdate(todo.id, todo.title, nextStatus);
              })
          }}
        />
      )}
      {/* Add a todo on form submit */}
      <form
        onSubmit={event => {
          event.preventDefault();
          handleSubmit(title, setTitle);
        }}
      >
        <input
          ref={newTodoField}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          autoFocus
          value={title}
          onChange={event => setTitle(event.target.value)}
          disabled={isLoading}
        />
      </form>
    </header>
  );
};
