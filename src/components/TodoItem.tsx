import cn from 'classnames';

import {
  FormEvent,
  useContext,
  useState,
} from 'react';
import { Todo } from '../types/Todo';
import { TodoStatus } from '../types/TodoStatus';
import { TodoEditing } from './TodoEditing';
import { deleteTodo, editTodo } from '../api/todos';
import { TodoContext } from '../providers/TodoProvider';
import { TodoError } from '../types/TodoError';
import { FormContext } from '../providers/FormProvider';

export const TodoItem: React.FC<{ todo: Todo }> = ({ todo }) => {
  const { id, title, completed } = todo;

  const {
    todos,
    setTodos,
    setError,
    inputRef,
  } = useContext(TodoContext);

  const { isUpdating, isToggleAll, isClearing } = useContext(FormContext);

  const [isLoading, setIsLoading] = useState(false);

  const [isEditing, setIsEditing] = useState(false);

  const handleTodoDelete = () => {
    setIsLoading(true);

    deleteTodo(id)
      .then(() => {
        const editedArray = todos.filter(task => task.id !== id);

        setTodos(editedArray);
      })
      .catch(() => setError(TodoError.Delete))
      .finally(() => {
        setIsLoading(false);

        if (inputRef.current) {
          inputRef.current.focus();
        }

        setTimeout(() => {
          setError(TodoError.Null);
        }, 3000);
      });
  };

  const handleTodoCheck = (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    editTodo({
      ...todo,
      completed: !completed,
    })
      .then(() => {
        setTodos(prevTodos => prevTodos.map(prevTodo => {
          if (prevTodo.id === id) {
            return {
              ...prevTodo,
              completed: !completed,
            };
          }

          return prevTodo;
        }));
      })
      .catch(() => {
        setError(TodoError.Update);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const isLoaderActive = isLoading
                      || id === 0
                      || (isClearing && completed)
                      || (isUpdating && !completed && !isToggleAll)
                      || (isUpdating && completed && isToggleAll);

  return (
    <div
      data-cy="Todo"
      className={cn('todo', {
        [TodoStatus.Editing]: isEditing,
        [TodoStatus.Completed]: completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={handleTodoCheck}
        />
      </label>

      {isEditing
        ? (
          <TodoEditing
            todoToEdit={todo}
            setIsEditing={setIsEditing}
            setIsLoading={setIsLoading}
          />
        )
        : (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={handleDoubleClick}
            >
              {title}
            </span>

            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={handleTodoDelete}
            >
              ×
            </button>
          </>
        )}

      <div
        data-cy="TodoLoader"
        className={cn(
          'modal',
          'overlay',
          {
            'is-active': isLoaderActive,
          },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
