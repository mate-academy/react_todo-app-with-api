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
  addTodoLoadId: (todoId: number) => void,
  removeTodoLoadId: (todoId: number) => void,
};

export const TodoInput: React.FC<Props> = ({
  todo,
  setTodos,
  setEditableTodoId,
  onError: setErrorType,
  todoTitle,
  addTodoLoadId,
  removeTodoLoadId,
}) => {
  const submitForm = (newTitle: string) => {
    if (newTitle.trim() === todoTitle) {
      setEditableTodoId(null);

      return;
    }

    addTodoLoadId(todo.id);

    if (!newTitle.trim().length) {
      deleteTodo(todo.id)
        .then(() => {
          setTodos((prevTodos) => (
            prevTodos.filter((item) => todo.id !== item.id)));
        })
        .catch(() => setErrorType(ErrorType.DELETE))
        .finally(() => removeTodoLoadId(todo.id));

      return;
    }

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
      .finally(() => removeTodoLoadId(todo.id));

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
          // eslint-disable-next-line
          autoFocus
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
