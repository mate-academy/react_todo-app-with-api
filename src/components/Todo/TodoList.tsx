import React from 'react';
import { Todo } from '../../types/Todo';
import { useTodoProcess, useTodoTodos } from './Context';
import { TodoItem } from './TodoItem';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { FilterOption } from '../../types/types';

type Props = {
  filter: FilterOption;
};

export const TodoList = React.memo(({ filter }: Props) => {
  const { todos, tempTodo } = useTodoTodos();
  const idsOfProcessedTodos = useTodoProcess();

  let filterCallback;

  switch (filter) {
    case FilterOption.All:
      filterCallback = () => true;
      break;
    case FilterOption.Active:
      filterCallback = (todo: Todo) => !todo.completed;
      break;
    case FilterOption.Completed:
      filterCallback = (todo: Todo) => todo.completed;
      break;
    default:
      throw new Error('Filter option is not valid!!!');
  }

  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {todos.filter(filterCallback).map(todo => (
          <CSSTransition key={todo.id} timeout={300} classNames="item">
            <TodoItem
              key={todo.id}
              todo={todo}
              isProcessed={idsOfProcessedTodos.includes(todo.id)}
            />
          </CSSTransition>
        ))}
        {tempTodo && (
          <CSSTransition key={0} timeout={300} classNames="temp-item">
            <TodoItem todo={tempTodo} isProcessed />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
});

TodoList.displayName = 'TodoList';
