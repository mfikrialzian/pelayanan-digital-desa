const fs = require('fs');
const path = require('path');
const acorn = require('acorn');

const inputPath = path.join(__dirname, '../script_warga.js');
const code = fs.readFileSync(inputPath, 'utf8');
const ast = acorn.parse(code, { ecmaVersion: 2020 });

const moduleMap = {
    'pengajuan_wizard': ['saveWargaDraft', 'loadWargaDraft', 'handleMulaiPengajuan', 'loadLayananDataWarga', 'renderLayananListWarga', 'openFormPengajuan', 'renderDynamicCustomQuestions', 'generateFieldInputHtml', 'generateRepeaterBlockHtml', 'addRepeaterGroup', 'renderDynamicUploadSlots', 'runLiveConditionalLogicEvaluationForCitizen', 'toggleWizardStep1State', 'switchWizardSection', 'goToStep1', 'goToStep2', 'goToStep3', 'goToStep4', 'goToStep5', 'backToPrevStepOrMenu', 'executeBackStep', 'addRepeaterRow', 'updateRepeaterHidden', 'handleWargaSubmit', 'toggleSubmitButtonState', 'showWizardSuccessScreen', 'copyRegIdToClipboard', 'sendWaAfterSubmit', 'fallbackCopyText', 'validateCurrentWizardStep'],
    'status': ['runSearchStatus', 'renderStatusCards', 'runReuploadProcessDirect'],
    'ui': ['toggleInfoDetail'],
    'image_utils': ['analyzeImageSharpnessLocal', 'handleFileSelectImageAndCompress']
};

const moduleOutputs = {};
for (const mod of Object.keys(moduleMap)) {
    moduleOutputs[mod] = [];
}

let unmappedNodes = [];
for (const node of ast.body) {
    let name = null;
    if (node.type === 'FunctionDeclaration') {
        name = node.id.name;
    } else if (node.type === 'VariableDeclaration') {
        name = node.declarations[0].id.name;
    }
    
    if (name) {
        let found = false;
        for (const [mod, names] of Object.entries(moduleMap)) {
            if (names.includes(name)) {
                let nodeCode = code.substring(node.start, node.end);
                moduleOutputs[mod].push('export ' + nodeCode);
                found = true;
                break;
            }
        }
        if (!found) {
            unmappedNodes.push(name);
        }
    } else {
        let nodeCode = code.substring(node.start, node.end);
        moduleOutputs['pengajuan_wizard'].push(nodeCode);
    }
}

if (unmappedNodes.length > 0) {
    console.warn("Unmapped top-level identifiers:", unmappedNodes);
}

const outDir = path.join(__dirname, '../src/warga');
fs.mkdirSync(outDir, { recursive: true });

for (const [mod, codes] of Object.entries(moduleOutputs)) {
    const filePath = path.join(outDir, `${mod}.js`);
    fs.writeFileSync(filePath, codes.join('\n\n'), 'utf8');
    console.log(`Wrote ${mod}.js`);
}

fs.renameSync(inputPath, inputPath + '.bak');
console.log("Renamed script_warga.js to script_warga.js.bak");
