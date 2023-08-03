import { FC } from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { TodoInfo } from '../TodoInfo';
import { Todo } from '../../types/Todo';

interface Props {
  todos: Todo[];
  loadingTodoIds: number[];
  tempTodo: Todo | null;
  removeTodo: (todoId: number) => void;
  editTodo: (todoId: number, data: Partial<Todo>) => void;
}

export const TodoList: FC<Props> = ({
  todos,
  loadingTodoIds,
  tempTodo,
  removeTodo,
  editTodo,
}) => (
  <section className="todoapp__main">
    <TransitionGroup>
      {todos.map((todo) => (
        <CSSTransition
          key={todo.id}
          timeout={300}
          classNames="item"
        >
          <TodoInfo
            todo={todo}
            loadingTodoIds={loadingTodoIds}
            removeTodo={removeTodo}
            editTodo={editTodo}
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
            loadingTodoIds={loadingTodoIds}
            removeTodo={removeTodo}
            editTodo={editTodo}
          />
        </CSSTransition>
      )}
    </TransitionGroup>
  </section>
);
