/* eslint-disable jsx-a11y/label-has-associated-control */
import { Todo } from '../../types/Todo';
import { deleteTodo, updateTodo } from '../../api/todos';
import { ErrorType } from '../../types/Error';

interface Props {
  todo: Todo;
  isTemp: boolean;
  loadingIds: number[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setError: React.Dispatch<React.SetStateAction<ErrorType | null>>;
  setLoadingIds: React.Dispatch<React.SetStateAction<number[]>>;
}

export const TodoItem: React.FC<Props> = ({
  todo,
  isTemp,
  loadingIds,
  setTodos,
  setError,
  setLoadingIds,
}) => {
  const handleDeleteClick = (todoId: number) => {
    setLoadingIds(prevIds => [...prevIds, todoId]);

    deleteTodo(todoId)
      .then(() =>
        setTodos((prevTodos: Todo[]) =>
          prevTodos.filter(todoItem => todoItem.id !== todoId),
        ),
      )
      .catch(() => {
        setError(ErrorType.DeleteFail);
      })
      .finally(() => {
        setLoadingIds(prevIds => prevIds.filter(id => id !== todoId));
      });
  };

  const handleCheck = () => {
    setLoadingIds(prevIds => [...prevIds, todo.id]);
    const newTodo = { ...todo, completed: !todo.completed };

    updateTodo(newTodo)
      .then(() => {
        setTodos((prevTodos: Todo[]) =>
          prevTodos.map(todoItem =>
            todoItem.id === todo.id ? newTodo : todoItem,
          ),
        );
      })
      .catch(() => setError(ErrorType.UpdateFail))
      .finally(() => {
        setLoadingIds(prevIds => prevIds.filter(id => id !== todo.id));
      });
  };

  return (
    <div
      data-cy="Todo"
      className={`todo ${todo.completed && 'completed'}`}
      key={todo.id}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onClick={handleCheck}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => handleDeleteClick(todo.id)}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={`modal overlay ${(isTemp || loadingIds.includes(todo.id)) && 'is-active'}`}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
