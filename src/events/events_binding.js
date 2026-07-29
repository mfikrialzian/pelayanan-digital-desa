
// Extracted from div #ev-bind-1
const el_ev_bind_1 = document.getElementById('ev-bind-1');
if (el_ev_bind_1) {
    el_ev_bind_1.addEventListener('click', function(event) {
        switchView('beranda')
    });
} else {
    console.warn("Element #ev-bind-1 not found for event binding.");
}


// Extracted from div #ev-bind-2
const el_ev_bind_2 = document.getElementById('ev-bind-2');
if (el_ev_bind_2) {
    el_ev_bind_2.addEventListener('click', function(event) {
        handleMulaiPengajuan()
    });
} else {
    console.warn("Element #ev-bind-2 not found for event binding.");
}


// Extracted from div #ev-bind-3
const el_ev_bind_3 = document.getElementById('ev-bind-3');
if (el_ev_bind_3) {
    el_ev_bind_3.addEventListener('click', function(event) {
        switchView('status')
    });
} else {
    console.warn("Element #ev-bind-3 not found for event binding.");
}


// Extracted from div #warga-info-jam
const el_warga_info_jam = document.getElementById('warga-info-jam');
if (el_warga_info_jam) {
    el_warga_info_jam.addEventListener('click', function(event) {
        toggleInfoDetail('jam-detail')
    });
} else {
    console.warn("Element #warga-info-jam not found for event binding.");
}


// Extracted from div #warga-info-alur
const el_warga_info_alur = document.getElementById('warga-info-alur');
if (el_warga_info_alur) {
    el_warga_info_alur.addEventListener('click', function(event) {
        toggleInfoDetail('alur-detail')
    });
} else {
    console.warn("Element #warga-info-alur not found for event binding.");
}


// Extracted from button #btn-back-warga-nav
const el_btn_back_warga_nav = document.getElementById('btn-back-warga-nav');
if (el_btn_back_warga_nav) {
    el_btn_back_warga_nav.addEventListener('click', function(event) {
        backToPrevStepOrMenu()
    });
} else {
    console.warn("Element #btn-back-warga-nav not found for event binding.");
}


// Extracted from input #warga-syarat-checkbox
const el_warga_syarat_checkbox = document.getElementById('warga-syarat-checkbox');
if (el_warga_syarat_checkbox) {
    el_warga_syarat_checkbox.addEventListener('change', function(event) {
        toggleWizardStep1State()
    });
} else {
    console.warn("Element #warga-syarat-checkbox not found for event binding.");
}


// Extracted from button #btn-next-step-1
const el_btn_next_step_1 = document.getElementById('btn-next-step-1');
if (el_btn_next_step_1) {
    el_btn_next_step_1.addEventListener('click', function(event) {
        goToStep2()
    });
} else {
    console.warn("Element #btn-next-step-1 not found for event binding.");
}


// Extracted from button #btn-next-step-2
const el_btn_next_step_2 = document.getElementById('btn-next-step-2');
if (el_btn_next_step_2) {
    el_btn_next_step_2.addEventListener('click', function(event) {
        goToStep3()
    });
} else {
    console.warn("Element #btn-next-step-2 not found for event binding.");
}


// Extracted from button #btn-next-step-3
const el_btn_next_step_3 = document.getElementById('btn-next-step-3');
if (el_btn_next_step_3) {
    el_btn_next_step_3.addEventListener('click', function(event) {
        goToStep4()
    });
} else {
    console.warn("Element #btn-next-step-3 not found for event binding.");
}


// Extracted from button #btn-next-step-4
const el_btn_next_step_4 = document.getElementById('btn-next-step-4');
if (el_btn_next_step_4) {
    el_btn_next_step_4.addEventListener('click', function(event) {
        goToStep5()
    });
} else {
    console.warn("Element #btn-next-step-4 not found for event binding.");
}


// Extracted from input #warga-check-kebenaran
const el_warga_check_kebenaran = document.getElementById('warga-check-kebenaran');
if (el_warga_check_kebenaran) {
    el_warga_check_kebenaran.addEventListener('change', function(event) {
        toggleSubmitButtonState()
    });
} else {
    console.warn("Element #warga-check-kebenaran not found for event binding.");
}


// Extracted from input #warga-check-tanggungjawab
const el_warga_check_tanggungjawab = document.getElementById('warga-check-tanggungjawab');
if (el_warga_check_tanggungjawab) {
    el_warga_check_tanggungjawab.addEventListener('change', function(event) {
        toggleSubmitButtonState()
    });
} else {
    console.warn("Element #warga-check-tanggungjawab not found for event binding.");
}


// Extracted from button #btn-submit-warga
const el_btn_submit_warga = document.getElementById('btn-submit-warga');
if (el_btn_submit_warga) {
    el_btn_submit_warga.addEventListener('click', function(event) {
        handleWargaSubmit()
    });
} else {
    console.warn("Element #btn-submit-warga not found for event binding.");
}


// Extracted from button #ev-bind-4
const el_ev_bind_4 = document.getElementById('ev-bind-4');
if (el_ev_bind_4) {
    el_ev_bind_4.addEventListener('click', function(event) {
        copyRegIdToClipboard()
    });
} else {
    console.warn("Element #ev-bind-4 not found for event binding.");
}


// Extracted from button #ev-bind-5
const el_ev_bind_5 = document.getElementById('ev-bind-5');
if (el_ev_bind_5) {
    el_ev_bind_5.addEventListener('click', function(event) {
        sendWaAfterSubmit()
    });
} else {
    console.warn("Element #ev-bind-5 not found for event binding.");
}


// Extracted from button #ev-bind-6
const el_ev_bind_6 = document.getElementById('ev-bind-6');
if (el_ev_bind_6) {
    el_ev_bind_6.addEventListener('click', function(event) {
        switchView('beranda')
    });
} else {
    console.warn("Element #ev-bind-6 not found for event binding.");
}


// Extracted from button #ev-bind-7
const el_ev_bind_7 = document.getElementById('ev-bind-7');
if (el_ev_bind_7) {
    el_ev_bind_7.addEventListener('click', function(event) {
        switchView('beranda')
    });
} else {
    console.warn("Element #ev-bind-7 not found for event binding.");
}


// Extracted from form #ev-bind-8
const el_ev_bind_8 = document.getElementById('ev-bind-8');
if (el_ev_bind_8) {
    el_ev_bind_8.addEventListener('submit', function(event) {
        event.preventDefault(); runSearchStatus();
    });
} else {
    console.warn("Element #ev-bind-8 not found for event binding.");
}


// Extracted from form #ev-bind-9
const el_ev_bind_9 = document.getElementById('ev-bind-9');
if (el_ev_bind_9) {
    el_ev_bind_9.addEventListener('submit', function(event) {
        event.preventDefault(); runAdminLoginAuth();
    });
} else {
    console.warn("Element #ev-bind-9 not found for event binding.");
}


// Extracted from button #ev-bind-10
const el_ev_bind_10 = document.getElementById('ev-bind-10');
if (el_ev_bind_10) {
    el_ev_bind_10.addEventListener('click', function(event) {
        togglePasswordView('login-password', 'eye-icon-login')
    });
} else {
    console.warn("Element #ev-bind-10 not found for event binding.");
}


// Extracted from button #ev-bind-11
const el_ev_bind_11 = document.getElementById('ev-bind-11');
if (el_ev_bind_11) {
    el_ev_bind_11.addEventListener('click', function(event) {
        switchView('beranda')
    });
} else {
    console.warn("Element #ev-bind-11 not found for event binding.");
}


// Extracted from button #ev-bind-12
const el_ev_bind_12 = document.getElementById('ev-bind-12');
if (el_ev_bind_12) {
    el_ev_bind_12.addEventListener('click', function(event) {
        markAllNotificationsAsRead()
    });
} else {
    console.warn("Element #ev-bind-12 not found for event binding.");
}


// Extracted from button #ev-bind-13
const el_ev_bind_13 = document.getElementById('ev-bind-13');
if (el_ev_bind_13) {
    el_ev_bind_13.addEventListener('click', function(event) {
        deleteAllNotifications()
    });
} else {
    console.warn("Element #ev-bind-13 not found for event binding.");
}


// Extracted from div #card-stat-total
const el_card_stat_total = document.getElementById('card-stat-total');
if (el_card_stat_total) {
    el_card_stat_total.addEventListener('click', function(event) {
        setStatusFilter('')
    });
} else {
    console.warn("Element #card-stat-total not found for event binding.");
}


// Extracted from div #card-stat-menunggu
const el_card_stat_menunggu = document.getElementById('card-stat-menunggu');
if (el_card_stat_menunggu) {
    el_card_stat_menunggu.addEventListener('click', function(event) {
        setStatusFilter('Menunggu')
    });
} else {
    console.warn("Element #card-stat-menunggu not found for event binding.");
}


// Extracted from div #card-stat-verifikasi
const el_card_stat_verifikasi = document.getElementById('card-stat-verifikasi');
if (el_card_stat_verifikasi) {
    el_card_stat_verifikasi.addEventListener('click', function(event) {
        setStatusFilter('Verifikasi')
    });
} else {
    console.warn("Element #card-stat-verifikasi not found for event binding.");
}


// Extracted from div #card-stat-selesai
const el_card_stat_selesai = document.getElementById('card-stat-selesai');
if (el_card_stat_selesai) {
    el_card_stat_selesai.addEventListener('click', function(event) {
        setStatusFilter('Selesai')
    });
} else {
    console.warn("Element #card-stat-selesai not found for event binding.");
}


// Extracted from div #card-stat-perbaikan
const el_card_stat_perbaikan = document.getElementById('card-stat-perbaikan');
if (el_card_stat_perbaikan) {
    el_card_stat_perbaikan.addEventListener('click', function(event) {
        setStatusFilter('Perbaikan')
    });
} else {
    console.warn("Element #card-stat-perbaikan not found for event binding.");
}


// Extracted from button #btn-adm-prev
const el_btn_adm_prev = document.getElementById('btn-adm-prev');
if (el_btn_adm_prev) {
    el_btn_adm_prev.addEventListener('click', function(event) {
        moveAdminPage(-1)
    });
} else {
    console.warn("Element #btn-adm-prev not found for event binding.");
}


// Extracted from button #btn-adm-next
const el_btn_adm_next = document.getElementById('btn-adm-next');
if (el_btn_adm_next) {
    el_btn_adm_next.addEventListener('click', function(event) {
        moveAdminPage(1)
    });
} else {
    console.warn("Element #btn-adm-next not found for event binding.");
}


// Extracted from div #ev-bind-14
const el_ev_bind_14 = document.getElementById('ev-bind-14');
if (el_ev_bind_14) {
    el_ev_bind_14.addEventListener('click', function(event) {
        switchPengaturanAkunTab('profil')
    });
} else {
    console.warn("Element #ev-bind-14 not found for event binding.");
}


// Extracted from div #ev-bind-15
const el_ev_bind_15 = document.getElementById('ev-bind-15');
if (el_ev_bind_15) {
    el_ev_bind_15.addEventListener('click', function(event) {
        switchPengaturanAkunTab('keamanan')
    });
} else {
    console.warn("Element #ev-bind-15 not found for event binding.");
}


// Extracted from div #ev-bind-16
const el_ev_bind_16 = document.getElementById('ev-bind-16');
if (el_ev_bind_16) {
    el_ev_bind_16.addEventListener('click', function(event) {
        switchPengaturanAkunTab('tampilan')
    });
} else {
    console.warn("Element #ev-bind-16 not found for event binding.");
}


// Extracted from div #ev-bind-17
const el_ev_bind_17 = document.getElementById('ev-bind-17');
if (el_ev_bind_17) {
    el_ev_bind_17.addEventListener('click', function(event) {
        switchPengaturanAkunTab('notifikasi')
    });
} else {
    console.warn("Element #ev-bind-17 not found for event binding.");
}


// Extracted from div #ev-bind-18
const el_ev_bind_18 = document.getElementById('ev-bind-18');
if (el_ev_bind_18) {
    el_ev_bind_18.addEventListener('click', function(event) {
        switchPengaturanAkunTab('aktivitas')
    });
} else {
    console.warn("Element #ev-bind-18 not found for event binding.");
}


// Extracted from button #ev-bind-19
const el_ev_bind_19 = document.getElementById('ev-bind-19');
if (el_ev_bind_19) {
    el_ev_bind_19.addEventListener('click', function(event) {
        showPengaturanAkunMenu()
    });
} else {
    console.warn("Element #ev-bind-19 not found for event binding.");
}


// Extracted from button #ev-bind-20
const el_ev_bind_20 = document.getElementById('ev-bind-20');
if (el_ev_bind_20) {
    el_ev_bind_20.addEventListener('click', function(event) {
        document.getElementById('input-profil-foto').click()
    });
} else {
    console.warn("Element #ev-bind-20 not found for event binding.");
}


// Extracted from input #input-profil-foto
const el_input_profil_foto = document.getElementById('input-profil-foto');
if (el_input_profil_foto) {
    el_input_profil_foto.addEventListener('change', function(event) {
        handleProfilePhotoChange(event)
    });
} else {
    console.warn("Element #input-profil-foto not found for event binding.");
}


// Extracted from button #btn-edit-profil
const el_btn_edit_profil = document.getElementById('btn-edit-profil');
if (el_btn_edit_profil) {
    el_btn_edit_profil.addEventListener('click', function(event) {
        toggleEditProfile()
    });
} else {
    console.warn("Element #btn-edit-profil not found for event binding.");
}


// Extracted from button #ev-bind-21
const el_ev_bind_21 = document.getElementById('ev-bind-21');
if (el_ev_bind_21) {
    el_ev_bind_21.addEventListener('click', function(event) {
        toggleEditProfile(true)
    });
} else {
    console.warn("Element #ev-bind-21 not found for event binding.");
}


// Extracted from form #form-password
const el_form_password = document.getElementById('form-password');
if (el_form_password) {
    el_form_password.addEventListener('submit', function(event) {
        if (typeof savePassword === 'function') {
            savePassword(event);
        }
    });
} else {
    console.warn("Element #form-password not found for event binding.");
}


// Extracted from button #ev-bind-22
const el_ev_bind_22 = document.getElementById('ev-bind-22');
if (el_ev_bind_22) {
    el_ev_bind_22.addEventListener('click', function(event) {
        toggleDarkModeUI(this)
    });
} else {
    console.warn("Element #ev-bind-22 not found for event binding.");
}


// Extracted from select #ev-bind-23
const el_ev_bind_23 = document.getElementById('ev-bind-23');
if (el_ev_bind_23) {
    el_ev_bind_23.addEventListener('change', function(event) {
        mockSaveSetting('Kepadatan Tabel')
    });
} else {
    console.warn("Element #ev-bind-23 not found for event binding.");
}


// Extracted from select #ev-bind-24
const el_ev_bind_24 = document.getElementById('ev-bind-24');
if (el_ev_bind_24) {
    el_ev_bind_24.addEventListener('change', function(event) {
        mockSaveSetting('Bahasa Sistem')
    });
} else {
    console.warn("Element #ev-bind-24 not found for event binding.");
}


// Extracted from button #ev-bind-25
const el_ev_bind_25 = document.getElementById('ev-bind-25');
if (el_ev_bind_25) {
    el_ev_bind_25.addEventListener('click', function(event) {
        pushToast('Pengaturan tampilan berhasil disimpan.', 'success')
    });
} else {
    console.warn("Element #ev-bind-25 not found for event binding.");
}


// Extracted from button #ev-bind-26
const el_ev_bind_26 = document.getElementById('ev-bind-26');
if (el_ev_bind_26) {
    el_ev_bind_26.addEventListener('click', function(event) {
        toggleSettingSwitch(this, 'Notifikasi Email')
    });
} else {
    console.warn("Element #ev-bind-26 not found for event binding.");
}


// Extracted from button #ev-bind-27
const el_ev_bind_27 = document.getElementById('ev-bind-27');
if (el_ev_bind_27) {
    el_ev_bind_27.addEventListener('click', function(event) {
        toggleSettingSwitch(this, 'Notifikasi WhatsApp')
    });
} else {
    console.warn("Element #ev-bind-27 not found for event binding.");
}


// Extracted from button #ev-bind-28
const el_ev_bind_28 = document.getElementById('ev-bind-28');
if (el_ev_bind_28) {
    el_ev_bind_28.addEventListener('click', function(event) {
        toggleSettingSwitch(this, 'Push Notification')
    });
} else {
    console.warn("Element #ev-bind-28 not found for event binding.");
}


// Extracted from button #ev-bind-29
const el_ev_bind_29 = document.getElementById('ev-bind-29');
if (el_ev_bind_29) {
    el_ev_bind_29.addEventListener('click', function(event) {
        pushToast('Pengaturan notifikasi berhasil disimpan.', 'success')
    });
} else {
    console.warn("Element #ev-bind-29 not found for event binding.");
}


// Extracted from button #ev-bind-30
const el_ev_bind_30 = document.getElementById('ev-bind-30');
if (el_ev_bind_30) {
    el_ev_bind_30.addEventListener('click', function(event) {
        closeLayananEditor()
    });
} else {
    console.warn("Element #ev-bind-30 not found for event binding.");
}


// Extracted from button #ev-bind-31
const el_ev_bind_31 = document.getElementById('ev-bind-31');
if (el_ev_bind_31) {
    el_ev_bind_31.addEventListener('click', function(event) {
        submitBuilderDataToServer()
    });
} else {
    console.warn("Element #ev-bind-31 not found for event binding.");
}


// Extracted from select #builder-keperluan-select
const el_builder_keperluan_select = document.getElementById('builder-keperluan-select');
if (el_builder_keperluan_select) {
    el_builder_keperluan_select.addEventListener('change', function(event) {
        handleKeperluanSelectChange()
    });
} else {
    console.warn("Element #builder-keperluan-select not found for event binding.");
}


// Extracted from button #ev-bind-32
const el_ev_bind_32 = document.getElementById('ev-bind-32');
if (el_ev_bind_32) {
    el_ev_bind_32.addEventListener('click', function(event) {
        deleteSelectedKeperluanOption()
    });
} else {
    console.warn("Element #ev-bind-32 not found for event binding.");
}


// Extracted from button #ev-bind-33
const el_ev_bind_33 = document.getElementById('ev-bind-33');
if (el_ev_bind_33) {
    el_ev_bind_33.addEventListener('click', function(event) {
        saveNewKeperluanOption()
    });
} else {
    console.warn("Element #ev-bind-33 not found for event binding.");
}


// Extracted from button #ev-bind-34
const el_ev_bind_34 = document.getElementById('ev-bind-34');
if (el_ev_bind_34) {
    el_ev_bind_34.addEventListener('click', function(event) {
        cancelNewKeperluanOption()
    });
} else {
    console.warn("Element #ev-bind-34 not found for event binding.");
}


// Extracted from button #ev-bind-35
const el_ev_bind_35 = document.getElementById('ev-bind-35');
if (el_ev_bind_35) {
    el_ev_bind_35.addEventListener('click', function(event) {
        addRequirementToKeperluan()
    });
} else {
    console.warn("Element #ev-bind-35 not found for event binding.");
}


// Extracted from select #builder-q-type
const el_builder_q_type = document.getElementById('builder-q-type');
if (el_builder_q_type) {
    el_builder_q_type.addEventListener('change', function(event) {
        toggleBuilderOptionInput()
    });
} else {
    console.warn("Element #builder-q-type not found for event binding.");
}


// Extracted from button #btn-cancel-update-question
const el_btn_cancel_update_question = document.getElementById('btn-cancel-update-question');
if (el_btn_cancel_update_question) {
    el_btn_cancel_update_question.addEventListener('click', function(event) {
        cancelEditBuilderQuestion()
    });
} else {
    console.warn("Element #btn-cancel-update-question not found for event binding.");
}


// Extracted from button #btn-add-update-question
const el_btn_add_update_question = document.getElementById('btn-add-update-question');
if (el_btn_add_update_question) {
    el_btn_add_update_question.addEventListener('click', function(event) {
        addBuilderQuestionToList()
    });
} else {
    console.warn("Element #btn-add-update-question not found for event binding.");
}


// Extracted from select #builder-repeater-keperluan
const el_builder_repeater_keperluan = document.getElementById('builder-repeater-keperluan');
if (el_builder_repeater_keperluan) {
    el_builder_repeater_keperluan.addEventListener('change', function(event) {
        populateBuilderRepeaterSelect()
    });
} else {
    console.warn("Element #builder-repeater-keperluan not found for event binding.");
}


// Extracted from button #ev-bind-36
const el_ev_bind_36 = document.getElementById('ev-bind-36');
if (el_ev_bind_36) {
    el_ev_bind_36.addEventListener('click', function(event) {
        addQuestionToRepeaterTempList()
    });
} else {
    console.warn("Element #ev-bind-36 not found for event binding.");
}


// Extracted from button #btn-cancel-update-repeater
const el_btn_cancel_update_repeater = document.getElementById('btn-cancel-update-repeater');
if (el_btn_cancel_update_repeater) {
    el_btn_cancel_update_repeater.addEventListener('click', function(event) {
        cancelEditRepeaterGroup()
    });
} else {
    console.warn("Element #btn-cancel-update-repeater not found for event binding.");
}


// Extracted from button #btn-add-update-repeater
const el_btn_add_update_repeater = document.getElementById('btn-add-update-repeater');
if (el_btn_add_update_repeater) {
    el_btn_add_update_repeater.addEventListener('click', function(event) {
        saveRepeaterGroup()
    });
} else {
    console.warn("Element #btn-add-update-repeater not found for event binding.");
}


// Extracted from button #ev-bind-37
const el_ev_bind_37 = document.getElementById('ev-bind-37');
if (el_ev_bind_37) {
    el_ev_bind_37.addEventListener('click', function(event) {
        runLayananFilter()
    });
} else {
    console.warn("Element #ev-bind-37 not found for event binding.");
}


// Extracted from button #ev-bind-38
const el_ev_bind_38 = document.getElementById('ev-bind-38');
if (el_ev_bind_38) {
    el_ev_bind_38.addEventListener('click', function(event) {
        openLayananEditor('__NEW__')
    });
} else {
    console.warn("Element #ev-bind-38 not found for event binding.");
}


// Extracted from button #btn-tab-draf
const el_btn_tab_draf = document.getElementById('btn-tab-draf');
if (el_btn_tab_draf) {
    el_btn_tab_draf.addEventListener('click', function(event) {
        switchVerifTab('draf')
    });
} else {
    console.warn("Element #btn-tab-draf not found for event binding.");
}


// Extracted from button #btn-tab-lampiran
const el_btn_tab_lampiran = document.getElementById('btn-tab-lampiran');
if (el_btn_tab_lampiran) {
    el_btn_tab_lampiran.addEventListener('click', function(event) {
        switchVerifTab('lampiran')
    });
} else {
    console.warn("Element #btn-tab-lampiran not found for event binding.");
}


// Extracted from select #edit-status-select
const el_edit_status_select = document.getElementById('edit-status-select');
if (el_edit_status_select) {
    el_edit_status_select.addEventListener('change', function(event) {
        markVerifikasiDirty()
    });
} else {
    console.warn("Element #edit-status-select not found for event binding.");
}


// Extracted from button #ev-bind-39
const el_ev_bind_39 = document.getElementById('ev-bind-39');
if (el_ev_bind_39) {
    el_ev_bind_39.addEventListener('click', function(event) {
        confirmSaveVerification()
    });
} else {
    console.warn("Element #ev-bind-39 not found for event binding.");
}


// Extracted from button #ev-bind-40
const el_ev_bind_40 = document.getElementById('ev-bind-40');
if (el_ev_bind_40) {
    el_ev_bind_40.addEventListener('click', function(event) {
        closeManageStatusModal()
    });
} else {
    console.warn("Element #ev-bind-40 not found for event binding.");
}


// Extracted from form #ev-bind-41
const el_ev_bind_41 = document.getElementById('ev-bind-41');
if (el_ev_bind_41) {
    el_ev_bind_41.addEventListener('submit', function(event) {
        event.preventDefault(); saveAdminSettings();
    });
} else {
    console.warn("Element #ev-bind-41 not found for event binding.");
}


// Extracted from form #ev-bind-42
const el_ev_bind_42 = document.getElementById('ev-bind-42');
if (el_ev_bind_42) {
    el_ev_bind_42.addEventListener('submit', function(event) {
        event.preventDefault(); saveAdminSettings();
    });
} else {
    console.warn("Element #ev-bind-42 not found for event binding.");
}


// Extracted from div #mp-btn-daftar
const el_mp_btn_daftar = document.getElementById('mp-btn-daftar');
if (el_mp_btn_daftar) {
    el_mp_btn_daftar.addEventListener('click', function(event) {
        switchManajemenPenggunaTab('daftar')
    });
} else {
    console.warn("Element #mp-btn-daftar not found for event binding.");
}


// Extracted from div #mp-btn-akses
const el_mp_btn_akses = document.getElementById('mp-btn-akses');
if (el_mp_btn_akses) {
    el_mp_btn_akses.addEventListener('click', function(event) {
        switchManajemenPenggunaTab('akses')
    });
} else {
    console.warn("Element #mp-btn-akses not found for event binding.");
}


// Extracted from div #mp-btn-aktifitas
const el_mp_btn_aktifitas = document.getElementById('mp-btn-aktifitas');
if (el_mp_btn_aktifitas) {
    el_mp_btn_aktifitas.addEventListener('click', function(event) {
        switchManajemenPenggunaTab('aktifitas')
    });
} else {
    console.warn("Element #mp-btn-aktifitas not found for event binding.");
}


// Extracted from button #ev-bind-43
const el_ev_bind_43 = document.getElementById('ev-bind-43');
if (el_ev_bind_43) {
    el_ev_bind_43.addEventListener('click', function(event) {
        backToManajemenPengguna()
    });
} else {
    console.warn("Element #ev-bind-43 not found for event binding.");
}


// Extracted from button #ev-bind-44
const el_ev_bind_44 = document.getElementById('ev-bind-44');
if (el_ev_bind_44) {
    el_ev_bind_44.addEventListener('click', function(event) {
        openModalTambahPengguna()
    });
} else {
    console.warn("Element #ev-bind-44 not found for event binding.");
}


// Extracted from button #ev-bind-45
const el_ev_bind_45 = document.getElementById('ev-bind-45');
if (el_ev_bind_45) {
    el_ev_bind_45.addEventListener('click', function(event) {
        backToManajemenPengguna()
    });
} else {
    console.warn("Element #ev-bind-45 not found for event binding.");
}


// Extracted from button #ev-bind-46
const el_ev_bind_46 = document.getElementById('ev-bind-46');
if (el_ev_bind_46) {
    el_ev_bind_46.addEventListener('click', function(event) {
        saveRoleAccess()
    });
} else {
    console.warn("Element #ev-bind-46 not found for event binding.");
}


// Extracted from button #ev-bind-47
const el_ev_bind_47 = document.getElementById('ev-bind-47');
if (el_ev_bind_47) {
    el_ev_bind_47.addEventListener('click', function(event) {
        backToManajemenPengguna()
    });
} else {
    console.warn("Element #ev-bind-47 not found for event binding.");
}


// Extracted from button #ev-bind-48
const el_ev_bind_48 = document.getElementById('ev-bind-48');
if (el_ev_bind_48) {
    el_ev_bind_48.addEventListener('click', function(event) {
        fetchActivities()
    });
} else {
    console.warn("Element #ev-bind-48 not found for event binding.");
}


// Extracted from button #ev-bind-49
const el_ev_bind_49 = document.getElementById('ev-bind-49');
if (el_ev_bind_49) {
    el_ev_bind_49.addEventListener('click', function(event) {
        closeModalEditPengguna()
    });
} else {
    console.warn("Element #ev-bind-49 not found for event binding.");
}


// Extracted from button #btn-submit-edit-pengguna
const el_btn_submit_edit_pengguna = document.getElementById('btn-submit-edit-pengguna');
if (el_btn_submit_edit_pengguna) {
    el_btn_submit_edit_pengguna.addEventListener('click', function(event) {
        document.getElementById('btn-submit-te-hidden').click()
    });
} else {
    console.warn("Element #btn-submit-edit-pengguna not found for event binding.");
}


// Extracted from form #form-edit-pengguna
const el_form_edit_pengguna = document.getElementById('form-edit-pengguna');
if (el_form_edit_pengguna) {
    el_form_edit_pengguna.addEventListener('submit', function(event) {
        simpanEditPengguna(event)
    });
} else {
    console.warn("Element #form-edit-pengguna not found for event binding.");
}


// Extracted from button #ev-bind-50
const el_ev_bind_50 = document.getElementById('ev-bind-50');
if (el_ev_bind_50) {
    el_ev_bind_50.addEventListener('click', function(event) {
        closeModalTambahPengguna()
    });
} else {
    console.warn("Element #ev-bind-50 not found for event binding.");
}


// Extracted from button #btn-submit-tambah-pengguna
const el_btn_submit_tambah_pengguna = document.getElementById('btn-submit-tambah-pengguna');
if (el_btn_submit_tambah_pengguna) {
    el_btn_submit_tambah_pengguna.addEventListener('click', function(event) {
        document.getElementById('btn-submit-tp-hidden').click()
    });
} else {
    console.warn("Element #btn-submit-tambah-pengguna not found for event binding.");
}


// Extracted from form #form-tambah-pengguna
const el_form_tambah_pengguna = document.getElementById('form-tambah-pengguna');
if (el_form_tambah_pengguna) {
    el_form_tambah_pengguna.addEventListener('submit', function(event) {
        simpanPenggunaBaru(event)
    });
} else {
    console.warn("Element #form-tambah-pengguna not found for event binding.");
}


// Extracted from button #ev-bind-51
const el_ev_bind_51 = document.getElementById('ev-bind-51');
if (el_ev_bind_51) {
    el_ev_bind_51.addEventListener('click', function(event) {
        const p = document.getElementById('tp-password'); const i = this.querySelector('i'); if(p.type === 'password'){p.type = 'text'; i.classList.replace('fa-eye', 'fa-eye-slash');}else{p.type = 'password'; i.classList.replace('fa-eye-slash', 'fa-eye');}
    });
} else {
    console.warn("Element #ev-bind-51 not found for event binding.");
}


// Extracted from div #lightbox-modal
const el_lightbox_modal = document.getElementById('lightbox-modal');
if (el_lightbox_modal) {
    el_lightbox_modal.addEventListener('click', function(event) {
        closeLightbox()
    });
} else {
    console.warn("Element #lightbox-modal not found for event binding.");
}
