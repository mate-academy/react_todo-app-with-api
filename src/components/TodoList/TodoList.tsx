import { CSSTransition } from 'react-transition-group';
import { Todo } from '../../types/Todo';
import { TodoUser } from '../TodoUser/TodoUser';

type Props = {
  todos: Todo[];
  onDelete: (id: number) => Promise<void>;
  tempTodo: Todo | null;
  handleCompletedStatus: (id: number) => void;
  handleUpdateTodo: (todo: Todo) => Promise<void>;
  processedIds: number[];
};

export const TodoList: React.FC<Props> = ({
  todos,
  onDelete,
  tempTodo,
  handleCompletedStatus,
  handleUpdateTodo,
  processedIds,
}) => {
  const TIMEOUT = 300;

  const TodoItem = (todo: Todo) => (
    <CSSTransition key={todo.id} timeout={TIMEOUT} classNames="item">
      <TodoUser
        todo={todo}
        handleCompletedStatus={handleCompletedStatus}
        onDelete={onDelete}
        processedId={processedIds}
        handleUpdateTodo={handleUpdateTodo}
      />
    </CSSTransition>
  );

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(TodoItem)}
      {tempTodo && TodoItem(tempTodo)}
    </section>
  );
};
