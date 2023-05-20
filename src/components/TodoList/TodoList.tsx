import { FC } from 'react';
import {
  CSSTransition,
  TransitionGroup,
} from 'react-transition-group';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';
import { TempTodo } from '../TempTodo';
import '../../styles/todoList.scss';

interface Props {
  todos: Todo[];
  tempTodo: Todo | null;
  deletedTodosID: number | null;
  completedTodoIds: number[] | null;
  updatingTodoIds: number[] | null
  deleteTodo: (id: number) => void;
  updateTodo: (id: number, data: string | boolean) => void,
}

export const TodoList: FC<Props> = (
  {
    todos,
    tempTodo,
    deletedTodosID,
    completedTodoIds,
    updatingTodoIds,
    deleteTodo,
    updateTodo,
  },
) => {
  return (
    <section className="todoapp__main">
      <TransitionGroup>
        {todos.map((todo) => (
          <CSSTransition
            key={todo.id}
            timeout={500}
            classNames="item"
          >
            <TodoItem
              todo={todo}
              key={todo.id}
              completedTodoIds={completedTodoIds}
              deletedTodosID={deletedTodosID}
              updatingTodoIds={updatingTodoIds}
              deleteTodo={deleteTodo}
              updateTodo={updateTodo}
            />
          </CSSTransition>
        ))}

        {tempTodo && (
          <CSSTransition
            key={0}
            timeout={300}
            classNames="temp-item"
          >
            <TempTodo todo={tempTodo} />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
