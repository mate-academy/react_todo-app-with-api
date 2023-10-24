import classNames from 'classnames';
import {
  useContext, useEffect, useRef, useState,
} from 'react';

import { Todo } from '../../types/Todo';
import { deleteTodo, updateTodo } from '../../api/todos';
import { TodosContext } from '../../TodosContext';

type Props = {
  todo: Todo,
  isProcessed?: boolean,
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isProcessed = false,
}) => {
  const {
    todos,
    setTodos,
    setErrorMessage,
    errorDiv,
    inputTitle,
  } = useContext(TodosContext);
  const [isLoading, setIsLoading] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const editInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && editInput.current) {
      editInput.current.focus();
    }
  }, [isEditing]);

  const handlerCompleteTodo = () => {
    const updatedTodos = [...todos];
    const currentTodoIndex = updatedTodos
      .findIndex((elem: Todo) => elem.id === todo.id);

    if (currentTodoIndex !== -1) {
      const newCompleted = !updatedTodos[currentTodoIndex].completed;

      updatedTodos[currentTodoIndex] = {
        ...updatedTodos[currentTodoIndex],
        completed: newCompleted,
      };

      updatedTodos
        .splice(currentTodoIndex, 1, updatedTodos[currentTodoIndex]);
    }

    setIsLoading(true);
    updateTodo(updatedTodos[currentTodoIndex])
      .then(() => {
        setTodos(updatedTodos);
      })
      .catch(() => {
        setErrorMessage('Unable to update a todo');
        if (errorDiv.current !== null) {
          errorDiv.current.classList.remove('hidden');
          setTimeout(() => {
            if (errorDiv.current !== null) {
              errorDiv.current.classList.add('hidden');
              setErrorMessage('');
            }
          }, 3000);
        }
      })
      .finally(() => setIsLoading(false));
  };

  const handlerDeleteTodo = () => {
    setIsLoading(true);
    deleteTodo(todo.id)
      .then(() => {
        setTodos((currentTodos: Todo[]) => currentTodos
          .filter(elem => elem.id !== todo.id));
        if (isEditing) {
          setIsEditing(false);
        }

        if (inputTitle.current !== null) {
          inputTitle.current.focus();
        }
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
        if (errorDiv.current !== null) {
          errorDiv.current.classList.remove('hidden');
          setTimeout(() => {
            if (errorDiv.current !== null) {
              errorDiv.current.classList.add('hidden');
              setErrorMessage('');
            }
          }, 3000);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handlerEditTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(event.target.value);
  };

  const handlerEndEditTodoOnBlur = () => {
    if (isEditing) {
      if (newTitle.trim() !== '') {
        if (newTitle.trim() !== todo.title.trim()) {
          const updatedTodos = [...todos];
          const currentTodoIndex = updatedTodos
            .findIndex((elem: Todo) => elem.id === todo.id);

          if (currentTodoIndex !== -1) {
            updatedTodos[currentTodoIndex] = {
              ...updatedTodos[currentTodoIndex],
              title: newTitle.trim(),
            };
            updatedTodos
              .splice(currentTodoIndex, 1, updatedTodos[currentTodoIndex]);
          }

          setTodos(updatedTodos);
          setIsLoading(true);
          updateTodo(updatedTodos[currentTodoIndex])
            .then(() => {
              setIsEditing(false);
            })
            .catch(() => {
              setErrorMessage('Unable to update a todo');
              if (errorDiv.current !== null) {
                errorDiv.current.classList.remove('hidden');
                setTimeout(() => {
                  if (errorDiv.current !== null) {
                    errorDiv.current.classList.add('hidden');
                    setErrorMessage('');
                  }
                }, 3000);
              }

              setNewTitle('');
              setTodos(todos);
            })
            .finally(() => {
              setIsLoading(false);
            });
        } else {
          setIsEditing(false);
        }
      } else {
        handlerDeleteTodo();
      }
    }
  };

  const handlerKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape' && isEditing) {
      setNewTitle('');
      setIsEditing(false);
    } else if (event.key === 'Enter' && isEditing) {
      handlerEndEditTodoOnBlur();
    }
  };

  const handlerEditTodo = () => {
    setNewTitle(todo.title);
    setIsEditing(true);
  };

  const handlerSaveEditTodo = (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: todo.completed,
      })}
      onDoubleClick={handlerEditTodo}
    >
      <label
        className="todo__status-label"
      >
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={handlerCompleteTodo}

        />
      </label>

      {isEditing
        ? (
          <form
            onSubmit={handlerSaveEditTodo}
          >
            <input
              ref={editInput}
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={newTitle}
              onChange={handlerEditTitle}
              onBlur={handlerEndEditTodoOnBlur}
              onKeyUp={handlerKeyUp}
            />
          </form>
        ) : (
          <>
            <span data-cy="TodoTitle" className="todo__title">
              {todo.title}
            </span>

            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={handlerDeleteTodo}
            >
              ×
            </button>
          </>
        )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': isLoading || isProcessed,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
