import React from 'react';

import { CSSTransition, TransitionGroup } from 'react-transition-group';

import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

import '../../styles/todolist.scss';

type Props = {
  todos: Todo[],
  tempTodo: Todo | null,
  fetchDeleteTodo: (todoId: number) => void,
  activeTodoIds: number[],
  handleUpdateTodo: (todo: Todo) => void,
};

export const TodoList: React.FC<Props> = React.memo(({
  todos,
  tempTodo,
  fetchDeleteTodo,
  activeTodoIds,
  handleUpdateTodo,
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
            fetchDeleteTodo={fetchDeleteTodo}
            isLoading={activeTodoIds.some(id => id === todo.id)}
            handleUpdateTodo={handleUpdateTodo}
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
            fetchDeleteTodo={fetchDeleteTodo}
            isLoading
            handleUpdateTodo={handleUpdateTodo}
          />
        </CSSTransition>
      )}
    </TransitionGroup>
  </section>
));
