import { useState } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { TodoEdit } from '../TodoEdit/TodoEdit';

type Props = {
  todo: Todo;
  loadingTodoIds:number[],
  updateTodo: (
    todoId:number,
    newData: Partial<Pick<Todo, 'title' | 'completed'>>) => void,
  deleteTodo:(todoId:number) => void,
  setError:(error:string) => void;
};

export const TodoItem:React.FC<Props> = ({
  todo,
  loadingTodoIds,
  updateTodo,
  deleteTodo,
  setError,
}) => {
  const [isBeingEdited, setIsBeingEdited] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);

  const isTodoLoading = loadingTodoIds.includes(todo.id);

  const handleCheck = () => {
    updateTodo(todo.id, { completed: !todo.completed });
  };

  const handleDoubleClick = (
    event:React.MouseEvent<HTMLSpanElement, MouseEvent>,
  ) => {
    event.preventDefault();

    setIsBeingEdited(true);
  };

  return (
    <div className={cn('todo', {
      completed: todo.completed,
    })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onClick={handleCheck}
        />
      </label>

      {isBeingEdited
        ? (
          <TodoEdit
            todo={todo}
            setIsBeingEdited={setIsBeingEdited}
            setError={setError}
            newTitle={newTitle}
            setNewTitle={setNewTitle}
            deleteTodo={deleteTodo}
            updateTodo={updateTodo}

          />
        )
        : (
          <>
            <span
              className="todo__title"
              onDoubleClick={(event) => handleDoubleClick(event)}
            >
              {todo.title}
            </span>

            <button
              type="button"
              className="todo__remove"
              onClick={() => deleteTodo(todo.id)}
            >
              ×
            </button>
          </>
        )}

      <div className={cn('modal overlay', {
        'is-active': isTodoLoading,
      })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
