import { TodoCard } from './TodoCard';
import { Todo } from '../types/typedefs';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { LoadingTodo } from '../types/typedefs';

interface TodoListProps {
  todosFiltered: Todo[];
  tempTodo: Todo | null;
  loadingTodo: LoadingTodo;
  toggleTodo: (todoId: number) => Promise<void>;
  removeTodo: (todoId: number) => Promise<void>;
  updateTodoTitle: (todoId: number, newTitle: string) => Promise<void>;
}

export const TodoList: React.FC<TodoListProps> = ({
  todosFiltered,
  tempTodo,
  loadingTodo,
  toggleTodo,
  removeTodo,
  updateTodoTitle,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <div>
        <TransitionGroup>
          {todosFiltered.map(todo => (
            <CSSTransition key={todo.id} timeout={300} classNames="item">
              <TodoCard
                key={todo.id}
                todo={todo}
                loadingTodo={loadingTodo}
                onToggle={toggleTodo}
                onRemove={removeTodo}
                onUpdateTitle={updateTodoTitle}
              />
            </CSSTransition>
          ))}
          {tempTodo && (
            <CSSTransition key="temp-todo" timeout={300} classNames="temp-item">
              <TodoCard
                key="temp-todo"
                todo={tempTodo}
                loadingTodo={loadingTodo}
                onToggle={toggleTodo}
                onRemove={removeTodo}
                onUpdateTitle={updateTodoTitle}
              />
            </CSSTransition>
          )}
        </TransitionGroup>
      </div>
    </section>
  );
};
