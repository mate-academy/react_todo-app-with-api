import {
  FC,
  FormEvent,
  FocusEvent,
  KeyboardEvent,
  useContext,
  useState,
  useRef,
  useEffect,
} from 'react';
import classNames from 'classnames';
import { changeTitleTodos, deleteTodos, toggleTodos } from '../../api/todos';
import { ErrorMessage, Todo } from '../../types';
import { TodosContext } from '../TodosContext/TodosContext';

interface Props {
  todo: Todo;
  todoLoading?: boolean;
}

export const TodoItem: FC<Props> = ({
  todo,
  todoLoading,
}) => {
  const {
    setTodos,
    setError,
    isTodoDeleting,
    setSelectedTodoId,
  } = useContext(TodosContext);

  const { id, completed, title } = todo;

  const [isItemTododLoading, setIsItemTodoLoading] = useState(false);
  const [editTodoTitle, setEditTodoTitle] = useState(title);
  const [editTodoTitleId, setEditTodoTitleId] = useState<number | null>(null);

  const inputReference = useRef<HTMLInputElement>(null);

  const isLoading = todoLoading
    || isItemTododLoading
    || isTodoDeleting?.includes(id);

  const handleTodoDelete = () => {
    setIsItemTodoLoading(true);

    deleteTodos(id)
      .then(() => setTodos((prevTodos: Todo[]) => (
        prevTodos.filter((prevTodo: Todo) => prevTodo.id !== id)
      )))
      .catch(() => {
        setError(ErrorMessage.Delete);
      }).finally(() => {
        setIsItemTodoLoading(false);
      });
  };

  const handleTodoStatusChange = (todoId: number, check: boolean) => {
    setSelectedTodoId(todoId);

    setIsItemTodoLoading(true);

    toggleTodos(todoId, !check)
      .then(() => {
        setTodos((prevTodos: Todo[]) => prevTodos.map(currTodo => (
          currTodo.id === todoId
            ? { ...currTodo, completed: !currTodo.completed }
            : currTodo
        )));
      }).catch(() => {
        setError(ErrorMessage.Update);
      }).finally(() => {
        setSelectedTodoId(null);
        setIsItemTodoLoading(false);
      });
  };

  const handleTodoTitleChange = (
    event: FormEvent<HTMLFormElement> | FocusEvent<HTMLInputElement>,
  ) => {
    event.preventDefault();

    if (!editTodoTitleId) {
      return;
    }

    if (editTodoTitle === title) {
      setEditTodoTitleId(null);

      return;
    }

    setIsItemTodoLoading(true);

    if (!editTodoTitle.trim()) {
      deleteTodos(editTodoTitleId)
        .then(() => {
          setTodos((prevTodos: Todo[]) => (
            prevTodos.filter((prevTodo: Todo) => (
              prevTodo.id !== editTodoTitleId
            ))
          ));
        }).catch(() => {
          setError(ErrorMessage.Delete);
          setEditTodoTitle(title);
        }).finally(() => {
          setEditTodoTitleId(null);
          setIsItemTodoLoading(false);
        });
    } else {
      changeTitleTodos(editTodoTitleId, editTodoTitle)
        .then(() => {
          setTodos((prevTodos) => prevTodos.map((prevTodo) => (
            prevTodo.id === editTodoTitleId
              ? { ...prevTodo, title: editTodoTitle }
              : prevTodo
          )));
        }).catch(() => {
          setError(ErrorMessage.Update);
        }).finally(() => {
          setEditTodoTitleId(null);
          setIsItemTodoLoading(false);
        });
    }
  };

  const handleUpdatedTitle = (todoTitle: string) => {
    setEditTodoTitle(todoTitle);
  };

  const handleKeyUp = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setEditTodoTitleId(null);
      setEditTodoTitle(title);
    }
  };

  useEffect(() => {
    inputReference.current?.focus();
  }, [editTodoTitleId]);

  return (
    <div className={classNames('todo', { completed })}>
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => handleTodoStatusChange(id, completed)}
        />
      </label>

      {editTodoTitleId !== id ? (
        <>
          <span
            className="todo__title"
            onDoubleClick={() => {
              setEditTodoTitleId(id);
            }}
          >
            { title }
          </span>

          <button
            type="button"
            className="todo__remove"
            onClick={handleTodoDelete}
          >
            ×
          </button>
        </>
      ) : (
        <form onSubmit={handleTodoTitleChange}>
          <input
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be delted"
            value={editTodoTitle}
            onChange={(event) => handleUpdatedTitle(event.target.value)}
            onBlur={(event) => handleTodoTitleChange(event)}
            onKeyUp={handleKeyUp}
            ref={inputReference}
            disabled={todoLoading}
          />
        </form>
      )}

      <div className={classNames('modal overlay', {
        'is-active': isLoading,
      })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
