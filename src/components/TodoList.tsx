import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[],
  tempTodo: Todo | null,
  onDelete: (todoId: number) => Promise<void>,
  onUpdate: (todo: Todo) => Promise<void>,
  processings: number[],
};

export const TodoList: React.FC<Props> = ({
  todos, tempTodo, onDelete, onUpdate, processings,
}) => {
  return (
    <section className="todoapp__main">
      <TransitionGroup>
        {todos.map(todo => (
          <CSSTransition
            key={todo.id}
            timeout={300}
            classNames="item"
          >
            <TodoItem
              key={todo.id}
              todo={todo}
              onDelete={onDelete}
              onUpdate={onUpdate}
              isProcessed={processings.includes(todo.id)}
            />
          </CSSTransition>
        ))}

        {tempTodo && (
          <CSSTransition
            key={0}
            timeout={300}
            classNames="temp-item"
          >
            <TodoItem
              key={tempTodo.id}
              todo={tempTodo}
              isProcessed
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
