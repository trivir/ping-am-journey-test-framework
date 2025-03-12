import { test, describe } from "vitest";
import { authId, description, header, successUrl } from "../response";
import { assertThat, not } from "hamjest";

describe("Response Matcher unit tests", () => {
  describe("authId unit tests", () => {
    test("Should match if the authId property is defined", () => {
      const mockResponse = {
        authId: "authIdString",
      };
      assertThat(mockResponse, authId());
    });
    test("Should match if the expected authId value is found", () => {
      const mockResponse = {
        authId: "authIdString",
      };
      assertThat(mockResponse, authId("authIdString"));
    });
    test("Should not match if the expected authId value is not found", () => {
      const mockResponse = {
        authId: "authIdString",
      };
      assertThat(mockResponse, not(authId("differentString")));
    });
    test("Should not match if the expected authId value is an empty string", () => {
      const mockResponse = {
        authId: "authIdString",
      };
      assertThat(mockResponse, not(authId("")));
    });
    test("Should not match if the authId property is not defined", () => {
      const mockResponse = {
        test: "authIdString",
      };
      assertThat(mockResponse, not(authId()));
    });
  });
  describe("successUrl unit tests", () => {
    test("Should match if the successUrl property is defined", () => {
      const mockResponse = {
        successUrl: "successUrlString",
      };
      assertThat(mockResponse, successUrl());
    });
    test("Should match if the expected successUrl property is found", () => {
      const mockResponse = {
        successUrl: "successUrlString",
      };
      assertThat(mockResponse, successUrl("successUrlString"));
    });
    test("Should not match if the expected sucessUrl value is not found", () => {
      const mockResponse = {
        successUrl: "successUrlString",
      };
      assertThat(mockResponse, not(successUrl("differentUrl")));
    });
    test("Should not match if the expected sucessUrl value is an empty string", () => {
      const mockResponse = {
        successUrl: "successUrlString",
      };
      assertThat(mockResponse, not(successUrl("")));
    });
    test("Should not match if the sucessUrl property is not defined", () => {
      const mockResponse = {
        test: "teststring",
      };
      assertThat(mockResponse, not(successUrl()));
    });
  });
  describe("description unit tests", () => {
    test("Should match if the description property is defined", () => {
      const mockResponse = {
        description: "description string",
      };
      assertThat(mockResponse, description());
    });
    test("Should match if the expected description property is found", () => {
      const mockResponse = {
        description: "description string",
      };
      assertThat(mockResponse, description("description string"));
    });
    test("Should not match if the expected description value is not found", () => {
      const mockResponse = {
        description: "description string",
      };
      assertThat(mockResponse, not(description("differentUrl")));
    });
    test("Should not match if the expected description value is an empty string", () => {
      const mockResponse = {
        description: "description string",
      };
      assertThat(mockResponse, not(description("")));
    });
    test("Should not match if the description property is not defined", () => {
      const mockResponse = {
        test: "teststring",
      };
      assertThat(mockResponse, not(description()));
    });
  });
  describe("header unit tests", () => {
    test("Should match if the header property is defined", () => {
      const mockResponse = {
        header: "header string",
      };
      assertThat(mockResponse, header());
    });
    test("Should match if the expected header property is found", () => {
      const mockResponse = {
        header: "header string",
      };
      assertThat(mockResponse, header("header string"));
    });
    test("Should not match if the expected header value is not found", () => {
      const mockResponse = {
        header: "header string",
      };
      assertThat(mockResponse, not(header("differentUrl")));
    });
    test("Should not match if the expected header value is an empty string", () => {
      const mockResponse = {
        header: "header string",
      };
      assertThat(mockResponse, not(header("")));
    });
    test("Should not match if the header property is not defined", () => {
      const mockResponse = {
        test: "teststring",
      };
      assertThat(mockResponse, not(header()));
    });
  });
});
