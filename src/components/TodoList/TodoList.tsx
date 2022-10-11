import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[],
  title: string,
  isLoaded: boolean,
  removeTodo: (param: number) => void,
  handleChange: (todoId: number, data: Partial<Todo>) => void,
  selectedId: number[]
};

export const TodoList: React.FC<Props> = (props) => {
  const {
    todos, title, isLoaded, removeTodo, handleChange, selectedId
  } = props;

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          isLoaded={isLoaded}
          removeTodo={removeTodo}
          handleChange={handleChange}
          selectedId={selectedId}
        />
      ))}

      {isLoaded && (
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
          <div
            data-cy="TodoLoader"
            className={classNames(
              'modal overlay',
              {'is-active': isLoaded}
            )}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </section>
  );
};
