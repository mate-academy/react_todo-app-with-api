import React from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { Todo } from '../../types/Todo';
import { TempTodo } from '../TempTodo';
import '../../styles/transitions.scss';
import { NewTodo } from '../../types/NewTodo';
import { TodoItem } from '../TodoItem';

interface Props {
  todos: Todo[],
  removeTodo: (todoId: number) => void;
  loadingTodo: number[];
  tempTodo: NewTodo | null;
  updateTodo: (id: number, data: Partial<Todo>) => void
}

export const TodoList: React.FC<Props> = ({
  todos,
  removeTodo,
  loadingTodo,
  tempTodo,
  updateTodo,
}) => {
  return (
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
              loadingTodo={loadingTodo}
              updateTodo={updateTodo}
            />
          </CSSTransition>
        ))}

        {tempTodo && (
          <CSSTransition
            key={0}
            timeout={300}
            classNames="temp-item"
          >
            <TempTodo todo={tempTodo} />

          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
