/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[];
  deleteSelectTodo: (id: number) => void;
  tempTodo?: Todo | null;
  handleUpdateComplete: (todo: Todo) => void;
  selectedTodosIds: number[];
  handleEditTitle: (title: string, todo: Todo) => Promise<boolean>;
};

export const TodoList: React.FC<Props> = ({
  todos,
  deleteSelectTodo,
  tempTodo,
  handleUpdateComplete,
  selectedTodosIds,
  handleEditTitle,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map((todo: Todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          deleteSelectTodo={deleteSelectTodo}
          isLoadingById={selectedTodosIds.includes(todo.id)}
          handleUpdateComplete={handleUpdateComplete}
          handleEditTitle={handleEditTitle}
        />
      ))}

      {tempTodo && (
        <div data-cy="Todo" className="todo">
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
            />
          </label>

          <span data-cy="TodoTitle" className="todo__title">
            {tempTodo.title}
          </span>

          <div data-cy="TodoLoader" className="modal overlay is-active">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </section>
  );
};
