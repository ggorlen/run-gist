const loadScript = (() => {
  const loaded = new Map();
  return (src) => {
    if (!loaded.has(src)) {
      loaded.set(
        src,
        new Promise((resolve, reject) => {
          const script = document.createElement("script");
          script.src = src;
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        }),
      );
    }
    return loaded.get(src);
  };
})();

const runHTML = async (html) => {
  const el = document.querySelector("html");
  el.innerHTML = html;

  for (const oldScriptEl of el.querySelectorAll("script")) {
    const newScriptEl = document.createElement("script");
    [...oldScriptEl.attributes].forEach((attr) => {
      newScriptEl.setAttribute(attr.name, attr.value);
    });
    newScriptEl.textContent = oldScriptEl.textContent;

    if (newScriptEl.src) {
      await new Promise((resolve, reject) => {
        newScriptEl.onload = resolve;
        newScriptEl.onerror = reject;
        oldScriptEl.parentNode.replaceChild(newScriptEl, oldScriptEl);
      });
    } else {
      oldScriptEl.parentNode.replaceChild(newScriptEl, oldScriptEl);
    }
  }
};

const runJavaScript = (content) => {
  const el = document.querySelector("body");
  el.innerHTML = "<pre></pre>";
  const pre = el.querySelector("pre");
  const originalLog = console.log;
  const originalError = console.error;
  console.log = (...args) => {
    pre.textContent += `${args.join(" ")}\n`;
    originalLog.apply(console, args);
  };
  console.error = (...args) => {
    pre.textContent += `${args.join(" ")}\n`;
    originalError.apply(console, args);
  };
  try {
    eval(content);
  } catch (err) {
    console.error(err);
  }
  console.log = originalLog;
  console.error = originalError;
};

const runLua = async (content) => {
  const el = document.querySelector("body");
  el.innerHTML = "<pre></pre>";
  const pre = el.querySelector("pre");
  pre.textContent = "Loading Lua...\n";
  await loadScript("https://cdn.jsdelivr.net/npm/fengari-web@0.1.4/dist/fengari-web.js");
  pre.textContent = "";
  const originalLog = console.log;
  const originalError = console.error;
  console.log = (...args) => {
    pre.textContent += `${args.join(" ")}\n`;
    originalLog.apply(console, args);
  };
  console.error = (...args) => {
    pre.textContent += `${args.join(" ")}\n`;
    originalError.apply(console, args);
  };
  try {
    fengari.load(content)();
  } catch (err) {
    console.error(err);
  }
  console.log = originalLog;
  console.error = originalError;
};

const runPython = async (content, requirements) => {
  const el = document.querySelector("body");
  el.innerHTML = "<pre></pre>";
  const pre = el.querySelector("pre");
  pre.textContent = "Loading Pyodide...\n";
  await loadScript("https://cdn.jsdelivr.net/pyodide/v0.27.4/full/pyodide.js");
  const pyodide = await loadPyodide({
    stdout: (str) => {
      console.log(str);
      pre.textContent += `${str}\n`;
    },
    stderr: (str) => {
      console.error(str);
      pre.textContent += `${str}\n`;
    },
  });

  if (requirements) {
    const pkgs = requirements.split("\n").map((e) => e.split("=")[0]);
    await pyodide.loadPackage(pkgs, {
      messageCallback: (str) => {
        console.log(str);
        pre.textContent += `${str}\n`;
      },
      errorCallback: (str) => {
        console.error(str);
        pre.textContent += `${str}\n`;
      },
    });
  }

  await pyodide.loadPackagesFromImports(content, {
    messageCallback: (str) => {
      console.log(str);
      pre.textContent += `${str}\n`;
    },
    errorCallback: (str) => {
      console.error(str);
      pre.textContent += `${str}\n`;
    },
  });
  pre.textContent = "";

  try {
    pyodide.runPython(content);
  } catch (err) {
    console.error(err);
    pre.textContent += `${err.message}\n`;
  }
};

const runPerl = async (content) => {
  const el = document.querySelector("body");
  el.innerHTML = "<pre></pre>";
  const pre = el.querySelector("pre");
  pre.textContent = "Loading Perl...\n";

  await loadScript("https://webperlcdn.zero-g.net/v0.09-beta/webperl.js");

  Perl.noMountIdbfs = true;
  Perl.endAfterMain = true;
  Perl.output = (str) => {
    if (pre.textContent.startsWith("Loading")) {
      pre.textContent = "";
    }
    console.log(str);
    pre.textContent += str;
  };

  Perl.init(() => {
    try {
      FS.writeFile("/script.pl", content);
      Perl.start(["/script.pl"]);
    } catch (err) {
      console.error(err);
      pre.textContent += err.message + "\n";
    }
  });
};

const runRuby = async (content) => {
  const el = document.querySelector("body");
  el.innerHTML = "<pre></pre>";
  const pre = el.querySelector("pre");
  pre.textContent = "Loading Ruby...\n";

  const codeScript = document.createElement("script");
  codeScript.type = "text/ruby";
  codeScript.textContent = content;
  document.body.insertBefore(codeScript, pre);

  const originalLog = console.log;
  const originalWarn = console.warn;
  const originalError = console.error;
  const clearLoading = () => {
    if (pre.textContent.startsWith("Loading")) pre.textContent = "";
  };
  console.log = (...args) => {
    clearLoading();
    pre.textContent += args.join(" ") + "\n";
    originalLog.apply(console, args);
  };
  console.warn = (...args) => {
    originalWarn.apply(console, args);
  };
  console.error = (...args) => {
    clearLoading();
    pre.textContent += args.join(" ") + "\n";
    originalError.apply(console, args);
  };

  await loadScript(
    "https://cdn.jsdelivr.net/npm/@ruby/3.4-wasm-wasi@2.7.1/dist/browser.script.iife.js",
  );
};

const runPHP = async (content) => {
  const el = document.querySelector("body");
  el.innerHTML = "<pre></pre>";
  const pre = el.querySelector("pre");
  pre.textContent = "Loading PHP...\n";

  const codeScript = document.createElement("script");
  codeScript.type = "text/php";
  codeScript.setAttribute("data-stdout", "pre");
  codeScript.textContent = content;
  document.body.insertBefore(codeScript, pre);

  const originalLog = console.log;
  const originalError = console.error;
  const clearLoading = () => {
    if (pre.textContent.startsWith("Loading")) {
      pre.textContent = "";
    }
  };
  console.log = (...args) => {
    clearLoading();
    originalLog.apply(console, args);
  };
  console.error = (...args) => {
    clearLoading();
    pre.textContent += args.join(" ") + "\n";
    originalError.apply(console, args);
  };

  await loadScript("https://cdn.jsdelivr.net/npm/php-wasm@0.0.8/php-tags.jsdelivr.mjs");
};

const runR = async (content) => {
  const el = document.querySelector("body");
  el.innerHTML = "<pre></pre>";
  const pre = el.querySelector("pre");
  pre.textContent = "Loading R...\n";

  const { WebR } = await import("https://webr.r-wasm.org/latest/webr.mjs");
  const webR = new WebR();
  await webR.init();

  pre.textContent = "";

  const originalWarn = console.warn;
  console.warn = () => {};

  try {
    await webR.evalR(content);
  } catch (err) {
    console.error(err);
    pre.textContent += err.message + "\n";
  }

  console.warn = originalWarn;
};

const runScheme = async (content) => {
  const el = document.querySelector("body");
  el.innerHTML = "<pre id='bs-console'></pre>";
  const pre = el.querySelector("pre");
  pre.textContent = "Loading Scheme...\n";

  const codeScript = document.createElement("script");
  codeScript.type = "text/biwascheme";
  codeScript.textContent = content;
  document.body.insertBefore(codeScript, pre);

  const originalLog = console.log;
  const originalError = console.error;
  const clearLoading = () => {
    if (pre.textContent.startsWith("Loading")) pre.textContent = "";
  };
  console.log = (...args) => {
    clearLoading();
    originalLog.apply(console, args);
  };
  console.error = (...args) => {
    clearLoading();
    pre.textContent += args.join(" ") + "\n";
    originalError.apply(console, args);
  };

  await loadScript("https://cdn.jsdelivr.net/npm/biwascheme@0.8.3/release/biwascheme.js");
};

const runTypeScript = async (content) => {
  const el = document.querySelector("body");
  el.innerHTML = "<pre></pre>";
  const pre = el.querySelector("pre");
  pre.textContent = "Loading TypeScript...\n";

  await loadScript("https://cdn.jsdelivr.net/npm/typescript@5.7.3/lib/typescript.js");

  pre.textContent = "";

  const sourceFile = ts.createSourceFile("input.ts", content, ts.ScriptTarget.ES2020, true);
  const diagnostics = [];
  const host = {
    getSourceFile: (name) => (name === "input.ts" ? sourceFile : undefined),
    writeFile: () => {},
    getDefaultLibFileName: () => "lib.d.ts",
    useCaseSensitiveFileNames: () => false,
    getCanonicalFileName: (f) => f,
    getCurrentDirectory: () => "",
    getNewLine: () => "\n",
    fileExists: (f) => f === "input.ts",
    readFile: () => "",
  };
  const program = ts.createProgram(["input.ts"], { target: ts.ScriptTarget.ES2020 }, host);
  diagnostics.push(...ts.getPreEmitDiagnostics(program));

  if (diagnostics.length > 0) {
    const errors = diagnostics.map((d) => {
      if (d.file && d.start !== undefined) {
        const { line, character } = d.file.getLineAndCharacterOfPosition(d.start);
        return `(${line + 1},${character + 1}) ${ts.flattenDiagnosticMessageText(d.messageText, "\n")}`;
      }

      return ts.flattenDiagnosticMessageText(d.messageText, "\n");
    });
    const errText = errors.join("\n");
    console.error(errText);
    pre.textContent = errText + "\n\n";
  }

  const originalLog = console.log;
  const originalError = console.error;
  console.log = (...args) => {
    pre.textContent += args.join(" ") + "\n";
    originalLog.apply(console, args);
  };
  console.error = (...args) => {
    pre.textContent += args.join(" ") + "\n";
    originalError.apply(console, args);
  };

  try {
    const js = ts.transpileModule(content, {
      compilerOptions: { target: ts.ScriptTarget.ES2020 },
    }).outputText;
    eval(js);
  } catch (err) {
    console.error(err);
  }

  console.log = originalLog;
  console.error = originalError;
};

const runSQLite = async (content) => {
  const el = document.querySelector("body");
  el.innerHTML = "<pre></pre>";
  const pre = el.querySelector("pre");
  pre.textContent = "Loading SQLite...\n";

  await loadScript("https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.2/sql-wasm.js");

  const SQL = await initSqlJs({
    locateFile: (file) =>
      `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.2/${file}`,
  });
  const db = new SQL.Database();

  pre.textContent = "";

  try {
    const result = db.exec(content);
    const output = JSON.stringify(result, null, 2);
    console.log(result);
    pre.textContent = output;
  } catch (err) {
    console.error(err);
    pre.textContent = err.message;
  }
};

const runPostgres = async (content) => {
  const el = document.querySelector("body");
  el.innerHTML = "<pre></pre>";
  const pre = el.querySelector("pre");
  pre.textContent = "Loading Postgres...\n";

  const { PGlite } = await import(
    "https://cdn.jsdelivr.net/npm/@electric-sql/pglite@0.2.14/dist/index.js"
  );
  const db = new PGlite();

  pre.textContent = "";

  try {
    const result = await db.exec(content);
    const output = JSON.stringify(result, null, 2);
    console.log(result);
    pre.textContent = output;
  } catch (err) {
    console.error(err);
    pre.textContent = err.message;
  }
};

const renderDataWithJSON = async (data) => {
  const el = document.querySelector("body");
  el.innerHTML = "<div id='json-output'></div>";
  const container = el.querySelector("#json-output");

  await loadScript("https://cdn.jsdelivr.net/npm/renderjson@1.4.0/renderjson.min.js");

  renderjson.set_show_to_level(2);
  renderjson.set_icons("+", "-");

  console.log(data);
  container.appendChild(renderjson(data));

  if (!document.querySelector("#renderjson-styles")) {
    const style = document.createElement("style");
    style.id = "renderjson-styles";
    style.textContent = `
      #json-output { font-family: monospace; font-size: 14px; }
      .renderjson a { text-decoration: none; cursor: pointer; }
      .renderjson .disclosure { color: #888; margin-right: 4px; }
      .renderjson .string { color: #a31515; }
      .renderjson .number { color: #098658; }
      .renderjson .boolean { color: #0000ff; }
      .renderjson .key { color: #001080; }
      .renderjson .keyword { color: #0000ff; }
    `;
    document.head.appendChild(style);
  }
};

const runJSON = async (content) => {
  try {
    await renderDataWithJSON(JSON.parse(content));
  } catch (err) {
    console.error(err);
    document.body.innerHTML = `<pre>${err.message}</pre>`;
  }
};

const runText = (content) => {
  const el = document.querySelector("body");
  el.innerHTML = "<pre></pre>";
  const pre = el.querySelector("pre");
  console.log(content);
  pre.textContent = content;
};

const runClojureScript = async (content) => {
  const el = document.querySelector("body");
  el.innerHTML = "<pre></pre>";
  const pre = el.querySelector("pre");
  pre.textContent = "Loading ClojureScript...\n";

  const codeScript = document.createElement("script");
  codeScript.type = "application/x-scittle";
  codeScript.textContent = content;
  document.body.insertBefore(codeScript, pre);

  const originalLog = console.log;
  const originalError = console.error;
  const clearLoading = () => {
    if (pre.textContent.startsWith("Loading ClojureScript...")) {
      pre.textContent = "";
    }
  };
  console.log = (...args) => {
    clearLoading();
    pre.textContent += args.join(" ") + "\n";
    originalLog.apply(console, args);
  };
  console.error = (...args) => {
    clearLoading();
    pre.textContent += args.join(" ") + "\n";
    originalError.apply(console, args);
  };

  await loadScript("https://cdn.jsdelivr.net/npm/scittle@0.6.22/dist/scittle.js");
};

const runYAML = async (content) => {
  try {
    await loadScript("https://cdn.jsdelivr.net/npm/js-yaml@4.1.0/dist/js-yaml.min.js");
    await renderDataWithJSON(jsyaml.load(content));
  } catch (err) {
    console.error(err);
    document.body.innerHTML = `<pre>${err.message}</pre>`;
  }
};

const runMarkdown = async (content) => {
  const el = document.querySelector("body");
  el.innerHTML = "<article></article>";
  const article = el.querySelector("article");

  await loadScript("https://cdn.jsdelivr.net/npm/marked@12.0.0/marked.min.js");

  try {
    const html = marked.parse(content);
    console.log(content);
    article.innerHTML = html;
  } catch (err) {
    console.error(err);
    article.innerHTML = `<pre>${err.message}</pre>`;
  }

  const style = document.createElement("style");
  style.textContent = `
    article { max-width: 800px; margin: 0 auto; padding: 20px; font-family: system-ui, sans-serif; line-height: 1.6; }
    article pre { background: #f4f4f4; padding: 12px; overflow-x: auto; border-radius: 4px; }
    article code { background: #f4f4f4; padding: 2px 6px; border-radius: 3px; }
    article pre code { background: none; padding: 0; }
    article blockquote { border-left: 4px solid #ddd; margin-left: 0; padding-left: 16px; color: #666; }
    article table { border-collapse: collapse; width: 100%; }
    article th, article td { border: 1px solid #ddd; padding: 8px; text-align: left; }
    article th { background: #f4f4f4; }
  `;
  document.head.appendChild(style);
};

const languageRunners = {
  HTML: runHTML,
  JavaScript: runJavaScript,
  Lua: runLua,
  Python: runPython,
  Perl: runPerl,
  Ruby: runRuby,
  PHP: runPHP,
  R: runR,
  Scheme: runScheme,
  TypeScript: runTypeScript,
  SQL: runSQLite,
  SQLite: runSQLite,
  PLpgSQL: runPostgres,
  Postgres: runPostgres,
  Clojure: runClojureScript,
  ClojureScript: runClojureScript,
  JSON: runJSON,
  YAML: runYAML,
  Text: runText,
  Markdown: runMarkdown,
};

const languagePriority = [
  "Python",
  "TypeScript",
  "JavaScript",
  "Ruby",
  "Perl",
  "PHP",
  "Lua",
  "R",
  "Scheme",
  "Clojure",
  "SQL",
  "PLpgSQL",
  "HTML",
];

const langAliases = {
  python: "Python",
  py: "Python",
  typescript: "TypeScript",
  ts: "TypeScript",
  javascript: "JavaScript",
  js: "JavaScript",
  ruby: "Ruby",
  rb: "Ruby",
  perl: "Perl",
  pl: "Perl",
  php: "PHP",
  lua: "Lua",
  r: "R",
  scheme: "Scheme",
  scm: "Scheme",
  sql: "SQL",
  sqlite: "SQLite",
  postgres: "Postgres",
  postgresql: "Postgres",
  plpgsql: "PLpgSQL",
  html: "HTML",
  clojurescript: "ClojureScript",
  clojure: "ClojureScript",
  cljs: "ClojureScript",
  json: "JSON",
  yaml: "YAML",
  yml: "YAML",
  text: "Text",
  txt: "Text",
  plain: "Text",
  markdown: "Markdown",
  md: "Markdown",
};

const runGist = async (gistId, options = {}) => {
  const { file, lang } = options;
  const errEl = document.querySelector(".error");

  const response = await fetch(`https://api.github.com/gists/${gistId}`);
  const data = await response.json();

  if (!response.ok) {
    console.error(data);
    errEl.textContent = data.message;
    return;
  }

  let targetFile;
  if (file) {
    targetFile = Object.values(data.files).find((f) => f.filename === file);
    if (!targetFile) {
      errEl.textContent = `File "${file}" not found in gist`;
      return;
    }
  } else {
    const sortedFiles = Object.values(data.files).sort((a, b) => {
      const aPri = languagePriority.indexOf(a.language);
      const bPri = languagePriority.indexOf(b.language);
      return (aPri === -1 ? Infinity : aPri) - (bPri === -1 ? Infinity : bPri);
    });
    targetFile = sortedFiles.find((f) => languageRunners[f.language]);
  }

  if (!targetFile) {
    errEl.textContent = "No supported runnable files found in gist";
    return;
  }

  const runnerKey = lang ? langAliases[lang.toLowerCase()] : targetFile.language;
  const runner = languageRunners[runnerKey];

  if (!runner) {
    errEl.textContent = `Unsupported language: ${lang}`;
    return;
  }

  if (runnerKey === "Python") {
    const requirements = Object.values(data.files).find(
      (f) => f.filename === "requirements.txt",
    )?.content;
    runner(targetFile.content, requirements);
  } else {
    runner(targetFile.content);
  }
};

const extractGistId = (input) => {
  const match = input.match(/([a-f0-9]{32})/i);
  return match ? match[1] : input.trim();
};

const updateRunHref = (input) => {
  const id = extractGistId(input);
  const hrefNoParams = window.location.href.split("?")[0];
  const href = `${hrefNoParams}?id=${id}`;
  const runUrl = document.querySelector(".run-url");
  runUrl.href = href;
  runUrl.textContent = href;
};

const main = () => {
  const params = new URLSearchParams(window.location.search);

  if (params.get("id")) {
    runGist(extractGistId(params.get("id")), {
      file: params.get("file"),
      lang: params.get("lang"),
    });
  }

  const gistIdInput = document.querySelector('[name="gist-id"]');
  updateRunHref(gistIdInput.value);
  gistIdInput.addEventListener("keyup", (event) => {
    updateRunHref(event.target.value);
  });

  document.querySelector("form").addEventListener("submit", (event) => {
    event.preventDefault();
    runGist(extractGistId(event.target.elements["gist-id"].value));
  });
};

main();
