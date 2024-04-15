import React, { useContext } from 'react';
import { TodoContext } from '../../context/TodoContext';
import { Footer } from '../Footer';
import { Header } from '../Header';
import { TodoList } from '../TodoList';
import { Error } from '../Error';

export const Container: React.FC = () => {
  const { todos } = useContext(TodoContext);

  return (
    <>
      <div className="todoapp__content">
        <Header />

        <TodoList />

        {todos.length > 0 && <Footer />}
      </div>

      <Error />
    </>
  );
};
