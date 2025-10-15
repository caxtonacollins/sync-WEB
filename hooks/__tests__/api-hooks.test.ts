import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFiatAccounts, useTransactions, useUsers } from "../api";
import { api } from "@/lib/api-client";
import { ReactNode } from "react";

// Mock the API client
jest.mock("@/lib/api-client", () => ({
  api: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
  },
}));

describe("API Hooks", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
  });

  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  describe("useFiatAccounts", () => {
    it("should fetch fiat accounts", async () => {
      const mockData = [
        {
          id: "1",
          accountNumber: "1234567890",
          accountName: "Test Account",
        },
      ];

      (api.get as jest.Mock).mockResolvedValueOnce({ data: mockData });

      const { result } = renderHook(() => useFiatAccounts(), { wrapper });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual(mockData);
    });
  });

  describe("useTransactions", () => {
    it("should fetch transactions", async () => {
      const mockData = [
        {
          id: "1",
          amount: 100,
          type: "DEPOSIT",
        },
      ];

      (api.get as jest.Mock).mockResolvedValueOnce({ data: mockData });

      const { result } = renderHook(() => useTransactions(), { wrapper });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual(mockData);
    });
  });

  describe("useUsers", () => {
    it("should fetch users", async () => {
      const mockData = [
        {
          id: "1",
          email: "test@example.com",
          firstName: "Test",
          lastName: "User",
        },
      ];

      (api.get as jest.Mock).mockResolvedValueOnce({ data: mockData });

      const { result } = renderHook(() => useUsers(), { wrapper });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual(mockData);
    });
  });
});
