import React, { ChangeEvent, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';
import { deleteTodos, updateTodos, USER_ID } from '../api/todos';
import { ErrorMessage } from './errorsMessage';

type ItemProps = {
  todoTemplate: Todo | null;
  post: Todo;
  setErrorMessage: (errorMessage: ErrorMessage) => void;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  error: ErrorMessage | '';
};
export const TodoItems: React.FC<ItemProps> = ({
  post,
  todoTemplate,
  setErrorMessage,
  setTodos,
  error,
}) => {
  const { completed, id, title } = post;
  const [focusItems, setFocusItems] = useState(false);
  const [inputTitle, setInputTitle] = useState(title);
  const [deleteCheck, setDeleteCheck] = useState(false);

  const saveInputOnBlur = () => {
    const trimValueBlur = inputTitle.trim();

    if (trimValueBlur == '') {
      deleteTodos(post.id)
        .then(() => {
          setFocusItems(false);
          setTodos(currentTodos => currentTodos.filter(todo => todo.id !== id));
        })
        .catch(() => {
          setFocusItems(true);
          setErrorMessage(ErrorMessage.deleteError);
          setTimeout(() => {
            setErrorMessage(ErrorMessage.noError);
          }, 3000);
        })
        .finally(() => {
          if (error == '') {
            setFocusItems(false);
          }

          setDeleteCheck(false);
        });
    } else {
      setInputTitle(trimValueBlur);
      updateTodos({
        id: post.id,
        userId: USER_ID,
        title: trimValueBlur,
        completed: completed,
      })
        .then(respone => {
          setFocusItems(false);
          setTodos(prevTodos =>
            prevTodos.map((item: Todo) =>
              item.id === respone.id ? respone : item,
            ),
          );
        })

        .catch(() => {
          setErrorMessage(ErrorMessage.updateError);
          setFocusItems(true);
          setTimeout(() => {
            setErrorMessage(ErrorMessage.noError);
          }, 3000);
        })
        .finally(() => {
          setDeleteCheck(false);
        });
    }
  };

  const saveInput = (evt: React.KeyboardEvent<HTMLInputElement>) => {
    if (evt.key === 'Enter') {
      const trimValue = inputTitle.trim();

      if (trimValue == '') {
        setDeleteCheck(true);

        deleteTodos(id)
          .then(() => {
            setFocusItems(false);
            setTodos(currentTodos =>
              currentTodos.filter(todo => todo.id !== id),
            );
          })
          .catch(() => {
            setFocusItems(true);
            setErrorMessage(ErrorMessage.deleteError);
            setTimeout(() => {
              setErrorMessage(ErrorMessage.noError);
            }, 3000);
          })
          .finally(() => {
            setDeleteCheck(false);
          });
      } else {
        setDeleteCheck(true);
        setFocusItems(false);
        setInputTitle(trimValue.trim());
        updateTodos({
          id: id,
          userId: USER_ID,
          title: trimValue,
          completed: completed,
        })
          .then(respone => {
            setTodos(prevTodos =>
              prevTodos.map((item: Todo) =>
                item.id === respone.id ? respone : item,
              ),
            );
            setFocusItems(false);
          })
          .catch(() => {
            setFocusItems(true);

            setErrorMessage(ErrorMessage.updateError);
            setTimeout(() => {
              setErrorMessage(ErrorMessage.noError);
            }, 3000);
          })
          .finally(() => {
            setDeleteCheck(false);
          });
      }
    }

    if (evt.key === 'Escape') {
      setFocusItems(false);
      setInputTitle(post.title.trim());
    }
  };

  const toggleCompleted = (todo: Todo) => {
    const updatedTodo: Todo = {
      id: todo.id,
      userId: todo.userId,
      title: todo.title,
      completed: !todo.completed,
    };

    setDeleteCheck(true);

    updateTodos(updatedTodo)
      .then(respone => {
        setTodos(prevTodos =>
          prevTodos.map((item: Todo) =>
            item.id === respone.id ? respone : item,
          ),
        );
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.updateError);
        setTimeout(() => {
          setErrorMessage(ErrorMessage.noError);
        }, 3000);
      })
      .finally(() => {
        setDeleteCheck(false);
      });
  };

  const onDelete = () => {
    setDeleteCheck(true);
    deleteTodos(post.id)
      .then(() => {
        setTodos(currentTodos => currentTodos.filter(todo => todo.id !== id));
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.deleteError);
        setTimeout(() => {
          setErrorMessage(ErrorMessage.noError);
        }, 3000);
      })
      .finally(() => {
        setDeleteCheck(false);
      });
  };

  const doubleClickItem = () => {
    setFocusItems(true);
  };

  const onTextChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputTitle(e.target.value);
  };

  return (
    <div
      key={id}
      data-cy="Todo"
      className={cn('todo', { completed: post.completed })}
    >
      <label className="todo__status-label">
        {''}
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={post.completed}
          onChange={() => toggleCompleted(post)}
        />
      </label>
      {focusItems ? (
        <input
          data-cy="TodoTitleField"
          className="todo__title-field"
          type="text"
          placeholder="Empty todo will be deleted"
          onKeyDown={saveInput}
          value={inputTitle}
          onChange={onTextChange}
          onBlur={saveInputOnBlur}
          autoFocus={focusItems}
        />
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            onDoubleClick={doubleClickItem}
            className="todo__title"
          >
            {inputTitle}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={onDelete}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={`modal overlay ${todoTemplate?.id === post.id || deleteCheck ? 'is-active' : ''}`}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
