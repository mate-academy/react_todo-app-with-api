import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';

type Props = {
  todo: Todo,
  removeTodo: (todoId: number) => void,
  deleteCompleted: boolean,
  updateCompleted: (todoId: number, data: {}) => void,
  actionAllCompleted: string,
  setAllCompleted: (state: 'allTrue' | 'allFalse' | '') => void,
};

export const TodoItem: React.FC<Props> = (
  {
    todo,
    removeTodo,
    deleteCompleted,
    updateCompleted,
    actionAllCompleted,
    setAllCompleted,
  },
) => {
  const [editor, setEditor] = useState<boolean>(false);
  const [isLoad, setIsLoad] = useState<boolean>(false);
  const [completed, setCompleted] = useState<boolean>(todo.completed);
  const [newTitle, setNewTitle] = useState<string>(todo.title);

  const handleText = (event: { target: { value: string } }) => {
    setNewTitle(event.target.value);
  };

  const changeCompleted = async () => {
    setIsLoad(true);
    await updateCompleted(todo.id, { completed: !todo.completed });
    setIsLoad(false);
  };

  useEffect(() => {
    switch (actionAllCompleted) {
      case 'allTrue':
        if (!todo.completed) {
          changeCompleted();
        }

        break;

      case 'allFalse':
        if (todo.completed) {
          changeCompleted();
        }

        break;
      default: break;
    }

    setAllCompleted('');
  }, [actionAllCompleted]);

  useEffect(() => {
    setCompleted(todo.completed);
  }, [todo]);

  useEffect(() => {
    if (deleteCompleted && todo.completed) {
      setIsLoad(true);
    } else {
      setIsLoad(false);
    }
  }, [deleteCompleted]);

  const newTodoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, [editor]);

  const { title } = todo;

  const remover = async () => {
    setIsLoad(true);
    await removeTodo(todo.id);
    setIsLoad(false);
  };

  const updateTitle = async () => {
    setIsLoad(true);
    if (todo.title !== newTitle) {
      await updateCompleted(todo.id, { title: newTitle });
    }

    setIsLoad(false);
  };

  const controlForm = (event: { key: string }) => {
    switch (event.key) {
      case 'Enter':
        updateTitle();
        setEditor(!editor);

        break;
      case 'Escape':
        setNewTitle(todo.title);
        setEditor(!editor);

        break;
      default:
        break;
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          onChange={changeCompleted}
        />
      </label>

      {editor
        ? (
          <form
            onSubmit={(event) => {
              event.preventDefault();
            }}
          >
            <input
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              defaultValue={title}
              ref={newTodoField}
              onBlur={() => {
                updateTitle();
                setEditor(!editor);
              }}
              onDoubleClick={() => {
                updateTitle();
                setEditor(!editor);
              }}
              onChange={handleText}
              onKeyDown={controlForm}
            />
          </form>
        )
        : (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={() => setEditor(!editor)}
            >
              {title}
            </span>
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDeleteButton"
              onClick={remover}
            >
              ×
            </button>
          </>
        )}

      <div
        data-cy="TodoLoader"
        className={classNames(
          'modal',
          'overlay',
          { 'is-active': isLoad },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
