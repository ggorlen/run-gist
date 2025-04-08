# run-gist

Run a GitHub gist. This looks for an .html, .py or .js file in the gist and executes it. In the future, it can hopefully run more languages and handle larger projects.

### Examples

- Single HTML file: <https://ggorlen.github.io/run-gist/?id=1234f531e250c4858ee45e650946ab22>
- Simple Python script: <https://ggorlen.github.io/run-gist/?id=1811236>
- Python script with deps: <https://ggorlen.github.io/run-gist/?id=35e3f829ded6d826626762da50b7a003>
- Simple JS script: <https://ggorlen.github.io/run-gist/?id=faf38135846db5a1a93a69875dd0761d>
- Simple Lua script: <https://ggorlen.github.io/run-gist/?id=b420d1ecc60ad6ec44e5>

### TODO

- Parse and include CSS/JS files included from HTML
  - HTML/CSS/JS example to make work: <https://ggorlen.github.io/run-gist/?id=eedd8f9f754706347b63d2baa95ca73c>
  - Render markdown with marked
  - Render JSON/plain text preformatted
- Add support for other WASM languages like Lua, PHP, C, etc (might have to move away from no-build though)
- Could have it run files from github repos following similar patterns
- Maybe add a feature to [list all gists for a user](https://github.com/ggorlen/gist-list) and let them click one to open/exec/edit it.
- Add editing/saving options. See [this repo](https://github.com/greggman/jsgist?tab=readme-ov-file) and [this repo](https://github.com/gist-run/gist-run) for inspiration.
- Options to open in new window or replace current, optionally keep run gist header bar
- Consider escaping or rendering HTML characters from Python scripts
  - Theoretically could follow this further to make web apps with backend languages
- Could try to get turtle running in the browser, a la [this](https://stackoverflow.com/questions/69326598/running-python-3-turtle-programs-in-the-browser)
- Load Pyodide packages with [micropip](https://micropip.pyodide.org/en/v0.7.1/project/api.html#micropip.install)
- Upgrade Lua VM to Fengari
