import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";

import App from "./App";

test("renders taskBox header", async () => {
  render(<App />);
  const linkElement = screen.getByText(/taskbox/i);
  expect(linkElement).toBeInTheDocument();
  await waitForElementToBeRemoved(linkElement);
});
