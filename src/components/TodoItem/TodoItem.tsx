import classNames from 'classnames';
import React, {
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Todo } from '../../types/Todo';
import { FetchContext } from '../../context/FetchContext';
import { TodoEditForm } from './TodoEditForm';
import { TodoTitle } from './TodoTitle';
import { TodoStatus } from './TodoStatus';

interface Props {
  todo: Todo;
  isParentLoading: boolean;
}

export const TodoItem: React.FC<Props> = React.memo(({
  todo,
  isParentLoading,
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);
  const [checked, setChecked] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { deleteTodos, updateTodo } = useContext(FetchContext);
  const { title, completed, id } = todo;

  const handleInputTitle = useCallback((
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setEditedTitle(event.target.value);
  }, []);

  const handleCompleteStatusChange = useCallback((checkStatus: boolean) => {
    setIsLoading(true);
    updateTodo(id, { completed: checkStatus }).finally(() => {
      setIsLoading(false);
    });
    setChecked(!checked);
  }, [id, checked, updateTodo]);

  useEffect(() => {
    setChecked(completed);
  }, [id, completed]);

  const handleTodoDelete = useCallback(() => {
    setIsLoading(true);
    deleteTodos(id).finally(() => setIsLoading(false));
  }, [deleteTodos]);

  const handleDoubleClick = useCallback(() => {
    setIsEditing(true);
  }, []);

  const handleUpdateTitle = useCallback((event?: React.FormEvent) => {
    if (event) {
      event.preventDefault();
    }

    if (title === editedTitle) {
      setIsEditing(false);

      return;
    }

    if (editedTitle.trim() === '') {
      setIsLoading(true);
      setIsEditing(false);
      deleteTodos(id).finally(() => setIsLoading(false));

      return;
    }

    setIsLoading(true);
    updateTodo(id, { title: editedTitle }).finally(() => {
      setIsLoading(false);
    });
    setIsEditing(false);
  }, [title, editedTitle, updateTodo, deleteTodos]);

  const handleCancelEdit = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsEditing(false);
      setEditedTitle(todo.title);
    }
  }, []);

  return (
    <div className={classNames('todo', { completed })}>
      <TodoStatus
        checked={checked}
        handleCompleteStatusChange={handleCompleteStatusChange}
      />

      {isEditing ? (
        <TodoEditForm
          onUpdate={handleUpdateTitle}
          editedTitle={editedTitle}
          onInput={handleInputTitle}
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
        'is-active': isParentLoading || isLoading,
      })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
});
