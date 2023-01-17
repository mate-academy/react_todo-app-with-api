import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  onUpdateTodo: (todoId: number, todo: Todo) => void;
  onDeleteTodo: (value: number) => void;
  currentTodo: Todo;
  title: string;
  onTitleModifyingChange: (value: boolean) => void;
};

export const NewTodo: React.FC<Props> = ({
  onUpdateTodo,
  onDeleteTodo,
  currentTodo,
  title,
  onTitleModifyingChange,
}) => {
  const [newTitle, setNewTitle] = useState(title);
  const newTodoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

  const handleFormSubmit = useCallback((event: React.FormEvent) => {
    event.preventDefault();

    onUpdateTodo(currentTodo.id, {
      ...currentTodo,
      title: newTitle,
      completed: false,
    });

    if (!newTitle.trim()) {
      onDeleteTodo(currentTodo.id);
    }

    onTitleModifyingChange(false);
  }, [newTitle]);

  const handleEscapeButton = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      onTitleModifyingChange(false);
    }
  }, []);

  return (
    <form onSubmit={handleFormSubmit}>
      <input
        data-cy="TodoTitleField"
        type="text"
        ref={newTodoField}
        className="todo__title-field"
        placeholder="Empty todo will be deleted"
        value={newTitle}
        onChange={(event) => {
          setNewTitle(event.target.value);
        }}
        onBlur={(event) => {
          handleFormSubmit(event);
          onTitleModifyingChange(false);
        }}
        onKeyDown={handleEscapeButton}
      />
    </form>
  );
};
