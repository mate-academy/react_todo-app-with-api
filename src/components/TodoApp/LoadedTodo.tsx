import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { deleteTodo, updateTodoCheck } from '../../api/todos';
import { ErrorType } from '../../types/Error';
import { TodoInput } from './TodoInput';
import { LoadingTodo } from './LoadingTodo';

type Props = {
  todo: Todo,
  onError: (error: ErrorType) => void,
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>,
  onEditId: (id: number | null) => void,
  editableTodoId: number | null,
  setTodoTitle: (title: string) => void,
  todoTitle: string,
  addTodoLoadId: (todoId: number) => void,
  removeTodoLoadId: (todoId: number) => void,
  loadingTodosId: number[]
};

export const LoadedTodo: React.FC<Props> = ({
  todo,
  onError: setErrorType,
  setTodos,
  onEditId: setEditableTodoId,
  editableTodoId,
  setTodoTitle,
  todoTitle,
  addTodoLoadId,
  removeTodoLoadId,
  loadingTodosId,
}) => {
  const updateCheck = (todoToUpdate: Todo) => {
    addTodoLoadId(todoToUpdate.id);
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
      .finally(() => removeTodoLoadId(todo.id));
  };

  const handleDeleteTodo = () => {
    addTodoLoadId(todo.id);

    deleteTodo(todo.id)
      .then(() => {
        setTodos((prevTodos) => (
          prevTodos.filter((item) => todo.id !== item.id)));
      })
      .catch(() => setErrorType(ErrorType.DELETE))
      .finally(() => removeTodoLoadId(todo.id));
  };

  if (todo.id === editableTodoId) {
    return (
      <div>
        <TodoInput
          todo={todo}
          setEditableTodoId={setEditableTodoId}
          setTodos={setTodos}
          onError={setErrorType}
          todoTitle={todoTitle}
          setTodoTitle={setTodoTitle}
          addTodoLoadId={addTodoLoadId}
          removeTodoLoadId={removeTodoLoadId}
        />
      </div>
    );
  }

  if (loadingTodosId.includes(todo.id)) {
    return (
      <div>
        <LoadingTodo todo={todo} />
      </div>
    );
  }

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
          onChange={() => updateCheck(todo)}
        />
      </label>
      <span className="todo__title">{todo.title}</span>

      <button
        type="button"
        className="todo__remove"
        onClick={handleDeleteTodo}
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
