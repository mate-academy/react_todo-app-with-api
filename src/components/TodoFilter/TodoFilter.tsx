import { Status } from '../../types/enums';

import { TodoFilterLink } from '../TodoFilterLink/TodoFilterLink';

export const TodoFilter: React.FC = () => {
  return (
    <nav className="filter" data-cy="Filter">
      <nav className="filter" data-cy="Filter">
        {Object.values(Status).map(statusValue => {
          return (
            <TodoFilterLink key={statusValue} statusValue={statusValue}>
              {statusValue}
            </TodoFilterLink>
          );
        })}
      </nav>
    </nav>
  );
};
