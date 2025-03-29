# run-gist

Run a GitHub gist. For now, this looks for an .html file and executes it. In the future, it can hopefully build larger sites and render non-executable files appropriately.

### TODO

- pull down JS/CSS files in repo
  - if there is no HTML file, but there is a JS file, run it and show output.
  - render markdown with marked
  - render JSON
  - otherwise just show the text (preformatted?)
  - Run Python, C, etc with wasm?
    - [Pyodide](https://pyodide.org/en/0.27.4/usage/quickstart.html) and [this](https://stackoverflow.com/questions/62148386/python-in-browser-with-webassembly-without-recompilation/79486695#79486695)
- maybe add a feature to list all gists for a user and let them click one to open/exec it.
- options to open in new window or replace current, optionally keep run gist header bar
- add saving options. See [this repo](https://github.com/greggman/jsgist?tab=readme-ov-file) for inspiration.
