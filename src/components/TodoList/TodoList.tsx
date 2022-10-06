import {
  FC,
  useState,
  useContext,
  FormEvent,
  useEffect,
  useCallback,
} from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { TodoContext } from '../TodoContext';

interface Props {
  visibleTodos: Todo[];
  removeTodo: (todoId: number) => void;
  setIsAdding(loader: boolean): void;
  isAdding: boolean;
  setErrorMessage: (message: string) => void;
  handleStatusChange: (todoId: number, data: Partial<Todo>) => void;
  newTodoField: React.RefObject<HTMLInputElement>;
  mainInput: string;
  upgradeTodos: (todoId: number, data: Partial<Todo>) => Promise<void>;
}

export const TodoList: FC<Props> = ({
  visibleTodos,
  removeTodo,
  setIsAdding,
  isAdding,
  setErrorMessage,
  handleStatusChange,
  newTodoField,
  mainInput,
  upgradeTodos,
}) => {
  const [deletedId, setDeletedId] = useState<number | null>(null);
  const [todos, setTodos] = useContext(TodoContext);

  const deleteTodo = (todoId: number) => {
    setDeletedId(todoId);
    removeTodo(todoId);
  };

  const [
    changeTodoDescription,
    setChangeTodoDescription,
  ] = useState<string>('');

  const [choosedTodoId, setChoosedTodoId] = useState<number | null>(null);

  const [isDoubleClick, setIsDoubleClick] = useState<boolean>(false);

  const handleDoubleClick = (todoId: number, title: string) => {
    setIsDoubleClick(!isDoubleClick);
    setChoosedTodoId(todoId);
    setChangeTodoDescription(title);
  };

  const handleRenameTodo = ({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement>) => setChangeTodoDescription(value);

  const handleRenameSubmit = async (
    event: FormEvent,
    todoId: number,
  ) => {
    event.preventDefault();

    if (!changeTodoDescription.trim().length) {
      try {
        setIsAdding(true);
        await removeTodo(todoId);

        setTodos([...todos.filter(({ id }) => id !== todoId)]);
      } catch {
        setErrorMessage('Unable to delete a todo');
      }
    }

    upgradeTodos(todoId, { title: changeTodoDescription });

    setIsDoubleClick(false);
    setIsAdding(false);
  };

  const escHandler = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsDoubleClick(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', escHandler, false);

    return () => {
      document.removeEventListener('keydown', escHandler, false);
    };
  }, [todos, changeTodoDescription]);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, [todos, isDoubleClick]);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {visibleTodos.map((todo) => {
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
                onClick={() => {
                  handleStatusChange(id, { completed: !completed });
                }}
              />
            </label>

            {(isDoubleClick && choosedTodoId === id)
              ? (
                <form
                  onSubmit={event => handleRenameSubmit(event, id)}
                >
                  <input
                    data-cy="NewTodoField"
                    type="text"
                    ref={newTodoField}
                    className="todoapp__new-todo"
                    placeholder="What needs to be done?"
                    value={changeTodoDescription}
                    onChange={handleRenameTodo}
                    onBlur={event => handleRenameSubmit(event, id)}
                    disabled={isAdding}
                  />
                </form>
              )
              : (
                <span
                  data-cy="TodoTitle"
                  className="todo__title"
                  onDoubleClick={() => handleDoubleClick(id, title)}
                >
                  {title}
                </span>

              )}

            {!isDoubleClick && (
              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDeleteButton"
                onClick={() => deleteTodo(id)}
              >
                ×
              </button>
            )}

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

          <span data-cy="TodoTitle" className="todo__title">{mainInput}</span>

          <div data-cy="TodoLoader" className="modal overlay is-active">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </section>
  );
};
