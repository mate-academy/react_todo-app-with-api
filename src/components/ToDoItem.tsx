/* eslint-disable no-console */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable prettier/prettier */
import classNames from 'classnames';
import { useContext } from 'react';
import { DispatchContext, StateContext } from './StateContext';
import { Todo } from '../types/Todo';
import { deleteTodo, updateTodo } from '../api/todos';
import { EnumedError } from '../types/EnumedError';

type Props = {
  todo: Todo;
};

export const ToDoItem = ({ todo }: Props) => {
  const dispatch = useContext(DispatchContext);
  const {
    temporaryIds,
    edittedTitle,
    todos,
  } = useContext(StateContext);

  const handleDeleteTodo = (todoId: number) => {
    dispatch({
      type: 'LOADING_TODOS',
      id: [todoId],
    });
    dispatch({
      type: 'FOCUS_ON_INPUT',
      value: false,
    });

    deleteTodo(todoId)
      .then(() => {
        dispatch({
          type: 'DELETE_TODO',
          id: todoId,
        });
      })
      .catch(() => {
        dispatch({
          type: 'SHOW_ERROR',
          message: EnumedError.DeleteError,
        });
      })
      .finally(() => {
        dispatch({
          type: 'LOADING_TODOS',
          id: [],
        });
        dispatch({
          type: 'FOCUS_ON_INPUT',
          value: true,
        });
      });
  };

  const changeTodoStatus = (todoId: number, completed: boolean) => {
    dispatch({
      type: 'LOADING_TODOS',
      id: [todoId],
    });

    updateTodo(todoId,
      { completed })
      .then(() => {
        dispatch({
          type: 'CHANGE_STATUS',
          id: todoId,
        });
      })
      .catch(() => {
        dispatch({
          type: 'SHOW_ERROR',
          message: EnumedError.UpdateError,
        });
      })
      .finally(() => {
        dispatch({
          type: 'LOADING_TODOS',
          id: [],
        });
      });

  };

  const handleDoubleClick = (todoId: number) => {
    dispatch({
      type: 'GET_TODOS',
      todos: todos.map(t => {
        if (t.id === todoId) {
          return {
            ...t,
            editted: true,
          };
        }

        return {
          ...t,
          editted: false,
        };
      })
    });
    const todosTitle = todos.find(t => t.id === todoId)?.title || '';

    dispatch({
      type: 'CHANGE_TITLE',
      id: todoId,
      changedTitle: todosTitle,
    });
  };

  const changeTitle = () => {
    dispatch({
      type: 'LOADING_TODOS',
      id: [todo.id],
    });

    if (todo.title.trim() === edittedTitle.trim()) {
      dispatch({
        type: 'LOADING_TODOS',
        id: [],
      });

      dispatch({
        type: 'INPUT_ON_BLUR',
      });
    }

    if (edittedTitle.trim() === '') {
      deleteTodo(todo.id)
        .then(() => {
          dispatch({
            type: 'DELETE_TODO',
            id: todo.id,
          });
        })
        .catch(() => {
          dispatch({
            type: 'SHOW_ERROR',
            message: EnumedError.DeleteError,
          });
          dispatch({
            type: 'LOADING_TODOS',
            id: [],
          });
        });

      return;
    }

    updateTodo(todo.id, { title: edittedTitle, editted: false })
      .then(() => {
        dispatch({
          type: 'EDIT_TODO',
          id: todo.id,
        });
        dispatch({
          type: 'INPUT_ON_BLUR',
        });
      })
      .catch(() => {
        dispatch({
          type: 'SHOW_ERROR',
          message: EnumedError.UpdateError,
        });
      })
      .finally(() => {
        dispatch({
          type: "LOADING_TODOS",
          id: [],
        });
      });
  };

  const handleChangingTitle = (e: React.FormEvent<HTMLFormElement>) => {

    e.preventDefault();
    changeTitle();
  };

  return (

    <div data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
      key={todo.id}
    >

      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onClick={() => changeTodoStatus(todo.id, !todo.completed)}
        />
      </label>
      {todo.editted ? (
        <form
          onSubmit={handleChangingTitle}
        >
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={edittedTitle}
            onChange={e => {
              dispatch({
                type: 'CHANGE_TITLE',
                id: todo.id,
                changedTitle: e.target.value.toString(),
              });
            }}
            onKeyUp={event => {
              if (event.key === 'Escape') {
                dispatch({
                  type: 'HANDLE_ESCAPE',
                  id: todo.id,
                });
              }
            }}
            onBlur={() => changeTitle()}
            autoFocus
          />
          <div
            data-cy="TodoLoader"
            className={classNames('modal overlay', {
              'is-active':
                temporaryIds.includes(todo.id),
            })}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => handleDoubleClick(todo.id)}
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
          <div
            data-cy="TodoLoader"
            className={classNames('modal overlay', {
              'is-active':
                      temporaryIds.includes(todo.id),
            })}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>


        </>
      )}

    </div>

  );

};
