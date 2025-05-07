import { useState } from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  isLoading?: boolean;
  removeTodo: (todoId: number[]) => void;
  updateStatusTodo: (todo: Todo[]) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isLoading,
  removeTodo,
  updateStatusTodo,
}) => {
  const [query, setQuery] = useState(todo.title);
  // const [isOnBlur, setIsOnBlur] = useState(false);
  const [currentTodo, setCurrentTodo] = useState<Todo>();

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    // if (!query) {
    //   setError('Title should not be empty');

    //   return;
    // }

    if (!currentTodo) {
      return;
    }

    // updateStatusTodo([currentTodo])
    //   .then(reset)
    //   .catch(() => {
    //     setError('Unable to update a todo');
    //   });
  };

  // console.log('item render');

  // const inputRef = useRef<HTMLInputElement>(null);

  // useEffect(() => {
  //   inputRef.current?.focus();
  // }, [query]);

  return (
    <div
      data-cy="Todo"
      className={`todo ${todo.completed ? 'completed' : 'active'}`}
      onDoubleClick={() => setCurrentTodo(todo)}
    >
      {/*eslint-disable-next-line jsx-a11y/label-has-associated-control*/}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked={todo.completed}
          onClick={() => updateStatusTodo([todo])}
        />
      </label>

      {currentTodo ? (
        <form onSubmit={handleSubmit}>
          <input
            data-cy="NewTodoField"
            type="text"
            className="todoapp__new-todo"
            placeholder="Empty todo will be deleted"
            value={query}
            onChange={handleQueryChange}
          />
        </form>
      ) : (
        <>
          <span data-cy="TodoTitle" className="todo__title">
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => removeTodo([todo.id])}
          >
            ×
          </button>
        </>
      )}

      {/* overlay will cover the todo while it is being deleted or updated */}

      <div
        data-cy="TodoLoader"
        className={`modal overlay ${isLoading ? 'is-active' : ''}`}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
