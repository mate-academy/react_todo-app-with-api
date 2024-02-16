/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext,
} from 'react';
import { TodoContext } from './TodoContext';
import { TodoItem } from './Components/TodoItem/TodoItem';
import { TodoRenameForm } from './Components/TodoRenameForm/TodoRenameForm';
import { Footer } from './Components/Footer/Footer';
import { TempTodo } from './Components/TempTodo/TempTodo';
import { ErrorsHandling } from './Components/ErrorsHandling/ErrorsHandling';
import { Header } from './Components/Header/Header';

export const App: React.FC = () => {
  const {
    todos,
    filteredTodos,
    isChosenToRename,
    tempTodo,
  } = useContext(TodoContext);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header />

        <section className="todoapp__main" data-cy="TodoList">
          {filteredTodos.map((todo) => (
            <React.Fragment key={todo.id}>
              {isChosenToRename === todo.id ? (
                <TodoRenameForm todo={todo} />
              ) : (
                <TodoItem todo={todo} />
              )}

            </React.Fragment>
          ))}
        </section>

        {tempTodo && (
          <TempTodo />
        )}

        {todos.length > 0 && (
          <Footer />
        )}
      </div>
      <ErrorsHandling />
    </div>
  );
};
