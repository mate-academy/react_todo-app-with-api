/* eslint-disable jsx-a11y/label-has-associated-control */
import { Todo } from '../types/Todo';
import { TodoItem } from './todoItem';

type Props = {
  todos: Todo[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setPreparedTodos: (e: Todo[] | ((f: any[]) => any[])) => void;
  tempTodo: Todo | null;
  isLoading: number[];
  setIsLoading: (e: (s: number[]) => number[] | number[]) => void;
  setErrorMessage: (m: string) => void;
  setIsEditing: (s: number | null) => void;
  isEditing: number | null;
  setUpdatedTitle: (t: string) => void;
  updatedTitle: string;
};

export const TodoList: React.FC<Props> = ({
  todos,
  setPreparedTodos,
  tempTodo,
  isLoading,
  setIsLoading,
  setErrorMessage,
  setIsEditing,
  isEditing,
  setUpdatedTitle,
  updatedTitle,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          todos={todos}
          todo={todo}
          setPreparedTodos={setPreparedTodos}
          key={todo.id}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          setErrorMessage={setErrorMessage}
          setIsEditing={setIsEditing}
          isEditing={isEditing}
          setUpdatedTitle={setUpdatedTitle}
          updatedTitle={updatedTitle}
        />
      ))}

      {tempTodo !== null && (
        <div data-cy="Todo" className="todo">
          <label htmlFor="status-temp" className="todo__status-label">
            <input
              id="status-temp"
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
