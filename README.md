# run-gist

Run a GitHub gist. For now, this looks for an .html, .py or .js file and executes it. In the future, it can hopefully run more languages and handle larger projects.

### TODO

- Parse and include CSS/JS files included from HTML
  - if there is no HTML file, but there is a JS file, run it and show output.
  - render markdown with marked
  - render JSON
  - otherwise just show the text (preformatted?)
  - Run different languages with WASM?
  - Handle requirements.txt following [this](https://stackoverflow.com/questions/62148386/python-in-browser-with-webassembly-without-recompilation/79486695#79486695) or [this](https://stackoverflow.com/questions/79115163/setup-to-get-the-python-output-displayed-line-by-line-during-execution)
- maybe add a feature to list all gists for a user and let them click one to open/exec it.
- options to open in new window or replace current, optionally keep run gist header bar
- add editing/saving options. See [this repo](https://github.com/greggman/jsgist?tab=readme-ov-file) for inspiration.
