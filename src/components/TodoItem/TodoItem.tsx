import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { deleteTodo, updateTodo } from '../../api/todos';
import { TodosContext } from '../TodosContextProvider/TodosContextProvider';
import { ErrorContext } from '../ErrorContextProvider/ErrorContextProvider';

type Props = {
  todo: Todo,
};

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const { onNewError } = useContext(ErrorContext);
  const {
    todos,
    setTodos,
    todoIdsWithLoader,
    setTodoIdsWithLoader,
  } = useContext(TodosContext);
  const { title, completed, id } = todo;
  const [isBeingEdited, setIsBeingEdited] = useState(false);
  const [newTitle, setNewTitle] = useState(title);
  const editedInput = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (editedInput.current) {
      editedInput.current.focus();
    }
  }, [isBeingEdited]);

  const handleTodoDelete = () => {
    setTodoIdsWithLoader(prevTodoIds => {
      const newTodoIds = [...prevTodoIds, id];

      return newTodoIds;
    });
    deleteTodo(id)
      .then(() => {
        setTodos(prevTodos => prevTodos
          .filter(({ id: todoId }) => id !== todoId));
        setIsBeingEdited(false);
      })
      .catch(() => onNewError('Unable to delete a todo'))
      .finally(() => setTodoIdsWithLoader(
        prevTodoIds => prevTodoIds.filter((todoId) => todoId !== id),
      ));
  };

  const handleChangeOfTitle = ((
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setNewTitle(event.target.value);
  });

  const handleNewTitleSubmit = (event?: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    const trimmedTitle = newTitle.trim();

    if (!trimmedTitle) {
      handleTodoDelete();

      return;
    }

    if (trimmedTitle === title) {
      setIsBeingEdited(false);

      return;
    }

    setTodoIdsWithLoader(prevTodoIds => [...prevTodoIds, id]);

    updateTodo(id, { title: trimmedTitle })
      .then(() => {
        const todosCopy = [...todos];
        const searchedTodo = todos.find(
          ({ id: todoId }) => todoId === id,
        ) as Todo;

        searchedTodo.title = trimmedTitle;

        setTodos(todosCopy);
        setIsBeingEdited(false);
      })
      .catch(() => onNewError('Unable to update a todo'))
      .finally(() => {
        setTodoIdsWithLoader(
          prevTodoIds => prevTodoIds.filter((todoId) => todoId !== id),
        );
      });
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setIsBeingEdited(false);
      setNewTitle(title);
    }
  };

  const handleTodoToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTodoIdsWithLoader(prevTodoIds => [...prevTodoIds, id]);
    updateTodo(id, { completed: !completed })
      .then(() => {
        const todosCopy = [...todos];
        const searchedTodo = todos.find(
          ({ id: todoId }) => todoId === id,
        ) as Todo;

        searchedTodo.completed = !event.target.checked;

        setTodos(todosCopy);
      })
      .catch(() => onNewError('Unable to update a todo'))
      .finally(() => setTodoIdsWithLoader(
        prevTodoIds => prevTodoIds.filter((todoId) => todoId !== id),
      ));
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed,
        editing: isBeingEdited,
      })}
    >
      <label
        className="todo__status-label"
      >
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={handleTodoToggle}
        />
      </label>

      {isBeingEdited
        ? (
          <form onSubmit={handleNewTitleSubmit}>
            <input
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={newTitle}
              ref={editedInput}
              onChange={handleChangeOfTitle}
              onKeyUp={handleKeyUp}
              onBlur={() => handleNewTitleSubmit()}
            />
          </form>
        ) : (
          <>
            <span
              className="todo__title"
              data-cy="TodoTitle"
              onDoubleClick={() => setIsBeingEdited(true)}
            >
              {title}
            </span>
            <button
              data-cy="TodoDelete"
              type="button"
              className="todo__remove"
              onClick={handleTodoDelete}
            >
              ×
            </button>
          </>
        )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': todo.id === 0 || todoIdsWithLoader.includes(id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
