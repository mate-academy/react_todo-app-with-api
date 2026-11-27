/* eslint-disable prettier/prettier */
import { Todo as TodoType } from '../../types/Todo';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Todo } from '../Todo/Todo';

export const TodoList = ({
  todos,
  tempTodo,
  deletingTodoIds,
  updatingTodoIds,
  onChangeTodo: handleChangeTodo,
  removeTodo,
}: {
  todos: TodoType[];
  tempTodo: TodoType | null;
  deletingTodoIds: ReadonlySet<number>;
  updatingTodoIds: ReadonlySet<number>;
  onChangeTodo: (todo: TodoType) => Promise<boolean>;
  removeTodo: (todoId: number) => Promise<boolean>;
}) => (
  <TransitionGroup
    component="section"
    className="todoapp__main"
    data-cy="TodoList"
  >
    {[
      ...todos.map(todo => (
        <CSSTransition key={todo.id} timeout={300} classNames="item">
          <Todo
            todo={todo}
            isLoading={
              deletingTodoIds.has(todo.id) || updatingTodoIds.has(todo.id)
            }
            onChangeTodo={handleChangeTodo}
            removeTodo={removeTodo}
          />
        </CSSTransition>
      )),
      ...(tempTodo
        ? [
          <CSSTransition key={tempTodo.id} timeout={300} classNames="item">
            <Todo
              todo={tempTodo}
              isLoading
              removeTodo={removeTodo}
              onChangeTodo={handleChangeTodo}
            />
          </CSSTransition>,
        ]
        : []),
    ]}
  </TransitionGroup>
);
