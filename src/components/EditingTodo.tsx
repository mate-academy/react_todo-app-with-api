import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Todo } from '../types/Todo';

interface Props {
  todo: Todo,
  onUpdateTodo: (todoId: number, data: Partial<Todo>) => Promise<void>,
  onRemoveTodo: (todoId: number) => Promise<void>,
  isEditing: boolean,
  setIsEditing: Dispatch<SetStateAction<boolean>>,
}

export const EditingTodo: React.FC<Props> = ({
  todo,
  onUpdateTodo,
  onRemoveTodo,
  isEditing,
  setIsEditing,
}) => {
  const { title, id } = todo;
  const todoTitleField = useRef<HTMLInputElement>(null);
  const [titleChange, setTitleChange] = useState(title);

  useEffect(() => {
    if (todoTitleField.current) {
      todoTitleField.current.focus();
    }
  }, [isEditing]);

  const handleTitleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (title !== titleChange) {
      onUpdateTodo(id, { title: titleChange });
    }

    if (titleChange.trim().length === 0) {
      onRemoveTodo(id);
    }

    setIsEditing(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsEditing(false);
    }
  };

  return (
    <form onSubmit={handleTitleSubmit}>
      <input
        data-cy="TodoTitleField"
        ref={todoTitleField}
        type="text"
        className="todoapp__editing-todo"
        value={titleChange}
        onChange={event => {
          setTitleChange(event.target.value);
        }}
        onBlur={handleTitleSubmit}
        onKeyDown={handleKeyDown}
      />
    </form>
  );
};
