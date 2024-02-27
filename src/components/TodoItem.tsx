import { useState, useContext, useRef, useEffect } from 'react';
import cn from 'classnames';
import { Todo } from '../Types/Todo';
import { DispatchContext, StateContext } from './TodosContext';
import { deleteTodo, updateTodo } from '../api/todos';

type Props = {
  todo: Todo;
};

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const dispatch = useContext(DispatchContext);
  const { loading } = useContext(StateContext);
  const isLoading = loading.isLoading && loading.todoIds.includes(todo.id);
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);
  const titleField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && titleField.current) {
      titleField.current.focus();
    }
  }, [isEditing]);

  const handlerDoubleClick = () => {
    setIsEditing(true);
  };

  const handleDeleteTodo = (id: number) => {
    dispatch({
      type: 'setLoading',
      payload: {
        isLoading: true,
        todoIds: [id],
      },
    });

    deleteTodo(id)
      .then(() => {
        dispatch({
          type: 'deleteTodo',
          payload: id,
        });
      })
      .catch(() => {
        dispatch({
          type: 'hasError',
          payload: true,
        });
        dispatch({
          type: 'errorMessage',
          payload: 'Unable to delete a todo',
        });
      })
      .finally(() => {
        dispatch({
          type: 'setLoading',
          payload: {
            isLoading: false,
          },
        });
      });
  };

  const handleChangeTodoStatus = () => {
    const updatedTodo = { ...todo, completed: !todo.completed };

    dispatch({
      type: 'setLoading',
      payload: {
        isLoading: true,
        todoIds: [todo.id],
      },
    });

    updateTodo(updatedTodo)
      .then(() => {
        dispatch({
          type: 'changeTodo',
          payload: updatedTodo,
        });
      })
      .catch(() => {
        dispatch({
          type: 'hasError',
          payload: true,
        });
        dispatch({
          type: 'errorMessage',
          payload: 'Unable to update a todo',
        });
      })
      .finally(() => {
        dispatch({
          type: 'setLoading',
          payload: {
            isLoading: false,
          },
        });
      });
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(event.target.value);
  };

  const handleEditTitle = () => {
    if (newTitle === '') {
      handleDeleteTodo(todo.id);
    } else {
      setNewTitle(newTitle.trim());
      const updatedTodo = { ...todo, title: newTitle };

      updateTodo(updatedTodo)
        .then(() => {
          dispatch({
            type: 'changeTodo',
            payload: updatedTodo,
          });
        })
        .catch(() => {
          dispatch({
            type: 'hasError',
            payload: true,
          });
          dispatch({
            type: 'errorMessage',
            payload: 'Unable to update a todo',
          });
        });
    }

    setIsEditing(false);
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleEditTitle();
    }
  };

  return (
    <div
      key={todo.id}
      data-cy="Todo"
      className={`todo${todo.completed ? ' completed' : ''}`}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked={todo.completed}
          onChange={handleChangeTodoStatus}
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
            onChange={handleTitleChange}
            onBlur={handleEditTitle}
            onKeyUp={handleKeyUp}
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
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => handleDeleteTodo(todo.id)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', { 'is-active': isLoading })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
