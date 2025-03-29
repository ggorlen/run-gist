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
  const originalLog = console.log;
  el.textContent = "";
  console.log = (...args) => {
    el.textContent += "\n" + args.join(" ");
    originalLog.apply(console, args);
  };
  eval(content);
  console.log = originalLog;
};

const runPython = async (content) => {
  const el = document.querySelector("body");
  el.innerHTML = "Loading Pyodide...";
  const pyodide = await loadPyodide();
  pyodide.runPython(`
        import sys
        class StdoutCatcher:
            def __init__(self):
                self.output = ""

            def write(self, text):
                self.output += text

            def flush(self):
                pass  # Required for sys.stdout compatibility

        sys.stdout = StdoutCatcher()
    `);
  pyodide.runPython(content);
  const output = pyodide.runPython("sys.stdout.output");
  el.textContent = output;
};

const languageRunners = {
  HTML: runHTML,
  JavaScript: runJavaScript,
  Python: runPython,
};

const runGist = async (gistId) => {
  const res = await fetch(`https://api.github.com/gists/${gistId}`);
  const data = await res.json();

  if (!res.ok) {
    console.error(data);
    const errEl = document.querySelector(".error");
    errEl.textContent = data.message;
    return;
  }

  for (const file of Object.values(data.files)) {
    if (languageRunners[file.language]) {
      languageRunners[file.language](file.content);
      break;
    }
  }
};

const updateRunHref = (id) => {
  const hrefNoParams = window.location.href.split("?")[0];
  const href = `${hrefNoParams}?id=${id}`;
  const runUrl = document.querySelector(".run-url");
  runUrl.href = href;
  runUrl.textContent = href;
};

const main = () => {
  const params = new URLSearchParams(window.location.search);

  if (params.get("id")) {
    runGist(params.get("id"));
  }

  const gistIdInput = document.querySelector('[name="gist-id"]');
  updateRunHref(gistIdInput.value);
  gistIdInput.addEventListener("keyup", (event) => {
    updateRunHref(event.target.value);
  });

  document.querySelector("form").addEventListener("submit", (event) => {
    event.preventDefault();
    runGist(event.target.elements["gist-id"].value);
  });
};

main();
