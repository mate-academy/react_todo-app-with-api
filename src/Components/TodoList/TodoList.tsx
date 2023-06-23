import React from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo/TodoInfo';
import './TodoList.scss';

type Props = {
  filteredTodos: Todo[],
  removeTodo: (todoId: number) => void,
  tempTodo: Todo | null;
  todoIdUpdate: number[];
  toggleCompletedTodo: (todoId: number, completed: boolean) => void,
  changeName: (todoId: number, title: string) => void
};

export const TodoList: React.FC<Props> = ({
  filteredTodos, removeTodo, tempTodo, todoIdUpdate,
  toggleCompletedTodo, changeName,
}) => {
  return (
    <ul className="todoapp__main">
      <TransitionGroup>
        {filteredTodos.map(todo => (
          <CSSTransition
            key={todo.id}
            timeout={300}
            classNames="item"
          >
            <TodoInfo
              todo={todo}
              removeTodo={removeTodo}
              todoIdUpdate={todoIdUpdate}
              toggleCompletedTodo={toggleCompletedTodo}
              changeName={changeName}
            />
          </CSSTransition>
        ))}

        {tempTodo && (
          <CSSTransition
            key={tempTodo.id}
            timeout={300}
            classNames="temp-item"
          >
            <TodoInfo
              todo={tempTodo}
              removeTodo={removeTodo}
              todoIdUpdate={todoIdUpdate}
              toggleCompletedTodo={toggleCompletedTodo}
              changeName={changeName}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </ul>
  );
};
