import classNames from 'classnames';
import TodoItem from '../TodoItem/TodoItem';
import { Todo } from '../../types/Todo';

interface Props {
  todos: Todo[];
  setTodos: (todos: Todo[]) => void;
  setErrorMessage: (message: string) => void;
  tempTodo: Todo | null;
  deletingId: number | null;
  focusInput: () => void;
  deleteSingleTodo: (id: number) => void;
}

export default function TodoList({
  todos,
  setTodos,
  tempTodo,
  deletingId,
  focusInput,
  deleteSingleTodo,
  setErrorMessage,
}: Props) {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          focusInput={focusInput}
          setTodos={setTodos}
          todos={todos}
          deleteSingleTodo={deleteSingleTodo}
          setErrorMessage={setErrorMessage}
          todo={todo}
          deletingId={deletingId}
        />
      ))}

      {tempTodo && (
        <div>
          <div
            data-cy="Todo"
            className={classNames('todo', {
              completed: tempTodo.completed,
            })}
          >
            <label className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
                checked={tempTodo.completed}
              />
            </label>
            <span data-cy="TodoTitle" className="todo__title">
              {tempTodo.title.trim()}
            </span>
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={() => {
                deleteSingleTodo(tempTodo.id);
              }}
            >
              ×
            </button>
            <div
              data-cy="TodoLoader"
              className={classNames('modal overlay', { 'is-active': tempTodo })}
            >
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
