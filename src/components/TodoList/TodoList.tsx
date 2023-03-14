import { FC } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Todo } from '../../types/Todo';
import './TodoList.scss';
import { TodoTask } from '../TodoTask';

type Props = {
  todos: Todo[];
  tempTodo?: Todo | null;
  onDelete: (id: number) => void;
  loadingTodosIDs: number[];
  onUpdate: (id: number, data: object) => void;
};

export const getVisibleTodos = (
  todos: Todo[],
  status: string,
): Todo[] => {
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
  loadingTodosIDs,
  onUpdate,
}) => {
  return (
    <>
      <section className="todoapp__main">
        <TransitionGroup>
          {todos.map(todo => {
            const isLoading = loadingTodosIDs.some(id => id === todo.id); // is problem here?

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
                onDelete={() => {}} // quyestion
                onUpdate={() => {}}
                isLoading
              />
            </CSSTransition>
          )}

        </TransitionGroup>
      </section>
    </>
  );
};
