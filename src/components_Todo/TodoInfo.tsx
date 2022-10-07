import classNames from 'classnames';
import {
  FormEvent,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Todo } from '../types/Todo';

interface Props {
  todo: Todo;
  changTitle: string;
  isAdding: boolean;
  setChangTitle: (event: string) => void;
  handleDeleteTodo: (event: FormEvent, element: number) => void;
  handleChangeCompleted: (event: number, completed: boolean) => void;
  handleUpdateTodo: (event: FormEvent, element: number) => void;
}

export const TodoInfo: React.FC<Props> = ({
  todo,
  changTitle,
  isAdding,
  setChangTitle,
  handleDeleteTodo,
  handleChangeCompleted,
  handleUpdateTodo,
}) => {
  const { id, completed, title } = todo;
  const newTodoField = useRef<HTMLInputElement>(null);
  const [visiblInput, setVisibulInput] = useState(false);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

  const handleChangeTitile = () => {
    setVisibulInput(!visiblInput);
  };

  const handlePatch = (event: { target: { value: string; }; }) => {
    setChangTitle(event.target.value);
  };

  const handleCooseUpdateTodo = (event: FormEvent<Element>) => {
    if (changTitle.trim() === '') {
      handleDeleteTodo(event, id);
    }

    handleUpdateTodo(event, id);

    setVisibulInput(false);
  };

  return (
    <div
      data-cy="Todo"
      className={classNames(
        'todo',
        { 'todo completed': completed },
      )}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked
          onChange={() => handleChangeCompleted(id, completed)}
        />
      </label>
      {!visiblInput ? (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => handleChangeTitile()}
          >
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDeleteButton"
            onClick={(event) => handleDeleteTodo(event, id)}
          >
            ×
          </button>
        </>
      ) : (
        <form>
          <input
            onSubmit={(event) => handleUpdateTodo(event, id)}
            data-cy="TodoTitleField"
            type="text"
            ref={newTodoField}
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            defaultValue={title}
            onChange={handlePatch}
            onBlur={(event) => {
              handleCooseUpdateTodo(event);
            }}
          />
        </form>
      )}
      {isAdding
      && (
        <div
          data-cy="TodoLoader"
          className={classNames(
            'modal overlay',
            {
              'is-active': isAdding,
            },
          )}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      )}
    </div>
  );
};
