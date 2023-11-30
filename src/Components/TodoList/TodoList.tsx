import { FC } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Todo, UpdateTodoArgs } from '../../types/Todo';
import { TodoItem } from '../TodoItem';
import './TodoList.scss';

interface Props {
  todos: Todo[];
  tempTodo: Todo | null;
  removeTodo: (todoId: number) => void;
  editTodo: (todoId: number, args: UpdateTodoArgs) => Promise<void>;
  loadingItems: number[];
  isLoadingAddTodo: boolean;
}

export const TodoList: FC<Props> = ({
  todos,
  tempTodo,
  removeTodo,
  editTodo,
  loadingItems,
  isLoadingAddTodo,
}) => (
  <section className="todoapp__main">
    <TransitionGroup>
      {todos.map((todo) => (
        <CSSTransition
          key={todo.id}
          timeout={300}
          classNames="item"
        >
          <TodoItem
            todo={todo}
            removeTodo={removeTodo}
            editTodo={editTodo}
            loadingItems={loadingItems}
            isLoadingAddTodo={isLoadingAddTodo}
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
            todo={tempTodo}
            removeTodo={removeTodo}
            editTodo={editTodo}
            loadingItems={loadingItems}
            isLoadingAddTodo={isLoadingAddTodo}
          />
        </CSSTransition>
      )}
    </TransitionGroup>
  </section>
);
