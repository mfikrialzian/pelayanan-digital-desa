const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, '../index.html');
const jsOutputPath = path.join(__dirname, '../src/events_binding.js'); // Or just ../events_binding.js

let html = fs.readFileSync(htmlPath, 'utf8');

// Regex to find elements with on[event]="...". 
// This simple regex handles normal cases where > isn't inside attribute values.
const tagRegex = /<([a-zA-Z0-9]+)\s+([^>]*?)\b(onclick|onchange|onsubmit)="([^"]+)"([^>]*?)>/gi;

let counter = 1;
const bindings = [];

let newHtml = html.replace(tagRegex, (match, tagName, beforeAttrs, eventType, eventCode, afterAttrs) => {
    // Check if there is an ID in beforeAttrs or afterAttrs
    const idRegex = /\bid="([^"]+)"/i;
    let elementId = null;
    let m = beforeAttrs.match(idRegex) || afterAttrs.match(idRegex);
    
    let injectedIdStr = "";
    if (m && m[1]) {
        elementId = m[1];
    } else {
        elementId = `ev-bind-${counter++}`;
        injectedIdStr = ` id="${elementId}"`;
    }

    // Determine the JS event name (remove "on")
    const jsEventName = eventType.toLowerCase().substring(2);

    // Format the binding code
    // Use an IIFE or block if needed, but a simple function wrapper is best
    bindings.push(`
// Extracted from ${tagName} #${elementId}
const el_${elementId.replace(/-/g, '_')} = document.getElementById('${elementId}');
if (el_${elementId.replace(/-/g, '_')}) {
    el_${elementId.replace(/-/g, '_')}.addEventListener('${jsEventName}', function(event) {
        ${eventCode}
    });
} else {
    console.warn("Element #${elementId} not found for event binding.");
}
`);

    // Reconstruct the tag without the on[event]="..." and insert the ID if generated
    return `<${tagName}${injectedIdStr} ${beforeAttrs} ${afterAttrs}>`.replace(/\s+/g, ' ').replace(/ >$/, '>');
});

fs.mkdirSync(path.dirname(jsOutputPath), { recursive: true });
fs.writeFileSync(jsOutputPath, bindings.join('\n'), 'utf8');
fs.writeFileSync(htmlPath, newHtml, 'utf8');

console.log(`Extracted ${bindings.length} events to ${jsOutputPath}`);
