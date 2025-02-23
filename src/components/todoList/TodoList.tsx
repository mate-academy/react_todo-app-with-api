/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { TodoInterface } from '../../types/Todo';
import { Todo } from '../todo/Todo';

interface Props {
  filteredTodos: TodoInterface[];

  deleteTodos: (content: number[]) => Promise<void>;

  tempTodo: TodoInterface | null;

  todosForModify: TodoInterface[];
  setTodosForModify: React.Dispatch<React.SetStateAction<TodoInterface[]>>;
  updateTodos: (updateTodo: TodoInterface[]) => Promise<void>;
}

export const TodoList: React.FC<Props> = ({
  filteredTodos,
  deleteTodos,

  tempTodo,
  todosForModify,

  setTodosForModify,
  updateTodos,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(todo => (
        <Todo
          todo={todo}
          key={todo.id}
          deleteTodos={deleteTodos}
          setTodosForModify={setTodosForModify}
          todosForModify={todosForModify}
          updateTodos={updateTodos}
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
          <button type="button" className="todo__remove" data-cy="TodoDelete">
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
