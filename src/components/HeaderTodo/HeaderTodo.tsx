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
  const isHasTodos = todos.length < 1;
  const isAllCompleted
    = todos.length === todos.filter(todo => todo.completed).length;

  return (
    <>
      <button
        type="button"
        className={classNames(
          'todoapp__toggle-all',
          {
            active: isAllCompleted,
            'is-invisible': isHasTodos,
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
