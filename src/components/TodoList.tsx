/* eslint-disable @typescript-eslint/no-explicit-any */
import { TransitionGroup, CSSTransition } from 'react-transition-group';

import { TodoItem } from './TodoItem';
import { Todo } from '../types/Todo';

type Props = {
  visibleTodos: Todo[];
  onDeleteTodo: (todoId: number) => void;
  processedTodoIds: number[];
  tempTodo: Todo | null;
  onUpdateTodo: (todoId: number, data: any) => void;
};

export const TodoList: React.FC<Props> = ({
  visibleTodos,
  onDeleteTodo,
  processedTodoIds,
  tempTodo,
  onUpdateTodo,
}) => {
  return (
    <section className="todoapp__main">
      <TransitionGroup>
        {visibleTodos.map(todo => (
          <CSSTransition
            key={todo.id}
            timeout={300}
            classNames="item"
          >
            <TodoItem
              todo={todo}
              onDeleteTodo={onDeleteTodo}
              isProcessed={processedTodoIds.includes(todo.id)}
              onUpdateTodo={onUpdateTodo}
            />
          </CSSTransition>
        ))}

        {tempTodo !== null && (
          <CSSTransition
            key={0}
            timeout={300}
            classNames="temp-item"
          >
            <TodoItem
              todo={tempTodo}
              isProcessed
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
