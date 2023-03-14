import { FC, useState } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Todo } from '../../types/Todo';
import './TodoList.scss';
import { Footer, FilteringMethod } from '../Footer';
import { TodoTask } from '../TodoTask';

type Props = {
  todos: Todo[];
  tempTodo?: Todo;
  onDelete: (id: number) => void;
  onClearAll: () => void;
  loadingTodosIDs: number[];
  onUpdate: (id: number, data: object) => void;
};

const getVisibleTodos = (todos: Todo[], status: FilteringMethod): Todo[] => {
  if (status === 'Active') {
    return todos.filter(todo => !todo.completed);
  }

  if (status === 'Completed') {
    return todos.filter(todo => todo.completed);
  }

  return todos;
};

export const TodoList: FC<Props> = ({
  todos,
  tempTodo,
  onDelete,
  onClearAll,
  loadingTodosIDs,
  onUpdate,
}) => {
  const [filterStatus, changeFilterStatus] = useState<FilteringMethod>('All');

  const visibleTodos = getVisibleTodos(todos, filterStatus);
  const remainTodos = todos.filter(todo => !todo.completed).length;
  const completedCount = getVisibleTodos(todos, 'Completed').length;

  return (
    <>
      <section className="todoapp__main">
        <TransitionGroup>
          {visibleTodos.map(todo => {
            const isLoading = loadingTodosIDs.some(id => id === todo.id);

            return (
              <CSSTransition
                key={todo.id}
                timeout={300}
                classNames="item"
              >
                <TodoTask
                  todo={todo}
                  onDelete={onDelete}
                  isLoading={isLoading}
                  onUpdate={onUpdate}
                />
              </CSSTransition>
            );
          })}

          {tempTodo && (
            <CSSTransition
              key={0}
              timeout={300}
              classNames="temp-item"
            >
              <TodoTask
                todo={tempTodo}
                onDelete={() => {}}
                onUpdate={() => {}}
                isLoading
              />
            </CSSTransition>
          )}

        </TransitionGroup>
      </section>

      <Footer
        status={filterStatus}
        onStatusChange={changeFilterStatus}
        remainTodos={remainTodos}
        completedTodos={completedCount}
        onClearAll={onClearAll}
      />
    </>
  );
};
