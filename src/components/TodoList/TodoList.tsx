import React from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo';
import '../../styles/transitiongroup.scss';

type Props = {
  todos: Todo[],
  onDeleteTodo: (todo: Todo) => void;
  handleUpdateTodoStatus: (todo: Todo) => void,
  isUpdatingTodoId: number,
  handleUpdateTodoTitle: (todo: Todo, newTitle: string) => void,
  tempTodo: Todo | null,
};

export const TodoList:React.FC<Props> = ({
  todos,
  onDeleteTodo,
  handleUpdateTodoStatus,
  isUpdatingTodoId,
  handleUpdateTodoTitle,
  tempTodo,
}) => (
  <section className="todoapp__main">
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
            onDeleteTodo={onDeleteTodo}
            handleUpdateTodoStatus={handleUpdateTodoStatus}
            isUpdatingTodoId={isUpdatingTodoId}
            handleUpdateTodoTitle={handleUpdateTodoTitle}
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
            onDeleteTodo={() => {}}
            handleUpdateTodoStatus={() => {}}
            isUpdatingTodoId={tempTodo.id}
            handleUpdateTodoTitle={() => {}}
          />
        </CSSTransition>
      )}
    </TransitionGroup>
  </section>
);
