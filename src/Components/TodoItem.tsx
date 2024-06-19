/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { changeTodo, deleteTodo } from '../api/todos';
import { useEffect, useState } from 'react';
import { getTodosToToggle } from '../utils/functions';
import { useTodoContext } from './GlobalProvider';

type Props = {
  todo: Todo;
};

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const [editValue, setEditValue] = useState<string>('');
  const [editingTodoStatus, setEditingTodoStatus] = useState<Todo | null>(null);
  const [editingTodoTitle, setEditingTodoTitle] = useState<Todo | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const {
    todos,
    editInputRef,
    setTodos,
    inputRef,
    setErrorMessage,
    isToggling,
    clearCompleted,
  } = useTodoContext();

  const completedTodos = todos.filter(item => item.completed);
  const completedTodoIds = completedTodos.map(item => item.id);
  const idsToToggle = getTodosToToggle(todos).map(item => item.id);

  useEffect(() => {
    if (editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [editingTodoTitle, editInputRef]);

  const handleCheckboxChange = (todoToChange: Todo) => {
    setEditingTodoStatus(todoToChange);
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
        setEditingTodoStatus(null);
      });
  };

  const handleTodoDelete = (todoToDelete: Todo) => {
    setEditingTodoStatus(todoToDelete);
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
        setEditingTodoStatus(null);
      });
  };

  const handleEdit = (todoToEdit: Todo, todoTitle: string) => {
    setEditingTodoTitle(todoToEdit);
    setEditValue(todoTitle);
  };

  const handleEditSubmit = (todoToChange: Todo) => {
    setIsSubmitting(true);

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
            (isToggling && idsToToggle.includes(todo.id)) ||
            isSubmitting ||
            editingTodoStatus?.id === todo.id ||
            (clearCompleted && completedTodoIds.includes(todo.id)),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
