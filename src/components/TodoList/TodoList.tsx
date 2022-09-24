import cN from 'classnames';
import { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[],
  title: string,
  onDelete: (todoId: number) => void,
  onUpdated: (todoId: number, data: Partial<Todo>) => void,
  onSelectTodos: (todoId: number[]) => void,
  onSelectTodo: (todoId: number) => void,
  isAdding: boolean,
  selectedTodos: number[],
  selectedTodo: number,
};

export const TodoList: React.FC<Props> = ({
  todos,
  title,
  onDelete,
  onUpdated,
  onSelectTodos,
  onSelectTodo,
  isAdding,
  selectedTodos,
  selectedTodo,
}) => {
  const todoTitleField = useRef<HTMLInputElement>(null);
  const [doubleClick, setDoubleClick] = useState(false);
  const [todoTitle, setTodoTitle] = useState('');
  const onUpddateTodoTitle = () => {
    if (!todoTitle) {
      onDelete(selectedTodo);
    }

    if (todos.find(todo => todo.title === todoTitle)) {
      setDoubleClick(false);
    }

    onUpdated(selectedTodo, { title: todoTitle });
    setDoubleClick(false);
    setTodoTitle('');
  };

  useEffect(() => {
    if (todoTitleField.current) {
      todoTitleField.current.focus();
    }
  }, [selectedTodo]);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <div
          data-cy="Todo"
          className={cN(
            'todo',
            { completed: todo.completed },
          )}
          key={todo.id}
        >
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              defaultChecked={todo.completed}
              onClick={() => {
                onUpdated(todo.id, { completed: !todo.completed });
              }}
            />
          </label>

          {doubleClick && selectedTodo === todo.id
            ? (
              <form onSubmit={(e) => {
                e.preventDefault();
              }}
              >
                <input
                  data-cy="TodoTitleField"
                  type="text"
                  ref={todoTitleField}
                  className="todo__title-field"
                  value={todoTitle}
                  placeholder="If your todo is empty, it will be deleted"
                  onChange={(e) => {
                    setTodoTitle(e.target.value);
                  }}
                  onBlur={() => {
                    onUpddateTodoTitle();
                    setDoubleClick(false);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      onUpddateTodoTitle();
                    }

                    if (e.key === 'Escape') {
                      setDoubleClick(false);
                    }
                  }}
                />
              </form>
            )
            : (
              <>
                <span
                  data-cy="TodoTitle"
                  className="todo__title"
                  onDoubleClick={() => {
                    setDoubleClick(true);
                    onSelectTodo(todo.id);
                    setTodoTitle(todo.title);
                  }}
                >
                  {todo.title}
                </span>
                <button
                  type="button"
                  className="todo__remove"
                  data-cy="TodoDeleteButton"
                  onClick={() => {
                    onDelete(todo.id);
                    onSelectTodos([todo.id]);
                  }}
                >
                  ×
                </button>
              </>
            )}

          <div
            data-cy="TodoLoader"
            className={cN('modal overlay', {
              'is-active': selectedTodos.includes(todo.id),
            })}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      ))}

      {isAdding && (
        <div
          data-cy="Todo"
          className="todo"
          key={selectedTodo}
        >
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
            />
          </label>
          <span data-cy="TodoTitle" className="todo__title">
            {title}
          </span>
          <div
            data-cy="TodoLoader"
            className={cN('modal overlay', { 'is-active': isAdding })}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </section>
  );
};
