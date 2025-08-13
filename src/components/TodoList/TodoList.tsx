import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';
import { FilterType } from '../../types/FilterType';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

type Props = {
  todos: Todo[];
  filterValue: FilterType;
  onDelete: (id: number) => void;
  tempTodo: Todo | null;
  processingTodos: number[];
  onChange: (todo: Todo) => Promise<void>;
};

function filterTodo(todos: Todo[], filterBy: FilterType) {
  switch (filterBy) {
    case FilterType.all:
      return todos;
    case FilterType.completed:
      return todos.filter(todo => todo.completed);
    case FilterType.active:
      return todos.filter(todo => !todo.completed);
  }
}

export const TodoList: React.FC<Props> = ({
  todos,
  filterValue,
  onDelete,
  tempTodo,
  processingTodos,
  onChange,
}) => {
  const visibleTodos = filterTodo(todos, filterValue);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {visibleTodos.map(todo => (
          <CSSTransition key={todo.id} timeout={300} classNames="item">
            <TodoItem
              todo={todo}
              isLoader={processingTodos.includes(todo.id)}
              onDelete={onDelete}
              onChange={onChange}
            />
          </CSSTransition>
        ))}
        {tempTodo && (
          <CSSTransition timeout={300} classNames="item">
            <TodoItem todo={tempTodo} isLoader={true} onDelete={onDelete} />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
