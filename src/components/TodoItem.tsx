import { FormEvent, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';
import * as postService from '../api/todos';
import { Error } from '../types/Error';

const USER_ID = 11260;

type Props = {
  todo: Todo,
  onDeleteTodo: (todoId: number) => void,
  loadingIds: number[],
  setTodos: (v: Todo[]) => void,
  setLoadingIds: React.Dispatch<React.SetStateAction<number[]>>,
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onDeleteTodo,
  loadingIds,
  setLoadingIds,
  setTodos,
}) => {
  const [, setErrorMessage] = useState(Error.None);
  const [doubleClicked, setDoubleClicked] = useState(false);
  const [editingTitle, setEditingTitle] = useState(todo.title);

  const handleCheckedTodo = (todoId: number) => {
    setLoadingIds(currIds => [...currIds, todoId]);

    postService.updateTodo(todoId, { completed: !todo.completed })
      .then(() => {
        postService.getTodos(USER_ID)
          // eslint-disable-next-line @typescript-eslint/no-shadow
          .then((todos) => {
            setTodos(todos);
          })
          .catch(() => {
            setErrorMessage(Error.Load);
          })
          .finally(() => {
            setLoadingIds(currIds => currIds.filter(id => id !== todoId));
          });
      })
      .catch(() => {
        setErrorMessage(Error.Update);
      });
  };

  const handleDoubleClick = (
    event: React.MouseEvent<HTMLLabelElement, MouseEvent>,
  ) => {
    event.preventDefault();
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

      postService.deleteTodo(todoId)
        .then(() => {
          postService.getTodos(USER_ID)
            .then((todos) => {
              setTodos(todos);
            })
            .catch(() => {
              setErrorMessage(Error.Load);
              setLoadingIds(currIds => currIds.filter(id => id !== todoId));
            });
        })
        .catch(() => {
          setErrorMessage(Error.Delete);
          setLoadingIds(currIds => currIds.filter(id => id !== todoId));
        });

      return;
    }

    if (title !== todo.title) {
      setLoadingIds(currIds => [...currIds, todoId]);

      postService.updateTodo(todoId, { title: editingTitle })
        .then(() => {
          postService.getTodos(USER_ID)
            .then((todos) => {
              setTodos(todos);
              setDoubleClicked(false);
              setLoadingIds(currIds => currIds.filter(id => id !== todoId));
            })
            .catch(() => {
              setErrorMessage(Error.Load);
              setLoadingIds(currIds => currIds.filter(id => id !== todoId));
            });
        })
        .catch(() => {
          setErrorMessage(Error.Update);
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
    <div className={cn('todo', {
      completed: todo.completed,
    })}
    >
      <label className="todo__status-label">
        <input
          checked={todo.completed}
          type="checkbox"
          className="todo__status"
          onChange={() => handleCheckedTodo(todo.id)}
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
            onDoubleClick={handleDoubleClick}
          >
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            onClick={() => onDeleteTodo(todo.id)}
          >
            x
          </button>
        </>
      )}

      <div
        className={
          cn('modal overlay', {
            'is-active': loadingIds.includes(todo.id),
          })
        }
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
