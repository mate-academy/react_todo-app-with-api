import React, { FC, useEffect, useRef } from 'react';
import { Todo } from '../types/Todo';

interface Props {
  todo: Todo;
  isEditing: boolean;
  newTitle:string;
  setNewTitle: (value:string) => void;
  setIsEditing: (value:boolean) => void;
  onDelete: (todoId: number) => void;
  onUpdate: (id: number, status: boolean, title: string) => void;
  setTodos:(todos:Todo) => void;
}

type PopupClick = MouseEvent & {
  path: Node[];
};

export const TodoEdit: FC<Props> = ({
  todo,
  isEditing,
  setNewTitle,
  setIsEditing,
  newTitle,
  onUpdate,
  onDelete,
  setTodos,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      setNewTitle(todo.title);
    }
  }, [isEditing]);

  const handleEditClick = () => {
    setIsEditing(false);
    setNewTitle(todo.title);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const Event = event as PopupClick;

      if (inputRef.current && !Event.path.includes(inputRef.current)) {
        handleEditClick();
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

  const handleCancelEditing = (event?:React.KeyboardEvent<Element>) => {
    if (event?.key === 'Escape') {
      setIsEditing(false);
      setNewTitle(todo.title);
    }
  };

  // const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
  //   event.preventDefault();

  return (
    <form>
      <input
        className="todoapp__edit-todo"
        onKeyUp={(event) => handleCancelEditing(event)}
        type="text"
        ref={inputRef}
        value={newTitle}
        onChange={handleNewTitle}
      />
    </form>
  );
};
