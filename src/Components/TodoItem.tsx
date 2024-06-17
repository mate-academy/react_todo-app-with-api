/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { changeTodo, deleteTodo } from '../api/todos';
import { useState } from 'react';

type Props = {
  todo: Todo;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setErrorMessage: (value: string) => void;
  inputRef: React.RefObject<HTMLInputElement>;
  editInputRef: React.RefObject<HTMLInputElement>;
  completedTodoIds: number[];
  makingChanges: boolean;
  setMakingChanges: (value: boolean) => void;
  editingTodoStatus?: Todo | null;
  setEditingTodoStatus: (todo: Todo | null) => void;
  clearCompleted?: boolean;
  editingTodoTitle: Todo | null;
  setEditingTodoTitle: (value: Todo | null) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  setTodos,
  setErrorMessage,
  inputRef,
  editInputRef,
  makingChanges,
  completedTodoIds,
  setMakingChanges,
  editingTodoStatus,
  setEditingTodoStatus,
  clearCompleted,
  editingTodoTitle,
  setEditingTodoTitle,
}) => {
  const [editValue, setEditValue] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleCheckboxChange = (todoToChange: Todo) => {
    setEditingTodoStatus(todoToChange);
    setMakingChanges(true);
    changeTodo(todoToChange.id, { completed: !todo.completed })
      .then(() => {
        setTodos((prevTodos: Todo[]) =>
          prevTodos.map((prevTodo: Todo) => {
            if (prevTodo.id === todoToChange.id) {
              return { ...prevTodo, completed: !prevTodo.completed };
            }

            return prevTodo;
          }),
        );
        if (inputRef.current) {
          inputRef.current.focus();
        }
      })
      .catch(() => {
        setErrorMessage('Unable to update a todo');
        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
      })
      .finally(() => {
        setMakingChanges(false);
        setEditingTodoStatus(null);
      });
  };

  const handleTodoDelete = (todoToDelete: Todo) => {
    setEditingTodoStatus(todoToDelete);
    setMakingChanges(true);
    deleteTodo(todoToDelete.id)
      .then(() => {
        setTodos((prevTodos: Todo[]) =>
          prevTodos.filter(prevTodo => prevTodo.id !== todoToDelete.id),
        );
        if (inputRef.current) {
          inputRef.current.focus();
        }
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
      })
      .finally(() => {
        setMakingChanges(false);
        setEditingTodoStatus(null);
      });
  };

  const handleEdit = (todoToEdit: Todo, todoTitle: string) => {
    setEditingTodoTitle(todoToEdit);
    setEditValue(todoTitle);
  };

  const handleEditSubmit = (todoToChange: Todo) => {
    setIsSubmitting(true);
    setEditingTodoTitle(todoToChange);

    if (editingTodoTitle?.title === editValue) {
      setEditingTodoTitle(null);
      setEditValue('');
      setIsSubmitting(false);
    } else if (editValue.trim().length === 0) {
      deleteTodo(todoToChange.id)
        .then(() => {
          setTodos((prevTodos: Todo[]) =>
            prevTodos.filter(prevTodo => prevTodo.id !== todoToChange.id),
          );
          if (inputRef.current) {
            inputRef.current.focus();
          }
        })
        .catch(() => {
          setErrorMessage('Unable to delete a todo');
          setTimeout(() => {
            setErrorMessage('');
          }, 3000);
        });
    } else {
      changeTodo(todoToChange.id, { title: editValue.trim() })
        .then(() => {
          setTodos((prevTodos: Todo[]) =>
            prevTodos.map((prevTodo: Todo) => {
              if (prevTodo.id === todoToChange.id) {
                return { ...prevTodo, title: editValue.trim() };
              }

              return prevTodo;
            }),
          );
          setEditingTodoTitle(null);
          setEditValue('');
          setIsSubmitting(false);
        })
        .catch(() => {
          setErrorMessage('Unable to update a todo');
          setTimeout(() => {
            setErrorMessage('');
          }, 3000);
          if (editInputRef.current) {
            editInputRef.current.focus();
          }

          setIsSubmitting(false);
        });
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => handleCheckboxChange(todo)}
        />
      </label>
      {editingTodoTitle?.id === todo.id ? (
        <form
          onSubmit={event => {
            event.preventDefault();
            handleEditSubmit(todo);
          }}
        >
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            ref={editInputRef}
            value={editValue}
            onChange={e => setEditValue(e.target.value)}
            onBlur={() => handleEditSubmit(todo)}
            onKeyUp={e => {
              if (e.key === 'Escape') {
                setEditingTodoTitle(null);
                setEditValue('');
              }
            }}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => handleEdit(todo, todo.title)}
          >
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => handleTodoDelete(todo)}
          >
            ×
          </button>
        </>
      )}
      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active':
            isSubmitting ||
            (makingChanges && editingTodoStatus?.id === todo.id) ||
            (makingChanges && editingTodoTitle?.id === todo.id) ||
            (clearCompleted && completedTodoIds.includes(todo.id)),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
