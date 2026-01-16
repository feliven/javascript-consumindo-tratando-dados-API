import { describe, it, expect, beforeEach, afterEach, jest } from "@jest/globals";
import { VideosAPI } from "../scripts/ts/obterVideos";
import type { Video } from "../scripts/ts/Video";

// Mock fetch globally
const mockFetch = jest.fn() as jest.MockedFunction<typeof fetch>;
globalThis.fetch = mockFetch;

describe("VideosAPI", () => {
  let videosAPI: VideosAPI;

  beforeEach(() => {
    videosAPI = new VideosAPI();
    jest.clearAllMocks();
    jest.spyOn(console, "log").mockImplementation(() => {});
    jest.spyOn(console, "warn").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("obterVideosDaAPI", () => {
    it("should handle network errors", async () => {
      mockFetch.mockRejectedValueOnce(new Error("Network error"));

      await expect(videosAPI.obterVideosDaAPI()).rejects.toThrow("Network error");
      expect(console.error).toHaveBeenCalledWith("Erro ao buscar vídeos:", expect.any(Error));
    });

    it("should handle empty array response", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => [],
      } as Response);

      const result = await videosAPI.obterVideosDaAPI();

      expect(result).toEqual([]);
      expect(console.warn).not.toHaveBeenCalled();
    });

    it("should handle null response from API", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => null,
      } as Response);

      await expect(videosAPI.obterVideosDaAPI()).rejects.toThrow("Nenhum vídeo foi encontrado.");
    });

    it("should handle undefined response from API", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => undefined,
      } as Response);

      await expect(videosAPI.obterVideosDaAPI()).rejects.toThrow("Nenhum vídeo foi encontrado.");
    });

    it("should handle videos with partial missing fields", async () => {
      const partialVideos: Partial<Video>[] = [
        {
          id: 9,
          titulo: "Valid Title",
          descricao: "Valid Description",
          url: "",
          imagem: "https://example.com/image.jpg",
          categoria: "Valid Category",
        },
        {
          id: 10,
          titulo: "Another Valid Title",
          descricao: "",
          url: "https://example.com/video.mp4",
          imagem: "",
          categoria: "Valid Category",
        },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => partialVideos,
      } as Response);

      const result = await videosAPI.obterVideosDaAPI();

      expect(result).toHaveLength(2);
      expect(result[0]).toBeDefined();
      expect(result[0]?.url).toBe("https://placehold.co/700x400/lightgrey/black?text=[Erro+ao+carregar+vídeo]");
      expect(result[1]).toBeDefined();
      expect(result[1]?.descricao).toBe("[Erro ao carregar descrição]");
      expect(result[1]?.imagem).toContain("data:image/svg+xml");
      expect(console.warn).toHaveBeenCalledTimes(2);
    });

    it("should handle mixed valid and invalid videos in array", async () => {
      const mixedVideos: Partial<Video>[] = [
        {
          id: 14,
          titulo: "Complete Video",
          descricao: "Complete Description",
          url: "https://example.com/video.mp4",
          imagem: "https://example.com/image.jpg",
          categoria: "Category",
        },
        {
          id: 15,
          titulo: "",
          descricao: "Partial Description",
          url: "",
          imagem: "",
          categoria: "Category",
        },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mixedVideos,
      } as Response);

      const result = await videosAPI.obterVideosDaAPI();

      expect(result).toHaveLength(2);
      expect(result[0]).toBeDefined();
      expect(result[0]?.titulo).toBe("Complete Video");
      expect(result[1]).toBeDefined();
      expect(result[1]?.titulo).toBe("[Erro ao carregar título]");
      expect(result[1]?.url).toBe("https://placehold.co/700x400/lightgrey/black?text=[Erro+ao+carregar+vídeo]");
      expect(result[1]?.imagem).toContain("data:image/svg+xml");
      expect(console.warn).toHaveBeenCalledTimes(1);
    });

    it("should handle video with empty string url and null imagem", async () => {
      const video: Partial<Video> = {
        id: 16,
        titulo: "Test Video",
        descricao: "Test Description",
        url: "",
        imagem: null as any,
        categoria: "Test Category",
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => [video],
      } as Response);

      const result = await videosAPI.obterVideosDaAPI();

      expect(result).toHaveLength(1);
      expect(result[0]).toBeDefined();
      expect(result[0]?.url).toBe("https://placehold.co/700x400/lightgrey/black?text=[Erro+ao+carregar+vídeo]");
      expect(result[0]?.imagem).toContain("data:image/svg+xml");
      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining("Vídeo de id 16 com campo(s) ausente(s): url, imagem")
      );
    });

    it("should not modify videos with all valid fields", async () => {
      const validVideos: Video[] = [
        {
          id: 12,
          titulo: "Complete Video 1",
          descricao: "Complete Description 1",
          url: "https://example.com/video1.mp4",
          imagem: "https://example.com/image1.jpg",
          categoria: "Category 1",
        },
        {
          id: 13,
          titulo: "Complete Video 2",
          descricao: "Complete Description 2",
          url: "https://example.com/video2.mp4",
          imagem: "https://example.com/image2.jpg",
          categoria: "Category 2",
        },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => validVideos,
      } as Response);

      const result = await videosAPI.obterVideosDaAPI();

      expect(result).toEqual(validVideos);
      expect(console.warn).not.toHaveBeenCalled();
    });

    it("should handle 0 as valid id", async () => {
      const videoWithZeroId: Partial<Video> = {
        id: 0,
        titulo: "",
        descricao: "Valid Description",
        url: "https://example.com/video.mp4",
        imagem: "https://example.com/image.jpg",
        categoria: "Valid Category",
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => [videoWithZeroId],
      } as Response);

      const result = await videosAPI.obterVideosDaAPI();

      expect(result[0]).toBeDefined();
      expect(result[0]!.titulo).toBe("[Erro ao carregar título]");
      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining("Vídeo de id 0 com campo(s) ausente(s): titulo")
      );
    });

    it("should handle 404 status code", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      } as Response);

      await expect(videosAPI.obterVideosDaAPI()).rejects.toThrow("HTTP 404");
      expect(console.error).toHaveBeenCalledWith("Erro ao buscar vídeos:", expect.any(Error));
    });

    it("should fetch and return videos successfully", async () => {
      const mockVideos: Video[] = [
        {
          id: 1,
          titulo: "Test Video",
          descricao: "Test Description",
          url: "https://example.com/video.mp4",
          imagem: "https://example.com/image.jpg",
          categoria: "Test Category",
        },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockVideos,
      } as Response);

      const result = await videosAPI.obterVideosDaAPI();

      expect(fetch).toHaveBeenCalledWith("http://localhost:3000/videos");
      expect(result).toEqual(mockVideos);
      expect(console.log).toHaveBeenCalledWith("videos:", mockVideos);
    });

    it("should handle different HTTP error status codes", async () => {
      const statusCodes = [400, 401, 403, 500, 503];

      for (const status of statusCodes) {
        jest.clearAllMocks();
        mockFetch.mockResolvedValueOnce({
          ok: false,
          status,
        } as Response);

        await expect(videosAPI.obterVideosDaAPI()).rejects.toThrow(`HTTP ${status}`);
      }
    });

    it("should handle large number of videos", async () => {
      const largeVideoSet = Array.from({ length: 100 }, (_, i) => ({
        id: i + 1,
        titulo: `Video ${i + 1}`,
        descricao: `Description ${i + 1}`,
        url: `https://example.com/video${i + 1}.mp4`,
        imagem: `https://example.com/image${i + 1}.jpg`,
        categoria: `Category ${i % 5}`,
      }));

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => largeVideoSet,
      } as Response);

      const result = await videosAPI.obterVideosDaAPI();

      expect(result).toHaveLength(100);
      expect(console.warn).not.toHaveBeenCalled();
    });

    it("should handle 0 as valid id", async () => {
      const videoWithZeroId: Partial<Video> = {
        id: 0,
        titulo: "",
        descricao: "Valid Description",
        url: "https://example.com/video.mp4",
        imagem: "https://example.com/image.jpg",
        categoria: "Valid Category",
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => [videoWithZeroId],
      } as Response);

      const result = await videosAPI.obterVideosDaAPI();

      expect(result[0]).toBeDefined();
      expect(result[0]!.titulo).toBe("[Erro ao carregar título]");
      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining("Vídeo de id 0 com campo(s) ausente(s): titulo")
      );
    });

    it("should handle negative id values", async () => {
      const videoWithNegativeId: Partial<Video> = {
        id: -1,
        titulo: "Test Video",
        descricao: "",
        url: "https://example.com/video.mp4",
        imagem: "https://example.com/image.jpg",
        categoria: "Test Category",
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => [videoWithNegativeId],
      } as Response);

      const result = await videosAPI.obterVideosDaAPI();

      expect(result[0]).toBeDefined();
      expect(result[0]!.descricao).toBe("[Erro ao carregar descrição]");
      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining("Vídeo de id -1 com campo(s) ausente(s): descricao")
      );
    });

    it("should handle videos with numeric string values instead of proper strings", async () => {
      const videoWithNumericStrings: Partial<Video> = {
        id: 17,
        titulo: "123",
        descricao: "456",
        url: "https://example.com/video.mp4",
        imagem: "https://example.com/image.jpg",
        categoria: "789",
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => [videoWithNumericStrings],
      } as Response);

      const result = await videosAPI.obterVideosDaAPI();

      expect(result[0]).toBeDefined();
      expect(result[0]!.titulo).toBe("123");
      expect(result[0]!.descricao).toBe("456");
      expect(result[0]!.categoria).toBe("789");
      expect(console.warn).not.toHaveBeenCalled();
    });

    it("should handle special characters in string fields", async () => {
      const videoWithSpecialChars: Video = {
        id: 18,
        titulo: "Test <>&\"' Video",
        descricao: "Description with émojis 🎥📹",
        url: "https://example.com/video.mp4?param=value&other=123",
        imagem: "https://example.com/image.jpg#fragment",
        categoria: "Category/Subcategory",
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => [videoWithSpecialChars],
      } as Response);

      const result = await videosAPI.obterVideosDaAPI();

      expect(result[0]).toBeDefined();
      expect(result[0]!.titulo).toBe("Test <>&\"' Video");
      expect(result[0]!.descricao).toContain("émojis 🎥📹");
      expect(console.warn).not.toHaveBeenCalled();
    });

    it("should handle very long string values", async () => {
      const longString = "A".repeat(10000);
      const videoWithLongStrings: Video = {
        id: 19,
        titulo: longString,
        descricao: longString,
        url: "https://example.com/video.mp4",
        imagem: "https://example.com/image.jpg",
        categoria: longString,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => [videoWithLongStrings],
      } as Response);

      const result = await videosAPI.obterVideosDaAPI();

      expect(result[0]).toBeDefined();
      expect(result[0]!.titulo).toHaveLength(10000);
      expect(result[0]!.descricao).toHaveLength(10000);
      expect(console.warn).not.toHaveBeenCalled();
    });

    it("should handle multiple videos with mixed missing fields", async () => {
      const mixedVideos: Partial<Video>[] = [
        { id: 20, titulo: "Video 1", descricao: "", url: "", imagem: "", categoria: "" },
        { id: 21, titulo: "", descricao: "Desc 2", url: "https://example.com/v2.mp4", imagem: "", categoria: "" },
        { id: 22, titulo: "", descricao: "", url: "", imagem: "https://example.com/i3.jpg", categoria: "Cat 3" },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mixedVideos,
      } as Response);

      const result = await videosAPI.obterVideosDaAPI();

      expect(result).toHaveLength(3);
      expect(result[0]).toBeDefined();
      expect(result[0]!.titulo).toBe("Video 1");
      expect(result[0]!.descricao).toBe("[Erro ao carregar descrição]");
      expect(result[1]).toBeDefined();
      expect(result[1]!.titulo).toBe("[Erro ao carregar título]");
      expect(result[1]!.descricao).toBe("Desc 2");
      expect(result[2]).toBeDefined();
      expect(result[2]!.imagem).toBe("https://example.com/i3.jpg");
      expect(console.warn).toHaveBeenCalledTimes(3);
    });

    it("should handle 404 status code", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      } as Response);

      await expect(videosAPI.obterVideosDaAPI()).rejects.toThrow("HTTP 404");
      expect(console.error).toHaveBeenCalledWith("Erro ao buscar vídeos:", expect.any(Error));
    });
  });
});
