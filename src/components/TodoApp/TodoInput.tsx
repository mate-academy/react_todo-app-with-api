import { Todo } from '../../types/Todo';
import { deleteTodo, updateTitle } from '../../api/todos';
import { ErrorType } from '../../types/Error';

type Props = {
  todo: Todo,
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>,
  setEditableTodoId: (id: number | null) => void,
  onError: (error: ErrorType) => void,
  todoTitle: string,
  setTodoTitle: (title: string) => void,
  setTodoLoadId: (id: number | null) => void,
};

export const TodoInput: React.FC<Props> = ({
  todo,
  setTodos,
  setEditableTodoId,
  onError: setErrorType,
  todoTitle,
  setTodoLoadId,
}) => {
  const submitForm = (newTitle: string) => {
    if (newTitle.trim() === todoTitle) {
      setEditableTodoId(null);

      return;
    }

    setTodoLoadId(todo.id);

    if (newTitle.trim().length === 0) {
      deleteTodo(todo.id)
        .then(() => {
          setTodos((prevTodos) => (
            prevTodos.filter((item) => todo.id !== item.id)));
        })
        .catch(() => setErrorType(ErrorType.DELETE))
        .finally(() => setTodoLoadId(null));
    } else {
      updateTitle(todo.id, newTitle)
        .then(() => {
          setTodos((prevTodos) => {
            return prevTodos.map((item: Todo) => {
              if (item.id === todo.id) {
                return {
                  ...item,
                  title: newTitle,
                };
              }

              return item;
            });
          });
        })
        .catch(() => setErrorType(ErrorType.UPDATE))
        .finally(() => setTodoLoadId(null));
    }

    setEditableTodoId(null);
  };

  return (
    <div className="todo">
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
        />
      </label>

      <form onSubmit={(e) => {
        e.preventDefault();
      }}
      >

        <input
          type="text"
          className="todo__title-field"
          placeholder="Empty todo will be deleted"
          defaultValue={todoTitle}
          onBlur={(e) => submitForm(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              submitForm(e.target.value);
            }

            if (e.key === 'Escape') {
              setEditableTodoId(null);
            }
          }}
        />
      </form>

      <div className="modal overlay">
        <div
          className="modal-background has-background-white-ter"
        />
        <div className="loader" />
      </div>
    </div>
  );
};
