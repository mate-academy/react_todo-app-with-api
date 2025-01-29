import { FC } from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

interface Props {
  todos: Todo[];
  tempTodo: Todo | null;
  deleteTodo: (todoId: number) => Promise<boolean>;
  updateTodo: (todoToUpdate: Todo) => Promise<boolean>;
  loadingIds: number[];
  isLoading: boolean;
}

export const TodoList: FC<Props> = ({
  todos,
  tempTodo,
  deleteTodo,
  updateTodo,
  loadingIds,
  isLoading,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {todos.map(todo => (
          <CSSTransition key={todo.id} timeout={300} classNames="item">
            <TodoItem
              key={todo.id}
              todo={todo}
              deleteTodo={deleteTodo}
              updateTodo={updateTodo}
              loadingIds={loadingIds}
              isLoading={false}
            />
          </CSSTransition>
        ))}

        {tempTodo && (
          <CSSTransition key={0} timeout={300} classNames="temp-item">
            <TodoItem
              todo={tempTodo}
              loadingIds={loadingIds}
              isLoading={isLoading}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
