import classNames from 'classnames';
import { deleteTodo, updateTodo } from '../api/todos';
import { Todo as TodoType } from '../types/Todo';

type Props = {
  todo: TodoType,
  todos: TodoType[],
  setTodos(todos: TodoType[]): void,
  setError(error: string): void,
};

export const Todo: React.FC<Props> = ({
  todo,
  todos,
  setTodos,
  setError,
}) => {
  return (
    <div
      data-cy="Todo"
      className={classNames(
        'todo',
        {
          completed: todo?.completed,
        },
      )}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo?.completed}
          onChange={() => {
            if (!todo) {
              return;
            }

            setTodos(todos.map(currentTodo => {
              if (currentTodo.id === todo.id) {
                return {
                  ...currentTodo,
                  loading: true,
                };
              }

              return { ...currentTodo };
            }));

            updateTodo(todo.id, !todo.completed).then(() => setTodos(todos
              .map(currentTodo => {
                if (currentTodo.id === todo.id) {
                  return {
                    ...currentTodo,
                    completed: !currentTodo.completed,
                    loading: false,
                  };
                }

                return { ...currentTodo };
              }))).catch(() => {
              setError('update');

              setTodos(todos.map(currentTodo => ({
                ...currentTodo,
                loading: false,
              })));
            });
          }}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo?.title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDeleteButton"
        onClick={() => {
          if (!todo) {
            return;
          }

          setTodos(todos.map(currentTodo => {
            if (currentTodo.id === todo.id) {
              return {
                ...currentTodo,
                loading: true,
              };
            }

            return { ...currentTodo };
          }));

          deleteTodo(todo.id).then(() => setTodos(todos
            .filter(currentTodo => currentTodo.id !== todo.id))).catch(() => {
            setError('delete');

            setTodos(todos.map(currentTodo => ({
              ...currentTodo,
              loading: false,
            })));
          });
        }}
      >
        x
      </button>

      <div
        data-cy="TodoLoader"
        className={classNames(
          'modal',
          'overlay',
          {
            'is-active': todo.loading,
          },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
