import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  tempTodo: Todo | null;
  filteredTodos: Todo[];
  loadingTodoIds: number[];
  onDeleteTodo: (todoId: number) => void;
  onUpdateTodo: (todoToUpdate: Todo) => Promise<void>;
};

export const TodoList: React.FC<Props> = props => {
  const {
    filteredTodos,
    tempTodo,
    loadingTodoIds,
    onDeleteTodo,
    onUpdateTodo,
  } = props;

  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {filteredTodos.map(todo => (
          <CSSTransition key={todo.id} timeout={300} classNames="item">
            <TodoItem
              key={todo.id}
              todo={todo}
              isLoading={loadingTodoIds.includes(todo.id)}
              onDeleteTodo={onDeleteTodo}
              onUpdateTodo={onUpdateTodo}
            />
          </CSSTransition>
        ))}

        {tempTodo && (
          <CSSTransition key={0} timeout={300} classNames="temp-item">
            <TodoItem
              todo={tempTodo}
              isLoading={loadingTodoIds.includes(tempTodo.id)}
              onDeleteTodo={() => {}}
              onUpdateTodo={onUpdateTodo}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
