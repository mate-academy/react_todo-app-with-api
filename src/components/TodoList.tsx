import classNames from 'classnames';
import { FC, LegacyRef, useEffect, useState } from 'react';
import { deleteTodo, editTodo, getTodos } from '../api/todos';
import { Todo } from '../types/Todo';
import { User } from '../types/User';

interface Props {
  newTodoField: LegacyRef<HTMLInputElement> | undefined,
  user: User,
  todos: Todo[],
  setTodos: (todos: Todo[]) => void,
}

export const TodoList: FC<Props> = (props) => {
  const { newTodoField, user, todos, setTodos } = props;

  const [isLoading, setIsloading] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedTodoTitle, setEditedTodoTitle] = useState('');
  const [selectedTodoId, setSelectedTodoId] = useState<number | null>(null);

  useEffect(() => {
    setIsloading(true);

    getTodos(user.id)
      .then(setTodos)
      .finally(() => setIsloading(false));
  }, [user]);

  console.log(todos);

  const onDelete = (id: number) => {
    setTodos((prevTodos: Todo[]) => prevTodos.filter(todo => todo.id !== id));
  };

  const deleteTodoHandler = (id: number) => {
    deleteTodo(id)
      .then(responce => {
        if (responce) {
          onDelete(id);
        }
      });
  };

  const onEdit = (editedTodo: Todo) => {
    setTodos((prevTodos: Todo[]) => prevTodos.map(
      (todo) => (todo.id === editedTodo.id ? editedTodo : todo)
    ));
  };

  const editTodoTitleHandler = (id: number) => {
    editTodo(id, {
      title: editedTodoTitle,
    })
      .then(onEdit)
      .finally(() => setIsEditMode(false));
  };

  const editTodoStatusHandler = (id: number) => {
    const editedTodo: Todo | null = todos.find(todo => todo.id === id) || null;

    if (editedTodo) {
      editTodo(id, {
        completed: !editedTodo.completed,
      })
        .then(onEdit)
        .finally(() => setIsChecked((prev) => !prev));
    }
  };

  return (
    <>
      {!isLoading && (
        <section className="todoapp__main" data-cy="TodoList">
          {todos.map(todo => (
            <div
              key={todo.id}
              data-cy="Todo"
              className={classNames(
                'todo',
                { completed: todo.completed },
              )}
            >
              <label className="todo__status-label">
                <input
                  data-cy="TodoStatus"
                  type="checkbox"
                  className="todo__status"
                  checked={isChecked}
                  onChange={() => editTodoStatusHandler(todo.id)}
                />
              </label>

              {((isEditMode && selectedTodoId !== todo.id) || !isEditMode) && (
                <>
                  <span
                    data-cy="TodoTitle"
                    className="todo__title"
                    onDoubleClick={() => {
                      setIsEditMode(true);
                      setSelectedTodoId(todo.id);
                    }}
                  >
                    {todo.title}
                  </span>

                  <button
                    type="button"
                    className="todo__remove"
                    data-cy="TodoDeleteButton"
                    onClick={() => deleteTodoHandler(todo.id)}
                  >
                    ×
                  </button>
                </>
              )}

              {isEditMode && selectedTodoId === todo.id && (
                <form onSubmit={(event) => {
                  event.preventDefault();
                  editTodoTitleHandler(todo.id);
                }}
                >
                  <input
                    data-cy="TodoTitleField"
                    type="text"
                    className="todo__title-field"
                    placeholder="Empty todo will be deleted"
                    ref={newTodoField}
                    value={editedTodoTitle}
                    onChange={
                      (event) => setEditedTodoTitle(event.target.value)
                    }
                  />
                </form>
              )}

              <div
                data-cy="TodoLoader"
                className={classNames(
                  'modal overlay',
                  { isLoading: 'is-active' },
                )}
              >
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          ))}

          <div data-cy="Todo" className="todo">
            <label className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
              />
            </label>

            <span data-cy="TodoTitle" className="todo__title">Redux</span>
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDeleteButton"
            >
              ×
            </button>

            <div data-cy="TodoLoader" className="modal overlay is-active">
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        </section>
      )}
    </>
  );
};
