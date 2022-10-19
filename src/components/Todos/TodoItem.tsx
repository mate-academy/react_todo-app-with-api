import classNames from 'classnames';
import React, { useState } from 'react';
import { deleteTodo, updateTodo } from '../../api/todos';
import { ErrorTypes } from '../../types/ErrorTypes';
import { Todo } from '../../types/Todo';

interface Props {
  todo: Todo;
  onDeleteTodo: (todoId: number) => void;
  onChangeTodo: (todoId: number, title?: string) => void;
  changeError: (value: ErrorTypes | null) => void;
  todosInProcess: number[] | null;
}

const TodoItem:React.FC<Props> = ({
  todo,
  onDeleteTodo,
  onChangeTodo,
  changeError,
  todosInProcess,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);

  const [inputValue, setInputValue] = useState(todo.title);

  const changeInputValue = (value: string) => {
    setInputValue(value);
  };

  const openEdit = () => setIsEdit(true);

  const deleteItem = () => {
    setIsLoading(true);

    deleteTodo(todo.id)
      .then(() => onDeleteTodo(todo.id))
      .catch(() => changeError(ErrorTypes.Delete))
      .finally(() => setIsLoading(false));
  };

  const changeTodoStatus = (todoId: number) => {
    setIsLoading(true);

    updateTodo(todoId, { completed: !todo.completed })
      .then(() => {
        onChangeTodo(todoId);
      })
      .catch(() => changeError(ErrorTypes.Update))
      .finally(() => setIsLoading(false));
  };

  const changeTodoTitle = (todoId: number) => {
    setIsLoading(true);

    const trimmedInputValue = inputValue.trim();

    if (!trimmedInputValue) {
      deleteItem();

      return;
    }

    if (todo.title === trimmedInputValue) {
      setIsEdit(false);
      setIsLoading(false);
      setInputValue(trimmedInputValue);

      return;
    }

    updateTodo(todoId, { title: trimmedInputValue })
      .then(() => {
        onChangeTodo(todoId, trimmedInputValue);
      })
      .catch(() => changeError(ErrorTypes.Update))
      .finally(() => {
        setIsLoading(false);
        setIsEdit(false);
        setInputValue(trimmedInputValue);
      });
  };

  const changeTodoTitleForKeyDown = (key: string, todoId: number) => {
    if (key !== 'Enter') {
      return;
    }

    changeTodoStatus(todoId);
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
    >
      <label
        className="todo__status-label"
      >
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked
          onClick={() => changeTodoStatus(todo.id)}
        />
      </label>

      {isEdit ? (
        <input
          data-cy="TodoTitleField"
          className="todo__input"
          type="text"
          value={inputValue}
          onChange={(event) => changeInputValue(event.target.value)}
          onBlur={() => changeTodoTitle(todo.id)}
          onKeyDown={(event) => changeTodoTitleForKeyDown(event.key, todo.id)}
        />
      ) : (
        <>
          <span
            aria-hidden="true"
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={openEdit}
          >
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDeleteButton"
            onClick={deleteItem}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames(
          'modal overlay',
          { 'is-active': isLoading || todosInProcess?.includes(todo.id) },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

export default TodoItem;
