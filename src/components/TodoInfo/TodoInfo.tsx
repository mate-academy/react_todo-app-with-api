import classNames from 'classnames';
import {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Todo } from '../../types/Todo';
import {
  deleteTodo,
  updateTodo,
} from '../../api/todos';
import { AuthContext } from '../Auth/AuthContext';
import { ErrorStatus } from '../../types/ErrorStatus';
import { Loader } from '../Loader/Loader';
import {
  setIsLoadingContext,
  functonsContext,
} from '../Context/context';

interface Props {
  todo: Todo,
  isLoading: number[],
}

export const TodoInfo: React.FC<Props> = (props) => {
  const {
    todo,
    isLoading,
  } = props;

  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);
  const user = useContext(AuthContext);

  const setIsLoading = useContext(setIsLoadingContext);
  const { setErrorWithTimer, loadUserTodos } = useContext(functonsContext);

  const editTodoField = useRef<HTMLInputElement>(null);

  const onFocusing = () => {
    if (editTodoField.current) {
      editTodoField.current.focus();
    }
  };

  useEffect(() => {
    onFocusing();
  }, [isEditing]);

  const handleSuccessfulEdit = useCallback((async () => {
    setIsLoading([todo.id]);
    if (!newTitle && user) {
      await deleteTodo(todo.id);

      try {
        await loadUserTodos();
      } catch {
        setErrorWithTimer(ErrorStatus.DeleteError);
        setIsLoading([]);
      }
    } else if (newTitle !== todo.title && user) {
      setIsLoading([todo.id]);
      await updateTodo(todo.id, { title: newTitle });

      try {
        await loadUserTodos();
      } catch {
        setErrorWithTimer(ErrorStatus.UpdateError);
      }
    }

    setIsEditing(false);
    setIsLoading([]);
  }), [newTitle, todo, user]);

  const handlePressEsc = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Escape') {
        setIsEditing(false);
        setNewTitle(todo.title);
      }
    }, [todo],
  );

  const handleCheckboxOnChange = useCallback(async () => {
    setIsLoading((prev) => [...prev, todo.id]);
    if (user) {
      await updateTodo(todo.id, { completed: !todo.completed })
        .catch(() => {
          setErrorWithTimer(ErrorStatus.UpdateError);
          setIsLoading([]);
        });
      await loadUserTodos();
      setIsLoading(prev => prev.filter((userTodoId) => userTodoId !== todo.id));
    }
  }, [todo, user]);

  const handleDeleteTodo = useCallback(async () => {
    setIsLoading([todo.id]);
    if (user) {
      await deleteTodo(todo.id)
        .catch(() => {
          setErrorWithTimer(ErrorStatus.DeleteError);
          setIsLoading([]);
        });
      await loadUserTodos();
      setIsLoading([]);
    }
  }, [todo, user]);

  return (
    <>
      <div
        data-cy="Todo"
        className={classNames(
          'todo',
          { completed: todo.completed },
        )}
      >
        {isLoading.includes(todo.id) && <Loader />}

        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            onChange={handleCheckboxOnChange}
          />
        </label>

        {isEditing
          ? (
            <form
              onSubmit={event => {
                event.preventDefault();
                handleSuccessfulEdit();
              }}
            >
              <input
                ref={editTodoField}
                data-cy="TodoTitleField"
                type="text"
                className="todo__title-field"
                placeholder="Empty todo will be deleted"
                value={newTitle}
                onBlur={() => {
                  handleSuccessfulEdit();
                }}
                onChange={event => setNewTitle(event.target.value)}
                onKeyDown={handlePressEsc}
              />
            </form>
          )
          : (
            <>
              <span
                data-cy="TodoTitle"
                className="todo__title"
                onDoubleClick={() => setIsEditing(true)}
                aria-hidden="true"
              >
                {todo.title}
              </span>

              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDeleteButton"
                onClick={handleDeleteTodo}
              >
                ×
              </button>
            </>
          )}

      </div>
    </>
  );
};
