import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { useContext, useEffect, useRef, useState } from 'react';
import { DispatchContext, StateContext } from '../../utils/Store';
import { deleteTodo, updateTodo } from '../../api/todos';

type Props = {
  todoItem: Todo;
};

export const TodoItem = ({ todoItem }: Props) => {
  const [isEdit, setIsEdit] = useState(false);
  const [value, setValue] = useState('');
  const dispatch = useContext(DispatchContext);
  const state = useContext(StateContext);
  const inputReference = useRef<HTMLInputElement>(null);

  const loading = state.loading.includes(todoItem.id);

  const deleteOneTodo = (todo: Todo) => {
    dispatch({
      type: 'addToLoading',
      payload: { id: todo.id },
    });

    const successDeleteTodo = () => {
      dispatch({
        type: 'deleteTodo',
        payload: { id: todo.id },
      });

      dispatch({
        type: 'removeFromLoading',
        payload: { id: todo.id },
      });
    };

    const unsuccessDeleteTodo = () => {
      dispatch({
        type: 'removeFromLoading',
        payload: { id: todo.id },
      });
      dispatch({
        type: 'setError',
        payload: 'Unable to delete a todo',
      });
    };

    deleteTodo(todo.id).then(successDeleteTodo).catch(unsuccessDeleteTodo);
  };

  const toggleTodo = (todo: Todo) => {
    dispatch({
      type: 'addToLoading',
      payload: { id: todo.id },
    });

    updateTodo({
      ...todo,
      completed: !todo.completed,
    })
      .then(() => {
        dispatch({
          type: 'toggleTodo',
          payload: { id: todo.id },
        });
        dispatch({
          type: 'removeFromLoading',
          payload: { id: todo.id },
        });
      })
      .catch(() => {
        dispatch({
          type: 'setError',
          payload: 'Unable to update a todo',
        });
        dispatch({
          type: 'removeFromLoading',
          payload: { id: todo.id },
        });
      });
  };

  const saveChanges = () => {
    if (value === todoItem.title) {
      setIsEdit(false);

      return;
    }

    if (value.length === 0) {
      setIsEdit(false);
      dispatch({
        type: 'addToLoading',
        payload: { id: todoItem.id },
      });
      deleteTodo(todoItem.id)
        .then(() => {
          dispatch({
            type: 'deleteTodo',
            payload: { id: todoItem.id },
          });
        })
        .catch(() => {
          setIsEdit(true);
          dispatch({
            type: 'setError',
            payload: 'Unable to delete a todo',
          });
        })
        .finally(() => {
          dispatch({
            type: 'removeFromLoading',
            payload: { id: todoItem.id },
          });
        });
    } else {
      dispatch({
        type: 'addToLoading',
        payload: { id: todoItem.id },
      });
      dispatch({
        type: 'editTodo',
        payload: { id: todoItem.id, title: value.trim() },
      });
      setIsEdit(false);
      updateTodo({
        ...todoItem,
        title: value.trim(),
      })
        .catch(() => {
          setIsEdit(true);
          dispatch({
            type: 'editTodo',
            payload: { id: todoItem.id, title: todoItem.title },
          });
          dispatch({
            type: 'setError',
            payload: 'Unable to update a todo',
          });
        })
        .finally(() => {
          dispatch({
            type: 'removeFromLoading',
            payload: { id: todoItem.id },
          });
        });
    }
  };

  const handleIsEdit = () => {
    setIsEdit(true);
    setValue(todoItem.title);
  };

  useEffect(() => {
    if (isEdit) {
      inputReference.current?.focus();
    }
  }, [isEdit]);

  return (
    <>
      {isEdit ? (
        <div data-cy="Todo" className="todo">
          <label className="todo__status-label">
            {''}
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked
            />
          </label>

          <form
            onSubmit={(event: React.FormEvent<HTMLFormElement>) =>
              event.preventDefault()
            }
          >
            <input
              ref={inputReference}
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={value}
              onBlur={saveChanges}
              onKeyUp={(event: React.KeyboardEvent<HTMLInputElement>) => {
                if (event.key === 'Escape') {
                  setIsEdit(false);
                } else if (event.key === 'Enter') {
                  event.preventDefault();
                  saveChanges();
                }
              }}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                event.preventDefault();
                setValue(event.target.value);
              }}
            />
          </form>
        </div>
      ) : (
        <div
          data-cy="Todo"
          className={classNames('todo', { completed: todoItem.completed })}
          key={todoItem.id}
        >
          <label className="todo__status-label">
            {''}
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={todoItem.completed}
              onChange={() => toggleTodo(todoItem)}
            />
          </label>

          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={handleIsEdit}
          >
            {todoItem.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => deleteOneTodo(todoItem)}
          >
            ×
          </button>
          <div
            data-cy="TodoLoader"
            className={classNames('modal overlay', {
              'is-active': loading,
            })}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </>
  );
};
