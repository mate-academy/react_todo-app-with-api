import {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
} from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todoId: number,
  prevTitle: string,
  deleteTodo: (id: number) => void;
  updateTodo: (id: number, data: Partial<Todo>) => void,
  setIsEditing: Dispatch<SetStateAction<boolean>>,
};

export const TodoEdit: React.FC<Props> = ({
  deleteTodo,
  updateTodo,
  setIsEditing,
  todoId,
  prevTitle,
}) => {
  const editInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (editInputRef.current) {
      editInputRef.current.focus();
    }
  }, []);

  const save = () => {
    const inputValue = editInputRef.current?.value.trim();

    if (!inputValue) {
      deleteTodo(todoId);
    }

    if (inputValue && inputValue !== prevTitle) {
      updateTodo(todoId, { title: inputValue });
    }

    setIsEditing(false);
  };

  const handleCancel = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsEditing(false);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    save();
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        data-cy="NewTodoField"
        ref={editInputRef}
        type="text"
        className="todoapp__new-todo todoapp__new-todo--edit"
        placeholder="Empty todo will be deleted"
        defaultValue={prevTitle}
        onBlur={save}
        onKeyUp={handleCancel}
      />
    </form>
  );
};
