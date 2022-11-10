import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { Errors } from '../../types/Errors';
import { deleteTodo, patchTodo } from '../../api/todos';

type Props = {
  todos: Todo[],
  todo: Todo,
  isAdded: boolean,
  setTodos(todos: Todo[]): void,
  setError(error: Errors): void,
  isDeletingAll: boolean,
  isToggleAll: boolean,
};

export const TodoItem: React.FC<Props> = ({
  todos,
  todo,
  isAdded,
  setTodos,
  setError,
  isDeletingAll,
  isToggleAll,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDoubleClicked, setIsDoubleClicked] = useState(false);
  const [todoTitle, setTodoTitle] = useState('');
  const todoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (todoField.current) {
      todoField.current.focus();
    }
  }, [isDoubleClicked]);

  const removeTodo = async (todoForRemove: Todo) => {
    setIsDeleting(true);

    try {
      await deleteTodo(todoForRemove.id);

      setTodos(todos.filter(item => item.id !== todoForRemove.id));
    } catch {
      setError(Errors.Delete);
    } finally {
      setIsDeleting(false);
    }
  };

  const updateTodo = async (todoForUpdate: Todo, data: Partial<Todo>) => {
    setIsUpdating(true);

    try {
      const updatedTodo = await patchTodo(todoForUpdate, data);

      setTodos(todos.map(newTodo => {
        return newTodo.id === updatedTodo.id
          ? updatedTodo
          : newTodo;
      }));
    } catch {
      setError(Errors.Update);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleBlur = () => {
    if (todo.title === todoTitle) {
      setIsDoubleClicked(false);

      return;
    }

    if (!todoTitle) {
      removeTodo(todo);

      return;
    }

    updateTodo(todo, { title: todoTitle });
    setIsDoubleClicked(false);
  };

  const handleStartEditingTodo = (todoForEdit: Todo) => {
    setIsDoubleClicked(true);
    setTodoTitle(todoForEdit.title);
  };

  const handleEndEditingTodo = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsDoubleClicked(false);

      return;
    }

    if (event.key === 'Enter') {
      handleBlur();
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames(
        'todo',
        { completed: todo.completed },
      )}
      key={todo.id}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => updateTodo(todo, { completed: !todo.completed })}
        />
      </label>

      {isDoubleClicked
        ? (
          <form onSubmit={(event) => event.preventDefault()}>
            <input
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              ref={todoField}
              value={todoTitle}
              onChange={(event) => setTodoTitle(event.target.value)}
              onKeyDown={(event) => handleEndEditingTodo(event)}
              onBlur={handleBlur}
            />
          </form>
        )
        : (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={() => handleStartEditingTodo(todo)}
            >
              {todo.title}
            </span>
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDeleteButton"
              onClick={() => removeTodo(todo)}
            >
              ×
            </button>
          </>
        )}

      <div
        data-cy="TodoLoader"
        className={classNames(
          'modal',
          'overlay',
          {
            'is-active': isAdded || isDeleting || isUpdating
              || (isDeletingAll && todo.completed)
              || (isToggleAll && !todo.completed),
          },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
