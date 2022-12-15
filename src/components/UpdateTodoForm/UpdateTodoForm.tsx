/* eslint-disable no-console */
import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
// import { TodoData } from '../../api/todos';
import { ErrorTypes } from '../../types/ErrorTypes';
import { Todo } from '../../types/Todo';
// import { AuthContext } from '../Auth/AuthContext';
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
  const TodoTitleField = useRef<HTMLInputElement>(null);
  const [updatedTodoTitle, setUpdatedTodoTitle] = useState(title);
  const trimmedTitle = updatedTodoTitle.trim();

  useEffect(() => {
    if (TodoTitleField.current) {
      TodoTitleField.current.focus();
    }
  }, []);

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>
    | React.FocusEvent<HTMLInputElement>,
  ) => {
    event.preventDefault();
    setError(ErrorTypes.NONE);
    if (trimmedTitle !== title) {
      const updatedTodo: Partial<Todo> = {
        title: trimmedTitle,
      };

      onUpdate(id, updatedTodo);
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
    <>
      <form onSubmit={handleSubmit}>
        <input
          data-cy="TodoTitleField"
          type="text"
          ref={TodoTitleField}
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
    </>
  );
};
