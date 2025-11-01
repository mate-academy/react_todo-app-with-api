import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';
import { createRef, useRef } from 'react';

type TodoListProps = {
  todos: Todo[];
  tempTodo: Todo | null;
  isLoading: (todoId: Todo['id']) => boolean;
  onDelete: (todoId: Todo['id']) => void;
  onEditTodo: (
    todoId: Todo['id'],
    { fields }: { fields: Partial<Todo> },
  ) => Promise<void>;
};

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  tempTodo,
  isLoading,
  onDelete,
  onEditTodo,
}) => {
  const nodeRefs = useRef<Record<number, React.RefObject<HTMLDivElement>>>({});

  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {todos.map(todo => {
          if (!nodeRefs.current[todo.id]) {
            nodeRefs.current[todo.id] = createRef<HTMLDivElement>();
          }
          const nodeRef = nodeRefs.current[todo.id];

          return (
            <CSSTransition
              key={todo.id}
              nodeRef={nodeRef}
              timeout={300}
              classNames="item"
            >
              <TodoItem
                todo={todo}
                isLoading={isLoading}
                onDelete={onDelete}
                onEditTodo={onEditTodo}
              />
            </CSSTransition>
          );
        })}
        {tempTodo && tempTodo.id === 0 && (
          <CSSTransition
            key={0}
            nodeRef={nodeRefs.current[0] || (nodeRefs.current[0] = createRef())}
            timeout={300}
            classNames="temp-item"
          >
            <TodoItem
              todo={tempTodo}
              isLoading={isLoading}
              onDelete={() => {}}
              onEditTodo={async () => {}}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
