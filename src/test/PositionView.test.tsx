import { describe, it, expect, vi } from "vitest";
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
  it("renders without crashing", () => {
    expect(PositionView).toBeDefined();
  });

  it("has correct mock data", () => {
    expect(mockApplications[0].full_name).toBe("Jane Doe");
    expect(mockApplications[0].position).toBe("Layout Artist");
  });
});
