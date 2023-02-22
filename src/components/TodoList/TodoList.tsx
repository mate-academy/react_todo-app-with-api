import React from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';
import '../../styles/transition.scss';

type Props = {
  todos: Todo[],
  tempTodo: Todo | null,
  onDeleteTodo: (todo: Todo) => void;
  onUpdateTodoStatus: (todo: Todo) => void,
  todosIdInProcess: number[],
  onUpdateTodoTitle: (todo: Todo, newTitle: string) => void,
};

export const TodoList:React.FC<Props> = ({
  todos,
  tempTodo,
  onDeleteTodo,
  onUpdateTodoStatus,
  todosIdInProcess,
  onUpdateTodoTitle,
}) => (
  <section className="todoapp__main">
    <TransitionGroup>
      {todos.map(todo => (
        <CSSTransition
          key={todo.id}
          timeout={300}
          classNames="item"
        >
          <TodoItem
            key={todo.id}
            todo={todo}
            onDeleteTodo={onDeleteTodo}
            onUpdateTodoStatus={onUpdateTodoStatus}
            todosIdInProcess={todosIdInProcess}
            onUpdateTodoTitle={onUpdateTodoTitle}
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
            onDeleteTodo={() => {}}
            onUpdateTodoStatus={() => {}}
            todosIdInProcess={[tempTodo.id]}
            onUpdateTodoTitle={() => {}}
          />
        </CSSTransition>
      )}
    </TransitionGroup>
  </section>
);
