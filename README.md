# run-gist

Run a GitHub gist. This looks for supported code files in the gist and executes it. In the future, it can hopefully run more languages and handle larger projects.

### Examples

- HTML: <https://ggorlen.github.io/run-gist/?id=1234f531e250c4858ee45e650946ab22>
- Python: <https://ggorlen.github.io/run-gist/?id=1811236>
- Python with deps: <https://ggorlen.github.io/run-gist/?id=35e3f829ded6d826626762da50b7a003>
- JS: <https://ggorlen.github.io/run-gist/?id=faf38135846db5a1a93a69875dd0761d>
- Lua: <https://ggorlen.github.io/run-gist/?id=b420d1ecc60ad6ec44e5>
- Perl: <https://ggorlen.github.io/run-gist/?id=5820275>
- Ruby: <https://ggorlen.github.io/run-gist/?id=d7cab2f5d98307909f3e53cbf61ffdce>
- PHP: <https://ggorlen.github.io/run-gist/?id=bf0fb63432a90c3de93a427f013bd2af>
- SQLite: <https://ggorlen.github.io/run-gist/?id=d25dcbe8cd0e6982d3f315dfd298034a&lang=sqlite>
- Postgres: <https://ggorlen.github.io/run-gist/?id=d25dcbe8cd0e6982d3f315dfd298034a&lang=postgres>
- Markdown: <https://ggorlen.github.io/run-gist/?id=8eccfe543a74717b13703cf7a2e03679>
- TypeScript: <https://ggorlen.github.io/run-gist/?id=ea91750c08ee2de80f8a4176bed85623>

Not yet fully working:
- Text: <https://ggorlen.github.io/run-gist/?id=35e3f829ded6d826626762da50b7a003&file=requirements.txt> (needs to infer lang from extension)
- R: <https://ggorlen.github.io/run-gist/?id=51f3bc251a47bce643b3f4c069ffccd3> (needs to print to DOM rather than just console)
- Scheme: <https://ggorlen.github.io/run-gist/?id=1854679> (no output)
- ClojureScript: <https://ggorlen.github.io/run-gist/?id=1343920> (no output)
- JSON: <https://ggorlen.github.io/run-gist/?id=5f5f8bd37428502cac6d960fabb30245> (poor color contrast)
- YAML: <https://ggorlen.github.io/run-gist/?id=1df3e721f732f958688c076674f81aee> (poor color contrast)

### TODO

- Parse and include CSS/JS files included from HTML
  - HTML/CSS/JS example to make work: <https://ggorlen.github.io/run-gist/?id=eedd8f9f754706347b63d2baa95ca73c>
- Add support for other WASM languages (might have to move away from no-build though)
  - https://meta.stackoverflow.com/a/394310/6243352 (thread has ClojureScript and Fengari)
  - [Run Python turtle in the browser with Skulpt](https://meta.stackoverflow.com/a/438047/6243352)
  - https://github.com/r-wasm/webr (works)
    - https://webr.sh/
  - shell scripting langs
  - assembly langs (need more attention)
    - SPIM I already have https://github.com/ggorlen/spimjs
  - <https://github.com/ocsigen/js_of_ocaml> (haven't tried)
  - https://github.com/Keno/julia-wasm (haven't tried)
  - https://popcorn.swmansion.com (haven't tried)
  - https://github.com/replit-archive/emscripted-ruby (wasn't able to get working on a quick spike)
  - https://github.com/Doridian/LuaJS (haven't tried, probably not needed since we're using Fengari)
  - https://www.spritely.institute/hoot/ (probably not necessary but listed just in case)
  - esolangs
  - Resources: [1](https://github.com/mbasso/awesome-wasm), [2](https://github.com/appcypher/awesome-wasm-langs)
- Could have it run files from github repos following similar patterns
- Maybe add a feature to [list all gists for a user](https://github.com/ggorlen/gist-list) and let them click one to open/exec/edit it. Better: just add a link to this run-gist app into that repo.
- Add editing/saving options. See [this repo](https://github.com/greggman/jsgist), [this project](https://scriptpad.dev/?id=ybqiqNVknx0aYPMCaTlJ&o=1&c=0) and [this repo](https://github.com/gist-run/gist-run) for inspiration.
- Options to open in new window or replace current, optionally keep run gist header bar
- Consider escaping or rendering HTML characters from Python scripts
  - Theoretically could follow this further to make web apps with backend languages
- Load Pyodide packages with [micropip](https://micropip.pyodide.org/en/v0.7.1/project/api.html#micropip.install)
- Try sandboxed JS execution with [quickjs](https://github.com/justjake/quickjs-emscripten?tab=readme-ov-file#using-in-the-browser-without-a-build-step)
- infinite loop detection?
- https://news.ycombinator.com/item?id=46762150 browser is the sandbox
- could run code blocks within markdown file?
- add a way to execute a gist locally?
- add e2e tests that run every month to check for regressions, or maybe even an action to find version bumps

### Similar tools

- https://gist.cafe/
- https://www.pythonanywhere.com/gists/
- https://github.com/gist-run/gist-run
- https://www.jspad.dev/
- https://github.com/greggman/jsgist
