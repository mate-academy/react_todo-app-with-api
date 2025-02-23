import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  loadingTodoIds?: number[];
  onDeleteTodo?: (currentTodoId: number) => Promise<void>;
  onEditTodo?: (currentTodo: Todo) => void;
  onCheckedTodo?: (currentTodo: Todo) => void;
  serverError?: boolean;
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  loadingTodoIds,
  onDeleteTodo = () => {},
  onEditTodo = () => {},
  onCheckedTodo = () => {},
  serverError,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {todos.map((todo: Todo) => {
          return (
            <CSSTransition key={todo.id} timeout={300} classNames="item">
              <TodoItem
                onloadingTodoIds={loadingTodoIds}
                todo={todo}
                onDelete={onDeleteTodo}
                onEdit={onEditTodo}
                onChecked={onCheckedTodo}
                errorFromServer={serverError}
              />
            </CSSTransition>
          );
        })}
        {tempTodo !== null && (
          <CSSTransition key={0} timeout={300} classNames="temp-item">
            <TodoItem todo={tempTodo} />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
