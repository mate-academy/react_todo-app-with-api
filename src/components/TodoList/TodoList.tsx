import React, { useCallback } from 'react';
import { deleteTodo, updateTodo } from '../../api/todos';
import { ErrorType } from '../../types/ErrorType';
import { Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo/TodoInfo';

type Props = {
  todosToShow: Todo[];
  changingTodoIds: number | number[]
  onTodoAction: (todoId:number, state:boolean) => void
  onError: (errorTpye: ErrorType) => void
  temptodo: Todo | null;
};

export const TodoList: React.FC<Props> = React.memo(({
  todosToShow,
  changingTodoIds,
  onTodoAction,
  onError,
  temptodo,
}) => {
  const onDeleteTodo = useCallback(
    (todoId: number) => {
      onTodoAction(todoId, true);
      deleteTodo(todoId)
        .catch(() => {
          onError(ErrorType.DELETE);
        })
        .finally(() => {
          onTodoAction(todoId, false);
        });
    }, [todosToShow],
  );

  const doUpdate = useCallback(
    (todo: Todo, prop: string, value: any) => {
      onTodoAction(todo.id, true);
      updateTodo(todo, prop, value)
        .catch(() => {
          onError(ErrorType.UPDATE);
        })
        .finally(() => {
          onTodoAction(todo.id, false);
        });
    }, [todosToShow],
  );

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todosToShow.map(todo => (
        <TodoInfo
          key={todo.id}
          todo={todo}
          onUpdate={doUpdate}
          onDelete={onDeleteTodo}
          changingTodoIds={changingTodoIds}
        />
      ))}
      {temptodo && (
        <TodoInfo
          todo={temptodo as Todo}
          onUpdate={updateTodo}
          onDelete={onDeleteTodo}
          changingTodoIds={changingTodoIds}
        />
      )}
    </section>
  );
});
