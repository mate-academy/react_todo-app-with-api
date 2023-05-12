import classNames from 'classnames';
import { useContext, useEffect, useState } from 'react';
import { Todo } from '../../types/Todo';
import { FetchContext } from '../../context/FetchContext';
import { TodoEditForm } from './TodoEditForm';
import { TodoTitle } from './TodoTitle';
import { TodoStatus } from './TodoStatus';

interface Props {
  todo: Todo;
  isPerentLoading: boolean;
}

export const TodoItem: React.FC<Props> = ({
  todo,
  isPerentLoading,
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);
  const [checked, setChecked] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { deleteTodos, updateTodo } = useContext(FetchContext);
  const { title, completed, id } = todo;

  const handleInputTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditedTitle(event.target.value);
  };

  const handleCompleteStatus = () => {
    setIsLoading(true);
    updateTodo(id, { completed: !checked }).finally(() => {
      setIsLoading(false);
    });
    setChecked(!checked);
  };

  useEffect(() => {
    setChecked(completed);
  }, [completed]);

  const handleTodoDelete = () => {
    setIsLoading(true);
    deleteTodos(id).finally(() => setIsLoading(false));
  };

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleUpdateTitle = (event?: React.FormEvent) => {
    if (event) {
      event.preventDefault();
    }

    if (title === editedTitle) {
      setIsEditing(false);

      return;
    }

    if (editedTitle.trim() === '') {
      handleTodoDelete();
    }

    setIsLoading(true);
    updateTodo(id, { title: editedTitle }).finally(() => {
      setIsLoading(false);
    });
    setIsEditing(false);
  };

  const handleFinishEdit = () => {
    handleUpdateTitle();
  };

  const handleCancelEdit = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsEditing(false);
      setEditedTitle(todo.title);
    }
  };

  return (
    <div className={classNames('todo', { completed })}>
      <TodoStatus
        checked={checked}
        onChangeStatus={handleCompleteStatus}
      />

      {isEditing ? (
        <TodoEditForm
          onUpdate={handleUpdateTitle}
          editedTitle={editedTitle}
          onInput={handleInputTitle}
          onFinishEdit={handleFinishEdit}
          onCancel={handleCancelEdit}
        />
      ) : (
        <TodoTitle
          title={title}
          onDoubleClick={handleDoubleClick}
          onDelete={handleTodoDelete}

        />
      )}

      <div className={classNames('modal overlay', {
        'is-active': isPerentLoading || isLoading,
      })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
