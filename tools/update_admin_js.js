const fs = require('fs');

const filePath = 'c:\\Users\\alzia\\.gemini\\antigravity\\scratch\\PelayananDigitalDesa\\script_admin.html';
let content = fs.readFileSync(filePath, 'utf-8');

// 1. Remove switchBuilderStep completely
const switchBuilderStepStart = content.indexOf('function switchBuilderStep(stepNum) {');
const switchBuilderStepEnd = content.indexOf('function initStep2RequirementsBuilder() {');
if (switchBuilderStepStart !== -1 && switchBuilderStepEnd !== -1) {
    content = content.substring(0, switchBuilderStepStart) + content.substring(switchBuilderStepEnd);
}

// 2. Add openLayananEditor and closeLayananEditor
const addCode = `
        function openLayananEditor(id) {
            document.getElementById('subview-admin-daftar-layanan').classList.add('hidden');
            document.getElementById('subview-admin-layanan').classList.remove('hidden');
            if(id === '__NEW__') {
                document.getElementById('builder-select-layanan').value = '[+] TAMBAH LAYANAN BARU';
            } else {
                document.getElementById('builder-select-layanan').value = id;
            }
            handleBuilderLayananLoad();
        }

        function closeLayananEditor() {
            document.getElementById('subview-admin-layanan').classList.add('hidden');
            document.getElementById('subview-admin-daftar-layanan').classList.remove('hidden');
        }
`;

// Insert it where switchBuilderStep was
content = content.replace('function initStep2RequirementsBuilder() {', addCode + '\n        function initStep2RequirementsBuilder() {');

// 3. Fix loadLayananKeBuilder to init steps instead of switchBuilderStep(1)
content = content.replace('switchBuilderStep(1);', `initStep2RequirementsBuilder();\n            initStep3QuestionsBuilder();`);

// 4. Update edit button in list
content = content.replace(/switchAdminTab\('layanan'\); populateBuilderLayananToEdit\('\\' \+ row\.id \+ '\\'\)/g, `openLayananEditor('\\'' + row.id + '\\'')`);

// 5. Remove simulator functions (runLiveBuilderSimulatorPreview, updateBuilderFinalReviewData)
const simStart = content.indexOf('function runLiveBuilderSimulatorPreview() {');
const submitStart = content.indexOf('function submitBuilderDataToServer() {');
if (simStart !== -1 && submitStart !== -1) {
    content = content.substring(0, simStart) + content.substring(submitStart);
}

// 6. Update submitBuilderDataToServer to not use step switches
content = content.replace(/switchBuilderStep\(4\);/g, 'closeLayananEditor();');
content = content.replace(/switchBuilderStep\(1\);/g, 'closeLayananEditor();');

fs.writeFileSync(filePath, content, 'utf-8');
console.log('script_admin.html JS logic updated successfully');
