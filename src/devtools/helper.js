// eslint-disable-next-line no-unused-vars
async function chromeEvalPromise(command) {
  return new Promise((resolve, reject) => {
    chrome.devtools.inspectedWindow.eval(
      command,
      null,
      (result, exceptionInfo) => {
        if (!exceptionInfo) {
          return resolve(result);
        }
        return reject(exceptionInfo);
      }
    );
  });
}



export { chromeEvalPromise };
