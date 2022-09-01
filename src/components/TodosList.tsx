import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  visibleTodos: Todo[],
  updateTodoStatus: (todoId: number, todoComleted: boolean) => void,
  setSelectedTodoId: React.Dispatch<React.SetStateAction<number | null>>,
  setTodoTitle: React.Dispatch<React.SetStateAction<string>>,
  setEditTodo: React.Dispatch<React.SetStateAction<boolean>>,
  editTodo: boolean,
  selectedTodoId: number | null,
  updateTodoTitle: (todoId: number) => void,
  deleteTodo: (todoId: number) => void
  editTodoField: React.RefObject<HTMLInputElement>,
  todoTitle: string,
};

export const TodosList: React.FC<Props> = (props) => {
  const {
    visibleTodos,
    updateTodoStatus,
    setSelectedTodoId,
    setTodoTitle,
    setEditTodo,
    editTodo,
    selectedTodoId,
    updateTodoTitle,
    deleteTodo,
    editTodoField,
    todoTitle,
  } = props;

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {visibleTodos.map(todo => (
        <div
          data-cy="Todo"
          className={classNames('todo', { completed: todo.completed })}
          key={todo.id}
        >
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              onChange={() => updateTodoStatus(todo.id, todo.completed)}
            />
          </label>

          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => {
              setSelectedTodoId(todo.id);
              setTodoTitle(todo.title);
              setEditTodo(true);
            }}
          >
            {(editTodo && todo.id === selectedTodoId)
              ? (
                <form onSubmit={(event) => {
                  event.preventDefault();
                  updateTodoTitle(todo.id);
                }}
                >
                  <input
                    type="text"
                    ref={editTodoField}
                    className="todoapp__edit-todo"
                    value={todoTitle}
                    onChange={
                      (event) => setTodoTitle(event.target.value)
                    }
                    onBlur={() => updateTodoTitle(todo.id)}
                  />
                </form>
              )
              : todo.title}
          </span>
          {!editTodo && (
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDeleteButton"
              onClick={() => deleteTodo(todo.id)}
            >
              ×
            </button>
          )}

          <div
            data-cy="TodoLoader"
            className={classNames(
              'modal overlay', { 'is-active': false },
            )}
          >
            <div
              className="modal-background has-background-white-ter"
            />
            <div className="loader" />
          </div>
        </div>
      ))}
    </section>
  );
};
