import React, { memo, useState } from 'react';

import { USER_ID } from '../../constans';
import { Todo } from '../../types/Todo';

interface Props {
  addTodo: (todo: Todo) => Promise<void>;
  newError: (error: string) => void;
  onTempTodo: (todo: Todo) => void;
  onLoading: (completed: boolean) => void;
  loading: boolean;
  titleField: React.RefObject<HTMLInputElement>;
}

export const TodoForm: React.FC<Props> = memo(function TodoFormComponent({
  addTodo,
  newError,
  onTempTodo,
  loading,
  onLoading,
  titleField,
}) {
  const [title, setTitle] = useState('');

  const reset = () => setTitle('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const normalizeTitle = title.trim();

    if (!normalizeTitle) {
      newError('Title should not be empty');
      onLoading(false);

      return;
    }

    onLoading(true);

    const id = 0;

    const todo: Todo = {
      id: id,
      userId: USER_ID,
      completed: false,
      title: normalizeTitle,
    };

    onTempTodo(todo);

    addTodo(todo)
      .then(reset)
      .finally(() => onLoading(false));
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        ref={titleField}
        value={title}
        disabled={loading}
        onChange={event => setTitle(event.target.value)}
      />
    </form>
  );
});
