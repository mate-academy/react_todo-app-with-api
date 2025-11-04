import { useContext, useState } from 'react';
import { TodosContext } from '../contexts/TodoContext';
import { EditContext } from '../contexts/EditContext';
import { useNotification } from '../contexts/NotificationContext';
import { ErrorType } from '../model/types';

type Props = {
  title: string;
  id: number;
};

export const TodoEdit: React.FC<Props> = ({ title, id }) => {
  const [newTodoTitle, setNewTodo] = useState(title);
  const { handleRenameTodo, handleDeleteTodo } = useContext(TodosContext);
  const { setEditedTodoId } = useContext(EditContext);
  const { showNotification } = useNotification();

  const commit = async (raw: string) => {
    const newTitle = raw.trim();

    if (newTitle.length === 0) {
      const ok = await handleDeleteTodo(id);

      if (!ok) {
        showNotification(ErrorType.DELETE_TODO);

        return;
      }

      setEditedTodoId(null);

      return;
    }

    if (newTitle !== title) {
      const ok = await handleRenameTodo(id, newTitle);

      if (ok) {
        setEditedTodoId(null);
      }

      return;
    }

    setEditedTodoId(null);
  };

  const handleKey = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setEditedTodoId(null);

      return;
    }

    if (event.key !== 'Enter') {
      return;
    }

    await commit(newTodoTitle);
  };

  const handleBlur = async () => {
    await commit(newTodoTitle);
  };

  return (
    <form onSubmit={e => e.preventDefault()}>
      <input
        autoFocus
        data-cy="TodoTitleField"
        type="text"
        className="todo__title-field"
        placeholder="Empty todo will be deleted"
        value={newTodoTitle}
        onBlur={handleBlur}
        onKeyDown={handleKey}
        onChange={event => setNewTodo(event.target.value)}
      />
    </form>
  );
};
