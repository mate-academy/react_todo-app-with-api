import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { Todo } from '../types/Todo';
import { TodoComponent } from './TodoComponent';

interface TodoListProps {
  todosAfterFiltering: Todo[];
  tempTodo?: Todo | null;
  loadingTodos: number[];
  inputRef: React.MutableRefObject<HTMLInputElement | null>;
  onTodoDelete: (todoId: number) => void;
  onTodoToggle: (todoId: number, currentCompletedStatus: boolean) => void;
  onUpdateTodo: (updatedTodo: Todo) => Promise<void>;
}

export const TodoList: React.FC<TodoListProps> = ({
  todosAfterFiltering,
  tempTodo,
  loadingTodos,
  inputRef,
  onTodoDelete,
  onTodoToggle,
  onUpdateTodo,
}) => {
  const handleEndListener = (node: HTMLElement, done: () => void) => {
    node.addEventListener('transitionend', done, false);
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {todosAfterFiltering.map(todo => (
          <CSSTransition
            key={todo.id}
            classNames="item"
            timeout={300}
            addEndListener={handleEndListener}
          >
            <TodoComponent
              todo={todo}
              isLoading={loadingTodos.includes(todo.id)}
              tempTodo={null}
              inputRef={inputRef}
              onTodoDelete={onTodoDelete}
              onTodoToggle={onTodoToggle}
              onUpdateTodo={onUpdateTodo}
            />
          </CSSTransition>
        ))}
        {tempTodo && (
          <CSSTransition
            key={tempTodo.id}
            classNames="item"
            timeout={300}
            addEndListener={handleEndListener}
          >
            <TodoComponent
              todo={tempTodo}
              isLoading={loadingTodos.includes(0)}
              tempTodo={tempTodo}
              inputRef={inputRef}
              onTodoDelete={onTodoDelete}
              onTodoToggle={onTodoToggle}
              onUpdateTodo={onUpdateTodo}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
