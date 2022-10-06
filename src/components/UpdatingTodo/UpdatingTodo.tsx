import classNames from 'classnames';
import React, {
  Dispatch,
  SetStateAction,
  useState,
  useEffect,
  useRef,
  useCallback,
} from 'react';
import { Todo } from '../../types/Todo';
import { deleteTodo } from '../../api/todos';

type Props = {
  todoId: number;
  setTodoId: (id: number) => void;
  setTodos: Dispatch<SetStateAction<Todo[]>>
  setErrorNotification: (value: string) => void;
  completed: boolean;
  id: number;
  title: string;
  updateStatus: (todoId: number, data: Partial<Todo>) => void;
};

export const UpdatingTodo: React.FC<Props> = ({
  todoId,
  setTodos,
  setTodoId,
  setErrorNotification,
  completed,
  id,
  title,
  updateStatus,
}) => {
  const [isDoubleClick, setIsDoubleClick] = useState(false);
  const [titleField, setTitleField] = useState(title);

  const newTodoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, [isDoubleClick]);

  const handlerDeleteTodo = useCallback((deletingId:number) => {
    setTodoId(deletingId);

    const deleteTodos = async () => {
      try {
        await deleteTodo(deletingId);
        setTodos((prevTodos) => {
          return prevTodos.filter(todo => todo.id !== deletingId);
        });
      } catch (error) {
        setErrorNotification('Unable to delete a todo');
      }
    };

    deleteTodos();
  }, []);

  const handleCheck = () => updateStatus(id, { completed: !completed });

  const handleTitle = () => {
    if (!titleField) {
      handlerDeleteTodo(id);
      setIsDoubleClick(false);

      return;
    }

    updateStatus(id, { title: titleField });
    setIsDoubleClick(false);
  };

  const handleTitleUpdate = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitleField(event.target.value);
  };

  const handleBlur = () => {
    setIsDoubleClick(false);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    return event.key === 'Escape' && setIsDoubleClick(false);
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      <div
        key={id}
        data-cy="Todo"
        className={classNames('todo', { completed })}
      >
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            checked={completed}
            onChange={handleCheck}
          />
        </label>
        { isDoubleClick
          ? (
            <form onSubmit={handleTitle}>
              <input
                type="text"
                data-cy="TodoTitleField"
                value={titleField}
                placeholder="Empty todo will be deleted"
                ref={newTodoField}
                className="todo__title-field"
                onBlur={handleBlur}
                onChange={handleTitleUpdate}
                onKeyDown={handleKeyPress}
              />
            </form>
          )
          : (
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={() => {
                setIsDoubleClick(true);
                setTitleField(title);
              }}
            >
              {title}

            </span>
          )}

        {!isDoubleClick && (
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDeleteButton"
            onClick={() => handlerDeleteTodo(id)}
          >
            ×
          </button>
        )}

        <div
          data-cy="TodoLoader"
          className={classNames('modal overlay',
            {
              'is-active': todoId === id,
            })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    </section>
  );
};
