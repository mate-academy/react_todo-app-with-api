/* eslint-disable no-console */
import { useContext } from 'react';
// eslint-disable-next-line import/no-cycle
import { TodoItem } from '../TodoItem/TodoItem';
import { Status } from '../../types/Status';
import { filterByStatus } from '../../services/filterByStatus';

// eslint-disable-next-line import/no-cycle
import {
  TodosContext,
} from '../../TodosContext/TodosContext';

type Props = {
  status: Status,
};

export const TodoList: React.FC<Props> = ({ status }) => {
  const { todos } = useContext(TodosContext);
  const todosWithStatus = filterByStatus(todos, status);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todosWithStatus.map((todo) => (<TodoItem todo={todo} key={todo.id} />))}
    </section>
  );
};
