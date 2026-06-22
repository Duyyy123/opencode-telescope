import { describe, expect, test } from "bun:test"
import { extractSearchText, makeSnippet, rowToSearchResult } from "./search"

describe("session search helpers", () => {
  test("extracts user message text", () => {
    expect(extractSearchText(JSON.stringify({ text: "hello validateSession world" }))).toContain("validateSession")
  })

  test("extracts assistant content text", () => {
    expect(
      extractSearchText(
        JSON.stringify({
          content: [
            { type: "reasoning", text: "thinking" },
            { type: "text", text: "call validateSession before returning" },
          ],
        }),
      ),
    ).toContain("validateSession")
  })

  test("builds focused snippets", () => {
    expect(makeSnippet("a ".repeat(100) + "needle" + " b".repeat(100), "needle")).toContain("needle")
  })

  test("builds match excerpts without duplicating match text", () => {
    const result = rowToSearchResult(
      {
        id: "prt_1",
        message_id: "msg_1",
        session_id: "ses_1",
        session_title: "Test",
        directory: "/tmp/project",
        role: "assistant",
        time_created: 1,
        text: "Scoped search for help returns relevant rows.",
      },
      "help",
    )
    expect(`${result?.before}${result?.match}${result?.after}`).toBe("Scoped search for help returns relevant rows.")
  })

  test("drops rows whose parsed text does not match", () => {
    expect(
      rowToSearchResult(
        {
          id: "prt_1",
          message_id: "msg_1",
          session_id: "ses_1",
          session_title: "Test",
          directory: "/tmp/project",
          role: "user",
          time_created: 1,
          text: "hello",
        },
        "missing",
      ),
    ).toBeUndefined()
  })

  test("matches multi-token queries in order (contiguous)", () => {
    const result = rowToSearchResult(
      {
        id: "prt_2",
        message_id: "msg_2",
        session_id: "ses_2",
        session_title: "Test",
        directory: "/tmp/project",
        role: "assistant",
        time_created: 2,
        text: "let me test this function",
      },
      "let me",
    )
    expect(result).toBeDefined()
    expect(result!.match).toBe("let me")
    expect(result!.before).not.toContain("let")
    expect(result!.after).toContain("test")
  })

  test("matches multi-token queries with words between (ordered gap)", () => {
    const result = rowToSearchResult(
      {
        id: "prt_3",
        message_id: "msg_3",
        session_id: "ses_3",
        session_title: "Test",
        directory: "/tmp/project",
        role: "assistant",
        time_created: 3,
        text: "let us now test me please",
      },
      "let me",
    )
    expect(result).toBeDefined()
    expect(result!.match).toBe("let us now test me")
  })

  test("rejects multi-token queries when tokens are out of order", () => {
    expect(
      rowToSearchResult(
        {
          id: "prt_4",
          message_id: "msg_4",
          session_id: "ses_4",
          session_title: "Test",
          directory: "/tmp/project",
          role: "user",
          time_created: 4,
          text: "me let",
        },
        "let me",
      ),
    ).toBeUndefined()
  })

  test("makeSnippet works with multi-token queries", () => {
    const text = "a ".repeat(50) + "let me test" + " b".repeat(50)
    const snippet = makeSnippet(text, "let me")
    expect(snippet).toContain("let")
    expect(snippet).toContain("me")
  })
})
