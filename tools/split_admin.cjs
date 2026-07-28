const fs = require('fs');
const path = require('path');
const acorn = require('acorn');

const inputPath = path.join(__dirname, '../script_admin.js');
const code = fs.readFileSync(inputPath, 'utf8');

// Parse the code using acorn to get start and end positions of all top-level nodes
const ast = acorn.parse(code, { ecmaVersion: 2020 });

// Mapping of module names to the functions/variables they should contain
const moduleMap = {
    'auth': ['runAdminLoginAuth', 'confirmAdminLogout', 'handleAdminLogout', 'initRBAC', 'initAdminHeader'],
    'dashboard': ['fetchAdminStats', 'renderStatsDashboard', 'loadChartJs', 'initAdminCharts', 'updateDateTime', 'fetchWeather', 'fetchUserDashboardData', 'fetchAdminDashboardData', 'adminCharts', 'isChartJsLoaded'],
    'pengajuan': ['renderAdminTable', 'triggerGeneratePDF', 'runAdminFilter', 'moveAdminPage', 'openManageStatusModalById', 'closeManageStatusModal', 'changeVerifSlide', 'renderChecklistTable', 'calculateAutoVerificationResult', 'confirmSaveVerification', 'executeAdminStatusUpdate', 'exportDataExcel', 'cetakMassal'],
    'layanan': ['openLayananEditor', 'closeLayananEditor', 'initStep2RequirementsBuilder', 'initStep3QuestionsBuilder', 'addRequirementToKeperluan', 'removeRequirementFromKeperluan', 'renderRequirementsMappingList', 'loadBuilderLayananList', 'extractSuggestions', 'handleBuilderLayananLoad', 'handleKeperluanSelectChange', 'saveNewKeperluanOption', 'cancelNewKeperluanOption', 'deleteSelectedKeperluanOption', 'runLayananFilter', 'renderLayananTable', 'loadBuilderDaftarLayananTab', 'populateBuilderLayananToEdit', 'toggleBuilderOptionInput', 'populateBuilderRepeaterSelect', 'addQuestionToRepeaterTempList', 'renderRepeaterTempList', 'moveRepeaterTempItem', 'removeRepeaterTempItem', 'saveRepeaterGroup', 'cancelEditRepeaterGroup', 'addBuilderQuestionToList', 'editBuilderQuestion', 'cancelEditBuilderQuestion', 'removeBuilderQuestion', 'moveBuilderQuestionUp', 'moveBuilderQuestionDown', 'duplicateBuilderQuestion', 'renderBuilderQuestionsUIList', 'submitBuilderDataToServer', 'resetBuilderFormState', 'deleteBuilderMasterLayanan'],
    'pengguna': ['initManajemenPengguna', 'filterUserTable', 'renderUserTable', 'toggleDropdown', 'switchManajemenPenggunaTab', 'saveRoleAccess', 'backToManajemenPengguna', 'fetchActivities', 'renderActivities', 'openModalTambahPengguna', 'closeModalTambahPengguna', 'callCrudPengguna', 'simpanPenggunaBaru', 'updateStatistikPengguna', 'openModalEditPengguna', 'closeModalEditPengguna', 'simpanEditPengguna', 'resetPasswordPengguna', 'toggleStatusPengguna', 'hapusPengguna'],
    'pengaturan': ['loadAdminSettingsForm', 'saveAdminSettings', 'showPengaturanAkunMenu', 'switchPengaturanAkunTab', 'toggleSettingSwitch', 'mockSaveSetting', 'toggleDarkModeUI', 'toggleEditProfile', 'saveProfileData', 'handleProfilePhotoChange', 'changePasswordMock', 'originalProfileData'],
    'notifikasi': ['fetchNotifications', 'renderNotifications', 'getNotifications', 'getUnreadNotificationCount', 'addNotification', 'markAllNotificationsAsRead', 'deleteNotification', 'deleteAllNotifications', 'updateNotificationBadge', 'formatTimeAgo', 'renderNotificationDropdown', 'playNotificationSound', 'dummyNotifikasiList'],
    'admin_core': ['switchAdminTab', 'executeSwitchAdminTab', 'markVerifikasiDirty', 'resetVerifikasiDirty', 'setStatusFilter', 'showCustomConfirm']
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
                // Extract code string and add 'export ' prefix
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
        // Blocks of code that are not functions or variables (e.g. standalone expressions)
        // Usually event listeners or IIFEs. We can dump them in admin_core.js for now.
        let nodeCode = code.substring(node.start, node.end);
        moduleOutputs['admin_core'].push(nodeCode);
    }
}

if (unmappedNodes.length > 0) {
    console.warn("Unmapped top-level identifiers:", unmappedNodes);
}

// Write to files
const outDir = path.join(__dirname, '../src/admin');
fs.mkdirSync(outDir, { recursive: true });

for (const [mod, codes] of Object.entries(moduleOutputs)) {
    const filePath = path.join(outDir, `${mod}.js`);
    fs.writeFileSync(filePath, codes.join('\n\n'), 'utf8');
    console.log(`Wrote ${mod}.js`);
}

// Rename the original file so it's not loaded
fs.renameSync(inputPath, inputPath + '.bak');
console.log("Renamed script_admin.js to script_admin.js.bak");
