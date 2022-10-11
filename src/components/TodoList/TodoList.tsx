import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { Loader } from '../Loader/Loader';

type Props = {
  todos: Todo[]
  selectedTodo: number,
  handleRemove : (todoId: number) => void
  isAdding: boolean
  handleUpdate: (todoId: number, data: Partial<Todo>) => Promise<void>
  onSelectTodo(todoId: number): void
  // onSelectTodos(todoId: number[]): void
};

export const TodoList:React.FC<Props> = ({
  todos,
  handleRemove,
  isAdding, handleUpdate, selectedTodo, onSelectTodo,
}) => {
  const newTodo = useRef<HTMLInputElement>(null);
  const [doubleClick, setDoubleClick] = useState(false);
  const [newTitle, setNewTitle] = useState('');

  useEffect(() => {
    if (newTodo.current) {
      newTodo.current.focus();
    }
  }, [doubleClick]);

  const updateTitle = () => {
    if (!newTitle) {
      setDoubleClick(false);
    }

    handleUpdate(selectedTodo, { title: newTitle });
    setDoubleClick(false);
    setNewTitle('');
  };

  // const handleKey = (event: { key: string; }) => {
  //   if (event.key === 'Escape') {
  //     setDoubleClick(false);
  //   }
  // };

  return (

    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <div
          data-cy="Todo"
          className={classNames('todo', { completed: todo.completed })}
          key={todo.id}
        >
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              defaultChecked={todo.completed}
              onChange={() => {
                handleUpdate(todo.id, { completed: !todo.completed });
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
                  ref={newTodo}
                  className="todo__title-field"
                  value={newTitle}
                  placeholder="If your todo is empty, it will be deleted"
                  onChange={(e) => {
                    setNewTitle(e.target.value);
                  }}
                  onBlur={() => {
                    updateTitle();
                    setDoubleClick(false);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      updateTitle();
                    }

                    if (e.key === 'Escape') {
                      setDoubleClick(false);
                    }
                  }}
                />
              </form>
            ) : (
              <>
                <span
                  data-cy="TodoTitle"
                  className="todo__title"
                  onDoubleClick={() => {
                    setDoubleClick(true);
                    setNewTitle(todo.title);
                    onSelectTodo(todo.id);
                  }}
                >
                  {todo.title}
                </span>
                <button
                  type="button"
                  className="todo__remove"
                  data-cy="TodoDeleteButton"
                  onClick={() => {
                    handleRemove(todo.id);
                    // onSelectTodos([todo.id]);
                  }}
                >
                  ×
                </button>
              </>

            )}

          {isAdding && (
            <Loader />
          )}
        </div>
      ))}

    </section>
  );
};
