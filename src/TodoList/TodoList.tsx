import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[]
  deleteTodo: (id: number, isCompleted: boolean) => void
  changeTodo: (id: number, isCompleted: boolean) => void
  isLoad: boolean
};

export const TodoList: React.FC<Props> = ({
  todos,
  deleteTodo,
  changeTodo,
}) => {
  return (
    <section className="todoapp__main">
      {todos.map((todo: Todo) => (
        <div
          key={todo.id}
          className={classNames('todo', {
            completed: todo.completed,
          })}
        >
          <label className="todo__status-label">
            <input
              type="checkbox"
              className="todo__status"
              checked={todo.completed}
              onClick={() => changeTodo(todo.id, todo.completed)}
            />
          </label>

          <span className="todo__title">{todo.title}</span>

          <button
            type="button"
            className="todo__remove"
            onClick={() => deleteTodo(todo.id, todo.completed)}
          >
            ×
          </button>

          {/* {!isLoad && (
            <div className="todo">
              <label className="todo__status-label">
                <input type="checkbox" className="todo__status" />
              </label>

              <div className="modal overlay is-active">
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          )} */}
        </div>
      ))}
    </section>
  );
};
