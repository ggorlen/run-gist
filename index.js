const setInnerHTML = async (elm, html) => {
  elm.innerHTML = html;

  for (const oldScriptEl of elm.querySelectorAll("script")) {
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

const tryRunning = (files, language) => {
  const { content } = Object.values(files).find((e) => e.language === language);

  if (content) {
    setInnerHTML(document.querySelector("html"), content);
    return true;
  }

  return false;
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

  const languages = ["HTML"];

  for (const language of languages) {
    if (tryRunning(data.files, language)) {
      break;
    }
  }
};

const updateRunHref = (id) => {
  const hrefNoParams = window.location.href.split("?")[0];
  const href = `${hrefNoParams}?run=${id}`;
  const runUrl = document.querySelector(".run-url");
  runUrl.href = href;
  runUrl.textContent = href;
};

const main = () => {
  const params = new URLSearchParams(window.location.search);

  if (params.get("run")) {
    runGist(params.get("run"));
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
