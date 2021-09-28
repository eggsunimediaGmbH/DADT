const executeScript = (compId, scriptName) => {
  return /*javascript*/ `
    if(!guidelib?.model?.Scriptable?.prototype?._originalCompileExpression){
        guidelib.model.Scriptable.prototype._originalCompileExpression =
          guidelib.model.Scriptable.prototype._compileExpression;
      }
    
    
      guidelib.model.Scriptable.prototype._compileExpression = function(
        expression,
        affectedProp
      ) {
           if(window.nextScriptToDebug) {
            var debugStr = "debugger;\\n",
                evalInd = expression.indexOf("eval("),
                debuggerInd = expression.indexOf("debugger");
            if (evalInd > -1 && debuggerInd < 0) {
                expression = expression.substring(0, evalInd + 6) + debugStr + expression.substring(evalInd + 6);
            } else if (evalInd === -1) {
                debugStr = "debugger;\\n";
                expression = debugStr + expression;
            }
        }
        return guidelib.model.Scriptable.prototype._originalCompileExpression.call(this, expression, affectedProp);
      };
    
      var runExp = guideBridge._resolveId("${compId}");
      window.nextScriptToDebug = true;
      runExp._collectExpressions();
      runExp._setExpressionContext(runExp, runExp.index);
      runExp.executeExpression("${scriptName}");
      window.nextScriptToDebug = false;
      runExp._collectExpressions();
    `;
};

const getGuideState = () => {
  return /*javascript*/ `
    guideBridge.getData({
        success: function(guideResultObject) {
            window.postMessage({data: guideResultObject.data, source: 'deniz-aem-tools'}, '*');
        },
        error: function(guideResultObject) {
            console.error("API Failed");
            var msg = guideResultObject.getNextMessage();
            while (msg != null) {
                console.error(msg.message);
                msg = guideResultObject.getNextMessage();
            }
        },
    });
    `;
};

const highlightNode = (compId) => {
  return /* javascript */ `
    $([document.documentElement, document.body]).animate(
      {
        scrollTop: $("#${compId}").offset().top - window.innerHeight / 2,
      },
      1000
    ),
    $("#${compId}").css("outline", "#f00 solid 2px"),
    setTimeout(() => {
      $("#${compId}").css("outline", "unset");
    }, 6000) 
`;
};

export { executeScript, getGuideState, highlightNode };
