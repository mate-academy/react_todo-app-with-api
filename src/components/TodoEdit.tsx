/* eslint-disable jsx-a11y/no-autofocus */
import { FC, useState } from 'react';
import { useTodo } from '../providers/TodoProvider';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
};

export const TodoEdit: FC<Props> = ({ todo }) => {
  const [title, setTitle] = useState<string>(todo.title);

  const {
    setModifiedTodo,
    updateTodo,
    deleteTodoFromApi,
  } = useTodo();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement> | null = null,
  ) => {
    if (event) {
      event.preventDefault();
    }

    if (!title) {
      deleteTodoFromApi(todo.id);
    }

    if (title !== todo.title) {
      updateTodo(todo.id, { title: title.trim() });
    } else {
      setModifiedTodo(null);
    }
  };

  const handleCancel = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setModifiedTodo(null);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
    >
      <input
        data-cy="TodoTitleField"
        type="text"
        className="todo__title-field"
        placeholder="Empty todo will be deleted"
        value={title}
        onChange={handleChange}
        onBlur={() => handleSubmit()}
        onKeyUp={handleCancel}
        autoFocus
      />
    </form>
  );
};
