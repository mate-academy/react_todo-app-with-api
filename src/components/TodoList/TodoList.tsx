import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type TodoListProps = {
  todos: Todo[];
  tempTodo?: Todo | null; // Optional tempTodo for displaying a temporary item
  onDelete: (todoId: number) => void;
  loader: boolean | number; // Optional loader prop to indicate loading state
  onToggleCompleted: (todoId: number, completed: boolean) => Promise<void>; // Function to toggle completed status
  onEditTitle: (todoId: number, newTitle: string) => Promise<void>;
};

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  onDelete,
  tempTodo,
  loader,
  onToggleCompleted,
  onEditTitle,
}) => {
  const isGlobalLoading = loader === true && !tempTodo;

  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {todos.map(todo => (
          <CSSTransition key={todo.id} timeout={300} classNames="item">
            <TodoItem
              key={todo.id}
              todo={todo}
              onDeleteItem={onDelete}
              loader={
                typeof loader === 'number'
                  ? todo.id === loader
                  : isGlobalLoading
              }
              onToggleCompleted={onToggleCompleted}
              onEditTitle={onEditTitle}
            />
          </CSSTransition>
        ))}
        {tempTodo && (
          <CSSTransition key={tempTodo.id} timeout={300} classNames="item">
            <TodoItem
              key={tempTodo.id}
              todo={tempTodo}
              onDeleteItem={onDelete}
              loader={loader === true}
              onToggleCompleted={onToggleCompleted}
              onEditTitle={onEditTitle}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
