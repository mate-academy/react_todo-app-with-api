import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { Todo } from '../../types/Todo';
import { deleteTodo, upDateTodo } from '../../api/todos';
import { TodoTitleField } from './TodoTitleField/TodoTitleField';

type Props = {
  todo: Todo,
  handleError?: (textError: string) => () => void,
  setTodos?: React.Dispatch<React.SetStateAction<Todo[]>>,
  isClickClearComleted?: boolean,
  isLoaderToggle?: null | boolean,
};

export const TodoInfo: React.FC<Props> = React.memo(({
  todo,
  handleError = () => {},
  setTodos = () => {},
  isClickClearComleted = false,
  isLoaderToggle = null,
}) => {
  const [hasLoader, setHasLoader] = useState(false);
  const { title, completed, id } = todo;
  const [isTodoTitleField, setIsTodoTitleField] = useState(false);

  const isLoader = (isClickClearComleted && completed)
    || hasLoader
    || isLoaderToggle === completed;

  useEffect(() => {
    if (todo.id === 0) {
      setHasLoader(true);
    }

    return () => {
      setHasLoader(false);
    };
  }, []);

  const removeTodo = (currentTodo: Todo) => {
    return deleteTodo(currentTodo.id)
      .then(() => setTodos((currentTodos) => {
        return currentTodos.filter(todoItem => currentTodo.id !== todoItem.id);
      }))
      .catch(() => {
        handleError('Unable to delete a todo');
      })
      .finally(() => {
        setHasLoader(false);
      });
  };

  const upDateProperties = (date:Partial<Todo>) => {
    return upDateTodo(id, date)
      .then(response => {
        setTodos(currentTodos => {
          const currentTodo = currentTodos.find(item => item.id === id);

          if (currentTodo) {
            currentTodo.completed = response.completed;
          }

          return [...currentTodos];
        });
      })
      .catch(() => {
        handleError('Unable to update a todo');
      })
      .finally(() => {
        setHasLoader(false);
      });
  };

  const handleTodoStatusClick = () => {
    setHasLoader(true);
    upDateProperties({ completed: !completed });
  };

  const handleDeleteTodoClick = () => {
    setHasLoader(true);
    removeTodo(todo);
  };

  const handleDbClick = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    if (e.detail !== 2) {
      return;
    }

    setIsTodoTitleField(true);
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked
          onClick={handleTodoStatusClick}
        />
      </label>
      {isTodoTitleField
        ? (
          <TodoTitleField
            todo={todo}
            setTodos={setTodos}
            setIsTodoTitleField={setIsTodoTitleField}
            setHasLoader={setHasLoader}
            removeTodo={removeTodo}
            handleError={handleError}
          />
        )
        : (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onClick={handleDbClick}
              role="presentation"
            >
              {title}
            </span>
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDeleteButton"
              onClick={handleDeleteTodoClick}
            >
              ×
            </button>
          </>
        )}
      <div
        data-cy="TodoLoader"
        className={classNames(
          'modal overlay',
          { 'is-active': isLoader },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
});
