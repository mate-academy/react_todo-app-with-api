import cn from 'classnames';
import { FC, useState } from 'react';
import { Todo } from '../types/Todo';
import { EditForm } from './EditForm';

interface Props {
  todo: Todo;
  removeTodoByID: (arg: number) => void;
  editTodoByID: (id: number, data: Partial<Todo>) => Promise<boolean>;
  isLoadingNow: boolean;
}

export const TodoItem:FC<Props> = ({
  todo,
  removeTodoByID,
  editTodoByID,
  isLoadingNow,
}) => {
  const { title, completed, id } = todo;
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const onHandleRemoveTodo = async () => {
    setIsLoading(true);
    await removeTodoByID(id);
    setIsLoading(false);
  };

  const editCurrentTodo = async (data: Partial<Todo>) => {
    setIsLoading(true);
    await editTodoByID(id, data);
    setIsLoading(false);
  };

  const toggleCheckboxHandler = () => {
    editCurrentTodo({ completed: !completed });
  };

  const editTodoTitle = (text: string) => {
    editCurrentTodo({ title: text });
  };

  const toggleTodoEdit = () => {
    setIsEditing(true);
  };

  const editFormSubmitHandler = (text: string) => {
    if (text === '') {
      onHandleRemoveTodo();
    } else {
      editTodoTitle(text);
    }

    setIsEditing(false);
  };

  return (
    <div className={cn('todo', { completed })}>
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={toggleCheckboxHandler}
        />
      </label>
      {isEditing
        ? (
          <EditForm
            editFormSubmitHandler={editFormSubmitHandler}
            setIsEditing={setIsEditing}
            title={title}
          />
        ) : (
          <>
            <span
              className="todo__title"
              onDoubleClick={toggleTodoEdit}
            >
              {title}
            </span>
            <button
              type="button"
              className="todo__remove"
              onClick={onHandleRemoveTodo}
            >
              ×
            </button>
          </>
        )}

      <div className={cn('modal overlay', {
        'is-active': isLoading || isLoadingNow,
      })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
