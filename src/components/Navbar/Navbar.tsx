import { FC } from 'react';
import { PageNavLink } from '../PageNavLink';

export const Navbar: FC = () => (
  <nav className="filter" data-cy="Filter">
    <PageNavLink to="/" text="All" />
    <PageNavLink to="/active" text="Active" />
    <PageNavLink to="/completed" text="Completed" />
  </nav>
);
