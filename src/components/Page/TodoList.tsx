import classNames from 'classnames';
import React, {
  FormEvent,
  useState,
} from 'react';
import { Todo } from '../../types/Todo';
// import { TodoContext } from '../TodoContext';

type Props = {
  visibleTodos: Todo[];
  removeTodo: (todoId: number) => Promise<void>;
  input: string;
  isAdding: boolean;
  handleStatus: (todoId: number, data: Partial<Todo>) => Promise<void>;
  setIsAdding: React.Dispatch<React.SetStateAction<boolean>>;
  newTodoField: React.RefObject<HTMLInputElement>;
};

export const TodoList: React.FC<Props> = ({
  visibleTodos,
  removeTodo,
  input,
  isAdding,
  handleStatus,
  setIsAdding,
  newTodoField,
}) => {
  const [deletedId, setDeletedId] = useState<number | null>(null);
  // const [todos, setTodos] = useContext(TodoContext);
  const handleDelete = (todoId: number) => {
    setDeletedId(todoId);
    removeTodo(todoId);
  };

  const [isDoubleClick, setIsDoubleClick] = useState<boolean>(false);

  const [name, setName] = useState<string>(input);
  const [doubleClickId, setDoubleClickId] = useState<number | null>(null);

  const handleDoubleClick = (todoId: number) => {
    setIsDoubleClick(!isDoubleClick);
    setDoubleClickId(todoId);
  };

  const handleChangeName = ({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement>) => setName(value);

  const handleRenameSubmit = async (event: FormEvent, todoId: number) => {
    event.preventDefault();

    setIsAdding(true);

    if (!input.trim()) {
      removeTodo(todoId);
    }
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {visibleTodos.map(todo => {
        const { id, title, completed } = todo;

        return (
          <div
            data-cy="Todo"
            className={classNames(
              'todo',
              { completed },
            )}
            key={id}
          >
            <label className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
                onClick={() => handleStatus(id, { completed: !completed })}
              />
            </label>

            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={() => handleDoubleClick(id)}
            >
              {(isDoubleClick && doubleClickId === id)
                ? (
                  <form onSubmit={() => handleRenameSubmit}>
                    <input
                      data-cy="NewTodoField"
                      type="text"
                      ref={newTodoField}
                      className="todoapp__new-todo"
                      placeholder="Empty Todo will be deleted"
                      value={name}
                      onChange={handleChangeName}
                      disabled={isAdding}
                    />
                  </form>
                )
                : title}
            </span>

            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDeleteButton"
              onClick={() => handleDelete(id)}
            >
              ×
            </button>

            <div
              data-cy="TodoLoader"
              className={classNames(
                'modal',
                'overlay',
                { 'is-active': id === deletedId },
              )}
            >
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        );
      })}
      {isAdding && (
        <div data-cy="Todo" className="todo">
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
            />
          </label>

          <span data-cy="TodoTitle" className="todo__title">{input}</span>

          <div data-cy="TodoLoader" className="modal overlay is-active">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </section>
  );
};
