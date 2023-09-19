/* eslint-disable @typescript-eslint/no-shadow */
import className from 'classnames';
import { FormEvent, useState } from 'react';
import { Todo } from '../types/Todo';
import * as postService from '../api/todos';
import { Error } from '../types/Error';

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
  const [, setErrorMessage] = useState(Error.None);
  const [doubleClicked, setDoubleClicked] = useState(false);
  const [editingTitle, setEditingTitle] = useState(todo.title);

  const handleCheckedTodo = (todoId: number) => {
    setLoadingIds(currentIds => [...currentIds, todoId]);

    postService.updateTodo(todoId, { completed: !todo.completed })
      .then(() => {
        postService.getTodos(USER_ID)
          .then((todos) => {
            setTodos(todos);
          })
          .catch(() => {
            setErrorMessage(Error.Load);
          })
          .finally(() => {
            setLoadingIds(currentIds => currentIds.filter(id => id !== todoId));
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
              setErrorMessage(Error.Load);
              setLoadingIds(currentIds => currentIds.filter(
                id => id !== todoId,
              ));
            });
        })
        .catch(() => {
          setErrorMessage(Error.Delete);
          setLoadingIds(currentIds => currentIds.filter(id => id !== todoId));
        });

      return;
    }

    if (currentTodo?.title !== todo.title) {
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
              setErrorMessage(Error.Load);
              setLoadingIds(currentIds => currentIds.filter(
                id => id !== todoId,
              ));
            });
        })
        .catch(() => {
          setErrorMessage(Error.Update);
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
      setEditingTitle(todo.title);
    }
  };

  return (
    <>
      <div className={className('todo', {
        completed: todo.completed,
      })}
      >
        <label className="todo__status-label">
          <input
            type="checkbox"
            className="todo__status"
            checked={todo.completed}
            onChange={() => handleCheckedTodo(todo.id)}
          />
        </label>

        {doubleClicked ? (
          <form
            onSubmit={(event) => handleClickedFormSubmit(event, todo.id)}
            onBlur={(event) => handleClickedFormSubmit(event, todo.id)}
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

        <div className={className('modal overlay', {
          'is-active': loadingIds.includes(todo.id),
        })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    </>
  );
};
