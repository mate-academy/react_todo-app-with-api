import { FC, memo } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Todo } from '../../types/Todo';
import { TodoInfo } from './TodoInfo';

type Props = {
  todos: Todo[];
  deleteTodo: (todoId: number) => Promise<void>;
  isAdding: boolean;
  tempTodo: Todo;
  deleteCompleted: boolean;
  handleTodoUpdate: (todoId: number, data: Partial<Todo>) => Promise<void>;
  isPatchingTodoIds: number[];
};

export const TodoList: FC<Props> = memo(({
  todos,
  deleteTodo,
  isAdding,
  tempTodo,
  deleteCompleted,
  handleTodoUpdate,
  isPatchingTodoIds,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    <TransitionGroup>
      {todos.map(todo => (
        <CSSTransition
          key={todo.id}
          timeout={300}
          classNames="item"
        >
          <TodoInfo
            key={todo.id}
            todo={todo}
            deleteTodo={deleteTodo}
            deleteCompleted={deleteCompleted}
            handleTodoUpdate={handleTodoUpdate}
            isPatchingTodoIds={isPatchingTodoIds}
          />
        </CSSTransition>
      ))}
      {isAdding && (
        <CSSTransition
          key={tempTodo.id}
          timeout={300}
          classNames="item"
        >
          <TodoInfo todo={tempTodo} isAdding={isAdding} />
        </CSSTransition>
      )}
    </TransitionGroup>
  </section>
));
