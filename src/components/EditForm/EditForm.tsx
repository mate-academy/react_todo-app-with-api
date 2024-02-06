import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { TodoContext } from '../../context/TodoContext';
import { deleteTodos, updateTodos } from '../../api/todos';
import { Error } from '../../types/Error';

interface Props {
  todo: Todo,
  onEditMode: (value: boolean) => void;
}

export const EditForm: React.FC<Props> = ({ todo, onEditMode }) => {
  const { title, completed, id } = todo;

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
      onEditMode(false);

      return;
    }

    handleError('');
    setIsLoading(true);

    if (!normalizedNewTitle) {
      deleteTodos(id)
        .then(() => {
          deleteTodo(id);
          onEditMode(false);
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

    updateTodos({ title: normalizedNewTitle, completed, id })
      .then(() => {
        updateTodo({ title: normalizedNewTitle, completed, id });
        onEditMode(false);
      })
      .catch(() => {
        editInput.current?.focus();
        handleError(Error.Update);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleEditTodo();
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      onEditMode(false);
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
          onChange={(e) => setNewTitle(e.target.value)}
          onBlur={handleEditTodo}
          onKeyUp={handleKeyUp}
        />
      </form>

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', { 'is-active': isLoading })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </>
  );
};
