import { FC, FormEvent, useEffect, useRef } from 'react';
import { Todo } from '../../types';

interface Props {
  todo: Todo;
  setEditingTodo: (todo: Todo | null) => void;
  updatedTitle: string;
  setUpdatedTitle: (title: string) => void;
  isBeingEditing: boolean;
  onRenameTodo: (todo: Todo, newTitle: string) => void;
}

export const RenameTodoForm: FC<Props> = ({
  todo,
  setEditingTodo,
  updatedTitle,
  setUpdatedTitle,
  isBeingEditing,
  onRenameTodo,
}) => {
  const titleField = useRef<HTMLInputElement>(null);

  const handleRenameTodoFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onRenameTodo(todo, updatedTitle.trim());
  };

  document.addEventListener('keyup', event => {
    if (event.key === 'Escape') {
      setEditingTodo(null);
      setUpdatedTitle(todo.title);
    }
  });

  useEffect(() => {
    if (isBeingEditing) {
      titleField.current?.focus();
    }
  }, [isBeingEditing]);

  return (
    <form onSubmit={handleRenameTodoFormSubmit}>
      <input
        data-cy="TodoTitleField"
        type="text"
        className="todo__title-field"
        placeholder="Empty todo will be deleted"
        ref={titleField}
        value={updatedTitle}
        onChange={event => setUpdatedTitle(event.target.value)}
        onBlur={() => onRenameTodo(todo, updatedTitle.trim())}
      />
    </form>
  );
};
