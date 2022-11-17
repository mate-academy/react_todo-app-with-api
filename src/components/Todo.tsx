import {
  useState,
  useEffect,
  useContext,
  useRef,
  useCallback,
} from 'react';
import classNames from 'classnames';
import { User } from '../types/User';
import { deleteTodos, updateTodo } from '../api/todos';
import { Todo } from '../types/Todo';
import { AuthContext } from './Auth/AuthContext';
import { ErrorType } from '../types/ErrorType';

type Props = {
  todo: Todo,
  updateTodoList: (u: User) => void,
  setErrorUpdate:(value: ErrorType) => void,
  setErrorRemove: (value: ErrorType) => void,
  setHidden: (value: boolean) => void,
  selectComplited: (toDo: Todo) => Promise<void>,
  clearLoader: boolean,
  loadingAllTodos: boolean,
  onLoadTodo: (value: Todo | null) => void,
  loadTodo: Todo | null,
};

export const ToDo: React.FC<Props> = ({
  todo,
  updateTodoList,
  setErrorUpdate,
  setErrorRemove,
  setHidden,
  selectComplited,
  clearLoader,
  loadingAllTodos,
  onLoadTodo,
  loadTodo,
}) => {
  const user = useContext(AuthContext);
  const [editTodoTitile, setEditTodoTitle] = useState('');
  const [toggleDoubleClick, setToggleDoubleClick] = useState<Todo | null>(null);
  const editTitle = useRef<HTMLInputElement>(null);

  const removeTodo = async (toDo:Todo) => {
    deleteTodos(toDo);
    try {
      onLoadTodo(toDo);
      await deleteTodos(toDo);
    } catch {
      setErrorRemove(ErrorType.errorRemove);
      setHidden(false);
    }

    if (user) {
      updateTodoList(user);
    }
  };

  const editingTodo = useCallback(async (toDo:Todo) => {
    const validTodoTitle = editTodoTitile.trim();

    if (validTodoTitle.length < 1) {
      setToggleDoubleClick(null);
      removeTodo(toDo);

      return;
    }

    if (validTodoTitle === toDo.title) {
      setToggleDoubleClick(null);

      return;
    }

    try {
      onLoadTodo(toDo);
      setToggleDoubleClick(null);
      await updateTodo(toDo, { title: validTodoTitle });
    } catch {
      setErrorUpdate(ErrorType.errorUpdate);
      setHidden(false);
    }

    if (user) {
      updateTodoList(user);
    }

    setToggleDoubleClick(null);
  }, [editTodoTitile]);

  useEffect(() => {
    if (editTitle.current) {
      editTitle.current.focus();
    }

    const handleClick = (event: any) => {
      if (!editTitle.current?.contains(event.target)) {
        setToggleDoubleClick(null);
      }
    };

    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [toggleDoubleClick]);

  useEffect(() => {
    if (editTitle.current) {
      editTitle.current.focus();
    }
  }, [toggleDoubleClick]);

  const handlerBlur = (toDo: Todo) => {
    editingTodo(toDo);
  };

  const handleEdditing = (toDo: Todo) => {
    setToggleDoubleClick(toDo);
    setEditTodoTitle(toDo.title);
  };

  const onKeyPressHandler = (event: { key: string }) => {
    if (event.key === 'Escape') {
      setToggleDoubleClick(null);
    }
  };

  const Loading = !!loadTodo;
  const activeTodoLoader = (Loading && loadTodo.id === todo.id)
          || (!todo.id)
          || (loadingAllTodos)
          || (clearLoader && todo.completed);

  return (
    <div
      key={todo.id}
      data-cy="Todo"
      className={
        classNames('todo', {
          completed: todo.completed,
        })
      }
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          onChange={() => selectComplited(todo)}
        />
      </label>

      {toggleDoubleClick !== todo && (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={() => handleEdditing(todo)}
        >
          {todo.title}
        </span>
      )}

      {toggleDoubleClick === todo && (
        <form
          onSubmit={() => editingTodo(todo)}
        >
          <input
            data-cy="TodoTitle"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            ref={editTitle}
            value={editTodoTitile}
            onBlur={() => handlerBlur(todo)}
            onChange={event => setEditTodoTitle(event.target.value)}
            onKeyDown={onKeyPressHandler}
          />
        </form>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames(
          'modal',
          'overlay',
          {
            'is-active': activeTodoLoader,
          },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDeleteButton"
        onClick={() => removeTodo(todo)}
      >
        {toggleDoubleClick !== todo && (
          '×'
        )}
      </button>
    </div>
  );
};
