import { useContext, useMemo } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { TodoItem } from '../TodoItem';
import { TodoContext } from '../State/TodoContext';
import { Status } from '../../types/Status';
import { Todo } from '../../types/Todo';

export const TodoList: React.FC = () => {
  const {
    status,
    todos,
    tempToDo,
  } = useContext(TodoContext);

  const filterTodos = (filterStatus: Status, todoList: Todo[]): Todo[] => {
    switch (filterStatus) {
      case Status.Active:
        return todoList.filter(todo => !todo.completed);

      case Status.Completed:
        return todoList.filter(todo => todo.completed);

      default:
        return todoList;
    }
  };

  const filteredTodos = useMemo(
    () => filterTodos(status, todos), [status, todos],
  );

  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {filteredTodos.map(({ completed, id, title }) => (
          <CSSTransition
            key={id}
            timeout={300}
            classNames="item"
          >
            <TodoItem
              key={id}
              completed={completed}
              id={id}
              title={title}
            />
          </CSSTransition>
        ))}

        {tempToDo && (
          <CSSTransition
            key={tempToDo.id}
            timeout={300}
            classNames="temp-item"
          >
            <TodoItem
              key={tempToDo.id}
              completed={tempToDo.completed}
              id={tempToDo.id}
              title={tempToDo.title}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
