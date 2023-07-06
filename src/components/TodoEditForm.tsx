import { useEffect, useState } from 'react';
import { changeTodoTitle } from '../api/todos';
import { Todo } from '../types/Todo';

type Props = {
  todoTitle: string;
  onTodoEditSubmit: (value: boolean) => void;
  onTodoDelete: (todoId: number) => void;
  todoId: number;
  onTodoSave: (value: boolean) => void;
  setError: (error: string) => void;
  onTodoEdit: (editedTodo: Todo) => void;
};

export const TodoEditForm: React.FC<Props> = ({
  onTodoEditSubmit,
  todoTitle,
  onTodoDelete,
  todoId,
  onTodoSave,
  setError,
  onTodoEdit,
}) => {
  const [title, setTitle] = useState(todoTitle);

  const handleEscapePress = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      onTodoEditSubmit(false);
      setTitle(todoTitle);
    }
  };

  useEffect(() => {
    window.addEventListener('keyup', handleEscapePress);

    return () => {
      window.removeEventListener('keyup', handleEscapePress);
    };
  }, []);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (title.trim() === todoTitle) {
      onTodoEditSubmit(false);

      return;
    }

    if (title.trim().length === 0) {
      onTodoEditSubmit(false);
      onTodoDelete(todoId);

      return;
    }

    onTodoSave(true);
    onTodoEditSubmit(false);

    try {
      const editedTodo = await changeTodoTitle(todoId, title);

      onTodoEdit(editedTodo);
    } catch {
      setError('Unable to update a todo');
    }

    onTodoSave(false);
  };

  return (
    <form
      onSubmit={handleFormSubmit}
      onBlur={handleFormSubmit}
    >
      <input
        type="text"
        className="todo__title-field"
        placeholder="Empty todo will be deleted"
        value={title}
        onChange={handleTitleChange}
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus
      />
    </form>
  );
};
