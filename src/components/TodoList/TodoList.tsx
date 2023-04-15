import { FC } from 'react';
import {
  CSSTransition,
  TransitionGroup,
} from 'react-transition-group';
import { Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo';

type Props = {
  todos: Todo[],
  tempTodo: Todo | null,
  loadingTodosIds: number[],
  onTodoDelete: (todoIds: number[]) => void;
  onTodoUpdate: (todoId: number, updatedTodo: Partial<Todo>) => void;
};

export const TodoList: FC<Props> = ({
  todos,
  tempTodo,
  loadingTodosIds,
  onTodoDelete,
  onTodoUpdate,
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
            <TodoInfo
              todo={todo}
              loadingTodosIds={loadingTodosIds}
              onDelete={onTodoDelete}
              onUpdate={onTodoUpdate}
            />
          </CSSTransition>
        ))}
        {tempTodo && (
          <CSSTransition
            key={0}
            timeout={300}
            classNames="temp-item"
          >
            <TodoInfo
              todo={tempTodo}
              loadingTodosIds={loadingTodosIds}
              onDelete={onTodoDelete}
              onUpdate={onTodoUpdate}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
