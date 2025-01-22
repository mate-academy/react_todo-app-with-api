import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

interface TodoListProps {
  todos: Todo[];
  tempTodo: Todo | null;
  loadingTodos: number[];
  handleDeleteTodo: (todoId: number) => Promise<void>;
  handleUpdateTodo: (updatedTodo: Todo) => Promise<void>;
}

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  tempTodo,
  loadingTodos,
  handleDeleteTodo,
  handleUpdateTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {todos.map(todo => {
          const isActiveModal = loadingTodos.includes(todo.id);

          return (
            <CSSTransition key={todo.id} timeout={300} classNames="item">
              <TodoItem
                todo={todo}
                isActiveModal={isActiveModal}
                handleDeleteTodo={handleDeleteTodo}
                handleUpdateTodo={handleUpdateTodo}
              />
            </CSSTransition>
          );
        })}
        {tempTodo && (
          <CSSTransition timeout={300} classNames="item">
            <TodoItem
              todo={tempTodo}
              isActiveModal={true}
              handleDeleteTodo={handleDeleteTodo}
              handleUpdateTodo={handleUpdateTodo}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
