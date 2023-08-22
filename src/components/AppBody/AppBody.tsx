/* eslint-disable import/no-cycle */
import React, { useContext } from 'react';
import { TodosContext } from '../../context/TodosContext';
import { TodoList } from '../TodoList';
import { Footer } from '../Footer';
import { ErrorComponent } from '../ErrorComponent';
import { Header } from '../Header';
import { filterTodo } from '../../helpers/filterTodo';
import { TodoItem } from '../TodoItem';

export const AppBody: React.FC = () => {
  const { todos, tempTodo, sortField } = useContext(TodosContext);

  const visibleTodos = filterTodo(todos, sortField);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header />

        {todos.length > 0 && (
          <>
            <TodoList todos={visibleTodos} />
            {tempTodo && <TodoItem todo={tempTodo} />}

            <Footer />
          </>
        )}
      </div>

      <ErrorComponent />
    </div>
  );
};
