import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { ErrorTypes } from '../../types/ErrorTypes';
import { Todo } from '../../types/Todo';
import { ProcessedContext } from '../ProcessedContext/ProcessedContext';

interface Props {
  onUpdate: (todoId: number, dataToUpdate: Partial<Todo>) => void,
  todo: Todo,
  onEdit: (isEdit: boolean) => void,
  onDelete: (todoId: number) => void,
}

export const UpdateTodoForm: React.FC<Props> = ({
  onUpdate,
  todo,
  onEdit,
  onDelete,
}) => {
  const { isAdding, setError } = useContext(ProcessedContext);
  const { id, title } = todo;
  const todoTitleField = useRef<HTMLInputElement>(null);
  const [updatedTodoTitle, setUpdatedTodoTitle] = useState(title);
  const trimmedTitle = updatedTodoTitle.trim();

  useEffect(() => {
    if (todoTitleField.current) {
      todoTitleField.current.focus();
    }
  }, []);

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>
    | React.FocusEvent<HTMLInputElement>,
  ) => {
    event.preventDefault();
    setError(ErrorTypes.NONE);
    if (trimmedTitle !== title) {
      onUpdate(id, { title: trimmedTitle });
    }

    if (trimmedTitle.length === 0) {
      onDelete(id);
    }

    onEdit(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      onEdit(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        data-cy="TodoTitleField"
        type="text"
        ref={todoTitleField}
        className="todo__title-field"
        placeholder="Empty todo will be deleted"
        value={updatedTodoTitle}
        onChange={(event) => {
          setUpdatedTodoTitle(event.target.value);
        }}
        onBlur={handleSubmit}
        onKeyDown={handleKeyDown}
        disabled={isAdding}
      />
    </form>
  );
};
