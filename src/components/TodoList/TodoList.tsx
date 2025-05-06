import './TodoList.scss';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

interface TodoListProps {
  lodingId: Todo['id'] | null;
  loadingCompleted: boolean;
  loadingToggles: boolean;
  hasNotCompleted: boolean;
  todos: Todo[];
  tempTodo: Todo | null;
  onChange: (todo: Todo, fieldsToUpdate: Partial<Todo>) => Promise<unknown>;
  onDelete: (todoId: Todo) => Promise<unknown>;
}

export const TodoList: React.FC<TodoListProps> = ({
  lodingId,
  loadingCompleted,
  loadingToggles,
  hasNotCompleted,
  todos,
  tempTodo,
  onChange,
  onDelete,
}) => {
  const isTodoLoading = (todo: Todo) => {
    return (
      lodingId === todo.id ||
      (loadingCompleted && todo.completed) ||
      (loadingToggles && (hasNotCompleted ? !todo.completed : todo.completed))
    );
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {todos.map(todo => (
          <CSSTransition key={todo.id} timeout={300} classNames="item">
            <TodoItem
              key={todo.id}
              todo={todo}
              onChange={onChange}
              onDelete={onDelete}
              isLoading={isTodoLoading(todo)}
            />
          </CSSTransition>
        ))}
        {tempTodo ? (
          <CSSTransition key={0} timeout={300} classNames="temp-item">
            <TodoItem
              todo={tempTodo}
              onChange={onChange}
              onDelete={onDelete}
              isLoading
            />
          </CSSTransition>
        ) : null}
      </TransitionGroup>
    </section>
  );
};
