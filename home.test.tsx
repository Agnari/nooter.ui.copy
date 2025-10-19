import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import { Home } from "./src/pages/Home"; // adjust if needed
import { MemoryRouter } from "react-router-dom";
import React from "react";
import { act } from "react-dom/test-utils";

// --- Mock fetch globally ---
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () =>
      Promise.resolve([
        {
          id: 1,
          title: "Test Article",
          body: "Mock content",
          authorName: "AI",
          imageURL: "",
        },
      ]),
  })
) as jest.Mock;

process.env.REACT_APP_API_URL = "http://mock.api";

describe("Home component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("calls API on render", async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <Home />
        </MemoryRouter>
      );
    });

    await waitFor(() =>
      expect(global.fetch).toHaveBeenCalledWith("http://mock.api/api/articles")
    );
  });

  it("renders fetched article data", async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <Home />
        </MemoryRouter>
      );
    });

    const article = await screen.findByText("Test Article");
    expect(article).toBeInTheDocument();
  });
});
