import React, { useState, useContext } from 'react';
import classNames from 'classnames';
import { TodoLoader } from '../TodoLoader';
import { TodoTitle } from '../TodoTitle';
import { TodoTitleForm } from '../TodoTitleField';
import { Todo } from '../../../types/Todo';
import { TodoContext, TodoUpdateContext } from '../../TodoContext';

type Props = {
  todo: Todo,
};

export const TodoItem: React.FC<Props> = ({
  todo,
}) => {
  const { modifiedTodosId } = useContext(TodoContext);
  const { setActiveIds, modifyTodos } = useContext(TodoUpdateContext);
  const [isForm, setIsForm] = useState(false);
  const [todoWithFormId, setTodoWithFormId] = useState(0);

  const { id, completed } = todo;
  const isModified = id === 0;
  const isActive = modifiedTodosId.includes(id);
  const shouldFormShow = isForm && id === todoWithFormId;

  const changeFormStatus = (formStatus: boolean) => {
    setIsForm(formStatus);
  };

  // activate input to change existing todo title
  const handleActiveTodoId = (todoId: number) => {
    setTodoWithFormId(todoId);
  };

  // change existing todo complet propery
  const handleChangeComplet = (currentTodo: Todo) => {
    const modifiedTodo = {
      ...currentTodo,
      completed: !currentTodo.completed,
    };

    setActiveIds([todo.id]);
    modifyTodos([modifiedTodo]);
  };

  return (
    <div
      data-cy="Todo"
      className={classNames(
        'todo',
        { completed },
      )}
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
};
