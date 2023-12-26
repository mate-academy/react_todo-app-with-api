import React, { useState, ChangeEvent, KeyboardEvent } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import '../styles/todo.scss';
import { updateTodo, deleteTodo } from '../api/todos';

type Props = {
  todo: Todo;
  handleDelete: (id : number) => void;
  changeStatus: (todo: Todo) => void;
  changeTitle: (todo: Todo, editedTitle: string) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo, handleDelete, changeStatus, changeTitle,
}) => {
  const { completed, title } = todo;
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const [editingTodo, setEditingTodo] = useState<Todo>(todo);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setEditedTitle(event.target.value);
  };

  const onEditMode = (editTodo: Todo) => {
    setEditingTodo(editTodo);
    setIsEditing(true);
  };

  const changeTodoTitle = (event: React.FormEvent, newTitle: string) => {
    event.preventDefault();

    if (!isEditing) {
      return;
    }

    if (!editedTitle || editedTitle === '') {
      handleDelete(editingTodo.id);
      deleteTodo(editingTodo.id);
    }

    if (editedTitle !== editingTodo.title) {
      updateTodo({
        ...editingTodo,
        title: newTitle,
      });
    }

    setIsEditing(false);

    changeTitle(editingTodo, newTitle);
  };

  const handleKeyUp = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      setIsEditing(false);
    }
  };

  return (
    <div
      className={classNames('todo', { completed })}
      key={todo.id}
      onDoubleClick={() => onEditMode(todo)}
    >

      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={completed}
          onClick={() => changeStatus(todo)}
          onKeyUp={handleKeyUp}
        />
      </label>

      {isEditing
        ? (
          <form onSubmit={(event) => changeTodoTitle(event, editedTitle)}>
            <input
              className="todo__title-field"
              type="text"
              id="fname"
              name="todo"
              value={editedTitle}
              onChange={handleChange}
              onBlur={(event) => changeTodoTitle(event, editedTitle)}
            />
          </form>
        )
        : (
          <>
            <span className="todo__title">
              {todo.title}
            </span>
            <div className="modal overlay">
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>

            <button
              type="button"
              className="todo__remove"
              onClick={() => handleDelete(todo.id)}
            >
              ×
            </button>
          </>
        )}
    </div>
  );
};
