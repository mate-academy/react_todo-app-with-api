import { FC } from 'react';
import cn from 'classnames';
import { CreatedTodo, Todo } from '../types/Todo';

interface Props {
  title: string;
  setTitle: (value: string) => void;
  handleSubmit: (data: CreatedTodo) => Promise<Todo | void>;
  userId: number;
  todos: Todo[];
  setTodos: (todos: Todo[]) => void;
}

export const TodoHeader: FC<Props> = ({
  title,
  setTitle,
  handleSubmit,
  userId,
  todos,
  setTodos,
}) => {
  const isAllTodosComleted = todos.every(todo => todo.completed === true);

  const handleToggleAll = () => {
    const updatedTodos = todos.map(todo => ({
      ...todo,
      completed: !isAllTodosComleted,
    }));

    setTodos(updatedTodos);
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        aria-label="toggle all todos"
        className={cn('todoapp__toggle-all', { active: isAllTodosComleted })}
        onClick={handleToggleAll}
      />

      <form onSubmit={(event) => {
        event.preventDefault();
        handleSubmit({
          title,
          completed: false,
          userId,
        });
      }}
      >
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
      </form>
    </header>
  );
};
