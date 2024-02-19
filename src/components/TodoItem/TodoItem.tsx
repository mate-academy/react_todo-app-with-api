import cn from 'classnames';
import {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { deleteTodos, patchTodos } from '../../api/todos';
import { TodoContext } from '../State/TodoContext';

type Props = {
  completed: boolean
  id: number
  title: string
};

export const TodoItem: React.FC<Props> = ({
  completed,
  id,
  title,
}) => {
  const {
    todos,
    setTodos,
    setIsError,
    setErrorText,
    setHandleDeleteTodoId,
    handleDeleteTodoId,
  } = useContext(TodoContext);

  const [isEdit, setIsEdit] = useState(false);
  const [todoTitleEdit, setTodoTitleEdit] = useState(title);

  const inputRef = useRef<HTMLInputElement>(null);
  const trimedTitleEdit = todoTitleEdit.trim();

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEdit]);

  const handleCheckTodo = (idTodo: number) => {
    const toggleStatus = todos.find(todo => idTodo === todo.id);

    setHandleDeleteTodoId(prev => [...prev, idTodo]);

    setTodos(prevTodos => prevTodos.map(todo => (
      todo.id === idTodo
        ? { ...todo, completed: !todo.completed }
        : todo
    )));

    const checkedTodo = todos.find(todo => todo.id === idTodo);

    if (checkedTodo) {
      patchTodos(idTodo, {
        userId: checkedTodo.userId,
        title: checkedTodo.title,
        completed: !toggleStatus?.completed,
      })
        .catch(() => {
          setIsError(true);
          setErrorText('Unable to update a todo');
        })
        .finally(() => {
          setHandleDeleteTodoId(prev => prev.filter(
            prevId => prevId !== idTodo,
          ));
        });
    }
  };

  const handleDeleteTodo = (idTodo: number) => {
    setHandleDeleteTodoId(prev => [...prev, idTodo]);

    deleteTodos(idTodo)
      .then(() => {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== idTodo));
      })
      .catch(() => {
        setIsError(true);
        setErrorText('Unable to delete a todo');
      });
  };

  const updateTodo = (idTodo: number) => {
    setIsEdit(false);
    setHandleDeleteTodoId(prev => [...prev, idTodo]);
    const currTodo = todos.filter(todo => todo.id === idTodo);

    currTodo.map(value => patchTodos(idTodo, {
      userId: value.userId,
      title: trimedTitleEdit,
      completed: value.completed,
    }).then(() => setTodos(prevTodos => prevTodos.map(todo => (
      todo.id === idTodo ? { ...todo, title: trimedTitleEdit } : todo))))
      .catch(() => {
        setIsError(true);
        setErrorText('Unable to update a todo');
      })
      .finally(() => {
        setHandleDeleteTodoId(pre => pre.filter(prevId => prevId !== idTodo));
      }));
  };

  const handleKeyUp = (
    e: React.KeyboardEvent<HTMLInputElement>,
    idTodo: number,
  ) => {
    if (e.key === 'Enter' && trimedTitleEdit === '') {
      handleDeleteTodo(idTodo);

      return;
    }

    if (e.key === 'Enter' && trimedTitleEdit === title) {
      setIsEdit(false);
      setTodoTitleEdit(trimedTitleEdit);

      return;
    }

    if (e.key === 'Enter') {
      updateTodo(idTodo);
      setTodoTitleEdit(trimedTitleEdit);
    }

    if (e.key === 'Escape') {
      setIsEdit(false);
      setTodoTitleEdit(trimedTitleEdit);
    }
  };

  const onBlurHandler = (idTodo: number) => {
    if (trimedTitleEdit === '') {
      handleDeleteTodo(idTodo);
    }

    if (trimedTitleEdit !== title) {
      updateTodo(idTodo);
    }

    setIsEdit(false);
    setTodoTitleEdit(trimedTitleEdit);
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo', { completed })}
      key={id}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => handleCheckTodo(id)}
        />
      </label>

      {isEdit ? (
        <form onSubmit={(e) => e.preventDefault()}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            ref={inputRef}
            value={todoTitleEdit}
            onChange={e => setTodoTitleEdit(e.target.value)}
            onKeyUp={e => handleKeyUp(e, id)}
            onBlur={() => onBlurHandler(id)}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setIsEdit(true)}
          >
            {title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => handleDeleteTodo(id)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': id === 0 || handleDeleteTodoId.includes(id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
