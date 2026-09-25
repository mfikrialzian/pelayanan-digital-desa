const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const targetStr = `                                    <button id="time-filter-Bulan-Ini" onclick="window.setTimeFilter('Bulan Ini')" class="px-4 py-1.5 bg-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-700 font-semibold text-xs rounded-full whitespace-nowrap transition-colors">Bulan Ini</button>
                                </div>
                            </div>
                            <!-- Tabs placed right below the header area -->`;

const newStr = `                                    <button id="time-filter-Bulan-Ini" onclick="window.setTimeFilter('Bulan Ini')" class="px-4 py-1.5 bg-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-700 font-semibold text-xs rounded-full whitespace-nowrap transition-colors">Bulan Ini</button>
                                    <button class="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 ml-2">
                                        <i class="fa-solid fa-filter"></i> Filter
                                    </button>
                                </div>
                            </div>
                            <!-- Tabs placed right below the header area -->`;
                            
html = html.replace(targetStr, newStr);
fs.writeFileSync('index.html', html);
console.log('Restored Filter button');
