import { FC, PropsWithChildren } from 'react';
import { useAppContext } from '../../context/useAppContext';

export const Footer: FC<PropsWithChildren> = ({ children }) => {
  const {
    state: {
      todos,
    },
    actions: {
      deleteTodo,
    },
  } = useAppContext();

  const activeTodosCount = todos?.filter(todo => !todo.completed).length || 0;
  const completedTodos = todos?.filter(todo => todo.completed);

  const handleClick = () => {
    if (!completedTodos) {
      return;
    }

    Promise.all(completedTodos.map(({ id }) => deleteTodo(id)));
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {
          `${activeTodosCount} ${activeTodosCount === 1 ? 'item' : 'items'} left`
        }
      </span>

      {children}

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className="todoapp__clear-completed"
        onClick={handleClick}
        disabled={!completedTodos?.length}
      >
        Clear completed
      </button>
    </footer>
  );
};
