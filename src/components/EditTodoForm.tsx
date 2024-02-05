import classNames from 'classnames';
import { useContext, useState } from 'react';
import { deleteTodo, updateTodos } from '../api/todos';
import { TodoContext } from '../contexts/TodoContext';
import { ErrorMessage } from '../types/ErrorMessage';
import { Todo } from '../types/Todo';

interface Props {
  todoOnUpdate: Todo,
  onEditMode: React.Dispatch<React.SetStateAction<boolean>>,
}

export const EditTodoForm: React.FC<Props> = ({
  todoOnUpdate,
  onEditMode,
}) => {
  const [newTitle, setNewTitle] = useState(todoOnUpdate.title);
  const [isLoading, setIsLoading] = useState(false);
  const { setTodos, setErrorMessage, updateTodoList } = useContext(TodoContext);

  const handleCatch = () => {
    setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  };

  const handleEdit = () => {
    if (todoOnUpdate.title.trim() === newTitle.trim()) {
      onEditMode(false);

      return;
    }

    if (newTitle.trim().length === 0) {
      deleteTodo(todoOnUpdate.id)
        .then(() => setTodos(prevTodos => prevTodos
          .filter(todoToFilter => todoToFilter.id !== todoOnUpdate.id)))
        .catch(() => setErrorMessage(ErrorMessage.FailedDeleteTodo))
        .finally(() => handleCatch());

      return;
    }

    updateTodos({ ...todoOnUpdate, title: newTitle })
      .then(() => {
        updateTodoList({ ...todoOnUpdate, title: newTitle });
        onEditMode(false);
      })
      .catch(() => setErrorMessage(ErrorMessage.FailedUpdateTodo))
      .finally(() => setIsLoading(true));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleEdit();
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
          data-cy="TodoTitleField"
          type="text"
          className="todo__title-field"
          placeholder="Empty todo will be deleted"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onBlur={handleEdit}
          onKeyUp={handleKeyUp}
        />
      </form>

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', { 'is-active': isLoading })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </>
  );
};
