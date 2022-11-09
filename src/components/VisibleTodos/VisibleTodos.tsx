import React, { useContext, useState } from 'react';
import classNames from 'classnames';
import {
  TodoContext, TodoUpdateContext,
} from '../ContextProviders/TodoProvider';
import { TodoTitleForm } from './TodoTitleField';
import { TodoTitle } from './TodoTitle';
import { TodoLoader } from './TodoLoader';
import { FilterContext } from '../Filter';

export const VisibleTodos: React.FC = () => {
  const {
    todos,
    modifiedTodosId,
    todoWithFormId,
  } = useContext(TodoContext);
  const { handleChangeComplet } = useContext(TodoUpdateContext);
  const { filterTodo } = useContext(FilterContext);
  const [isForm, setIsForm] = useState(false);

  const changeFormStatus = (formStatus: boolean) => {
    setIsForm(formStatus);
  };

  return (
    <>
      {todos
        .filter(todo => filterTodo(todo))
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
                ? (
                  <TodoTitleForm
                    todo={todo}
                    changeFormStatus={changeFormStatus}
                  />
                )
                : (
                  <TodoTitle
                    todo={todo}
                    isModified={isModified}
                    changeFormStatus={changeFormStatus}
                  />
                )}

              <TodoLoader isModified={isModified} isActive={isActive} />
            </div>
          );
        })}
    </>
  );
};
