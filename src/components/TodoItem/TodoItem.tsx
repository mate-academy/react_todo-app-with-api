/* eslint-disable quote-props */
/* eslint-disable no-console */
import classNames from 'classnames';
import {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import { Todo } from '../../types/Todo';

// eslint-disable-next-line import/no-cycle
import {
  LoadingContext,
  TodoUpdateContext,
} from '../../TodosContext/TodosContext';

type Props = {
  todo: Todo;
  inputRef: React.RefObject<HTMLInputElement>;
};

export const TodoItem: React.FC<Props> = ({ todo, inputRef }) => {
  const { removeTodo, changeTodo } = useContext(TodoUpdateContext);
  const { loading, startLoading } = useContext(LoadingContext);

  const [title, setTitle] = useState(todo.title);
  const [changeTitle, setChangeTitle] = useState<boolean>(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (tempTodo) {
      titleRef.current?.focus();
    }
  }, [tempTodo, changeTitle]);

  async function handleRemove(event: React.FormEvent<HTMLButtonElement>) {
    event.preventDefault();
    startLoading(todo.id);
    const deleteId: number = todo.id;

    await removeTodo(deleteId);
    inputRef.current?.focus();
  }

  async function handleChangeTodo() {
    startLoading(todo.id);

    try {
      await changeTodo(todo.id, !todo.completed, todo.title);
    } catch (error) {
      titleRef?.current?.focus();
    }
  }

  async function renameTodo(todoToUpdate: Todo, newTitle: string) {
    if (todoToUpdate.title === newTitle) {
      setTempTodo(null);
      setChangeTitle(false);

      return;
    }

    startLoading(todoToUpdate.id);
    if (newTitle === '') {
      try {
        await removeTodo(todoToUpdate.id);
        setTempTodo(null);
        setChangeTitle(false);
        setTitle('');
        inputRef.current?.focus();
      } catch (error) {
        titleRef?.current?.focus();
      }
    } else {
      await changeTodo(todoToUpdate.id, todoToUpdate.completed, newTitle);
      setChangeTitle(false);
    }
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setTempTodo(todo);

    try {
      renameTodo(todo, title.trim());
      titleRef.current?.focus();
    } catch (error) {
      setTitle(todo.title);
    }
  }

  return (
    <div
      data-cy="Todo"
      className={todo.completed ? 'todo completed' : 'todo'}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className={classNames('todo__status', {
            completed: todo.completed,
          })}
          checked={todo.completed}
          onClick={handleChangeTodo}
        />
      </label>

      {changeTitle ? (
        <form onSubmit={handleSubmit}>
          <input
            ref={titleRef}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            onBlur={handleSubmit}
            onKeyUp={(event) => {
              if (event.key === 'Escape') {
                setChangeTitle(false);
                setTitle(todo.title);
                console.log('escape was pushed');
              }
            }}
          />
        </form>
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={() => {
            setChangeTitle(true);
            setTempTodo(todo);
          }}
        >
          {todo.title}
        </span>
      )}

      {!changeTitle && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={handleRemove}
        >
          ×
        </button>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': loading?.includes(todo.id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
