import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Todo } from '../../types/Todo';
import { TempTodoItem } from '../TempTodoItem/TempTodoItem';
import { TodoItem } from '../TodoItem/TodoItem';
import { memo } from 'react';

/* eslint-disable jsx-a11y/label-has-associated-control */
type Props = {
  todos: Todo[];
  tempTodo?: Todo | null;
  onDelete: (id: number) => Promise<void>;
  onUpdate?: (id: number, data: Partial<Todo>) => Promise<boolean>;
  deletedTodos: number[];
  updatingIds: number[];
};

export const TodoList: React.FC<Props> = memo(
  ({ todos, tempTodo, onDelete, onUpdate, deletedTodos, updatingIds }) => {
    return (
      <>
        <TransitionGroup>
          {todos.map(todo => (
            <CSSTransition key={todo.id} timeout={300} classNames="item">
              <TodoItem
                key={todo.id}
                todo={todo}
                onDelete={onDelete}
                onUpdate={onUpdate}
                deletedTodos={deletedTodos}
                updatingIds={updatingIds}
              />
            </CSSTransition>
          ))}
          {tempTodo && (
            <CSSTransition key={0} timeout={300} classNames="temp-item">
              <TempTodoItem todo={tempTodo} isLoading />
            </CSSTransition>
          )}
        </TransitionGroup>
      </>
    );
  },
);

TodoList.displayName = 'TodoList';
