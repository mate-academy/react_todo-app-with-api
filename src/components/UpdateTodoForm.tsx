import { useState } from 'react';
import { Todo } from '../types/Todo';

type Props = {
  placeholder: string
  className: string,
  todo: Todo
  onTodoDelete: (todoId: number) => void
  setSelectedTodoId: (todoId: number) => void
  editingRef: React.RefObject<HTMLInputElement>
  onTodoUpdate: (todo:Todo) => void
};

export const UpdateTodoForm: React.FC<Props> = ({
  placeholder,
  className,
  todo,
  onTodoDelete,
  setSelectedTodoId,
  editingRef,
  onTodoUpdate,
}) => {
  const [title, setTitle] = useState<string>(todo.title || '');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!title) {
      onTodoDelete(todo.id);
    }

    if (title === todo.title) {
      setSelectedTodoId(0);
    }

    const todoToUpdate = {
      title,
      userId: todo.userId,
      id: todo.id,
      completed: todo.completed,
    };

    onTodoUpdate(todoToUpdate);
    setSelectedTodoId(0);
  };

  return (
    <form
      onSubmit={handleSubmit}
    >
      <input
        type="text"
        className={className}
        placeholder={placeholder}
        value={title}
        onChange={(event) => {
          setTitle(event.target.value);
        }}
        onBlur={handleSubmit}
        ref={editingRef}
        onKeyUp={(event) => {
          if (event.key === 'Escape') {
            setSelectedTodoId(0);
          }
        }}
      />
    </form>
  );
};
