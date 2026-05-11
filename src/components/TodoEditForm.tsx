import React from 'react';
import { TodoContext } from './TodoContext';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
};

export const TodoEditForm: React.FC<Props> = ({ todo }) => {
  const {
    setTodos,
    editingTitle,
    setEditingTitle,
    setEditingId,
    deleteTodo,
    updateTodo,
  } = React.useContext(TodoContext)!;

  const handleBlur = async () => {
    const trimmed = editingTitle.trim();

    if (trimmed) {
      if (trimmed !== todo.title) {
        try {
          await updateTodo(todo.id, trimmed, todo.completed);
          setEditingId(null);
        } catch {}
      } else {
        setEditingId(null);
      }
    } else {
      setTodos(prev =>
        prev.map(t => (t.id === todo.id ? { ...t, loading: true } : t)),
      );
      try {
        await deleteTodo(todo.id);
        setEditingId(null);
      } catch {}
    }
  };

  return (
    <>
      <input
        data-cy="TodoTitleField"
        type="text"
        className="todo__title-field"
        value={editingTitle}
        placeholder={
          editingTitle.trim() === '' ? 'Empty todo will be deleted' : ''
        }
        autoFocus
        disabled={todo.loading}
        onChange={e => setEditingTitle(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={e => {
          if (e.key === 'Enter') {
            (e.target as HTMLInputElement).blur();
          }
        }}
        onKeyUp={e => {
          if (e.key === 'Escape') {
            setEditingId(null);
          }
        }}
      />
      <div
        data-cy="TodoLoader"
        className={`modal overlay ${todo.loading ? 'is-active' : ''}`}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </>
  );
};
