import React from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';
import '../../styles/transition.scss';

type Props = {
  todos: Todo[];
  removeTodo:(todoId: number) => void;
  updateState:(todoId: number, property: Partial<Todo>) => void;
  selectedTodoId: number;
  isToggle: boolean;
};

export const TodoList: React.FC<Props> = ({
  todos,
  removeTodo,
  updateState,
  selectedTodoId,
  isToggle,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {todos.map(todo => (
          <CSSTransition
            key={todo.id}
            timeout={300}
            classNames="item"
          >
            <TodoItem
              todo={todo}
              removeTodo={removeTodo}
              updateState={updateState}
              selectedTodoId={selectedTodoId}
              isToggle={isToggle}
            />
          </CSSTransition>
        ))}
      </TransitionGroup>
    </section>
  );
};
