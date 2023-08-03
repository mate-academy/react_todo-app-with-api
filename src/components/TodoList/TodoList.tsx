import React, {
  FormEvent,
  useEffect,
  useMemo,
  useState,
} from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { findTodoById } from '../../utils/FindPostById';

type Props = {
  listOfTodoId: number[],
  loading: boolean,
  todos: Todo[],
  deleteTodo?: (todoId: number) => void,
  tempTodo: Todo | null,
  updateTodo?: (todoId: number | null, title: string) => void,
  onChange?: (todoId: number) => void,
  updatingTodos: number[],
};

export const TodoList: React.FC<Props> = ({
  listOfTodoId,
  loading,
  todos,
  deleteTodo = () => { },
  tempTodo,
  updateTodo = () => { },
  onChange = () => { },
  updatingTodos,
}) => {
  const [todoForDelete, setTodoForDelete] = useState<number | null>(null);
  const [isUpdating, setIsUpdating] = useState<number | null>(null);
  const [selectedTodoId, setSelectedTodoId] = useState<number | null>(null);
  const [tempTitle, setTempTitle] = useState('');
  const selectedTodo = useMemo(() => {
    return findTodoById(todos, selectedTodoId);
  }, [selectedTodoId]);

  useEffect(() => {
    if (selectedTodo !== null) {
      setTempTitle(selectedTodo.title);
    }
  }, [selectedTodoId]);

  useEffect(() => {
    setIsUpdating(null);
  }, todos);

  const handleUpdate = (event?: FormEvent) => {
    event?.preventDefault();

    if ((tempTitle !== null) && (!tempTitle.trim())) {
      if (isUpdating !== null) {
        deleteTodo(isUpdating);
      }

      return;
    }

    if (tempTitle === selectedTodo?.title) {
      setSelectedTodoId(null);

      return;
    }

    updateTodo(selectedTodoId, tempTitle);

    setSelectedTodoId(null);
    setTempTitle('');
  };

  return (
    <section className="todoapp__main">
      {todos.map(todo => (
        <div
          className={classNames('todo', {
            'todo completed': todo.completed,
          })}
          key={todo.id}
        >
          <label className="todo__status-label">
            <input
              type="checkbox"
              className="todo__status"
              checked={todo.completed}
              onClick={() => {
                onChange(todo.id);
                setIsUpdating(todo.id);
              }}
            />
          </label>

          {selectedTodoId === todo.id
            ? (
              <form onSubmit={handleUpdate}>
                <input
                  // eslint-disable-next-line jsx-a11y/no-autofocus
                  autoFocus
                  type="text"
                  value={tempTitle}
                  className="todo__title-field"
                  onChange={(event) => setTempTitle(event.target.value)}
                  onBlur={handleUpdate}
                  onKeyUp={(event) => {
                    if (event.key === 'Escape') {
                      setSelectedTodoId(null);
                    }
                  }}
                />
              </form>
            )
            : (
              <>
                <span
                  className="todo__title"
                  onDoubleClick={() => {
                    setSelectedTodoId(todo.id);
                    setIsUpdating(todo.id);
                  }}
                >
                  {todo.title}
                </span>
                <button
                  type="button"
                  className="todo__remove"
                  onClick={() => {
                    deleteTodo(todo.id);
                    setTodoForDelete(todo.id);
                  }}
                >
                  ×
                </button>
              </>
            )}

          <div className={classNames('modal overlay', {
            'modal overlay is-active': loading
              && [todoForDelete, ...listOfTodoId,
                isUpdating, ...updatingTodos].includes(todo.id),
          })}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      ))}

      {
        tempTodo
        && (
          <div className={classNames('todo', {
            'todo completed': tempTodo.completed,
          })}
          >
            <label className="todo__status-label">
              <input
                type="checkbox"
                className="todo__status"
                checked
              />
            </label>

            <span className="todo__title">{tempTodo.title}</span>
            <button
              type="button"
              className="todo__remove"
              onClick={() => deleteTodo(tempTodo.id)}
            >
              ×
            </button>

            <div className={classNames('modal overley', {
              'modal overlay is-active': loading,
            })}
            >
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        )
      }
    </section>
  );
};
