/* eslint-disable @typescript-eslint/no-shadow */
import className from 'classnames';
import { FormEvent, useState } from 'react';
import { Todo } from '../types/Todo';
import * as postService from '../api/todos';
import { Error, getErrorMessage } from '../utils/errorUtils';

type Props = {
  todo: Todo,
  onDeleteTodo: (todoId: number) => void,
  loadingIds: number[],
  setTodos: (value: Todo[]) => void,
  setLoadingIds: React.Dispatch<React.SetStateAction<number[]>>,
  todos: Todo[]
};

const USER_ID = 11707;

export const TodoItem: React.FC<Props> = ({
  todo,
  onDeleteTodo,
  loadingIds,
  setTodos,
  setLoadingIds,
  todos,
}) => {
  const [doubleClicked, setDoubleClicked] = useState<boolean>(false);
  const [editingTitle, setEditingTitle] = useState<string>(todo.title);
  const { id, title, completed } = todo;

  const handleCheckedTodo = (todoId: number) => {
    setLoadingIds(currentIds => [...currentIds, todoId]);

    postService.updateTodo(todoId, { completed: !completed })
      .then(() => {
        postService.getTodos(USER_ID)
          .then((todos) => {
            setTodos(todos);
          })
          .catch(() => {
            getErrorMessage(Error.Load);
          })
          .finally(() => {
            setLoadingIds(currentIds => currentIds.filter(id => id !== todoId));
          });
      })
      .catch(() => {
        getErrorMessage(Error.Update);
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
    todoId: number,
  ) => {
    event.preventDefault();
    const currentTodo = todos.find(todo => todo.id === todoId);

    if (currentTodo?.title.trim() === '') {
      setDoubleClicked(false);
      setLoadingIds(currentIds => [...currentIds, todoId]);

      postService.deleteTodo(todoId)
        .then(() => {
          postService.getTodos(USER_ID)
            .then((todos) => {
              setTodos(todos);
            })
            .catch(() => {
              getErrorMessage(Error.Load);
              setLoadingIds(currentIds => currentIds.filter(
                id => id !== todoId,
              ));
            });
        })
        .catch(() => {
          getErrorMessage(Error.Delete);
          setLoadingIds(currentIds => currentIds.filter(id => id !== todoId));
        });

      return;
    }

    if (currentTodo?.title !== title) {
      setLoadingIds(currentIds => [...currentIds, todoId]);

      postService.updateTodo(todoId, { title: editingTitle })
        .then(() => {
          postService.getTodos(USER_ID)
            .then((todos) => {
              setTodos(todos);
              setDoubleClicked(false);
              setLoadingIds(currentIds => currentIds.filter(
                id => id !== todoId,
              ));
            })
            .catch(() => {
              getErrorMessage(Error.Load);
              setLoadingIds(currentIds => currentIds.filter(
                id => id !== todoId,
              ));
            });
        })
        .catch(() => {
          getErrorMessage(Error.Update);
          setDoubleClicked(false);
          setLoadingIds(currentIds => currentIds.filter(
            id => id !== todoId,
          ));
        });

      return;
    }

    setDoubleClicked(false);
  };

  const handleKeyUp = (key: string) => {
    if (key === 'Escape') {
      setDoubleClicked(false);
      setEditingTitle(title);
    }
  };

  return (
    <>
      <div className={className('todo', { completed })}>
        <label className="todo__status-label">
          <input
            type="checkbox"
            className="todo__status"
            checked={completed}
            onChange={() => handleCheckedTodo(id)}
          />
        </label>

        {doubleClicked ? (
          <form
            onSubmit={(event) => handleClickedFormSubmit(event, id)}
            onBlur={(event) => handleClickedFormSubmit(event, id)}
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
              {title}
            </span>
            <button
              type="button"
              className="todo__remove"
              onClick={() => onDeleteTodo(id)}
            >
              x
            </button>
          </>
        )}

        <div className={className('modal overlay', {
          'is-active': loadingIds.includes(id),
        })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    </>
  );
};
