import { FormEvent, useState } from 'react';
import { Todo } from '../types/Todo';

interface Props {
  todo: Todo;
  onUpdateTodo: (todoId: Todo['id'], todo: Omit<Todo, 'id'>) => Promise<void>;
  onCancel: () => void;
  onDelete: (todoId: Todo['id']) => void;
}

export const UpdateTodoForm: React.FC<Props> = ({
  todo,
  onUpdateTodo,
  onCancel,
  onDelete,
}) => {
  const [newTodoTitle, setNewTodoTitle] = useState(todo.title);

  const handleSubmit = async (event?: FormEvent<HTMLFormElement>) => {
    event?.preventDefault();

    const trimmedTitle = newTodoTitle.trim();

    if (!trimmedTitle) {
      onDelete(todo.id);

      return;
    }

    if (trimmedTitle === todo.title) {
      onCancel();

      return;
    }

    onUpdateTodo(todo.id, {
      title: trimmedTitle,
      completed: todo.completed,
      userId: todo.userId,
    })
      .then(() => onCancel())
      .catch(() => {});
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      onCancel();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        data-cy="TodoTitleField"
        type="text"
        className="todo__title-field"
        placeholder="Empty todo will be deleted"
        value={newTodoTitle}
        onChange={event => setNewTodoTitle(event.target.value)}
        onBlur={() => handleSubmit()}
        onKeyUp={handleKeyUp}
        autoFocus
      />
    </form>
  );
};
