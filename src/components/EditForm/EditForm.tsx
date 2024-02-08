import classNames from 'classnames';
import React,
{
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Todo } from '../../types/Todo';
import { TodoContext } from '../../context/TodoContext';
import { deleteTodos, updateTodos } from '../../api/todos';
import { Error } from '../../types/Error';

type Props = {
  todo: Todo;
  onEditing: (value: boolean) => void;
};

export const EditForm: React.FC<Props> = ({ todo, onEditing }) => {
  const { id, title, completed } = todo;

  const [newTitle, setNewTitle] = useState(title);
  const [isLoading, setIsLoading] = useState(false);

  const { updateTodo, handleError, deleteTodo } = useContext(TodoContext);

  const editInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    editInput.current?.focus();
  }, []);

  const handleEditTodo = () => {
    const normalizedNewTitle = newTitle.trim();

    if (normalizedNewTitle === title) {
      onEditing(false);

      return;
    }

    handleError('');
    setIsLoading(true);

    if (!normalizedNewTitle) {
      deleteTodos(id)
        .then(() => {
          deleteTodo(id);
          onEditing(false);
        })
        .catch(() => {
          editInput.current?.focus();
          handleError(Error.Delete);
        })
        .finally(() => {
          setIsLoading(false);
        });

      return;
    }

    updateTodos({ id, title: normalizedNewTitle, completed })
      .then(() => {
        updateTodo({ id, title: normalizedNewTitle, completed });
        onEditing(false);
      })
      .catch(() => {
        editInput.current?.focus();
        handleError(Error.Update);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleEditTodo();
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      onEditing(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          ref={editInput}
          data-cy="TodoTitleField"
          type="text"
          className="todo__title-field"
          placeholder="Empty todo will be deleted"
          value={newTitle}
          onChange={(event) => setNewTitle(event.target.value)}
          onBlur={handleEditTodo}
          onKeyUp={handleKeyUp}
        />
      </form>

      <div
        data-cy="TodoLoader"
        className={classNames(
          'modal overlay',
          { 'is-active': isLoading },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </>
  );
};
