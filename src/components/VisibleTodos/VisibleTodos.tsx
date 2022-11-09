import React, { useContext, useState } from 'react';
import classNames from 'classnames';
import {
  TodoContext, TodoUpdateContext,
} from '../TodoContext';
import { TodoTitleForm } from './TodoTitleField';
import { TodoTitle } from './TodoTitle';
import { TodoLoader } from './TodoLoader';
import { FilterContext } from '../FilterContext';
import { Todo } from '../../types/Todo';

export const VisibleTodos: React.FC = () => {
  const {
    todos,
    modifiedTodosId,
  } = useContext(TodoContext);
  const { setActiveIds, modifyTodos } = useContext(TodoUpdateContext);
  const { filterTodo } = useContext(FilterContext);
  const [isForm, setIsForm] = useState(false);
  const [todoWithFormId, setTodoWithFormId] = useState(0);

  const changeFormStatus = (formStatus: boolean) => {
    setIsForm(formStatus);
  };

  // activate input to change existing todo title
  const handleActiveTodoId = (id: number) => {
    setTodoWithFormId(id);
  };

  // change existing todo complet propery
  const handleChangeComplet = (todo: Todo) => {
    const modifiedTodo = {
      ...todo,
      completed: !todo.completed,
    };

    setActiveIds([todo.id]);
    modifyTodos([modifiedTodo]);
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
                    handleActiveTodoId={handleActiveTodoId}
                  />
                )
                : (
                  <TodoTitle
                    todo={todo}
                    isModified={isModified}
                    changeFormStatus={changeFormStatus}
                    handleActiveTodoId={handleActiveTodoId}
                  />
                )}

              <TodoLoader isModified={isModified} isActive={isActive} />
            </div>
          );
        })}
    </>
  );
};
