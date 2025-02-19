import { useContext, useState } from 'react';
import { TodosContext } from '../../Context/TodoContext';
import { EditContext } from '../../Context/EditContext';
import { useNotification } from '../../Context/NotificationContext';

type Props = {
  title: string;
  id: number;
  setIsModifying: (value: boolean) => void;
};

export const TodoEdit: React.FC<Props> = ({ title, id, setIsModifying }) => {
  const [newTodoTitle, setNewTodo] = useState(title);
  const { handleRenameTodo, handleDeleteTodo } = useContext(TodosContext);
  const { setEditedTodoId } = useContext(EditContext);
  const { showNotification, hideNotification } = useNotification();

  const checkNewValue = async (newTitle: string) => {
    if (newTitle.length === 0) {
      setIsModifying(true);
      try {
        await handleDeleteTodo(id);
        hideNotification();
      } catch (error) {
        showNotification('Unable to delete a todo');
      } finally {
        setIsModifying(false);
      }

      return;
    }

    if (newTitle === title) {
      setEditedTodoId(null);
    }

    if (newTitle !== title) {
      setIsModifying(true);
      hideNotification();

      try {
        await handleRenameTodo(id, newTitle);
        setEditedTodoId(null);
      } catch (error) {
        showNotification(`Unable to update a todo`);
      } finally {
        setIsModifying(false);
      }
    }
  };

  const handleChange = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setEditedTodoId(null);

      return;
    }

    if (event.key !== 'Enter') {
      return;
    }

    checkNewValue(newTodoTitle.trim());
  };

  const handleBlur = () => {
    checkNewValue(newTodoTitle.trim());
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
        onKeyDown={event => handleChange(event)}
        onChange={event => setNewTodo(event.target.value)}
      />
    </form>
  );
};
