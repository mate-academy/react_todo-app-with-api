import React, { LegacyRef } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

import './TodoList.css';

interface Props {
  todos: Todo[];
  currentTodos: Todo[];
  deleteTodo: (todo: Todo) => void;
  updateTodo: (todo: Todo) => void;
  newTodoField: LegacyRef<HTMLInputElement> | undefined;
}

export const TodoList: React.FC<Props> = React.memo(({
  todos,
  currentTodos,
  deleteTodo,
  updateTodo,
  newTodoField,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {todos.map((todo) => (
          <CSSTransition key={todo.id} timeout={300} classNames="item">
            <TodoItem
              key={todo.id}
              todo={todo}
              currentTodos={currentTodos}
              deleteTodo={deleteTodo}
              updateTodo={updateTodo}
              newTodoField={newTodoField}
            />
          </CSSTransition>
        ))}
      </TransitionGroup>
    </section>
  );
});
