import { render } from "@testing-library/react";

import { Logo } from "./logo";

describe("<Logo />", () => {
  it("renders", () => {
    const { container } = render(<Logo />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });
});

