import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { TodoListItem } from '../TodoListItem';
import { Todo, UpdateTodoDto } from '../../types/Todo';
import { Nullable } from '../../types/Nullable';

interface Props {
  todos: Todo[];
  tempTodo: Nullable<Todo>;
  pendingTodoIds: number[];
  onRemove: (id: Todo['id']) => void;
  onUpdate: (id: Todo['id'], data: UpdateTodoDto) => Promise<void>;
}

export const TodoList = ({
  todos,
  tempTodo,
  pendingTodoIds,
  onRemove,
  onUpdate,
}: Props) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {todos.map(todo => (
          <CSSTransition key={todo.id} timeout={300} classNames="item">
            <TodoListItem
              todo={todo}
              onRemove={onRemove}
              onUpdate={onUpdate}
              isLoading={pendingTodoIds.includes(todo.id)}
            />
          </CSSTransition>
        ))}
        {tempTodo && (
          <CSSTransition key={tempTodo.id} timeout={300} classNames="temp-item">
            <TodoListItem
              todo={tempTodo}
              onRemove={onRemove}
              onUpdate={onUpdate}
              isLoading
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
