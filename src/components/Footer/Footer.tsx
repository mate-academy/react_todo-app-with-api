import { Filters } from './Filters';
import { FooterButton } from './FooterButton';

import { TodoCount } from './TodoCount';

export const Footer = () => (
  <footer
    data-cy="Footer"
    className="todoapp__footer"
  >
    <TodoCount />
    <Filters />
    <FooterButton />
  </footer>
);
