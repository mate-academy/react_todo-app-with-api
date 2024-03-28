import { Todo } from '../../types/Todo';
import cn from 'classnames';
import { useTodosContext } from '../../utils/useTodosContext';
import { Errors } from '../../types/Errors';
import * as todoSevice from '../../api/todos';
import { handleRequestError } from '../../utils/handleRequestError';
import { useEffect, useRef, useState } from 'react';

type Props = {
  todo: Todo;
  deleteTodo: (id: number) => void;
};

export const TodoItem: React.FC<Props> = ({ todo, deleteTodo }) => {
  const { loadingTodoIds, setError, setTodos, onDelete } = useTodosContext();
  const [isEdit, setIsEdit] = useState(false);
  const [changeTitle, setChangeTitle] = useState(todo.title);

  const changeInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEdit && changeInput.current) {
      changeInput.current.focus();
    }
  }, [isEdit]);

  function updateTodo() {
    setError(Errors.default);

    return todoSevice
      .updateTodo(todo.id, { title: changeTitle })

      .then(todoItem => {
        if (!changeTitle) {
          onDelete(todo.id);
        }

        setTodos(currentTodos => {
          const newTodos = [...currentTodos];
          const index = newTodos.findIndex(t => t.id === todo.id);

          newTodos.splice(index, 1, todoItem);

          return newTodos;
        });
      })
      .catch(error => {
        handleRequestError(Errors.updateTodo, setError);
        throw error;
      })
      .finally(() => setIsEdit(false));
  }

  const handleInputButtons = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      updateTodo();
    }

    if (event.key === 'Escape') {
      setChangeTitle(todo.title);
      setIsEdit(false);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo', { completed: todo.completed })}
      key={todo.id}
    >
      <label className="todo__status-label" aria-label="todo__status">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
        />
      </label>
      {isEdit ? (
        <input
          type="text"
          value={changeTitle}
          onChange={event => setChangeTitle(event.target.value)}
          className="todo__title-field"
          data-cy="TodoTitleField"
          onKeyUp={handleInputButtons}
          ref={changeInput}
        />
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setIsEdit(!isEdit)}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => deleteTodo(todo.id)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': loadingTodoIds.includes(todo.id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
