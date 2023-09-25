import React, {
  useContext,
  useEffect,
  useState,
  useRef,
} from 'react';
import cn from 'classnames';

import { Todo } from '../../types/todosTypes';
import { TodosContext, ApiErrorContext, FormFocusContext } from '../../Context';
import { deleteTodo, patchTodo } from '../../api/todos';
import { deleteTodoAction, patchTodoAction }
  from '../../Context/actions/actionCreators';
import { Form } from '../Form';

type Props = {
  todo: Todo,
};

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const { setIsFocused } = useContext(FormFocusContext);
  const {
    id,
    title,
    completed,
    isSpinned,
  } = todo;
  const [isTodoSpinned, setIsTodoSpinned] = useState(isSpinned || false);
  const [isCompleted, setIsCompleted] = useState(completed);
  const [isEdited, setIsEdited] = useState(false);
  const { dispatch } = useContext(TodosContext);
  const { setApiError } = useContext(ApiErrorContext);
  const [inputValue, setInputValue] = useState(title);
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsTodoSpinned(isSpinned || false);
  }, [isSpinned]);

  useEffect(() => {
    setIsCompleted(completed);
  }, [completed]);

  useEffect(() => {
    if (ref.current) {
      ref.current.focus();
    }
  }, [isEdited]);

  const handleDeleteClick = () => {
    setIsTodoSpinned(true);
    setIsFocused(false);

    deleteTodo(id)
      .then(() => {
        const deleteAction = deleteTodoAction(id);

        dispatch(deleteAction);
        setIsFocused(true);
      })
      .catch((error) => {
        setApiError(error);
      })
      .finally(() => {
        setIsTodoSpinned(false);
      });
  };

  const handleCompletedToggle = () => {
    setIsTodoSpinned(true);
    const data = { completed: !isCompleted };

    patchTodo(id, data)
      .then((patchedTodo) => {
        const patchAction = patchTodoAction(patchedTodo);

        setIsCompleted(prev => !prev);
        dispatch(patchAction);
      })
      .catch((error) => {
        setApiError(error);
      })
      .finally(() => {
        setIsTodoSpinned(false);
      });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.code === 'Escape') {
      setIsEdited(false);
      setInputValue(title);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>
  | React.FocusEvent<HTMLInputElement>) => {
    event.preventDefault();

    const preparedInputValue = inputValue.trim();
    const data = { title: preparedInputValue };

    if (preparedInputValue === title) {
      setIsEdited(false);
      setInputValue(preparedInputValue);

      return;
    }

    if (!preparedInputValue.length) {
      handleDeleteClick();
      setIsEdited(true);
      setInputValue(preparedInputValue);

      return;
    }

    setIsTodoSpinned(true);

    patchTodo(id, data)
      .then((patchedTodo) => {
        const patchAction = patchTodoAction(patchedTodo);

        setIsEdited(false);
        dispatch(patchAction);
        setInputValue(patchedTodo.title);
      })
      .catch(error => {
        setApiError(error);
        setIsEdited(true);
      })
      .finally(() => {
        setIsTodoSpinned(false);
        if (ref.current) {
          ref.current.disabled = false;
        }
      });
  };

  return (
    <div
      className={cn('todo', {
        completed: isCompleted,
      })}
      data-cy="Todo"
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={isCompleted}
          onChange={handleCompletedToggle}
        />
      </label>

      {isEdited ? (

        <Form
          forCypress="TodoTitleField"
          ref={ref}
          className="todo__title-field"
          placeholder="Empty todo will be deleted"
          value={inputValue}
          onInputChange={handleInputChange}
          onSubmit={handleSubmit}
          onBlur={handleSubmit}
          onKeyUp={handleKeyUp}
        />
      ) : (
        <>
          <span
            className="todo__title"
            data-cy="TodoTitle"
            onDoubleClick={() => {
              setIsEdited(true);
            }}
          >
            {inputValue}
          </span>

          <button
            type="button"
            className={cn('todo__remove')}
            onClick={handleDeleteClick}
            data-cy="TodoDelete"
          >
            ×
          </button>
        </>
      )}

      <div
        className={cn('modal overlay', {
          'is-active': isTodoSpinned,
        })}
        data-cy="TodoLoader"
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
