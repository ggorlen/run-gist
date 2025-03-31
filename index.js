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
  console.log = (...args) => {
    pre.textContent += "\n" + args.join(" ");
    originalLog.apply(console, args);
  };
  eval(content);
  console.log = originalLog;
};

const runPython = async (content, requirements) => {
  const el = document.querySelector("body");
  el.innerHTML = "<pre></pre>";
  const pre = el.querySelector("pre");
  pre.textContent = "Loading Pyodide...";
  const pyodide = await loadPyodide({
    stdout: (str) => {
      console.log(str);
      pre.textContent += str;
    },
    stderr: (str) => {
      console.error(str);
      pre.textContent += str;
    },
  });

  if (requirements) {
    const pkgs = requirements.split("\n").map((e) => e.split("=")[0]);
    await pyodide.loadPackage(pkgs, {
      messageCallback: (str) => {
        console.log(str);
        pre.textContent += str;
      },
      errorCallback: (str) => {
        console.error(str);
        pre.textContent += str;
      },
    });
  }

  await pyodide.loadPackagesFromImports(content, {
    messageCallback: (str) => {
      console.log(str);
      pre.textContent += str;
    },
    errorCallback: (str) => {
      console.error(str);
      pre.textContent += str;
    },
  });
  pre.textContent = "";

  try {
    pyodide.runPython(content);
  } catch (err) {
    pre.textContent = err.message;
  }
};

const languageRunners = {
  HTML: runHTML,
  JavaScript: runJavaScript,
  Python: runPython,
};

const runGist = async (gistId) => {
  const response = await fetch(`https://api.github.com/gists/${gistId}`);
  const data = await response.json();

  if (!response.ok) {
    console.error(data);
    const errEl = document.querySelector(".error");
    errEl.textContent = data.message;
    return;
  }

  for (const file of Object.values(data.files)) {
    if (languageRunners[file.language] && file.language === "Python") {
      const requirements = Object.values(data.files).find(
        (file) => file.filename === "requirements.txt",
      )?.content;
      languageRunners[file.language](file.content, requirements);
      break;
    } else if (languageRunners[file.language]) {
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
