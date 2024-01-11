import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';

type Prop = {
  todo: Todo,
  deleteTodo: (todoID: number) => void,
  updateTodo: (todo: Todo) => void,
};

export const TodoItem:React.FC<Prop> = React.memo(
  ({
    todo,
    deleteTodo,
    updateTodo,
  }) => {
    const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

    const titleFieldRef = useRef<HTMLInputElement | null>(null);

    const handleSubmit = (event: React.FormEvent) => {
      event.preventDefault();

      if (!editingTodo) {
        return;
      }

      const equalTitles = (todo.title === editingTodo.title);
      const emptyTitle = (editingTodo.title === '');

      if (!equalTitles) {
        updateTodo(editingTodo);
      }

      if (emptyTitle) {
        deleteTodo(editingTodo.id);
      }

      setEditingTodo(null);
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const newTitle = event.currentTarget.value;

      setEditingTodo({ ...todo, title: newTitle });
    };

    const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Escape') {
        setEditingTodo(null);
      }
    };

    useEffect(() => {
      titleFieldRef.current?.focus();
    }, [editingTodo?.id]);

    return (editingTodo && editingTodo.id === todo.id ? (
      <>
        <form
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editingTodo.title}
            ref={titleFieldRef}
            onChange={handleChange}
            onBlur={handleSubmit}
            onKeyUp={handleKeyUp}
          />
        </form>
      </>
    ) : (
      <>
        <span
          className="todo__title"
          onDoubleClick={() => setEditingTodo(todo)}
        >
          {todo.title}
        </span>

        <button
          type="button"
          className="todo__remove"
          onClick={() => deleteTodo(todo.id)}
        >
          ×
        </button>
      </>
    ));
  },
);
