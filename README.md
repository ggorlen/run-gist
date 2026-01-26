# run-gist

Run a GitHub gist. This looks for supported code files in the gist and executes it. In the future, it can hopefully run more languages and handle larger projects.

### Examples

- HTML file: <https://ggorlen.github.io/run-gist/?id=1234f531e250c4858ee45e650946ab22>
- Python script: <https://ggorlen.github.io/run-gist/?id=1811236>
- Python script with deps: <https://ggorlen.github.io/run-gist/?id=35e3f829ded6d826626762da50b7a003>
- JS script: <https://ggorlen.github.io/run-gist/?id=faf38135846db5a1a93a69875dd0761d>
- Lua script: <https://ggorlen.github.io/run-gist/?id=b420d1ecc60ad6ec44e5>

### TODO

- Parse and include CSS/JS files included from HTML
  - HTML/CSS/JS example to make work: <https://ggorlen.github.io/run-gist/?id=eedd8f9f754706347b63d2baa95ca73c>
  - Render markdown with marked
  - Render JSON/plain text preformatted
- Add support for other WASM languages (might have to move away from no-build though)
  - https://meta.stackoverflow.com/a/394310/6243352 (thread has ClojureScript and Fengari)
  - [Run Python turtle in the browser with Skulpt](https://meta.stackoverflow.com/a/438047/6243352)
  - https://github.com/seanmorris/php-wasm ([works](https://meta.stackoverflow.com/a/438047/6243352), although there's no obvious way to eval PHP in JS, so [this](https://github.com/oraoto/pib/tree/gh-pages) may be needed)
  - https://github.com/r-wasm/webr (works)
    - https://webr.sh/
  - https://github.com/replit-archive/emscripted-ruby (wasn't able to get working on a quick spike)
  - sqlite (works)
  - postgres (works)
  - assembly langs (need more attention)
  - https://github.com/haukex/webperl (works)
  - TS (works, except no errors)
  - <https://github.com/ocsigen/js_of_ocaml> (haven't tried)
  - https://github.com/Keno/julia-wasm (haven't tried)
  - https://github.com/Doridian/LuaJS (haven't tried)
  - https://popcorn.swmansion.com (haven't tried)
  - esolangs
  - Resources: [1](https://github.com/mbasso/awesome-wasm), [2](https://github.com/appcypher/awesome-wasm-langs)
- have an optional query param for which file/lang to run
- Could have it run files from github repos following similar patterns
- Maybe add a feature to [list all gists for a user](https://github.com/ggorlen/gist-list) and let them click one to open/exec/edit it. Better: just add a link to this run-gist app into that repo.
- Add editing/saving options. See [this repo](https://github.com/greggman/jsgist?tab=readme-ov-file), [this project](https://scriptpad.dev/?id=ybqiqNVknx0aYPMCaTlJ&o=1&c=0) and [this repo](https://github.com/gist-run/gist-run) for inspiration.
- Options to open in new window or replace current, optionally keep run gist header bar
- Consider escaping or rendering HTML characters from Python scripts
  - Theoretically could follow this further to make web apps with backend languages
- Load Pyodide packages with [micropip](https://micropip.pyodide.org/en/v0.7.1/project/api.html#micropip.install)
- Upgrade Lua VM to [Fengari](https://stackoverflow.com/a/79876021/6243352)
  - `console.log(fengari.load(luaCode)());`
- Try sandboxed JS execution with [quickjs](https://github.com/justjake/quickjs-emscripten?tab=readme-ov-file#using-in-the-browser-without-a-build-step)
- Move Pyodide and other large script tags out of the base index file and lazy-load them
- maybe have option to run gist within the same page, so there's a little banner to run another gist?
- infinite loop detection?
- https://news.ycombinator.com/item?id=46762150 browser is the sandbox
- add a way to execute a gist locally?
- add e2e tests that run every month to check for regressions, or maybe even an action to find version bumps

### Similar tools

- https://www.pythonanywhere.com/gists/
- gist.cafe
- (someone I follow, maybe potch, has a similar project I need to find here)
