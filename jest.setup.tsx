/* eslint-disable */
// import { toMatchDiffSnapshot } from "snapshot-diff";
import React from "react";

process.env = {
  ...process.env,
  // @ts-ignore
  __NEXT_IMAGE_OPTS: {
    deviceSizes: [320, 420, 768, 1024, 1200],
    imageSizes: [],
    domains: ["test.com"],
    path: "/_next/image",
    loader: "default",
  },
};

// expect.extend({ toMatchDiffSnapshot });

jest.mock(
  "next/link",
  (): React.FC =>
    ({ children }) =>
      <>{children}</>,
);
jest.mock("next/head", () => ({
  __esModule: true,
  default: jest.fn((props) => <div data-testid="head">{props.children}</div>),
}));
jest.mock("next/image", () => ({
  __esModule: true,
  default: jest.fn((props) => (
    <img src={props.src} alt={props.alt} height={props.height} width={props.width} />
  )),
}));

const OLD_ENV = process.env;

afterEach(() => {
  process.env = { ...OLD_ENV };
});
