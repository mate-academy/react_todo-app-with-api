import React, {
  useState, useContext, useMemo, useCallback,
} from 'react';
import classNames from 'classnames';
import { TodoLoader } from '../TodoLoader';
import { TodoTitle } from '../TodoTitle';
import { TodoTitleForm } from '../TodoTitleField';
import { Todo } from '../../../types/Todo';
import { TodoContext, TodoUpdateContext } from '../../TodoContext';

type Props = {
  todo: Todo,
};

export const TodoItem: React.FC<Props> = React.memo(({
  todo,
}) => {
  const { modifiedTodosId } = useContext(TodoContext);
  const { setActiveIds, modifyTodos } = useContext(TodoUpdateContext);
  const [isForm, setIsForm] = useState(false);
  const [todoWithFormId, setTodoWithFormId] = useState(0);

  const { id, completed } = todo;
  const isModified = useMemo(() => id === 0, [id]);
  const isActive = useMemo(
    () => modifiedTodosId.includes(id), [modifiedTodosId, id],
  );
  const shouldFormShow = useMemo(
    () => isForm && id === todoWithFormId, [isForm, id, todoWithFormId],
  );

  const changeFormStatus = useCallback((formStatus: boolean) => (
    setIsForm(formStatus)
  ), []);

  // activate input to change existing todo title
  const handleActiveTodoId = useCallback((todoId: number) => (
    setTodoWithFormId(todoId)
  ), []);

  // change existing todo complet propery
  const handleChangeComplet = useCallback((currentTodo: Todo) => {
    const modifiedTodo = {
      ...currentTodo,
      completed: !currentTodo.completed,
    };

    setActiveIds([todo.id]);
    modifyTodos([modifiedTodo]);
  }, []);

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
});
