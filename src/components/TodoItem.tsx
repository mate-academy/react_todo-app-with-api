import { FC, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';
import { TodoEdit } from './TodoEdit';

interface Props {
  todo: Todo;
  onDelete: (todoId: number) => void;
  onUpdate: (id: number, status: boolean, title: string) => void;
  loadingIds: number[];
  setTodos:() => void;
}

export const TodoItem: FC<Props> = ({
  todo,
  onUpdate,
  onDelete,
  loadingIds,
  setTodos,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState('');

  console.log(isEditing)
  const isActive = loadingIds.includes(todo.id);

  // const inputRef = useRef<HTMLInputElement | null>(null);

  // const handleNewTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setNewTitle(event.target.value);
  // };

  // const handleCancelEditing = (event: React.KeyboardEvent<Element>) => {
  //   if (event.key === 'Escape') {
  //     setIsEditing(false);
  //     setNewTitle(todo.title);
  //   }
  // };

  // const handleBlur = () => {
  //   if (newTitle !== todo.title) {
  //     onCheck(todo.id, todo.completed, newTitle);
  //   } else if (newTitle.trim() === '') {
  //     onDelete(todo.id);
  //   } else {
  //     setIsEditing(false);
  //     setNewTitle(todo.title);
  //   }
  // };

  // const handleSubmit = (event: React.FormEvent) => {
  //   event.preventDefault();
  // };

  const handleEditing = () => {
    setIsEditing(true);
  };

  return (
    <div
      key={todo.id}
      onDoubleClick={handleEditing}
      className={cn('todo',
        { completed: todo.completed })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => onUpdate(todo.id, !todo.completed, todo.title)}
        />
      </label>
      {isEditing
        ? (
          <TodoEdit
            todo={todo}
            setTodos={setTodos}
            newTitle={newTitle}
            setIsEditing={setIsEditing}
            setNewTitle={setNewTitle}
            isEditing={isEditing}
            onUpdate={onUpdate}
            onDelete={onDelete}
          />
        )
        : (
          <>
            <span
              className="todo__title"
            >
              {todo.title}
            </span>

            <button
              type="button"
              className="todo__remove"
              onClick={() => onDelete(todo.id)}
            >
              ×
            </button>

          </>
        )}

      <div className={cn('modal overlay',
        { 'is-active': isActive })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
