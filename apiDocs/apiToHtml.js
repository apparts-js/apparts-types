const STYLE = require("./style");

const recursivelyPrintType = (type, indent = 0) => {
  let res = "";
  const spaces = " ".repeat(indent);
  if (type.type === "object") {
    if (typeof type.values === "object") {
      res += `{
${Object.keys(type.values)
  .map(
    (key) =>
      spaces +
      `  "${key}": ${recursivelyPrintType(type.values[key], indent + 2)}`
  )
  .join(",\n")}
${spaces}}`;
    } else {
      res += `{
${spaces}  <span class="type">&lt;/&gt;</span>: <span class="type">&lt;${type.values}&gt;</span>
${spaces}}`;
    }
  } else if (type.type === "array") {
    res += `[
${spaces}  ${recursivelyPrintType(type.value, indent + 2)}
${spaces}]`;
  } else if (type.type) {
    res += `<span class="type">&lt;${type.type}&gt;</span>`;
  } else {
    res += JSON.stringify(type.value);
  }
  return res.replace(/\n/g, "<br/>").replace(/  /g, "&nbsp;&nbsp;");
};

const apiToHtml = (api, commitHash, style = STYLE) => {
  const toc = [];
  const data = api
    .map(
      ({
        method = "",
        path,
        assertions = {},
        returns = [],
        description,
        title,
        options = {},
      }) => {
        const [, version] = path.match(/v\/?(\d+)/) || [,];
        toc.push([
          `${method}_${path}`,
          method.toUpperCase(),
          path,
          title,
          version,
        ]);
        return `<section id="${method}_${path}">
   <h3><span class="version">${version ? "v" + version : ""}</span>
${title || ""}</h3>
   <p >${description || ""}</p>
   <div class="api">
     <strong class="method">${method.toUpperCase()}</strong>
     <span class="path">${path}</span><br/>
     <ul>
     ${
       options.auth
         ? `
        <li>Header:
            <ul>
        <li>
        <code>Authorization: ${options.auth}</code>
        </li>
        </ul>
        </li>
        `
         : ""
     }

     ${Object.keys(assertions)
       .map(
         (type) =>
           `
        <li>${type.slice(0, 1).toUpperCase() + type.slice(1)}: <br><ul>` +
           Object.keys(assertions[type])
             .map(
               (key) => `
                                                               <li><code>${
                                                                 assertions[
                                                                   type
                                                                 ][key].optional
                                                                   ? "? "
                                                                   : ""
                                                               }${key}:
                                                                         <span class="type">&lt;${
                                                                           assertions[
                                                                             type
                                                                           ][
                                                                             key
                                                                           ]
                                                                             .type
                                                                         }&gt; </span>${
                 assertions[type][key].default
                   ? `(= ${JSON.stringify(assertions[type][key].default)})`
                   : ""
               }</code></li>
        </li>`
             )
             .join("") +
           "</ul></li>"
       )
       .join("")}
     </ul>
     <span class="returns">Returns:</span> <br>
     <ul>
     ${returns
       .map(
         ({ status, error, ...rest }) => `
        <li>Status: ${status}
        <code>${
          error
            ? `{ "error": ${JSON.stringify(error)} }`
            : recursivelyPrintType(rest)
        }</code></li>
        `
       )
       .join("")}
     </ul>
  </div>
</section>`;
      }
    )
    .join("");

  return `
<!DOCTYPE html>
<!-- Commit hash: ${commitHash} -->
<html>
  <head>
    <style>
      ${style}
    </style>
  </head>
  <body>
    <div class="docs" >
      <h2>Contents:</h2>
      <div class="toc">
        ${toc
          .map(
            (a) =>
              `<a href="#${a[0]}">
  <span class="version">${a[4] ? "v" + a[4] : ""}</span>
  <span class="link">${a[3] || ""}</span><br/>
             &nbsp;&nbsp;<span class="method">${a[1]}</span><code>${a[2]}</code>
  </a>`
          )
          .join("")}
      </div>
    </div>
    <div class="docs" >
     <h2>Endpoints:</h2>
    ${data}
    </div>
  </body>
</html>

  `;
};

module.exports = {
  apiToHtml,
};
