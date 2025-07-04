/* eslint-disable jsx-a11y/label-has-associated-control */
import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import { Todo, PartialTodo } from '../../types/Todo';
import { Loader } from '../Loader';

type TodoItemProps = {
  deleteTodo: (todoId: Todo['id']) => void;
  handleActiveTodo: (todoId: Todo['id']) => void;
  activeTodo?: Todo[];
  todo: Todo;
  onEditTodo: (todo: PartialTodo) => Promise<boolean | null> | void;
};

export const TodoItem: React.FC<TodoItemProps> = ({
  deleteTodo,
  handleActiveTodo,
  activeTodo,
  todo,
  onEditTodo,
}) => {
  const { id, title, completed } = todo;

  const [editField, setEditField] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [hide, setHide] = useState(false);
  const focusToEdit = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editField && focusToEdit.current) {
      focusToEdit.current.focus();
    }
  }, [editField, id]);

  useEffect(() => {
    setEditTitle(title);
  }, [title]);

  const onDelete = () => {
    handleActiveTodo(id);
    deleteTodo(id);
  };

  const changeStatus = async (todoForChange: Todo) => {
    const changedItems = { id: todoForChange.id, completed: !completed };

    onEditTodo(changedItems);
  };

  const onActiveEditTitle = () => {
    setHide(true);
    setEditField(true);
  };

  const handleEditTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = event.target.value;

    setEditTitle(newTitle);
  };

  const submitChanges = async (event: React.FormEvent) => {
    event.preventDefault();
    const changedItems = { id: id, title: editTitle };

    if (changedItems.title.length === 0) {
      onDelete();

      return;
    }

    const result = await onEditTodo(changedItems);

    if (result === true) {
      setHide(false);
      setEditField(false);
    } else if (result === null) {
      setHide(false);
      setEditField(false);
    }
  };

  const handleKey = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setEditTitle(title);
      setHide(false);
      setEditField(false);
    }
  };

  return (
    <>
      <div
        key={id}
        data-cy="Todo"
        className={classNames('todo', {
          completed: completed,
        })}
        onDoubleClick={onActiveEditTitle}
      >
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className={classNames('todo__status', {
              success: completed,
            })}
            checked={completed}
            onChange={() => changeStatus(todo)}
          />
        </label>

        {!hide ? (
          <span data-cy="TodoTitle" className="todo__title">
            {editTitle ? editTitle : title}
          </span>
        ) : (
          <form
            style={{ display: 'flex' }}
            onSubmit={submitChanges}
            onBlur={submitChanges}
          >
            <label style={{ width: '100%' }}>
              <input
                className="todoapp__edit"
                type="text"
                style={{ padding: '12px 15px' }}
                ref={focusToEdit}
                value={editTitle}
                onChange={handleEditTitle}
                placeholder="Empty Todo will be deleted"
                data-cy="TodoTitleField"
                onKeyDown={handleKey}
              />
            </label>
          </form>
        )}

        {!editField && (
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={onDelete}
          >
            ×
          </button>
        )}

        <Loader activeTodo={activeTodo} todoId={id} />
      </div>
    </>
  );
};
