import React, {
  FC,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Todo } from '../types/Todo';
import { deleteTodo } from '../api/todos';

interface Props {
  todo: Todo;
  setIsEditing: (value:boolean) => void;
  editTodo: (id:number, data: Partial<Todo>) => void
}

export const TodoEdit: FC<Props> = ({
  todo,
  setIsEditing,
  editTodo,
}) => {
  const [newTitle, setNewTitle] = useState(todo.title);

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current?.focus();
    }
  }, []);

  const handleCancel = () => {
    setIsEditing(false);
    setNewTitle(todo.title);
  };

  const handleBlur = () => {
    if (todo.title === newTitle) {
      return;
    }

    setNewTitle(newTitle);
    editTodo(todo.id, { title: newTitle });
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

    if (todo.title === newTitle) {
      return;
    }

    if (newTitle.trim() === '') {
      await deleteTodo(todo.id);
    }

    editTodo(todo.id, { title: newTitle });
    setIsEditing(false);
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
