import classNames from 'classnames';
import {
  ChangeEvent, useEffect, useRef,
} from 'react';
import { deleteTodo, updateTodo } from '../../../api/todos';
import { TypeChange } from '../../../context/TodoContext';
import { Todo } from '../../../types/Todo';

type Props = {
  todo: Todo,
  handleStatusChange: (todo: Todo, type: TypeChange) => void,
  selectedTodoId: number | null,
  setSelectedTodoId: (valut: number) => void,
  setInputValue: (value: string) => void,
  inputValue: string,
  handleChangeTitle: (event: ChangeEvent<HTMLInputElement>) => void,
  setLoadError: (value: boolean) => void,
  setErrorMessage: (value: string) => void,
  allCompletedLoader: boolean,
  todoIdLoader: null | number,
  setTodoIdLoader: (value: number | null) => void,
  toggleLoader: boolean,
};

export const TodoRender: React.FC<Props> = ({
  todo,
  handleStatusChange,
  selectedTodoId,
  setSelectedTodoId,
  setInputValue,
  inputValue,
  handleChangeTitle,
  setLoadError,
  setErrorMessage,
  allCompletedLoader,
  todoIdLoader,
  setTodoIdLoader,
  toggleLoader,
}) => {
  const {
    title, completed, id,
  } = todo;
  const newTodoField = useRef<HTMLInputElement>(null);

  const removeFromServer = async (data: Todo) => {
    try {
      setTodoIdLoader(data.id);
      await deleteTodo(data.id);
      handleStatusChange(data, TypeChange.delete);
    } catch (_) {
      setLoadError(true);
      setErrorMessage('Unable to delete todo from the server');
    } finally {
      setTodoIdLoader(null);
    }
  };

  const handleRemoveTodo = (data: Todo) => {
    removeFromServer(data);
  };

  const changeCompleteOnServer = async () => {
    try {
      setTodoIdLoader(id);
      const todoWithChangedComplete = { ...todo };

      todoWithChangedComplete.completed = !completed;

      await updateTodo(id, todoWithChangedComplete);
      handleStatusChange(todo, TypeChange.checkbox);
    } catch (_) {
      setLoadError(true);
      setErrorMessage('Unable to change complete status');
    } finally {
      setTodoIdLoader(null);
    }
  };

  const handleCompleteChange = () => {
    changeCompleteOnServer();
  };

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, [selectedTodoId]);

  return (
    <div
      data-cy="Todo"
      className={classNames(
        'todo',
        { completed },
      )}
      key={id}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked
          onClick={handleCompleteChange}
        />
      </label>

      {(selectedTodoId !== id && (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={() => {
            setSelectedTodoId(todo.id);
            setInputValue(title);
          }}
        >
          {title}
        </span>
      ))}
      {selectedTodoId === id
  && (
    <input
      value={inputValue}
      className="input is-large is-primary"
      onBlur={() => handleStatusChange(todo, TypeChange.title)}
      onChange={handleChangeTitle}
      ref={newTodoField}
    />
  )}
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDeleteButton"
        onClick={() => handleRemoveTodo(todo)}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={classNames(
          'modal overlay',
          {
            'is-active': todo.id === 0 || todo.id === todoIdLoader
            || (allCompletedLoader && todo.completed) || toggleLoader,
          },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
