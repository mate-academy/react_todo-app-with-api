import { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';
import { PatchTodo } from '../../types/PatchTodo';

type Props = {
  todo: Todo;
  onNeedChange: (value: boolean) => void;
  onDelete: (id: number) => void;
  changeTodo: (id: number, data: PatchTodo) => void;
};

export const NewTodo: React.FC<Props> = ({
  todo,
  onNeedChange,
  onDelete,
  changeTodo,
}) => {
  const { title, id } = todo;

  const [newTitle, setNewTitle] = useState(title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSubmit = async (e: React.BaseSyntheticEvent) => {
    e.preventDefault();

    if (newTitle === '') {
      await onDelete(id);
      onNeedChange(false);

      return;
    }

    if (newTitle === title) {
      onNeedChange(false);

      return;
    }

    await changeTodo(id, { title: newTitle });
    onNeedChange(false);
  };

  const handleBlur = async (e: React.BaseSyntheticEvent) => {
    handleSubmit(e);
  };

  const handleKeyUp = (e: React.KeyboardEvent) => {
    if (e.code === 'Escape') {
      setNewTitle(title);
      onNeedChange(false);
    }
  };

  const handleInput = (e: React.BaseSyntheticEvent) => {
    setNewTitle(e.target.value);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        className="todo__title-field"
        placeholder="Empty todo will be deleted"
        value={newTitle}
        onChange={handleInput}
        onBlur={handleBlur}
        onKeyUp={handleKeyUp}
        ref={inputRef}
      />
    </form>
  );
};
