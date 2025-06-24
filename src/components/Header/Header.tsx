import { FC } from 'react';
import { Todo } from '../../types/Todo';
import { AddTodoForm } from '../AddTodoForm';
import classNames from 'classnames';

interface HeaderProps {
  todos: Todo[];
  processingTodoIds: number[];
  addNewTodo: (title: string) => Promise<void>;
  isTodoSubmitting: boolean;
  onToggleStatusTodos: (todos: Todo[]) => Promise<void>;
  isAllTodosCompleted: (todos: Todo[]) => boolean;
}

export const Header: FC<HeaderProps> = ({
  todos,
  processingTodoIds,
  addNewTodo,
  isTodoSubmitting,
  onToggleStatusTodos,
  isAllTodosCompleted,
}) => {
  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: isAllTodosCompleted(todos),
          })}
          data-cy="ToggleAllButton"
          onClick={() => onToggleStatusTodos(todos)}
        />
      )}

      <AddTodoForm
        processingTodoIds={processingTodoIds}
        addNewTodo={addNewTodo}
        isTodoSubmitting={isTodoSubmitting}
      />
    </header>
  );
};
