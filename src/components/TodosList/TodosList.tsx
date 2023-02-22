import React, { useContext, useState } from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import './TodoList.scss';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';
import { TodosContext } from '../TodosProvider';

type Props = {
  todos: Todo[];
};
export const TodosList: React.FC<Props> = ({ todos }) => {
  const [editedTodoId, setEditedTodoId] = useState(0);
  const { tempTodo } = useContext(TodosContext);

  const handleSetTodoId = (todoId: number) => {
    setEditedTodoId(todoId);
  };

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
              key={todo.id}
              todo={todo}
              setEditedTodoId={handleSetTodoId}
              editedTodoId={editedTodoId}
            />
          </CSSTransition>
        ))}

        {tempTodo && (
          <CSSTransition
            key={0}
            timeout={300}
            classNames="temp-item"
          >
            <TodoItem
              key={0}
              todo={tempTodo}
              editedTodoId={-1}
              setEditedTodoId={handleSetTodoId}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
