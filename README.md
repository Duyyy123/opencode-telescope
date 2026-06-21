# opencode-telescope

A Neovim Telescope-like fuzzy finder for your OpenCode conversations.

Grep through all your sessions with live preview — find any message, code snippet, or response instantly.

## Features

- **Fuzzy grep** — search across all sessions by message text
- **Live preview** — preview the matched conversation before opening
- **Find & jump** — select a result and jump straight to that session
- **Neovim Telescope-style UX** — familiar `<leader>f` keybind and `/telescope` command

## Installation

Add the plugin to your `tui.json`:

```jsonc
{
  "plugin": ["@bojackduy/opencode-telescope"],
}
```

> To use it from a local clone:
>
> ```jsonc
> "plugin": ["./path/to/opencode-telescope"]
> ```

## Usage

| Action | Key / Command |
|--------|--------------|
| Open search | `<leader>f` or `/telescope` |
| Type to filter | Fuzzy match against conversation text |
| Navigate results | `↑` / `↓` or `Ctrl+j` / `Ctrl+k` |
| Preview | Select a result to see the conversation preview |
| Open | Press `Enter` to jump to the selected session |

## How it works

Reads the OpenCode local SQLite session database in read-only mode, parses conversations into searchable text, and opens the selected session through the existing TUI route.
