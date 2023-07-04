import {
  FC,
  useState,
} from 'react';
import classNames from 'classnames';
import { TodoUpdate, Todo as TodoType } from '../types/Todo';
import { EditForm } from './EditForm';

type Props = {
  todo: TodoType;
  removeTodo: (id: number) => void;
  updateTodo: (id: number, newValues: TodoUpdate) => void;
};

export const Todo:FC<Props> = ({ todo, removeTodo, updateTodo }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const {
    id,
    completed,
    title,
  } = todo;

  const handleRemove = async () => {
    setIsLoading(true);
    await removeTodo(id);
    setIsLoading(false);
  };

  const handleCheck = async () => {
    setIsLoading(true);
    await updateTodo(id, { completed: !completed });
    setIsLoading(false);
  };

  const handleDoubleClick = () => {
    setIsEdit(true);
  };

  return (
    <>
      {isEdit ? (
        <li
          className={classNames('todo', { completed })}
          onDoubleClick={handleDoubleClick}
        >
          <label className="todo__status-label">
            <input
              type="checkbox"
              className="todo__status"
              checked
              onChange={handleCheck}
            />
          </label>
          <EditForm todo={todo} updateTodo={updateTodo} setIsEdit={setIsEdit} />
        </li>
      ) : (
        <li
          className={classNames('todo', { completed })}
          onDoubleClick={handleDoubleClick}
        >

          <label className="todo__status-label">
            <input
              type="checkbox"
              className="todo__status"
              checked
              onChange={handleCheck}
            />
          </label>

          <span className="todo__title">
            {title}
          </span>

          <button
            type="button"
            className="todo__remove"
            onClick={handleRemove}
          >
            ×
          </button>

          <div className={classNames('modal overlay', {
            'is-active': id === 0 || isLoading,
          })}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </li>
      )}
    </>

  );
};
