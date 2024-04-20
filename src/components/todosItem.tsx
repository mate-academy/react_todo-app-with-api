/* eslint-disable jsx-a11y/label-has-associated-control */

import { useContext, useState } from 'react';
import { Todo } from '../types/Todo';
import { TodosContext } from './todosContext';
import classNames from 'classnames';
import { updateTodo } from '../api/todos';

/* eslint-disable jsx-a11y/control-has-associated-label */
interface ItemProps {
  item: Todo;
}

export const TodosItem: React.FC<ItemProps> = ({ item }) => {
  const {
    allId,
    setAllId,
    handleDeleteTodo,
    handleUpdateTodoStatus,
    setErrorMessage,
    setTodos,
  } = useContext(TodosContext);

  const [isEditingOn, setIsEditingOn] = useState(false);
  const [updatedValue, setUpdatedValue] = useState(item.title);

  const handleUpdateTodoTitle = (clickedTodo: Todo) => {
    const updatedTodo = {
      ...clickedTodo,
      title: updatedValue,
    };

    setAllId(prevAllId => [...prevAllId, updatedTodo.id]);

    updateTodo(updatedTodo)
      .then(response => {
        setTodos(prevTodos => {
          const newTodos = [...prevTodos];

          const index = newTodos.findIndex(todo => todo.id === response.id);

          newTodos.splice(index, 1, updatedTodo);

          return newTodos;
        });
      })
      .catch(() => {
        setTimeout(() => {
          setErrorMessage('Unable to update a todo');
        }, 3000);
      })
      .finally(() => {
        setAllId([]);
      });
  };

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
    setIsEditingOn(false);

    if (updatedValue.trim() === '') {
      handleDeleteTodo(item.id);
    } else {
      handleUpdateTodoTitle(item);
    }
  };

  const handleEnterEdit = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') {
      return;
    }

    event.preventDefault();

    submitEditind();
  };

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
              onDoubleClick={() => setIsEditingOn(true)}
              data-cy="TodoTitle"
              className="todo__title"
            >
              {item.title}
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
              autoFocus
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={updatedValue}
              onBlur={() => submitEditind()}
              onKeyDown={handleEnterEdit}
              onChange={handleEditOnChange}
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
