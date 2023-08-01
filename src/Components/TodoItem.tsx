import classNames from 'classnames';
import { FormEvent, useState } from 'react';
import { Todo } from '../types/Todo';
import { getTodos, removeTodo, updateTodo } from '../api/todos';
import { ErrorStatus } from '../types/ErrorStatus';
import { USER_ID } from '../utils/constants';

interface Props {
  todo: Todo,
  setTodos: (todo: Todo[]) => void,
  setErrorMessage: (msg: string) => void,
  loadingIds: number[],
  setLoadingIds: React.Dispatch<React.SetStateAction<number[]>>,
}

export const TodoItem: React.FC<Props> = ({
  todo,
  setTodos,
  setErrorMessage,
  loadingIds,
  setLoadingIds,
}) => {
  const [editingTitle, setEditingTitle] = useState(todo.title);
  const [doubleClicked, setDoubleClicked] = useState(false);

  const handleDelete = (todoId: number) => {
    setLoadingIds(currIds => [...currIds, todoId]);

    removeTodo(todoId)
      .then(() => {
        getTodos(USER_ID)
          .then((value) => {
            setTodos(value);
            setLoadingIds(currIds => currIds.filter(id => id !== todoId));
          })
          .catch(() => {
            setErrorMessage(ErrorStatus.Load);
          });
      })
      .catch(() => {
        setErrorMessage(ErrorStatus.Delete);
      });
  };

  const handleToggle = (todoId: number) => {
    setLoadingIds(currIds => [...currIds, todoId]);

    updateTodo(todoId, { completed: !todo.completed })
      .then(() => {
        getTodos(USER_ID)
          .then((todos) => {
            setTodos(todos);
          })
          .catch(() => {
            setErrorMessage(ErrorStatus.Load);
          })
          .finally(() => {
            setLoadingIds(currIds => currIds.filter(id => id !== todoId));
          });
      })
      .catch(() => {
        setErrorMessage(ErrorStatus.Update);
      });
  };

  const handleDoubleClick = () => {
    setDoubleClicked(true);
  };

  const handleClickedFormSubmit = (
    event: FormEvent,
    title: string,
    todoId: number,
  ) => {
    event.preventDefault();

    if (title.trim() === '') {
      setDoubleClicked(false);
      setLoadingIds(currIds => [...currIds, todoId]);

      removeTodo(todoId)
        .then(() => {
          getTodos(USER_ID)
            .then((todos) => {
              setTodos(todos);
            })
            .catch(() => {
              setErrorMessage(ErrorStatus.Load);
              setLoadingIds(currIds => currIds.filter(id => id !== todoId));
            });
        })
        .catch(() => {
          setErrorMessage(ErrorStatus.Delete);
          setLoadingIds(currIds => currIds.filter(id => id !== todoId));
        });

      return;
    }

    if (title !== todo.title) {
      setLoadingIds(currIds => [...currIds, todoId]);

      updateTodo(todoId, { title: editingTitle })
        .then(() => {
          getTodos(USER_ID)
            .then((todos) => {
              setTodos(todos);
              setDoubleClicked(false);
              setLoadingIds(currIds => currIds.filter(id => id !== todoId));
            })
            .catch(() => {
              setErrorMessage(ErrorStatus.Load);
              setLoadingIds(currIds => currIds.filter(id => id !== todoId));
            });
        })
        .catch(() => {
          setErrorMessage(ErrorStatus.Update);
          setDoubleClicked(false);
          setLoadingIds(currIds => currIds.filter(id => id !== todoId));
        });

      return;
    }

    setDoubleClicked(false);
  };

  const handleKeyUp = (key: string) => {
    if (key === 'Escape') {
      setDoubleClicked(false);
      setEditingTitle(todo.title);
    }
  };

  return (
    <div
      key={todo.id}
      className={classNames('todo',
        { completed: todo.completed })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => {
            handleToggle(todo.id);
          }}
        />
      </label>

      {doubleClicked ? (
        <form
          onSubmit={(event) => handleClickedFormSubmit(
            event,
            editingTitle,
            todo.id,
          )}
          onBlur={(event) => handleClickedFormSubmit(
            event,
            editingTitle,
            todo.id,
          )}
        >
          <input
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editingTitle}
            onChange={(event) => setEditingTitle(event.target.value)}
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus={doubleClicked}
            onKeyUp={(event) => handleKeyUp(event.key)}
          />
        </form>
      ) : (
        <>
          <span
            className="todo__title"
            onDoubleClick={() => handleDoubleClick()}
          >
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            onClick={() => handleDelete(todo.id)}
          >
            х
          </button>
        </>
      )}

      <div className={
        classNames('modal overlay',
          { 'is-active': todo.id === 0 || loadingIds.includes(todo.id) })
      }
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
