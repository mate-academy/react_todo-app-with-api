import React, { useContext } from 'react';
import classNames from 'classnames';
import { filterTodo } from '../../utils/filterTodos';
import {
  TodoContext, TodoUpdateContext,
} from '../ContextProviders/TodoProvider';
import { TodoTitleForm } from './TodoTitleField';
import { TodoTitle } from './TodoTitle';
import { TodoLoader } from './TodoLoader';

export const VisibleTodos: React.FC = () => {
  const {
    todos,
    filterBy,
    isForm,
    modifiedTodosId,
    todoWithFormId,
  } = useContext(TodoContext);
  const { handleChangeComplet } = useContext(TodoUpdateContext);

  return (
    <>
      {todos
        .filter(todo => filterTodo(todo, filterBy))
        .map(todo => {
          const { id, completed } = todo;
          const isModified = id === 0;
          const isActive = modifiedTodosId.includes(id);
          const shouldFormShow = isForm && id === todoWithFormId;

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
                  checked={completed}
                  onChange={() => handleChangeComplet(todo)}
                />
              </label>

              {shouldFormShow
                ? <TodoTitleForm todo={todo} />
                : (
                  <TodoTitle
                    todo={todo}
                    isModified={isModified}
                  />
                )}

              <TodoLoader isModified={isModified} isActive={isActive} />
            </div>
          );
        })}
    </>
  );
};
