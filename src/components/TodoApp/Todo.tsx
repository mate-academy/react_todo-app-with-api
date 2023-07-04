import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { deleteTodo, updateTodoCheck } from '../../api/todos';
import { ErrorType } from '../../types/Error';

type Props = {
  todo: Todo,
  onError: (error: ErrorType) => void,
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>,
  onEditId: (id: number) => void,
  setTodoTitle: (title: string) => void,
  setTodoLoadId: (id: number | null) => void,
};

export const LoadedTodo: React.FC<Props> = ({
  todo,
  onError: setErrorType,
  setTodos,
  onEditId: setEditableTodoId,
  setTodoTitle,
  setTodoLoadId,
}) => {
  const updateCheck = (todoToUpdate: Todo) => {
    setTodoLoadId(todoToUpdate.id);
    updateTodoCheck(todoToUpdate.id, !todoToUpdate.completed)
      .then(() => {
        setTodos((prevTodos) => prevTodos.map((currentTodo) => {
          if (currentTodo.id === todo.id) {
            return {
              ...currentTodo,
              completed: !todo.completed,
            };
          }

          return currentTodo;
        }));
      })
      .catch(() => {
        setErrorType(ErrorType.UPDATE);
      })
      .finally(() => setTodoLoadId(null));
  };

  const deleteTodoHandler = () => {
    setTodoLoadId(todo.id);

    deleteTodo(todo.id)
      .then(() => {
        setTodos((prevTodos) => (
          prevTodos.filter((item) => todo.id !== item.id)));
      })
      .catch(() => setErrorType(ErrorType.DELETE))
      .finally(() => setTodoLoadId(null));
  };

  return (
    <div
      className={classNames('todo', { completed: todo.completed })}
      onDoubleClick={() => {
        setEditableTodoId(todo.id);
        setTodoTitle(todo.title);
      }}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onClick={() => updateCheck(todo)}
        />
      </label>
      <span className="todo__title">{todo.title}</span>

      <button
        type="button"
        className="todo__remove"
        onClick={deleteTodoHandler}
      >
        ×
      </button>

      <div className="modal overlay">
        <div
          className="modal-background has-background-white-ter"
        />
        <div className="loader" />
      </div>
    </div>
  );
};
