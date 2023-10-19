import { useEffect, useRef, useState } from 'react';
import { Todo } from '../types/Todo';
import { StatusFilter } from '../services/EnumStatusFilter';

type Props = {
  todo: Todo,
  onDeleteTodo: (tId: number) => Promise<void>,
  onCheckedTodo: (todo: Todo) => Promise<void>,
  updateTitle: (todo: Todo) => Promise<void>,
  checkedLoad: boolean,
  toggle: string,
  fieldTitle: React.MutableRefObject<HTMLInputElement | null>,
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onDeleteTodo,
  onCheckedTodo,
  updateTitle,
  checkedLoad,
  toggle,
  fieldTitle,
}) => {
  const [todoId, setTodoId] = useState(0);
  const [checkedLoading, setCheckedLoading] = useState(false);
  const [switchEditTodo, setSwitchEditTodo] = useState(false);
  const [newTitle, setNewTitle] = useState('' || todo.title);
  const loaders = todo.id === 0
  || (todo.id === todoId && checkedLoading)
  || (todo.completed && checkedLoad)
  || (!todo.completed && toggle === StatusFilter.COMPLETED)
  || (todo.completed && toggle === StatusFilter.ACTIVE);

  const todoItemEditRef = useRef<HTMLInputElement | null>(null);
  const { id, title, completed } = todo;

  useEffect(() => {
    if (switchEditTodo) {
      todoItemEditRef.current?.focus();
    }
  }, [switchEditTodo]);

  const handleDelete = (tId: number) => {
    setCheckedLoading(true);
    onDeleteTodo(tId)
      .finally(() => {
        fieldTitle.current?.focus();
        setCheckedLoading(false);
      });
  };

  const handleChecked = (
    tod: Todo,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setCheckedLoading(true);
    onCheckedTodo({ ...tod, completed: e.target.checked })
      .finally(() => setCheckedLoading(false));
  };

  const handleUpdateTitle = (tod: Todo) => {
    if (!newTitle.trim()) {
      setCheckedLoading(true);
      onDeleteTodo(id)
        .then(() => setSwitchEditTodo(false))
        .catch(() => todoItemEditRef.current?.focus())
        .finally(() => setCheckedLoading(false));
    } else {
      setCheckedLoading(true);
      updateTitle({ ...tod, title: newTitle.trim() })
        .then(() => setSwitchEditTodo(false))
        .catch(() => todoItemEditRef.current?.focus())
        .finally(() => setCheckedLoading(false));
    }
  };

  const handlesForUpdateTitle = () => {
    setNewTitle(newTitle);
    handleUpdateTitle(todo);
  };

  const handlesCurrentTitle = () => {
    setNewTitle(title);
    setSwitchEditTodo(false);
  };

  const handleKeyUp = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (newTitle === title) {
        handlesCurrentTitle();
      } else {
        handlesForUpdateTitle();
      }
    } else if (e.key === 'Escape') {
      handlesCurrentTitle();
    }
  };

  const handleOnBlur = () => {
    if (newTitle === title) {
      handlesCurrentTitle();
    } else {
      handlesForUpdateTitle();
    }
  };

  const handleDoubleClick = () => {
    setSwitchEditTodo(true);
    setTodoId(id);
  };

  return (
    <div
      data-cy="Todo"
      className={completed ? 'todo completed' : 'todo'}
      key={id}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          onChange={(e) => {
            handleChecked(todo, e);
            setTodoId(id);
          }}
          checked={completed}
        />
      </label>

      {
        switchEditTodo ? (
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            value={newTitle}
            ref={todoItemEditRef}
            onChange={(e) => {
              setNewTitle(e.target.value);
            }}
            onBlur={handleOnBlur}
            onKeyUp={handleKeyUp}
            placeholder={!newTitle ? 'Empty todo will be deleted' : ''}
          />
        ) : (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={handleDoubleClick}
            >
              {title}
            </span>

            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={() => {
                handleDelete(id);
                setTodoId(id);
              }}
            >
              ×
            </button>
          </>
        )
      }

      <div
        data-cy="TodoLoader"
        className={
          loaders ? 'modal overlay is-active' : 'modal overlay'
        }
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
