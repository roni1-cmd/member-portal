import { describe, it, expect, vi } from "vitest";
import Admin from "../pages/Admin";

vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    functions: {
      invoke: vi.fn().mockResolvedValue({ data: [], error: null }),
    },
  },
}));

describe("Admin component", () => {
  it("is defined", () => {
    expect(Admin).toBeDefined();
  });
});
