/* eslint-disable jsx-a11y/control-has-associated-label */
import { FC, useMemo, useState } from 'react';

import cn from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  setError: (error: string) => void;
  addTodo: (title: string) => void;
  tempTodo: Todo | null;
  updateTodoInfo: (
    todoId: number,
    newTodoData: Partial <Pick<Todo, 'title' | 'completed'>>
  ) => Promise<void>;
};

export const Header: FC<Props> = ({
  todos,
  setError,
  addTodo,
  tempTodo,
  updateTodoInfo,
}) => {
  const [newTodoTitle, setNewTodoTitle] = useState('');

  const isAllTodosCompleted = useMemo(() => (
    todos.every(todo => todo.completed)
  ), [todos]);

  const handleToggleAllButton = () => {
    todos.forEach(async (todo) => {
      await updateTodoInfo(
        todo.id,
        { completed: !isAllTodosCompleted },
      );
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!newTodoTitle.trim()) {
      setError('Title can\'t be empty');

      return;
    }

    await addTodo(newTodoTitle);
    setNewTodoTitle('');
  };

  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}
      <button
        type="button"
        className={cn('todoapp__toggle-all', {
          active: isAllTodosCompleted,
        })}
        onClick={handleToggleAllButton}
      />

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodoTitle}
          onChange={(event) => setNewTodoTitle(event.target.value)}
          disabled={tempTodo !== null}
        />
      </form>
    </header>
  );
};
