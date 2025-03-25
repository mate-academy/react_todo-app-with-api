import React, { useState } from 'react';

import { Todo } from '../../types/Todo';
import { FilterType } from '../../types/FilterType';

import { TodoItem } from '../Todo/TodoItem';
import { Footer } from '../Footer/Footer';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

type Props = {
  todoList: Todo[];
  tempTodo?: Todo | null;
  loadingTodos: Set<number>;
  removeTodo: (id: number) => void;
  updateTodoTitle: (id: number, updatedTitle: string) => void;
  showErrorMessage: (message: string, delay?: number) => void;
  toggleTodoStatus: (id: number) => void;
  setLoadingTodos: (todos: Set<number>) => void;
};

export const TodoList: React.FC<Props> = ({
  todoList,
  tempTodo = null,
  loadingTodos,
  removeTodo,
  updateTodoTitle,
  toggleTodoStatus,
  showErrorMessage,
  setLoadingTodos,
}) => {
  const [activeFilter, setActiveFilter] = useState<FilterType>(FilterType.all);

  const filteredList = (list: Todo[]) => {
    switch (activeFilter) {
      case FilterType.all: {
        return list;
      }

      case FilterType.active: {
        return list.filter(item => item.completed === false);
      }

      case FilterType.completed: {
        return list.filter(item => item.completed === true);
      }
    }
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {filteredList(todoList).map(todo => (
          <CSSTransition key={todo.id} timeout={300} classNames="item">
            <TodoItem
              key={todo.id}
              todo={todo}
              loadingTodos={loadingTodos}
              removeTodo={removeTodo}
              updateTodoTitle={updateTodoTitle}
              showErrorMessage={showErrorMessage}
              toggleTodoStatus={toggleTodoStatus}
            />
          </CSSTransition>
        ))}

        {tempTodo !== null && (
          <CSSTransition key={0} timeout={300} classNames="temp-item">
            <TodoItem todo={tempTodo} isLoadingDefault={true} />
          </CSSTransition>
        )}
      </TransitionGroup>

      {todoList?.length !== 0 && (
        <Footer
          todoList={todoList}
          activeFilter={activeFilter}
          removeTodo={removeTodo}
          setActiveFilter={setActiveFilter}
          showErrorMessage={showErrorMessage}
          setLoadingTodos={setLoadingTodos}
        />
      )}
    </section>
  );
};
