import { useMemo } from 'react';

import classNames from 'classnames';

import { Todo } from '../../types/Todo';
import { TodoForm } from '../TodoForm';

interface Props {
  todos: Todo[],
  onAddTodo: (title: string, todoId: number) => void,
  onToogleAll: () => void,
}

export const HeaderTodo: React.FC<Props> = (props) => {
  const {
    todos,
    onAddTodo,
    onToogleAll,
  } = props;
  const areTodosEmpty = todos.length < 1;
  const areAllCompleted = useMemo(() => {
    return todos.length === todos.filter(todo => todo.completed).length;
  }, [todos, onToogleAll]);

  return (
    <>
      <button
        type="button"
        className={classNames(
          'todoapp__toggle-all',
          {
            active: areAllCompleted,
            'is-invisible': areTodosEmpty,
          },
        )}
        aria-label="active"
        onClick={onToogleAll}
      />

      <TodoForm
        onSubmit={onAddTodo}
      />
    </>
  );
};
