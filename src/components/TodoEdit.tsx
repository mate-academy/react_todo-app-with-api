import React, {
  FC,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Todo } from '../types/Todo';

interface Props {
  todo: Todo;
  setIsEditing: (value:boolean) => void;
  editTodo: (id:number, data: Partial<Todo>) => void
  onDelete: (todoId: number) => void
}

export const TodoEdit: FC<Props> = ({
  todo,
  setIsEditing,
  editTodo,
  onDelete,
}) => {
  const [newTitle, setNewTitle] = useState(todo.title);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const isTitleChanged = todo.title === newTitle;

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current?.focus();
    }
  }, []);

  const handleCancel = () => {
    setIsEditing(false);
    setNewTitle(todo.title);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current
        && !inputRef.current.contains(event.target as Node)) {
        handleCancel();
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleNewTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(event.target.value);
  };

  const handleCancelEditing = (event:React.KeyboardEvent<Element>) => {
    if (event.key === 'Escape') {
      setIsEditing(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isTitleChanged) {
      return;
    }

    const trimmedTitle = newTitle.trim();

    if (trimmedTitle === '') {
      onDelete(todo.id);
    } else {
      editTodo(todo.id, { title: trimmedTitle });
    }

    setIsEditing(false);
  };

  const handleBlur = (event:React.FormEvent<HTMLFormElement>
  | React.FocusEvent<HTMLInputElement>) => {
    if (isTitleChanged) {
      return;
    }

    handleSubmit(event as React.FormEvent<HTMLFormElement>);
  };

  return (
    <form
      onSubmit={handleSubmit}
    >
      <input
        className="todoapp__edit-todo"
        onKeyUp={(event) => handleCancelEditing(event)}
        type="text"
        onBlur={handleBlur}
        ref={inputRef}
        value={newTitle}
        onChange={handleNewTitle}
      />
    </form>
  );
};
