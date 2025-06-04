const { render, screen } = require('@testing-library/react');
const React = require('react');

function Jobs() {
  return React.createElement('h1', null, 'Jobs');
}

test('renders job list heading', () => {
  render(React.createElement(Jobs));
  expect(screen.getByText(/Jobs/)).toBeInTheDocument();
});
