import {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { deleteTodo, updateTodo } from '../../api/todos';
import { Error } from '../../types/enums/Error';
import { DispatchContext } from '../../TodosContext';
import { ReducerType } from '../../types/enums/ReducerType';
import { TodoLoader } from '../TodoLoader/TodoLoader';

interface Props {
  todo: Todo
  load?: boolean
}

export const TodoItem: React.FC<Props> = ({
  todo,
  load = false,
}) => {
  const dispatch = useContext(DispatchContext);
  const { completed, title, id } = todo;
  const [hover, setHover] = useState(false);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(load);
  const [editTitle, setEditTitle] = useState(title);
  const editingInputItem = useRef<HTMLInputElement>(null);

  const isEditing = editing && !loading;
  const isHover = !editing && hover;

  useEffect(() => {
    editingInputItem.current?.focus();
  }, [editing]);

  const handleDeleteTodo = () => {
    setLoading(true);

    deleteTodo(id)
      .catch(() => dispatch({
        type: ReducerType.SetError,
        payload: Error.UnabletoDeleteATodo,
      }))
      .finally(() => {
        dispatch({
          type: ReducerType.DeleteTodo,
          payload: id,
        });
        setLoading(false);
      });
  };

  const handleCompletedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoading(true);

    updateTodo(id, { ...todo, completed: e.target.checked })
      .catch(() => dispatch({
        type: ReducerType.SetError,
        payload: Error.UnableToUpdateATodo,
      }))
      .finally(() => {
        dispatch({
          type: ReducerType.ChangeTodo,
          payload: {
            ...todo,
            completed: !completed,
          },
        });
        setLoading(false);
      });
  };

  const handleEditCancel = () => {
    setEditTitle(title);
    setEditing(false);
  };

  const handleEditSubmit = () => {
    switch (editTitle.trim()) {
      case title.trim():
        handleEditCancel();
        break;

      case '':
        handleDeleteTodo();
        break;

      default:
        setLoading(true);

        updateTodo(id, { ...todo, title: editTitle })
          .then(() => dispatch({
            type: ReducerType.ChangeTodo,
            payload: { ...todo, title: editTitle },
          }))
          .catch(() => dispatch({
            type: ReducerType.SetError,
            payload: Error.UnableToUpdateATodo,
          }))
          .finally(() => {
            setLoading(false);
            setEditing(false);
          });
        break;
    }
  };

  const handleEditKeySubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case 'Enter':
        handleEditSubmit();
        break;

      case 'Escape':
        handleEditCancel();
        break;

      default:
        break;
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames(
        'todo',
        {
          completed,
        },
      )}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={handleCompletedChange}
        />
      </label>

      {
        isEditing
          ? (
            <form onSubmit={(e) => e.preventDefault()}>
              <input
                data-cy="TodoTitleField"
                type="text"
                className="todo__title-field"
                placeholder="Empty todo will be deleted"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onBlur={handleEditSubmit}
                onKeyUp={handleEditKeySubmit}
                ref={editingInputItem}
              />
            </form>
          ) : (
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={() => setEditing(true)}
            >
              {title}
            </span>
          )
      }

      {
        isHover && (
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={handleDeleteTodo}
          >
            ×
          </button>
        )
      }

      {loading && <TodoLoader />}
    </div>
  );
};
