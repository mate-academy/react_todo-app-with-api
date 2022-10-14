import classNames from 'classnames';
import React, { useState } from 'react';
import { deleteTodo, updateTodo } from '../../api/todos';
import { ErrorTypes } from '../../types/ErrorTypes';
import { Todo } from '../../types/Todo';

interface Props {
  todo: Todo;
  deleteTodoToState: (todoId: number) => void;
  changeTodoFromState: (todoId: number, title?: string) => void;
  changeError: (value: ErrorTypes | null) => void;
  todosInProcess: number[] | null;
}

const TodoItem:React.FC<Props> = ({
  todo,
  deleteTodoToState,
  changeTodoFromState,
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
      .then(() => deleteTodoToState(todo.id))
      .catch(() => changeError(ErrorTypes.Delete))
      .finally(() => setIsLoading(false));
  };

  const changeTodoStatus = (todoId: number) => {
    setIsLoading(true);

    updateTodo(todoId, { completed: !todo.completed })
      .then(() => {
        changeTodoFromState(todoId);
      })
      .catch(() => changeError(ErrorTypes.Update))
      .finally(() => setIsLoading(false));
  };

  const changeTodoTitle = (todoId: number) => {
    setIsLoading(true);

    const inputValueTrim = inputValue.trim();

    if (!inputValueTrim) {
      deleteItem();

      return;
    }

    if (todo.title === inputValueTrim) {
      setIsEdit(false);
      setIsLoading(false);
      setInputValue(inputValueTrim);

      return;
    }

    updateTodo(todoId, { title: inputValueTrim })
      .then(() => {
        changeTodoFromState(todoId, inputValueTrim);
      })
      .catch(() => changeError(ErrorTypes.Update))
      .finally(() => {
        setIsLoading(false);
        setIsEdit(false);
        setInputValue(inputValueTrim);
      });
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
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              changeTodoTitle(todo.id);
            }
          }}
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
