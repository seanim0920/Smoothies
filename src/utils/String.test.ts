import { normalize } from "./String";

describe("normalize", () => {
  it("removes special characters and spaces, and converts to lowercase", () => {
    expect(normalize("Hello, World! 12345")).toBe("helloworld12345");
  })
});
