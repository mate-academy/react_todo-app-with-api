import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { Todo } from '../../types/Todo';
import { TodoHelpers } from '../../types/TodoHelpers';
import { TodoItem } from '../TodoItem';

type TodoListProps = {
  filteredTodos: Todo[];
  tempTodo: Todo | null;
  loadingTodoId: number | number[] | null;
  helpers: TodoHelpers;
};

export const TodoList: React.FC<TodoListProps> = ({
  filteredTodos,
  tempTodo,
  loadingTodoId,
  helpers,
}) => {
  const isTempTodoLoading = () => tempTodo !== null && loadingTodoId === 0;

  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {filteredTodos.map(todo => (
          <CSSTransition key={todo.id} timeout={300} classNames="item">
            <TodoItem
              todo={todo}
              key={todo.id}
              loadingTodoId={loadingTodoId}
              helpers={helpers}
            />
          </CSSTransition>
        ))}

        {tempTodo && (
          <CSSTransition key={0} timeout={300} classNames="temp-item">
            <div
              data-cy="Todo"
              className={`todo ${isTempTodoLoading() ? 'is-loading' : ''}`}
            >
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
                checked={tempTodo.completed}
                disabled
              />
              <span data-cy="TodoTitle" className="todo__title">
                {tempTodo.title}
              </span>
              {isTempTodoLoading() && (
                <div data-cy="TodoLoader" className="modal overlay is-active">
                  <div className="modal-background has-background-white-ter" />
                  <div className="loader" />
                </div>
              )}
            </div>
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
