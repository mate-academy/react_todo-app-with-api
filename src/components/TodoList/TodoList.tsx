import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[],
  title: string,
  isAdding: boolean,
  isDeletedId: number;
  handleDelete: (id: number) => void;
  loadingIds: number[];
  onToggleTodo: (id: number) => void,
  handleSubmit: (title: string, id: number) => void,
  clickedId: number,
  isDoubleClicked: boolean,
  setClickedId: (id: number) => void,
  setIsDoubleClicked: (isDouble: boolean) => void,
};

export const TodoList: React.FC<Props> = ({
  todos, title, isAdding, isDeletedId, handleDelete, loadingIds, onToggleTodo,
  handleSubmit, clickedId, isDoubleClicked, setClickedId, setIsDoubleClicked,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          onToggleTodo={onToggleTodo}
          isDeletedId={isDeletedId}
          handleDelete={handleDelete}
          loadingIds={loadingIds}
          handleSubmit={handleSubmit}
          clickedId={clickedId}
          isDoubleClicked={isDoubleClicked}
          setClickedId={setClickedId}
          setIsDoubleClicked={setIsDoubleClicked}
        />
      ))}

      {isAdding && (
        <div
          data-cy="Todo"
          className="todo"
        >
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
            />
          </label>

          <span data-cy="TodoTitle" className="todo__title">
            {title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDeleteButton"
          >
            ×
          </button>
          <div data-cy="TodoLoader" className="modal overlay is-active">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </section>
  );
};
