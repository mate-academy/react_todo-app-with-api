import {
  FC,
  ChangeEvent,
  Dispatch,
  useState,
  FormEvent,
  useRef,
  useEffect,
  KeyboardEvent,
} from 'react';
import classNames from 'classnames';
import { DataPatch, Todo } from '../types/Todo';
import { CustomError } from '../types/CustomError';
import { updateTodo } from '../api/todos';
import { useLoadStatusContext } from '../utils/LoadStatusContext';
import { initData } from '../constants/initData';

type Props = {
  completed: boolean,
  title: string,
  id: number,
  onRemove: (id: number) => void,
  todos: Todo[],
  setTodos: Dispatch<React.SetStateAction<Todo[]>>,
  setError: (newError: CustomError, delay?: number) => void,
};

export const TodoComponent: FC<Props> = ({
  completed,
  title,
  id,
  onRemove,
  todos,
  setTodos,
  setError,
}) => {
  const [editActive, setEditActive] = useState<boolean>(initData.editStatus);
  const [newTitle, setNewTitle] = useState<string>(title);
  const { loadingStatus, setLoadingStatus } = useLoadStatusContext();
  const focusEdit = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (focusEdit.current) {
      focusEdit.current.focus();
    }
  }, [editActive]);

  const editTodo = (data: DataPatch) => {
    const dataValue = Object.values(data)[0];

    if (dataValue) {
      if (dataValue !== title) {
        const currentTodo = todos.find((todo: Todo) => todo.id === id);

        if (currentTodo) {
          setLoadingStatus([currentTodo.id]);
          const index = todos.indexOf(currentTodo);

          updateTodo(id, data)
            .then((response: Todo) => {
              setTodos(prevState => {
                return [
                  ...prevState.slice(0, index),
                  {
                    ...response,
                  },
                  ...prevState.slice(index + 1, prevState.length),
                ];
              });

              setLoadingStatus(prevState => {
                return [
                  ...prevState.filter(stopLoadId => stopLoadId !== response.id),
                ];
              });
            })
            .catch(() => setError(CustomError.Update));
        } else {
          setError(CustomError.Update);
        }
      } else {
        setError(CustomError.Cancel, 3000);
        setEditActive(false);
      }
    } else {
      onRemove(id);
    }
  };

  const handleStatusChange = (e: ChangeEvent<HTMLInputElement>) => {
    const data = { completed: e.target.checked };

    editTodo(data);
  };

  const handleEdit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setEditActive(false);
    const data = { title: newTitle };

    editTodo(data);
  };

  const handleOnblur = () => {
    setEditActive(false);
    const data = { title: newTitle };

    editTodo(data);
  };

  const handleEsc = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setError(CustomError.Cancel, 3000);
      setEditActive(false);
    }
  };

  return (
    <>
      {editActive ? (
        <div className="todo">
          <label className="todo__status-label">
            <input
              type="checkbox"
              className="todo__status"
            />
          </label>

          <form
            onSubmit={handleEdit}
          >
            <input
              onBlur={handleOnblur}
              ref={focusEdit}
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyUp={handleEsc}
            />
          </form>

          <div className="modal overlay">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      ) : (
        <div
          className={classNames('todo', { completed })}
        >
          <label className="todo__status-label">
            <input
              type="checkbox"
              className="todo__status"
              checked={completed}
              onChange={handleStatusChange}
            />
          </label>

          <span
            onDoubleClick={() => setEditActive(true)}
            className="todo__title"
          >
            {title}
          </span>

          <button
            type="button"
            className="todo__remove"
            onClick={() => onRemove(id)}
          >
            ×
          </button>

          <div className={classNames(
            'modal',
            'overlay',
            { 'is-active': loadingStatus.includes(id) },
          )}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </>
  );
};
