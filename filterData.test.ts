// src/__tests__/filterData.test.ts
import { describe, it, expect } from "@jest/globals";

// copy or import your function here
const filterData = (query: string, items: any[]) =>
  query
    ? items.filter((d) =>
        [d.title, d.body].some((field) =>
          field.toLowerCase().includes(query.toLowerCase())
        )
      )
    : items;

describe("filterData", () => {
  const mockItems = [
    { title: "React Basics", body: "Introduction to components" },
    { title: "Advanced JS", body: "Closures and scopes" },
    { title: "Node.js Guide", body: "Backend runtime" },
  ];

  it("returns all items when query is empty", () => {
    const result = filterData("", mockItems);
    expect(result).toEqual(mockItems);
  });

  it("filters by title match", () => {
    const result = filterData("react", mockItems);
    expect(result).toEqual([{ title: "React Basics", body: "Introduction to components" }]);
  });

  it("filters by body match", () => {
    const result = filterData("backend", mockItems);
    expect(result).toEqual([{ title: "Node.js Guide", body: "Backend runtime" }]);
  });

  it("returns empty array if no matches found", () => {
    const result = filterData("python", mockItems);
    expect(result).toEqual([]);
  });

  it("is case-insensitive", () => {
    const result = filterData("REACT", mockItems);
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe("React Basics");
  });

  it("handles special characters safely", () => {
    const result = filterData("()", mockItems);
    expect(result).toEqual([]);
  });
});
