import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { TodoItem } from '../TodoItem';
import { Todo } from '../../types/Todo';

type TodoListProps = {
  todos: Todo[];
  waitingTodos: number[];
  tempTodo: Todo | null;
  onDelete: (id: number) => void;
  onUpdate: (id: number, body: Partial<Todo>) => Promise<void>;
};

export function TodoList({
  todos,
  waitingTodos,
  tempTodo,
  onDelete,
  onUpdate,
}: TodoListProps) {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {todos.map(todo => (
          <CSSTransition key={todo.id} timeout={300} classNames="item">
            <TodoItem
              todo={todo}
              onDelete={onDelete}
              loader={waitingTodos.includes(todo.id)}
              onUpdate={onUpdate}
            />
          </CSSTransition>
        ))}
        {tempTodo && (
          <CSSTransition key={tempTodo.id} timeout={300} classNames="temp-item">
            <TodoItem todo={tempTodo} loader={true} onDelete={() => {}} />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
}
