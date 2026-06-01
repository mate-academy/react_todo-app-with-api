import React from 'react';
import { TodoItem } from './TodoItem';
import { Todo } from '../types/Todo';
import { TempTodo } from './TempTodo';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

type Props = {
  filteredTodos: Todo[];
  deleteTodo: (todoId: number) => Promise<void>;
  loadingTodoId: number | null;
  tempTodo: Todo | null;
  updateTodo: (updatedTodo: Todo) => Promise<Todo>;
};

export const TodoList: React.FC<Props> = ({
  filteredTodos,
  deleteTodo,
  loadingTodoId,
  tempTodo,
  updateTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {filteredTodos.map(todo => (
          <CSSTransition key={todo.id} timeout={300} classNames="item">
            <TodoItem
              todo={todo}
              deleteTodo={deleteTodo}
              loadingTodoId={loadingTodoId}
              updateTodo={updateTodo}
            />
          </CSSTransition>
        ))}

        {tempTodo && (
          <CSSTransition key="temp" timeout={300} classNames="temp-item">
            <TempTodo tempTodo={tempTodo} />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
