import React, { useContext } from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { Todo } from '../../types/Todo';
import { ProcessedContext } from '../ProcessedContext/ProcessedContext';
import { TodoInfo } from '../TodoInfo/TodoInfo';

interface Props {
  todos: Todo[],
  onDelete: (todoId: number) => void,
  onUpdate: (todoId: number, dataToUpdate: Partial<Todo>,) => void,
  newTitle: string,
}

export const TodoList: React.FC<Props> = ({
  todos,
  onDelete,
  onUpdate,
  newTitle,
}) => {
  const { isAdding } = useContext(ProcessedContext);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {todos.map(todo => (
          <CSSTransition
            key={todo.id}
            timeout={300}
            classNames="item"
          >
            <TodoInfo
              key={todo.id}
              todo={todo}
              onDelete={onDelete}
              onUpdate={onUpdate}
            />
          </CSSTransition>
        ))}
        {isAdding && (
          <CSSTransition
            key={0}
            timeout={300}
            classNames="temp-item"
          >
            <div
              data-cy="Todo"
              className="todo"
            >
              <label className="todo__status-label">
                <input
                  data-cy="TodoStatus"
                  type="checkbox"
                  className="todo__status"
                  defaultChecked
                />
              </label>
              <span
                data-cy="TodoTitle"
                className="todo__title"
              >
                {newTitle}
              </span>

              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDeleteButton"
              >
                ×
              </button>
              <div
                data-cy="TodoLoader"
                className="modal overlay is-active"
              >
                <div className="
                  modal-background
                  has-background-white-ter"
                />
                <div className="loader" />
              </div>
            </div>
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
