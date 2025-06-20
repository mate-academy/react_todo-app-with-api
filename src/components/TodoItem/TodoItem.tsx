/* eslint-disable jsx-a11y/label-has-associated-control */
import React, {
  ChangeEvent,
  FocusEvent,
  FormEvent,
  KeyboardEvent,
  useState,
} from 'react';
import { Todo } from '../../types/Todo';
import cn from 'classnames';

import { ErrorMessage } from '../../types/ErrorStatusType';
import { deleteTodo, updateTodoStatus, updateTodoTitle } from '../../api/todos';

type TodoItemProps = {
  todo: Todo;
  todos?: Todo[] | null;
  setTodos?: (todos: Todo[]) => void;
  isTempTodo: boolean;
  setErrorMessage?: (errorMessage: ErrorMessage) => void;
  todoIdsToDelete?: number[];
  todoIdsToUpdate?: number[];
  setTodoIdsToDelete?: (idsToDelete: number[]) => void;
  setTodoIdsToUpdate?: (idsToUpdate: number[]) => void;
};

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  todos,
  isTempTodo,
  setTodos,
  setErrorMessage,
  todoIdsToDelete,
  setTodoIdsToDelete,
  todoIdsToUpdate,
  setTodoIdsToUpdate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState('');

  const onDoubleClickEditingHandler = () => {
    setIsEditing(true);
    setValue(todo.title);
  };

  const editingChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  const onBlurEditingHandler = (event: FocusEvent<HTMLFormElement>) => {
    if (event.relatedTarget) {
      return;
    }

    if (value === todo.title) {
      setIsEditing(false);
      setTodoIdsToUpdate?.([]);

      return;
    }

    if (value.length === 0) {
      setTodoIdsToDelete?.([...(todoIdsToDelete || []), todo.id]);

      deleteTodo(todo.id)
        .then(() => {
          if (todos && setTodos) {
            setTodos?.(todos.filter(todoItem => todoItem.id !== todo.id));
          }
        })
        .catch(() => {
          setErrorMessage?.(ErrorMessage.DeleteTodo);
        })
        .finally(() => {
          setTodoIdsToDelete?.(
            (todoIdsToDelete || []).filter(id => id !== todo.id),
          );
        });

      return;
    }

    setTodoIdsToUpdate?.([...(todoIdsToUpdate || []), todo.id]);

    updateTodoTitle(todo.id, value)
      .then(updatedTodo => {
        setIsEditing(false);
        if (todos) {
          const updatedTodos = todos.map(currentTodo => {
            if (currentTodo.id === updatedTodo.id) {
              return updatedTodo;
            }

            return currentTodo;
          });

          if (setTodos) {
            setTodos(updatedTodos);
          }
        }
      })
      .catch(() => {
        setErrorMessage?.(ErrorMessage.UpdateTodo);
      })
      .finally(() => {
        setTodoIdsToUpdate?.(
          (todoIdsToUpdate || []).filter(id => id !== todo.id),
        );
      });
  };

  const onSubmitEditingHandler = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (value === todo.title) {
      setIsEditing(false);
      setTodoIdsToUpdate?.([]);

      return;
    }

    if (value.length === 0) {
      setTodoIdsToDelete?.([...(todoIdsToDelete || []), todo.id]);

      deleteTodo(todo.id)
        .then(() => {
          if (todos && setTodos) {
            setTodos(todos.filter(todoItem => todoItem.id !== todo.id));
          }
        })
        .catch(() => {
          setErrorMessage?.(ErrorMessage.DeleteTodo);
        })
        .finally(() => {
          setTodoIdsToDelete?.(
            (todoIdsToDelete || []).filter(id => id !== todo.id),
          );
        });

      return;
    }

    setTodoIdsToUpdate?.([...(todoIdsToUpdate || []), todo.id]);

    updateTodoTitle(todo.id, value)
      .then(updatedTodo => {
        setIsEditing(false);
        if (todos) {
          const updatedTodos = todos.map(currentTodo => {
            if (currentTodo.id === updatedTodo.id) {
              return updatedTodo;
            }

            return currentTodo;
          });

          if (setTodos) {
            setTodos(updatedTodos);
          }
        }
      })
      .catch(() => {
        if (setErrorMessage) {
          setErrorMessage?.(ErrorMessage.UpdateTodo);
        }
      })
      .finally(() => {
        setTodoIdsToUpdate?.(
          (todoIdsToUpdate || []).filter(id => id !== todo.id),
        );
      });
  };

  const isLoading =
    todoIdsToUpdate?.includes(todo.id) ||
    todoIdsToDelete?.includes(todo.id) ||
    isTempTodo;

  const handleOnClickDelete = () => {
    if (setTodoIdsToDelete && todoIdsToDelete) {
      setTodoIdsToDelete([...todoIdsToDelete, todo.id]);
    }

    deleteTodo(todo.id)
      .then(() => {
        if (todos && setTodos) {
          setTodos(todos.filter(todoItem => todoItem.id !== todo.id));
        }
      })
      .catch(() => {
        if (setErrorMessage) {
          setErrorMessage(ErrorMessage.DeleteTodo);
        }
      })
      .finally(() => {
        if (setTodoIdsToDelete && todoIdsToDelete) {
          setTodoIdsToDelete(todoIdsToDelete?.filter(id => id !== todo.id));
        }
      });
  };

  const handleOnChangeCompleted = (event: ChangeEvent<HTMLInputElement>) => {
    if (setTodoIdsToUpdate && todoIdsToUpdate) {
      setTodoIdsToUpdate([...todoIdsToUpdate, todo.id]);
    }

    updateTodoStatus(todo.id, event.target.checked)
      .then(updatedTodo => {
        if (todos) {
          const updatedTodos = todos.map(currentTodo => {
            if (currentTodo.id === updatedTodo.id) {
              return updatedTodo;
            }

            return currentTodo;
          });

          if (setTodos) {
            setTodos(updatedTodos);
          }
        }
      })
      .catch(() => {
        if (setErrorMessage) {
          setErrorMessage(ErrorMessage.UpdateTodo);
        }
      })
      .finally(() => {
        if (setTodoIdsToUpdate && todoIdsToUpdate) {
          setTodoIdsToUpdate(todoIdsToUpdate.filter(id => id !== todo.id));
        }
      });
  };

  const handleOnKeyUp = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setIsEditing(false);
      if (setTodoIdsToUpdate) {
        setTodoIdsToUpdate([]);
      }
    }
  };

  return (
    <div data-cy="Todo" className={cn('todo', { completed: todo.completed })}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={handleOnChangeCompleted}
        />
      </label>
      {!isEditing ? (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={onDoubleClickEditingHandler}
          >
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={handleOnClickDelete}
          >
            ×
          </button>
        </>
      ) : (
        <form onSubmit={onSubmitEditingHandler} onBlur={onBlurEditingHandler}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={value}
            onChange={editingChangeHandler}
            onKeyUp={handleOnKeyUp}
            autoFocus
          />
        </form>
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
