import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { FilterOptions } from '../types/FilterOptions';
import { getFilteredTodos } from '../utils/getFilteredTodos';
import { deleteTodo, patchTodo } from '../api/todos';
import { Errors } from '../types/Errors';

type Props = {
  todos: Todo[];
  updateTodos: (todoItems: Todo[]) => void;
  tempTodo: Todo | null;
  filterOption: FilterOptions;
  errorText: Errors | null;
  addErrorText: (errorMessage: Errors | null) => void;
  clearTimeoutError: () => void;
  isCompletedTodosDeleting: boolean;
  toggleAllLoader: boolean | null;
};

export const TodoList: React.FC<Props> = ({
  todos,
  updateTodos,
  tempTodo,
  filterOption,
  errorText,
  addErrorText,
  clearTimeoutError,
  isCompletedTodosDeleting,
  toggleAllLoader,
}) => {
  const [editingTodoQuery, setEditingTodoQuery] = useState<string>('');
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);
  const [updatingTodoId, setUpdatingTodoId] = useState<number | null>(null);

  const editingTodoField = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (
      (editingTodoField.current && editingTodoId) ||
      (editingTodoField.current &&
        editingTodoId &&
        errorText === Errors.unableToUpdate)
    ) {
      editingTodoField.current.focus();
    }
  }, [editingTodoId, errorText]);

  const visibleTodos = useMemo(
    () => getFilteredTodos(todos, filterOption),
    [todos, filterOption],
  );

  const handleCheckboxChange = useCallback(
    (todo: Todo): void => {
      const { id, completed } = todo;

      setUpdatingTodoId(id);

      if (errorText) {
        addErrorText(null);
      }

      patchTodo({ ...todo, completed: !completed })
        .then(() => {
          updateTodos(
            todos.map(todoItem => {
              return todoItem.id === id
                ? { ...todoItem, completed: !completed }
                : todoItem;
            }),
          );
        })
        .catch(() => {
          addErrorText(Errors.unableToUpdate);
          clearTimeoutError();
        })
        .finally(() => setUpdatingTodoId(null));
    },
    [todos, updateTodos, errorText, addErrorText, clearTimeoutError],
  );

  const endEditTodo = useCallback((): void => {
    setEditingTodoId(null);
    setEditingTodoQuery('');
  }, []);

  const handleDeleteTodo = useCallback(
    (todoId: number): void => {
      if (errorText) {
        addErrorText(null);
      }

      setUpdatingTodoId(todoId);

      deleteTodo(todoId)
        .then(() => {
          updateTodos(todos.filter(todoItem => todoItem.id !== todoId));
          endEditTodo();
        })
        .catch(() => {
          addErrorText(Errors.unableToDelete);
          clearTimeoutError();
        })
        .finally(() => setUpdatingTodoId(null));
    },
    [
      todos,
      updateTodos,
      errorText,
      addErrorText,
      clearTimeoutError,
      endEditTodo,
    ],
  );

  const handleRenameTodo = useCallback(
    (todo: Todo, newTodoTitle: string): void => {
      if (errorText) {
        addErrorText(null);
      }

      setUpdatingTodoId(todo.id);

      patchTodo({ ...todo, title: newTodoTitle })
        .then(() => {
          updateTodos(
            todos.map(todoItem =>
              todoItem.id === todo.id
                ? { ...todoItem, title: newTodoTitle }
                : todoItem,
            ),
          );
          endEditTodo();
        })
        .catch(() => {
          addErrorText(Errors.unableToUpdate);
          clearTimeoutError();
        })
        .finally(() => setUpdatingTodoId(null));
    },
    [
      todos,
      updateTodos,
      errorText,
      addErrorText,
      clearTimeoutError,
      endEditTodo,
    ],
  );

  const startEditTodo = useCallback(
    (todoId: number, todoTitle: string): void => {
      setEditingTodoId(todoId);
      setEditingTodoQuery(todoTitle);
    },
    [],
  );

  const editTodo = useCallback(
    (todo: Todo): void => {
      const { id, title } = todo;

      if (!editingTodoQuery.trim()) {
        handleDeleteTodo(id);
      } else if (editingTodoQuery.trim() !== title) {
        handleRenameTodo(todo, editingTodoQuery.trim());
      } else {
        endEditTodo();
      }
    },
    [editingTodoQuery, handleDeleteTodo, handleRenameTodo, endEditTodo],
  );

  const handleOnChangeEditingTodo = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>): void => {
      setEditingTodoQuery(event.target.value);
    },
    [],
  );

  const handleOnKeyUpEditingTodo = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>): void => {
      if (event.key === 'Escape') {
        endEditTodo();
      }
    },
    [endEditTodo],
  );

  const handleSubmitEditingTodo = useCallback(
    (event: React.FormEvent<HTMLFormElement>, todo: Todo): void => {
      event.preventDefault();

      editTodo(todo);
    },
    [editTodo],
  );

  const handleOnBlurEditingTodo = useCallback(
    (todo: Todo): void => {
      editTodo(todo);
    },
    [editTodo],
  );

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {visibleTodos.map(todo => {
        const { id, title, completed } = todo;

        return (
          <div
            data-cy="Todo"
            className={classNames('todo', { completed })}
            key={id}
          >
            <label className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
                checked={completed}
                onChange={() => handleCheckboxChange(todo)}
              />
            </label>

            {editingTodoId === id ? (
              <form onSubmit={event => handleSubmitEditingTodo(event, todo)}>
                <input
                  ref={editingTodoField}
                  data-cy="TodoTitleField"
                  type="text"
                  className="todo__title-field"
                  placeholder="Empty todo will be deleted"
                  value={editingTodoQuery}
                  onChange={handleOnChangeEditingTodo}
                  onKeyUp={handleOnKeyUpEditingTodo}
                  onBlur={() => handleOnBlurEditingTodo(todo)}
                />
              </form>
            ) : (
              <>
                <span
                  data-cy="TodoTitle"
                  className="todo__title"
                  onDoubleClick={() => startEditTodo(id, title)}
                >
                  {title}
                </span>

                <button
                  type="button"
                  className="todo__remove"
                  data-cy="TodoDelete"
                  onClick={() => handleDeleteTodo(id)}
                >
                  ×
                </button>
              </>
            )}

            <div
              data-cy="TodoLoader"
              className={classNames('modal', 'overlay', {
                'is-active':
                  updatingTodoId === id ||
                  (isCompletedTodosDeleting && completed) ||
                  (toggleAllLoader !== null && toggleAllLoader === completed),
              })}
            >
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        );
      })}

      {!!tempTodo && (
        <>
          <div data-cy="Todo" className="todo">
            <label className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
                disabled
              />
            </label>

            <span data-cy="TodoTitle" className="todo__title">
              {tempTodo.title}
            </span>

            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              disabled
            >
              ×
            </button>

            <div data-cy="TodoLoader" className="modal overlay is-active">
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        </>
      )}
    </section>
  );
};
