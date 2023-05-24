import classNames from 'classnames/bind';
import {
  FC, useContext, useState,
} from 'react';
import { Todo } from '../../types/Todo';
import { AppTodoContext } from '../../contexts/AppTodoContext';
import {
  deleteTodo,
  getTodos,
  toggleTodoStatus,
} from '../../api/todos';
import { USER_ID } from '../../react-app-env';
import { EditForm } from '../EditForm/EditForm';
import {ErrorType} from "../../types/enums";

interface Props {
  todo: Todo,
  isTempTodo?: boolean,
}

export const TodoItem: FC<Props> = (
  { todo, isTempTodo },
) => {
  const {
    todos,
    setErrorMessage,
    addProcessingTodo,
    removeProcessingTodo,
    isTodoProcessing,
    setTodos,
  } = useContext(AppTodoContext);

  const { title, completed, id } = todo;
  const [isEditAvailable, setIsEditAvailable] = useState(false);

  const handleRemoveButton = async () => {
    addProcessingTodo(id);

    try {
      await deleteTodo(todo.id);
      setTodos(await getTodos(USER_ID));
    } catch {
      setErrorMessage(ErrorType.DeleteTodoError);
    } finally {
      removeProcessingTodo(id);
    }
  };

  const handleToggleStatus = async () => {
    addProcessingTodo(id);

    try {
      const updatedTodo = await toggleTodoStatus(todo);
      const prevTodoIndex = todos.findIndex(
        prevTodo => prevTodo.id === todo.id,
      );

      setTodos(prevTodos => {
        const updatedTodos = [...prevTodos];

        updatedTodos[prevTodoIndex] = updatedTodo;

        return updatedTodos;
      });

      setTodos(await getTodos(USER_ID));
    } catch {
      setErrorMessage(ErrorType.UpdateTodoError);
    } finally {
      removeProcessingTodo(id);
    }
  };

  return (
    <div
      className={classNames(
        'todo',
        { completed },
      )}
    >

      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          onChange={handleToggleStatus}
        />
      </label>

      {isEditAvailable
        ? (
          <EditForm
            todo={todo}
            setIsEditAvailable={setIsEditAvailable}
            onRemove={handleRemoveButton}
            isEditAvailable={isEditAvailable}
          />
        )
        : (
          <span
            className="todo__title"
            onDoubleClick={() => {
              setIsEditAvailable(true);
            }}
          >
            {title}
          </span>
        )}

      {!isEditAvailable && (
        <button
          type="button"
          className="todo__remove"
          onClick={() => {
            handleRemoveButton();
          }}
        >
          ×
        </button>
      )}

      <div className={classNames(
        'modal overlay',
        { 'is-active': isTodoProcessing(id) },
        { 'is-active': isTempTodo },
      )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
