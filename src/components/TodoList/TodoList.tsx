import React from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';
import '../../styles/transitiongroup.scss';

type Props = {
  todos: Todo[],
  tempTodo: Todo | null,
  onDeleteTodo: (todo: Todo) => void,
  handleUpdateTodoStatus: (todo: Todo) => void,
  isUpdatingTodoId: number,
  handleUpdateTodoTitle: (todo: Todo, newTitle: string) => void,
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  onDeleteTodo,
  handleUpdateTodoStatus,
  isUpdatingTodoId,
  handleUpdateTodoTitle,
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
            todo={todo}
            key={todo.id}
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
          <TodoItem
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
