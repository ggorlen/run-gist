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
  const { content } = Object.values(files).find(
    (e) => e.language === language,
  );

  if (content) {
    setInnerHTML(document.querySelector("html"), content);
    return true;
  }

  return false;
};

const runGist = async (gistId) => {
  const res = await fetch(`https://api.github.com/gists/${gistId}`)
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

document.querySelector("form").addEventListener("submit", event => {
  event.preventDefault();
  runGist(event.target.elements["gist-id"].value);
});
