import { Status } from '../../types/enums';
import cn from 'classnames';
import { useTodos } from '../context/TodosContext';
import { useCallback } from 'react';

type Props = {
  statusValue: Status;
  children: React.ReactNode;
};
export const TodoFilterLink: React.FC<Props> = ({ statusValue, children }) => {
  const { statusTodo, setStatusTodo } = useTodos();

  const handleClickFilter = useCallback(() => {
    setStatusTodo(statusValue);
  }, []);

  return (
    <a
      key={statusValue}
      href={`#/${statusValue === Status.All ? '' : statusValue}`}
      className={cn('filter__link', {
        selected: statusTodo === statusValue,
      })}
      data-cy={`FilterLink${statusValue}`}
      onClick={handleClickFilter}
    >
      {children}
    </a>
  );
};
