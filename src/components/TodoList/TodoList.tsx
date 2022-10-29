import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { Loader } from '../Loader/Loader';

type Props = {
  todos: Todo[]
  selectedTodo: number,
  handleRemove : (todoId: number) => void
  handleUpdate: (todoId: number, data: Partial<Todo>) => Promise<void>
  onSelectTodo(todoId: number): void
  selectedTodos: number[],
};

export const TodoList:React.FC<Props> = ({
  todos,
  handleRemove,
  handleUpdate, selectedTodo, onSelectTodo, selectedTodos,
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
    if (!newTitle.trim()) {
      setDoubleClick(false);
      handleRemove(selectedTodo);
    }

    handleUpdate(selectedTodo, { title: newTitle });
    setDoubleClick(false);

    setNewTitle('');
  };

  const clickEnter = (event: { key: string; }) => {
    if (event.key === 'Enter') {
      updateTitle();
    }

    if (event.key === 'Escape') {
      setDoubleClick(false);
    }
  };

  const onDoubleClick = (title: string, id: number) => {
    setDoubleClick(true);
    setNewTitle(title);
    onSelectTodo(id);
  };

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
              <form onSubmit={(event) => {
                event.preventDefault();
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
                  onKeyDown={clickEnter}
                />
              </form>
            ) : (
              <>
                <span
                  data-cy="TodoTitle"
                  className="todo__title"
                  onDoubleClick={() => onDoubleClick(todo.title, todo.id)}
                >
                  {todo.title}
                </span>
                <button
                  type="button"
                  className="todo__remove"
                  data-cy="TodoDeleteButton"
                  onClick={() => {
                    handleRemove(todo.id);
                  }}
                >
                  ×
                </button>
              </>

            )}
          <Loader
            isActive={selectedTodos.includes(todo.id)
              || todo.id === 0}
          />

        </div>
      ))}

    </section>
  );
};
