import { FormEvent, useEffect, useRef, useState, KeyboardEvent } from 'react';
import { Todo } from '../types/Todo';

type Params = {
  todo: Todo;
  onDelete: (todoId: number) => void;
  onUpdate: (todoId: number, data: Partial<Todo>) => Promise<void>;
};

export const useTodoEditing = ({ todo, onDelete, onUpdate }: Params) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  const handleSave = () => {
    const trimmedTitle = newTitle.trim();

    if (trimmedTitle === '') {
      onDelete(todo.id);

      return;
    }

    if (trimmedTitle === todo.title) {
      setIsEditing(false);

      return;
    }

    onUpdate(todo.id, { title: trimmedTitle })
      .then(() => setIsEditing(false))
      .catch(() => {});
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleSave();
  };

  const handleKeyUp = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setNewTitle(todo.title);
      setIsEditing(false);
    }
  };

  return {
    inputRef,
    isEditing,
    newTitle,
    setNewTitle,
    startEditing: () => setIsEditing(true),
    handleSave,
    handleSubmit,
    handleKeyUp,
  };
};
