import {
  FC,
  useContext,
  useState,
} from 'react';
import classNames from 'classnames';
import { TodoUpdate, Todo as TodoType } from '../types/Todo';
import { EditForm } from './EditForm';
import { TodoContext } from '../context/TodoContext';

type Props = {
  todo: TodoType;
  removeTodo: (id: number) => void;
  updateTodo: (id: number, newValues: TodoUpdate) => void;
};

export const Todo:FC<Props> = ({ todo, removeTodo, updateTodo }) => {
  const [isEdit, setIsEdit] = useState(false);
  const { todosIdsOnLoad } = useContext(TodoContext);

  const {
    id,
    completed,
    title,
  } = todo;

  const isLoading = todosIdsOnLoad.includes(id);

  const handleRemove = () => {
    removeTodo(id);
  };

  const handleCheck = () => {
    updateTodo(id, { completed: !completed });
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
              checked={isEdit}
              onChange={handleCheck}
            />
          </label>
          <EditForm
            todo={todo}
            updateTodo={updateTodo}
            setIsEdit={setIsEdit}
          />
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
