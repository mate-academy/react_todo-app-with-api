import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';
import { deleteTodo, updateTodo } from '../api/todos';
import { DispatchContext, StateContext } from './TodosContext';

type Props = {
  todo: Todo;
};

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const { completed, title, id } = todo;
  const { loading } = useContext(StateContext);
  const dispatch = useContext(DispatchContext);
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(title);
  const isLoading = loading.isLoading && loading.todoIds.includes(id);
  const titleField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && titleField.current) {
      titleField.current.focus();
    }
  }, [isEditing]);

  const handlerDoubleClick = () => {
    setIsEditing(true);
  };

  const handleAddNewTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(event.target.value);
  };

  const handleDeleteTodo = () => {
    dispatch({
      type: 'setLoading',
      payload: {
        isLoading: true,
        todoIds: [id],
      },
    });

    deleteTodo(id)
      .then(() => dispatch({
        type: 'deleteTodo',
        payload: id,
      }))
      .catch(() => dispatch({
        type: 'setErrorMessage',
        payload: 'Unable to delete a todo',
      }))
      .finally(() => dispatch({
        type: 'setLoading',
        payload: {
          isLoading: false,
        },
      }));
  };

  const handleEditTitle = () => {
    switch (newTitle.trim()) {
      case title:
        setIsEditing(false);
        setNewTitle(title);
        break;

      case '':
        handleDeleteTodo();
        break;

      default:
        dispatch({
          type: 'setLoading',
          payload: {
            isLoading: true,
            todoIds: [id],
          },
        });

        updateTodo({ ...todo, title: newTitle.trim() })
          .then(() => dispatch({
            type: 'changeTodo',
            payload: { ...todo, title: newTitle.trim() },
          }))
          .catch(() => dispatch({
            type: 'setErrorMessage',
            payload: 'Unable to update a todo',
          }))
          .finally(() => {
            dispatch({
              type: 'setLoading',
              payload: {
                isLoading: false,
              },
            });
            setIsEditing(false);
          });
    }
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setNewTitle(title);
      setIsEditing(false);
    }

    if (event.key === 'Enter') {
      handleEditTitle();
    }
  };

  const handleChangeCompleted = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    dispatch({
      type: 'setLoading',
      payload: {
        isLoading: true,
        todoIds: [id],
      },
    });

    updateTodo({ ...todo, completed: event.target.checked })
      .then(() => dispatch({
        type: 'changeTodo',
        payload: { ...todo, completed: !completed },
      }))
      .catch(() => dispatch({
        type: 'setErrorMessage',
        payload: 'Unable to update a todo',
      }))
      .finally(() => dispatch({
        type: 'setLoading',
        payload: {
          isLoading: false,
        },
      }));
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo', {
        completed,
        editing: isEditing,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={handleChangeCompleted}
        />
      </label>

      {isEditing ? (
        <form>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={newTitle}
            onChange={handleAddNewTitle}
            onKeyUp={handleKeyUp}
            onBlur={handleEditTitle}
            ref={titleField}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={handlerDoubleClick}
          >
            {title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={handleDeleteTodo}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': isLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
