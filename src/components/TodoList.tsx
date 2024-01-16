import {
  CSSTransition,
  TransitionGroup,
} from 'react-transition-group';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  onDelete: (id: number) => Promise<void>;
  temporaryTodo: Todo | null;
  onUpdate: (updatedTodo: Todo) => Promise<void>;
  loadingTodosId: number[];
};

export const TodoList: React.FC<Props> = ({
  todos,
  onDelete,
  temporaryTodo,
  onUpdate,
  loadingTodosId,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {todos.map((todo) => (
          <CSSTransition
            key={todo.id}
            timeout={300}
            classNames="item"
          >
            <TodoItem
              todo={todo}
              onDelete={onDelete}
              key={todo.id}
              onUpdate={onUpdate}
              loader={loadingTodosId.includes(todo.id)}
              loadingTodosId={loadingTodosId}
            />
          </CSSTransition>
        ))}

        {temporaryTodo && (
          <CSSTransition
            timeout={300}
            classNames="item"
          >
            <TodoItem
              todo={temporaryTodo}
              onDelete={onDelete}
              onUpdate={onUpdate}
              loader={loadingTodosId.includes(temporaryTodo.id)}
              loadingTodosId={loadingTodosId}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
