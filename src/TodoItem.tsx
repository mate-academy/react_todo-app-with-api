import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Todo, TodoForChange } from './types/Todo';

interface Props {
  todo: Todo;
  removeTodo: (todoIduserId: number) => void;
  loadingTodos: number[];
  updateTodoInfo: (todoId: number, newInfo: TodoForChange) => void;
}

export const TodoItem: React.FC<Props> = ({
  todo,
  removeTodo,
  loadingTodos,
  updateTodoInfo,
}) => {
  const [titleText, setTitleText] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [originalTitle, setOriginalTitle] = useState(todo.title);
  const titleField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (titleField.current) {
      titleField.current.focus();
    }
  }, [isOpen]);

  const handleDoubleClick = () => {
    setIsOpen(true);
    setTitleText(todo.title);
    setOriginalTitle(todo.title);
  };

  const handleDelete = () => {
    removeTodo(todo.id);
  };

  const handleToggleChange = async () => {
    await updateTodoInfo(todo.id, { completed: !todo.completed });
  };

  const handleEditTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitleText(event.target.value);
  };

  const saveChanges = () => {
    const newInfo: Partial<Pick<Todo, 'title'>> = {
      title: titleText,
    };

    updateTodoInfo(todo.id, newInfo);
    setIsOpen(false);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!titleText) {
      removeTodo(todo.id);
    }

    setTitleText(titleText);
    setIsOpen(false);
    saveChanges();
  };

  const onEscape = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setTitleText(originalTitle);
      setIsOpen(false);
    }
  };

  const handleBlur = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!titleText.trim()) {
      removeTodo(todo.id);
    }

    setTitleText(titleText);
    setIsOpen(false);
    saveChanges();
  };

  const isLoadingTodos = loadingTodos.includes(todo.id);

  return (
    <div className={classNames('todo', { completed: todo.completed })}>
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onClick={handleToggleChange}
        />
      </label>

      {isOpen ? (
        <form
          onSubmit={handleSubmit}
          onBlur={handleBlur}
        >
          <input
            type="text"
            className="todo__title-field"
            placeholder="Edit todo..."
            value={titleText}
            onChange={handleEditTitle}
            onKeyUp={onEscape}
            ref={titleField}
          />
        </form>
      ) : (
        <>
          <span
            onDoubleClick={handleDoubleClick}
            className="todo__title"
          >
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            onClick={handleDelete}
          >
            x
          </button>
        </>
      )}
      <div className={classNames('modal overlay',
        { 'is-active': isLoadingTodos })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
