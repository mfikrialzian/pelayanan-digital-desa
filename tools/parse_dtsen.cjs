const fs = require('fs');

const lines = fs.readFileSync('D:\\PelayananDigitalDesa\\Pemuktahiran dtsen.txt', 'utf8').split('\n');

let fields = [];
let reqs = [];
let qIdCounter = 1;
let repIdCounter = 1;

let currentSection = "";
let currentRepeater = null;

function determineTypeAndOptions(text) {
    text = text.trim();
    let type = "text";
    let options = "";
    
    // Check if there are options in parentheses
    let match = text.match(/\((.*?)\)$/);
    if (match) {
        let content = match[1].trim();
        let lower = content.toLowerCase();
        
        if (lower === "teks") type = "text";
        else if (lower === "nomor" || lower === "nomor/m2" || lower === "pcs" || lower === "gram") type = "number";
        else if (lower === "tanggal") type = "date";
        else if (content.includes(",")) {
            type = "dropdown";
            options = content.split(',').map(s => s.trim()).join(', ');
        } else if (lower.includes('dropdown')) {
            type = "dropdown";
            options = "Opsi 1, Opsi 2"; // Default fallback
        } else if (lower === "ada, tidak ada" || lower === "ya, tidak" || lower === "ya, tidak ada" || lower === "ada,tidak" || lower === "ada,tidak ada" || lower === "ada, tidak") {
            type = "dropdown";
            options = "Ya, Tidak"; // normalized
            if (lower.includes("ada")) options = "Ada, Tidak";
        }
        
        // Remove the parentheses part from the label
        text = text.replace(/\(.*?\)$/, "").trim();
    }
    
    // Check for + (total nilai asset)
    if (text.includes("+ (total nilai asset)")) {
        text = text.replace("+ (total nilai asset)", "").trim();
    }

    return { label: text, type: type, options: options };
}

lines.forEach(line => {
    line = line.trim();
    if (!line) return;
    
    if (line.startsWith("Persyaratan:")) {
        currentSection = "req";
        return;
    }
    
    if (currentSection === "req") {
        if (/^\d+\./.test(line) || line.startsWith("-")) {
            reqs.push({
                keperluan: "Pemutakhiran Data Sensus",
                text: line.replace(/^\d+\.\s*|-\s*/, "").trim()
            });
        }
        return;
    }
    
    // Sections
    if (/^\d+\.\s/.test(line)) {
        currentSection = line.replace(/^\d+\.\s*/, "").trim();
        
        // If section is Keterangan Anggota Keluarga, make it a repeater
        if (currentSection.includes("Anggota Keluarga") && currentSection.includes("diisi sesuai jumlah")) {
            currentRepeater = {
                id: "q_repeater_" + repIdCounter++,
                label: "Data Anggota Keluarga",
                type: "repeater",
                required: true,
                keperluan: "Pemutakhiran Data Sensus",
                options: [] // We will stringify this later
            };
            fields.push(currentRepeater);
        } else {
            currentRepeater = null;
        }
        return;
    }
    
    if (line.startsWith("Kepemilikan aset") || line.startsWith("sumber penerangan utama") || line.startsWith("- jumlah meteran") || line.startsWith("- daya meteran") || line.startsWith("- Id pelanggan") || line.startsWith("- No meteran")) {
        // Just parsing normal lines, indentations are fine
    }
    
    if (line.startsWith("-")) {
        let text = line.replace(/^-/, "").trim();
        let { label, type, options } = determineTypeAndOptions(text);
        
        let q = {
            id: currentRepeater ? "q_anggota_" + qIdCounter++ : "q_" + qIdCounter++,
            label: label,
            type: type,
            required: true,
            keperluan: "Pemutakhiran Data Sensus"
        };
        if (options) {
            q.options = options;
        }
        
        if (currentRepeater) {
            currentRepeater.options.push(q);
        } else {
            fields.push(q);
        }
    }
});

// Stringify repeater options
fields.forEach(f => {
    if (f.type === "repeater" && Array.isArray(f.options)) {
        f.options = JSON.stringify(f.options);
    }
});

let reqStr = reqs.map(r => `[${r.keperluan}] ${r.text}`).join(";;;");
let fieldStr = fields.map(f => JSON.stringify(f)).join(";;;");

let dtsenService = {
    id: "layanan_dtsen",
    nama: "Pemutakhiran Data Sensus (dtsen)",
    bidang: "Kasi Pemerintahan, Kasi Pelayanan",
    syarat: reqStr,
    pertanyaan: fieldStr,
    judulSectionIsian: "Pemutakhiran Data Sensus",
    deskripsiSectionIsian: "Formulir pendataan kependudukan terpadu",
    logikaKondisional: "[]",
    templateDocId: "",
    templatePratinjau: ""
};

const output = `export const dtsenData = ${JSON.stringify(dtsenService, null, 4)};`;
fs.writeFileSync('D:\\PelayananDigitalDesa\\vercel-frontend\\src\\core\\dtsen_data.js', output);
console.log("Successfully generated dtsen_data.js");
