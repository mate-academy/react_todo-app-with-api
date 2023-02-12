import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../types/Todo';
import { Loader } from './Loader';
import { UpdateTodoForm } from './UpdateTodoForm';

type Props = {
  todos: Todo[],
  onTodoDelete: (todoId: number) => void
  onTodoUpdate: (todo: Todo) => void
  todosBeingTransform: number[],
};

export const TodoList: React.FC<Props> = ({
  todos,
  onTodoDelete,
  onTodoUpdate,
  todosBeingTransform,
}) => {
  const [selectedTodoId, setSelectedTodoId] = useState<number>(0);
  const editingRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    editingRef.current?.focus();
  }, [selectedTodoId]);

  return (
    <section className="todoapp__main">
      {todos.map((visibleTodo) => (
        <div
          key={visibleTodo.id}
          className={classNames(
            'todo',
            { completed: visibleTodo.completed },
          )}
        >
          <label className="todo__status-label">
            {todosBeingTransform.includes(visibleTodo.id) && (
              <Loader />
            )}
            <input
              type="checkbox"
              className="todo__status"
              checked={visibleTodo.completed}
              onChange={() => {
                onTodoUpdate({
                  ...visibleTodo,
                  completed: !visibleTodo.completed,
                });
              }}
            />
          </label>
          {selectedTodoId === visibleTodo.id
            ? (
              <UpdateTodoForm
                todo={visibleTodo}
                className="todo__title-field"
                placeholder="Empty todo will be deleted"
                onTodoDelete={onTodoDelete}
                setSelectedTodoId={setSelectedTodoId}
                editingRef={editingRef}
                onTodoUpdate={onTodoUpdate}
              />
            )
            : (
              <>
                <span
                  ref={editingRef}
                  className="todo__title"
                  onDoubleClick={() => {
                    setSelectedTodoId(visibleTodo.id);
                  }}
                >
                  {visibleTodo.title}
                </span>

                <button
                  type="button"
                  className="todo__remove"
                  onClick={() => {
                    onTodoDelete(visibleTodo.id);
                  }}
                >
                  ×
                </button>
              </>
            )}
        </div>
      ))}
    </section>
  );
};
