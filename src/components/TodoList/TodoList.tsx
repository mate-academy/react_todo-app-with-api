import {
  CSSTransition,
  TransitionGroup,
} from 'react-transition-group';
import React from 'react';
import { TodoInfo } from '../TodoInfo/TodoInfo';
import { Todo } from '../../types/Todo';
import '../../styles/animation.scss';

type Props = {
  todos: Todo[],
  tempoTodo: Todo | null,
  loadingTodo: number[];
  removeTodo: (id: number) => void,
  updateTitleOfTodo: (todo: Todo, title?: string) => Promise<void>,
  updateStatusOfTodo : (todo: Todo) => void,
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempoTodo,
  loadingTodo,
  removeTodo,
  updateTitleOfTodo,
  updateStatusOfTodo,
}) => {
  return (
    <ul className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {todos.map((todo) => (
          <CSSTransition
            key={todo.id}
            timeout={300}
            classNames="item"
          >
            <TodoInfo
              todo={todo}
              loadingTodo={loadingTodo}
              removeTodo={removeTodo}
              updateTitleOfTodo={updateTitleOfTodo}
              updateStatusOfTodo={updateStatusOfTodo}
            />
          </CSSTransition>
        ))}

        {tempoTodo && (
          <CSSTransition
            key={0}
            timeout={300}
            classNames="temp-item"
          >
            <TodoInfo
              todo={tempoTodo}
              loadingTodo={loadingTodo}
              removeTodo={removeTodo}
              updateTitleOfTodo={updateTitleOfTodo}
              updateStatusOfTodo={updateStatusOfTodo}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </ul>
  );
};
