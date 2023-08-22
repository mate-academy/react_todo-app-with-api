import { useCallback, useEffect, useState } from 'react';
import classNames from 'classnames';

import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[];
  deleteTodo: (todoId: number) => Promise<void>;
  todoItem: Todo | null;
  deletedId: number[] | null;
  toggles: Todo[] | null;
  updateTodo: (todo: Todo) => Promise<void>;
};

export const TodoList: React.FC<Props> = ({
  todos,
  deleteTodo,
  todoItem,
  deletedId,
  toggles,
  updateTodo,
}) => {
  const [selectedTodo, setSelectedTodo] = useState(0);
  const [selectedTodos, setSelectedTodos] = useState<number[] | undefined>(
    deletedId
    || toggles?.map(todo => todo.id),
  );
  const [editedTodo, setEditedTodo] = useState(0);
  const [todo, setTodo] = useState<Todo | null>(null);

  const callbackRef = useCallback((inputElement: HTMLInputElement) => {
    if (inputElement) {
      inputElement.focus();
    }
  }, []);

  const clearEditForm = () => {
    setTodo(null);
    setEditedTodo(0);
  };

  const handleDelete = (id: number) => {
    setSelectedTodo(id);
    deleteTodo(id)
      .finally(() => setSelectedTodo(0));
  };

  const handleToggle = ({
    id,
    userId,
    title,
    completed,
  }: Todo) => {
    setSelectedTodo(id);

    updateTodo({
      id,
      userId,
      title,
      completed: !completed,
    })
      .finally(() => setSelectedTodo(0));
  };

  const handleDblClick = ({
    completed,
    title,
    id,
    userId,
  } : Todo) => {
    if (!todo) {
      setEditedTodo(id);
      setTodo({
        completed,
        title,
        id,
        userId,
      });
    }
  };

  const handleFormChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTodo(curTodo => {
      const newTodo = JSON.parse(JSON.stringify(curTodo));

      if (newTodo) {
        newTodo.title = event.target.value;
      }

      return newTodo;
    });
  };

  const handleBlur = ({
    id,
    userId,
    completed,
    title,
  }: Todo) => {
    const prevTitle = todos.find(curTodo => curTodo.id === editedTodo)?.title;

    if (title.trim() === '') {
      handleDelete(id);
    } else if (title !== prevTitle) {
      handleToggle({
        id,
        userId,
        completed: !completed,
        title,
      });
    }

    clearEditForm();
  };

  useEffect(() => {
    if (deletedId) {
      setSelectedTodos(deletedId);
      deletedId.forEach(id => deleteTodo(id));
    } else if (toggles) {
      setSelectedTodos(toggles.map(curTodo => curTodo.id));
      toggles.forEach(({
        id,
        userId,
        title,
        completed,
      } : Todo) => updateTodo({
        id,
        userId,
        title,
        completed: !completed,
      })
        .finally(() => setSelectedTodos(undefined)));
    }
  }, [deletedId, toggles]);

  useEffect(() => {
    if (todo) {
      const {
        id,
        userId,
        completed,
        title,
      } = todo;

      const handleKeyDown = (e: KeyboardEvent) => {
        switch (e.key) {
          case 'Escape':
            clearEditForm();
            break;
          case 'Enter':
            if (title.trim() === '') {
              handleDelete(id);
            } else if (todos
              .find(curTodo => curTodo.id === editedTodo)?.title !== title) {
              handleToggle({
                id,
                userId,
                completed: !completed,
                title,
              });
            }

            clearEditForm();
            break;
          default:
            break;
        }
      };

      document.addEventListener('keydown', handleKeyDown);

      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    }

    return () => {};
  }, [todo]);

  return (
    <section className="todoapp__main">
      {todos.map(({
        completed,
        title,
        id,
        userId,
      }) => (
        <div
          key={id}
          className={classNames(
            'todo',
            { completed },
          )}
          onDoubleClick={() => handleDblClick({
            completed,
            title,
            id,
            userId,
          })}
        >
          <label className="todo__status-label">
            <input
              type="checkbox"
              className="todo__status"
              checked={completed}
              onChange={() => handleToggle({
                completed,
                title,
                id,
                userId,
              })}
            />
          </label>

          {editedTodo === id ? (
            <input
              type="text"
              className="todo__title-field"
              value={todo?.title}
              onChange={(event) => handleFormChange(event)}
              ref={callbackRef}
              onBlur={() => todo && handleBlur(todo)}
            />
          )
            : (
              <>
                <span className="todo__title">
                  {title}
                </span>

                <button
                  type="button"
                  className="todo__remove"
                  onClick={() => handleDelete(id)}
                >
                  ×
                </button>
              </>
            )}

          <div className={classNames('modal', 'overlay', {
            'is-active': selectedTodos?.includes(id) || selectedTodo === id,
          })}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      ))}

      {todoItem && <TodoItem todo={todoItem} />}
    </section>
  );
};
