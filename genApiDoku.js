const { runShellCommand } = require("../../scripts/lib");

const { Readable, Writable, Transform } = require("stream");

const util = require("util");
const fs = require("fs");
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

const walkSync = function (dir, filelist = []) {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    if (fs.statSync(dir + file).isDirectory()) {
      filelist = walkSync(dir + file + "/", filelist);
    } else {
      filelist.push(dir + file);
    }
  });
  return filelist;
};

const DIR = process.env.DIR;
const INDEX_FILE = DIR + "index.js";

const stream = new Readable();
const streamEnd = stream
  .pipe(
    new Transform({
      readableObjectMode: true,
      transform(chunk, enc, next) {
        this.push({ file: fs.readFileSync(chunk), fileName: chunk.toString() });
        next();
      },
    })
  )
  .pipe(
    new Transform({
      writableObjectMode: true,
      readableObjectMode: true,
      transform({ file, fileName }, enc, next) {
        const [, apiVersion] = /\/(v[\d]+)\//.exec(fileName) || [];
        const regex = new RegExp(
          "const (.*?)\\s*=\\s*preparator\\s*\\(\\s*\\{([\\s\\S]*?)\\},\\s*async" +
            "(?:[\\s\\S]*\\1\\.returns\\s*=\\s*(\\[[\\s\\S]*?\\]);)?",
          "gm"
        );
        let match = regex.exec(file);
        while (match) {
          const params = eval("({" + match[2] + "})");
          const returns = eval("(" + match[3] + ")");
          this.push({
            funcName: match[1],
            params,
            apiVersion,
            returns,
          });
          match = regex.exec(file);
        }
        next();
      },
    })
  )
  .pipe(
    new Writable({
      objectMode: true,
      write(chunk, enc, next) {
        this.buffer = this.buffer || {};
        this.buffer[chunk.apiVersion + chunk.funcName] = chunk;
        next();
      },
    })
  );

async function main() {
  walkSync(DIR)
    .filter((file) => !/~|test/.test(file))
    .forEach((file) => stream.push(file));

  stream.push(null);

  const data = await new Promise((res) => {
    streamEnd.on("finish", () => {
      res(streamEnd.buffer);
    });
  });

  const indexData = (await readFile(INDEX_FILE)).toString(),
    regex = new RegExp(
      'app\\.(put|get|delete|post)\\(\\s*"([^"]+)"\\s*,\\s*(.*?)\\s*\\)',
      "gm"
    );
  let match = regex.exec(indexData);
  const results = [];
  while (match) {
    const apiVersion = (/\/(v\/?[\d]+)\//.exec(match[2]) || [
      "",
      "",
    ])[1].replace("/", "");
    results.push({
      method: match[1],
      path: match[2],
      funcName: match[3],
      params: (
        data[apiVersion + match[3]] ||
        data[apiVersion + match[3].substr(2)] ||
        {}
      ).params,
      returns: (
        data[apiVersion + match[3]] ||
        data[apiVersion + match[3].substr(2)] ||
        {}
      ).returns,
      apiVersion,
    });
    match = regex.exec(indexData);
  }

  const template = await readFile(process.argv[1] + "/" + "template.html");
  let html = "";

  for (const {
    method,
    path,
    params,
    apiVersion,
    funcName,
    returns,
  } of results) {
    const formatedParams = params
      ? JSON.stringify(
          params,
          (key, val) => {
            if (key === "type") {
              return " <span class='type'> &lt;" + val + "&gt;</span>";
            }
            return val;
          },
          2
        )
          .slice(2, -2)
          .replace(/\{|[ ]*\},?\n?|,|"|/g, "")
          .replace(/\s*type:\s*/g, "")
          .replace(/ {2}/g, "&nbsp;&nbsp;&nbsp;")
          .replace(/\n/g, "<br/>\n")
      : " <span class='error'>???</span>";
    const formatedReturn = returns
      ? JSON.stringify(
          returns,
          (key, val) => {
            if (key === "type") {
              return " <span class='type'> &lt;" + val + "&gt;</span>";
            }
            return val;
          },
          2
        )
          .slice(2, -2)
          .replace(/\{|[ ]*\},?\n?|,|"|/g, "")
          .replace(/\s*type:\s*/g, "")
          .replace(/ {2}/g, "&nbsp;&nbsp;&nbsp;")
          .replace(/\n/g, "<br/>\n")
      : " <span class='error'>???</span>";
    html += `
<div> <!-- ${method.toUpperCase()} ${path} ${funcName} -->
   <span class="version">${apiVersion}</span>
   <strong class="method">${method.toUpperCase()}</strong>
   <span class="path">${path}</span>
   <span class="funcName">${funcName}</span><br/>
   ${formatedParams}<br/>
<span class="returns">Returns:</span> <br/>
${formatedReturn}
<br/><br/>
</div>`;
  }

  const gitHash = await runShellCommand(
    'git log --simplify-by-decoration -1 --pretty="format: %h"'
  );

  await writeFile(
    "./api.html",
    template
      .toString()
      .replace("<!-- INSERT DATA HERE -->", html)
      .replace("INSERT COMMIT HASH HERE", gitHash)
  );
}

main()
  .then(() => {
    process.exit(0);
  })
  .catch((e) => {
    console.log("ERROR", e);
    process.exit(-1);
  });
