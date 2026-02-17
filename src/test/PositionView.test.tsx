import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { PositionView } from "../components/admin/PositionView";
import { Application } from "../components/admin/types";

const mockApplications: Application[] = [
  {
    id: "1",
    full_name: "Jane Doe",
    section: "Section B",
    email: "jane@example.com",
    phone_number: "0987654321",
    complete_address: "456 Ave",
    position: "Layout Artist",
    relevant_experience: "Expert",
    portfolio_link: "https://portfolio.com",
    referral_source: "Social Media",
    additional_message: "I love layout!",
    created_at: new Date().toISOString(),
  },
];

describe("PositionView component", () => {
  it("renders the position name and banner", () => {
    render(
      <PositionView
        position="Layout Artist"
        applications={mockApplications}
        onSelectApplication={vi.fn()}
        activeTab="Stream"
      />
    );

    expect(screen.getByText("Layout Artist")).toBeDefined();
    expect(screen.getByText("ANG SILAKBO 2024")).toBeDefined();
  });

  it("shows applicants in Stream tab", () => {
    render(
      <PositionView
        position="Layout Artist"
        applications={mockApplications}
        onSelectApplication={vi.fn()}
        activeTab="Stream"
      />
    );

    expect(screen.getByText(/Jane Doe submitted a new application/i)).toBeDefined();
  });

  it("shows people when activeTab is People", async () => {
    render(
      <PositionView
        position="Layout Artist"
        applications={mockApplications}
        onSelectApplication={vi.fn()}
        activeTab="People"
      />
    );

    expect(screen.getByText("Teachers")).toBeDefined();
    expect(screen.getByText("Applicants")).toBeDefined();
    expect(screen.getByText("Jane Doe")).toBeDefined();
  });

  it("calls onSelectApplication when an applicant is clicked", () => {
    const onSelect = vi.fn();
    render(
      <PositionView
        position="Layout Artist"
        applications={mockApplications}
        onSelectApplication={onSelect}
        activeTab="Stream"
      />
    );

    const applicantItem = screen.getByText(/Jane Doe submitted a new application/i);
    fireEvent.click(applicantItem);

    expect(onSelect).toHaveBeenCalledWith(mockApplications[0]);
  });
});
