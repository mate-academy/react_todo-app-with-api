import React, { useEffect, useRef } from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
  editedTitle: string,
  setEditedTitle: React.Dispatch<React.SetStateAction<string>>,
  title: string,
  setEditing: React.Dispatch<React.SetStateAction<boolean>>,
  editingTodoId: number,
  setEditingTodoId: React.Dispatch<React.SetStateAction<number>>,
  removeTodo: (todoId: number) => Promise<void>,
  updateTodo: (todoId: number, data: Partial<Todo>) => Promise<void>
};

export const TodoForm: React.FC<Props> = ({
  todo,
  editedTitle,
  setEditedTitle,
  title,
  setEditing,
  editingTodoId,
  setEditingTodoId,
  removeTodo,
  updateTodo,
}) => {
  const newTodoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, [editedTitle]);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.code === 'Escape') {
      setEditedTitle(title);
      setEditingTodoId(0);
    }
  };

  const submitEditingForm = (event: React.FormEvent, todoTitle: string) => {
    event.preventDefault();

    if (editedTitle.trim() === todoTitle) {
      setEditing(false);

      return;
    }

    if (!editedTitle) {
      setEditing(false);
      removeTodo(editingTodoId);

      return;
    }

    const data = {
      title: editedTitle.trim(),
    };

    updateTodo(editingTodoId, data);
    setEditing(false);
  };

  return (
    <form
      onSubmit={(event) => submitEditingForm(event, todo.title)}
    >
      <input
        data-cy="TodoTitleField"
        type="text"
        ref={newTodoField}
        className="todo__title-field"
        placeholder="Empty todo will be deleted"
        value={editedTitle}
        onChange={(event) => {
          setEditedTitle(event.target.value);
        }}
        onKeyDown={(event) => {
          handleKeyDown(event);
        }}
        onBlur={(event) => submitEditingForm(event, todo.title)}
      />
    </form>
  );
};
