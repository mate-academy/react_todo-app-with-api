/* eslint-disable jsx-a11y/label-has-associated-control */

import { useContext, useEffect, useRef } from 'react';
import { Todo } from '../types/Todo';
import { TodosContext } from './todosContext';
import classNames from 'classnames';

/* eslint-disable jsx-a11y/control-has-associated-label */
interface ItemProps {
  item: Todo;
}

export const TodosItem: React.FC<ItemProps> = ({ item }) => {
  const {
    allId,
    setAllId,
    updatedValue,
    setUpdatedValue,
    handleDeleteTodo,
    handleUpdateTodoStatus,
    handleUpdateTodoTitle,
    tempEdition,
    setTempEdition,
    isEditingOn,
    setIsEditingOn,
  } = useContext(TodosContext);

  // const [isEditingOn, setIsEditingOn] = useState(false);

  const isTodoCompletedClass = classNames({
    todo: true,
    completed: item.completed,
  });

  const loaderClass = classNames({
    modal: true,
    overlay: true,
    'is-active': allId.includes(item.id) || !item.id,
  });

  const handleEditOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUpdatedValue(event.target.value);
  };

  const submitEditind = () => {
    // setIsEditingOn(false);

    if (updatedValue.trim() === '') {
      handleDeleteTodo(item.id);
    } else {
      setTempEdition({
        ...item,
        title: updatedValue,
      });
      setAllId([...allId, item.id]);
      handleUpdateTodoTitle(item);
    }
  };

  const handleOnBlur = () => {
    if (item.title !== updatedValue) {
      submitEditind();
    } else {
      setIsEditingOn(false);
    }
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter' && event.key !== 'Escape') {
      return;
    } else if (event.key === 'Enter' && item.title === updatedValue) {
      setIsEditingOn(false);

      return;
    } else if (event.key === 'Escape') {
      setIsEditingOn(false);

      return;
    } else if (event.key === 'Enter' && item.title !== updatedValue) {
      submitEditind();
    } else {
      return;
    }

    event.preventDefault();
  };

  const handleDoubleClick = () => {
    setUpdatedValue(item.title);
    setIsEditingOn(true);
  };

  const showThisTitle = () => {
    return allId.includes(item.id) && tempEdition
      ? tempEdition.title
      : item.title;
  };

  const editElement = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editElement.current && isEditingOn) {
      editElement.current.focus();
    }
  }, [isEditingOn]);

  return (
    <>
      <div data-cy="Todo" className={isTodoCompletedClass}>
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            onChange={() => handleUpdateTodoStatus(item)}
            checked={item.completed}
          />
        </label>

        {!isEditingOn && (
          <>
            <span
              onDoubleClick={() => handleDoubleClick()}
              data-cy="TodoTitle"
              className="todo__title"
            >
              {showThisTitle()}
            </span>

            <button
              onClick={() => handleDeleteTodo(item.id)}
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
            >
              ×
            </button>
          </>
        )}

        {isEditingOn && (
          <form>
            <input
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={updatedValue}
              onBlur={handleOnBlur}
              onKeyDown={handleKeyUp}
              onChange={handleEditOnChange}
              ref={editElement}
            />
          </form>
        )}

        <div data-cy="TodoLoader" className={loaderClass}>
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    </>
  );
};
