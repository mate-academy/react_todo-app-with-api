import cn from 'classnames';
import { useContext } from 'react';
import { CSSTransition } from 'react-transition-group';
import { Todo } from '../types/Todo';
import { TodosContext } from './TodosContext';

type Props = {
  todo: Todo,
  onDelete: (todoId: number) => void,
  onUpdate: (todo: Todo) => void,
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onDelete,
  onUpdate,
}) => {
  const {
    loadingUpdatedTodo,
    // editedTitle, setTitle, setEditedTitle, setSelectedTodo,
  } = useContext(TodosContext);
  const handleCheckboxChange = () => {
    const updatedTodo = { ...todo, completed: !todo.completed };

    onUpdate(updatedTodo);
  };

  // const handleTitleEditing = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setEditedTitle(event.target.value);
  // };

  // const startEditing = () => {
  //   setSelectedTodo(todo);
  // };

  // const finishEditing = () => {
  //   setTitle(editedTitle);
  // };

  return (
    <CSSTransition
      key={todo.id}
      timeout={300}
      classNames="item"
    >
      <div
        key={todo.id}
        data-cy="Todo"
        className={cn({
          'todo completed': todo.completed,
          todo: !todo.completed,
        })}
      >
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            checked={todo.completed}
            onChange={handleCheckboxChange}
          />
        </label>
        <span data-cy="TodoTitle" className="todo__title">
          {todo.title}
        </span>
        {/* Remove button appears only on hover */}
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => onDelete(todo.id)}
        >
          ×
        </button>

        {loadingUpdatedTodo && (
          <div
            data-cy="TodoLoader"
            className="modal overlay"
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        )}
      </div>
    </CSSTransition>
  );
};
