import {
  MouseEvent, useEffect, useRef, useState,
} from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { useAppContext } from '../Context/AppContext';

type Props = {
  todoInfo: Todo,
};
export const TodoItem = ({ todoInfo }: Props) => {
  const {
    processing,
    setProcessing,
    deleteTodo,
    updateTodo,
  } = useAppContext();

  const {
    id,
    title,
    completed,
  } = todoInfo;

  const [editTitle, setEditTitle] = useState<string>(title);
  const [editTodo, setEditTodo] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (editTodo && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editTodo]);

  const handleCheckboxToggle = (todo: Todo) => {
    setProcessing([...processing, todo.id]);

    updateTodo({ id: todo.id, completed: !todo.completed })
      .finally(() => {
        setProcessing(processing.filter(todoId => todoId !== todo.id));
      });
  };

  const handleDeleteTodo = (todoId: number, event: MouseEvent) => {
    event.preventDefault();

    setProcessing([...processing, todoId]);

    deleteTodo(todoId)
      .finally(() => {
        setProcessing(processing.filter(num => num !== todoId));
      });
  };

  const handleEscape = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setEditTitle(title);
      setEditTodo(false);
    }
  };

  const handleSubmitEdit = () => {
    if (editTitle.trim().length < 1) {
      setProcessing([...processing, id]);
      deleteTodo(id)
        .finally(() => {
          setProcessing([...processing]);
          setEditTodo(false);
        });
    }

    if (editTitle.trim() !== title && editTitle.trim().length > 0) {
      setProcessing([...processing, id]);
      updateTodo({ id, title: editTitle.trim() })
        .finally(() => {
          setProcessing([...processing]);
          setEditTodo(false);
        });
    }
  };

  return (
    <div
      key={id}
      className={cn('todo', {
        completed,
      })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={completed}
          disabled={processing.length > 0}
          onChange={(event) => {
            event.preventDefault();
            handleCheckboxToggle(todoInfo);
          }}
        />
      </label>

      {editTodo ? (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            handleSubmitEdit();
          }}
        >
          <input
            ref={inputRef}
            onKeyUp={(event) => handleEscape(event)}
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editTitle}
            onChange={event => setEditTitle(event.target.value)}
            onBlur={handleSubmitEdit}
          />
        </form>
      ) : (
        <>
          <span
            className="todo__title"
            onDoubleClick={() => setEditTodo(true)}
          >
            {title}
          </span>

          <button
            type="button"
            className="todo__remove"
            onClick={(event) => handleDeleteTodo(id, event)}
          >
            x
          </button>
        </>
      )}

      <div
        className={
          cn('modal overlay', {
            'is-active': processing.includes(id) || id === 0,
          })
        }
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
