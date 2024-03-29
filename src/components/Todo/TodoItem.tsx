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
  const {
    loadingTodoIds,
    setError,
    setTodos,
    onDelete,
    todos,
    setIsFocused,
    setLoadingTodoIds,
  } = useTodosContext();
  const [isEdit, setIsEdit] = useState(false);
  const [changeTitle, setChangeTitle] = useState(todo.title);

  const changeInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEdit && changeInput.current) {
      changeInput.current.focus();
      setIsFocused(false);
    }
  }, [isEdit]);

  const updateTodo = () => {
    setError(Errors.default);
    setLoadingTodoIds(prev => [...prev, todo.id]);

    if (changeTitle === todo.title) {
      setIsEdit(false);
      setLoadingTodoIds([]);

      return;
    }

    if (!changeTitle.trim().length) {
      return onDelete(todo.id);
    }

    return todoSevice
      .updateTodo(todo.id, { title: changeTitle.trim() })
      .then(todoItem => {
        setTodos(currentTodos => {
          const newTodos = [...currentTodos];
          const index = newTodos.findIndex(t => t.id === todo.id);

          newTodos.splice(index, 1, todoItem);
          setIsEdit(false);

          return newTodos;
        });
      })
      .catch(() => {
        setIsEdit(true);
        setIsFocused(false);
        handleRequestError(Errors.updateTodo, setError);
      })
      .finally(() => {
        setLoadingTodoIds([]);
      });
  };

  const handleInputButtons = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      updateTodo();
    }

    if (event.key === 'Escape') {
      setChangeTitle(todo.title);
      setIsEdit(false);
      setLoadingTodoIds([]);
    }
  };

  const handleCheckbox = () => {
    setLoadingTodoIds(prev => [...prev, todo.id]);

    return todoSevice
      .updateTodo(todo.id, { completed: !todo.completed })

      .then(() => {
        setTodos(
          todos.map(prevTodo => {
            return prevTodo.id === todo.id
              ? { ...prevTodo, completed: !prevTodo.completed }
              : prevTodo;
          }),
        );
      })
      .catch(error => {
        handleRequestError(Errors.updateTodo, setError);
        throw error;
      })
      .finally(() => {
        setIsEdit(false);
        setLoadingTodoIds([]);
      });
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
          onClick={() => handleCheckbox()}
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
          onBlur={updateTodo}
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
