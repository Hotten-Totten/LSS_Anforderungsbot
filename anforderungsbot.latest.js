/* 
LSS_Anforderungsbot
Version: 0.0.15.40
*/

(function () {
  'use strict';

  // ===== VERSION SOFORT EXPORTIEREN =====
  window.__ANFB_VERSION__ = '0.0.15.40';

  console.log('[ANFB] LIVE', window.__ANFB_VERSION__, new Date().toISOString());

  // ===== Loader-Key Check =====
  const EXPECT_KEY = 'ANFB-9f3c2d4a1b7e49d8a6c1f0b2c4d6e8aa';
  if (window.__ANFB_LOADER_KEY__ !== EXPECT_KEY) {
    console.warn('[ANFB] Bitte den offiziellen Loader nutzen. Direktstart blockiert.');
    return;
  }

  // ===== Doppelstart verhindern =====
  if (window.__ANFB_LOADED__) {
    console.warn('[ANFB] bereits geladen – stoppe Doppelstart');
    return;
  }
  window.__ANFB_LOADED__ = true;

  console.log('[ANFB] ✅ Bot startet jetzt…');


    console.clear();
    let personnelReq = 0;
    let selectedTypeCounts = {};
    window._reloadAttempts = 0;
    const MAX_RELOADS = 4; // maximal 2x Nachladen, dann ist Schluss!
    // ── Boot-Äquivalenzen (Prio-Reihenfolge)
    const BOAT_EQUIV = [68, 66, 67, 70];



    window._reloadAttempted = false;
    // 🔁 Mapping Fahrzeugtyp → Namevarianten (inkl. Alternativen)
    const vehicleTypeNameVariants = {
        2:   ["DLK 23", "DLK", "Drehleitern"],
        3:   ["elw 1"],
        5:   ["GW-A"],
        10:  ["GW-Öl"],
        11:  ["schlauchwagen (gw-l2 wasser oder sw)", "schlauchwagen gw-l2 wasser oder sw", "gw-l2 wasser oder sw", "gw-l2 wasser", "schlauchwagen", "sw 1000", "sw 2000"],
        12:  ["gw-mess", "GW-Mess", "gw-messtechnik", "GW-Messtechnik"],
        27:  ["GW-Gefahrgut"],
        28:  ["RTW", "KTW", "KTW-B", "RTW oder KTW oder KTW-B"],
        29:  ["NEF"],
        30:  ["löschfahrzeug","rüstwagen", "feuerlöschpumpen z. b. lf"],
        31: ["RTH", "rth", "rettungshubschrauber", "rth winde"],
        32:  ["FuStW", "funkstreifenwagen"],
        33:  ["GW-Höhenrettung", "gw-höhenrettung"],
        34:  ["elw 2"],
        35:  ["leBefKw"],
        39:  ["GKW"],
        40:  ["MTW-TZ", "thw-einsatzleitung mtw tz"],
        41:  ["MzGW (FGr N)", "mzgw fgr n"],
        42:  ["LKW K 9"],
        43:  ["BRmG R"],
        44:  ["Anh DLE", "anhänger drucklufterzeugung"],
        45:  ["MLW 5"],
        46:  ["WLF"],
        50:  ["GruKw"],
        51:  ["fükw (polizei)", "fükw polizei"],
        52:  ["GefKw"],
        53:  ["Dekon-P"],
        55:  ["KdoW-LNA", "LNA"],
        56:  ["KdoW-OrgL", "OrgL"],
        57:  ["FwK"],
        59:  ["ELW 1 (SEG)"],
        60:  ["GW-San", "GWSan"],
        61:  ["Polizeihubschrauber","polizeihubschrauber"],
        63:  ["GW-Taucher"],
        64:  ["GW-Wasserrettung"],
        66:  ["MZB", "Boot", "Boote"],
        67:  ["MZB", "Rettungsboot", "Boot", "Boote"],
        68:  ["MZB", "Boot", "Boote"],
        69:  ["tauchkraftwagen", "gw-taucher", "GW-Taucher"],
        70:  ["MZB", "Boot", "Boote"],
        72:  ["Wasserwerfer", "wasserwerfer"],
        74:  ["naw"],
        79:  ["SEK - ZF", "sek-fahrzeuge"],
        80:  ["SEK - MTF", "sek-fahrzeuge"],
        81:  ["MEK - ZF", "mek-fahrzeuge", "Mek-fahrzeuge", "MEK-fahrzeuge"],
        82:  ["MEK - MTF", "mek-fahrzeuge", "Mek-fahrzeuge", "MEK-fahrzeuge", "MEK-Fahrzeuge"],
        91:  ["Rettungshundefahrzeug", "rettungshundefahrzeug", "rettungshundestaffeln"],
        94:  ["DHuFüKW"],
        95:  ["Polizeimotorrad", "Motorradstreife", "Polizeimotorräder"],
        96:  ["Außenlastbehälter (allgemein)", "außenlastbehälter allgemein"],
        98:  ["Zivilstreifenwagen", "Zivilfahrzeug"],
        103: ["funkstreifenwagen (dienstgruppenleitung)"],
        101: ["Schmutzwasserpumpe"],
        109: ["MzGW SB", "mzgw sb"],
        110: ["NEA50"],
        111: ["NEA50"],
        112: ["NEA200"],
        114: ["GW-Lüfter", "lüfter"],
        121: ["GTLF"],
        129: ["ELW2 Drohne", "drohneneinheit"],
        130: ["gw-bt", "betreuungs- und verpflegungsausstattung", "betreuungs und verpflegungsausstattung", "feldküche","bt-küche"], // Der GW-Bt transportiert Betreuungs- und Verpflegungsausstattung und kann als Feldküche zur Versorgung von Einsatzkräften und Betroffenen eingesetzt werden. 2x Verpflegungshelfer + 1 x Betreuungsdienst
        134: ["Pferdetransporter klein", "pferdetransporter klein", "polizeipferde", "Polizeipferde", "Reiterstaffel"],
        135: ["Pferdetransporter klein", "pferdetransporter klein", "polizeipferde", "Polizeipferde", "Reiterstaffel"],
        131: ["bt-kombi"], // Bt-Kombi Betreuungskombi: Der Bt-Kombi transportiert Betreuungsdienstler zur Versorgung von Einsatzkräften und Betroffenen zu Einsätzen. 9 x Betreuungsdienst
        139: ["GW-Küche"],// Feldküche zur Versorgung von Einsatzkräften und Betroffenen eingesetzt werden. 3 Personale 2x Verpflegungshelfer + 1x Feuerwehr-Verpflegungseinheit
        140: ["MTW-Verpflegung"], // 6 Personale Feuerwehr-Verpflegungseinheit
        144: ["FüKW (THW)", "fükw thw"],
        145: ["FüKomKW", "fükomkw"],
        146: ["Anh FüLa", "anh füla"],
        147: ["FmKW", "fmkw"],
        148: ["MTW-FGr K", "mtw fgr k"],
        157: ["RTH Winde", "rth winde"],
        158: ["GW-Höhenrettung (Bergrettung)", "höhenrettung bergrettung"],
        159: ["Seenotrettungskreuzer"],
        160: ["Seenotrettungsboot"],
        161: ["Hubschrauber (Seenotrettung)"],
        163: ["Bahnrettungsfahrzeug", "HLF Schiene", "bahnrettungsfahrzeug"],
        165: ["LauKw", "laukw"],
        167: ["SLF"],
        171: ["GW TeSi"],
        172: ["LKW Technik"],
        173: ["MTW TeSi"],
        174: ["Anh TeSi"],
        175: ["NEA50"],

    };

    const vehicleTypeNormMap = {};
    for (const [tid, names] of Object.entries(vehicleTypeNameVariants)) {
        vehicleTypeNormMap[tid] = names.map(norm);
    }


    function norm(str) {
        return String(str || '')
            .toLowerCase()
            .replace(/ä/g,'ae').replace(/ö/g,'oe').replace(/ü/g,'ue')
            .replace(/ß/g,'ss')
            .replace(/[^a-z0-9]/g, ''); // killt leerzeichen, bindestriche, klammern etc.
    }

    // 🔽 Boote sauber matchen (alle verstehen "boot"/"boote"/"mzb")
    const _boatLabels = ["boot", "boote", "mzb", "mehrzweckboot", "rettungsboot", "schlauchboot"];

    vehicleTypeNameVariants[66] = (vehicleTypeNameVariants[66] || ["MZB"]).concat(_boatLabels);
    vehicleTypeNameVariants[67] = (vehicleTypeNameVariants[67] || []).concat(_boatLabels);
    vehicleTypeNameVariants[68] = (vehicleTypeNameVariants[68] || ["MZB"]).concat(_boatLabels);
    vehicleTypeNameVariants[70] = (vehicleTypeNameVariants[70] || ["MZB"]).concat(_boatLabels);

    // 🔽 Drohnen-Mapping erweitern (alle verstehen "drohneneinheit"/"drohne"/"uas")
    vehicleTypeNameVariants[129] = (vehicleTypeNameVariants[129] || [])
        .concat(["drohneneinheit", "drohne", "uas", "drohnenstaffel", "drohnen-einheit"]);
    vehicleTypeNameVariants[127] = (vehicleTypeNameVariants[127] || ["GW-UAS", "gw-uas"])
        .concat(["drohneneinheit", "drohne", "uas", "drohnenstaffel", "drohnen-einheit"]);
    vehicleTypeNameVariants[125] = (vehicleTypeNameVariants[125] || [])
        .concat(["drohneneinheit", "drohne", "uas", "drohnenstaffel", "drohnen-einheit"]);
    vehicleTypeNameVariants[126] = (vehicleTypeNameVariants[126] || [])
        .concat(["drohneneinheit", "drohne", "uas", "drohnenstaffel", "drohnen-einheit"]);
    vehicleTypeNameVariants[128] = (vehicleTypeNameVariants[128] || [])
        .concat(["drohneneinheit", "drohne", "uas", "drohnenstaffel", "drohnen-einheit"]);


// Abhängigkeiten: wenn auf Typ X geklickt wird, soll Y mitgeschickt werden

    const dependentVehicleTypes = {
  28: [59, 60, 29],
 // 70: [39],
  175: [172], // NEA50 (Anhänger) -> LKW Technik (Zugfahrzeug)
  174: [171], // Anh TeSi -> GW TeSi
};


    // Bestimmung der Einsatzfarbe Rot= Unbearbeitet oder fehlende Fahrzeuge, Gelb= Bearbeitet, Fahrzeuge auf Anfahrt, Grün= Einsatz wird beendet
function getMissionColor(doc) {
    const img = doc.querySelector('#mission_general_info img[src*=".png"]');
    if (!img) return null;
    const src = img.getAttribute('src');
    if (/_rot\.png$/.test(src)) return 'rot';
    if (/_gelb\.png$/.test(src)) return 'gelb';
    if (/_gruen\.png$/.test(src)) return 'gruen';
    return null;
}



    function cleanLabel(label) {
        return label
            .replace(/einsatzart/gi, '')
            .replace(/generiert.*/gi, '')
            .replace(/voraussetzung(en)? an.*/gi, '')
            .replace(/credits im durchschnitt/gi, '')
            .replace(/[.:]/g, '')
            .replace(/\s+/g, ' ')
            .trim();
    }



    // ▪ Patienten- und Gefangenen-Zähler
    function extractPatientsAndPrisoners(doc) {
        let p=0,g=0;
        try {
            const html = doc.querySelector('#mission_general_info small')?.innerHTML||'';
            p = +(html.match(/(\d+)\s*<img[^>]+patient_dark\.svg/i)?.[1]||0);
            g = +(html.match(/(\d+)\s*<img[^>]+prisoner_dark\.svg/i)?.[1]||0);
        } catch{}
        return { patienten: p, gefangene: g };
    }

    // ▪ Fehlende Anforderungen aus Haupt-UI
    function extractMissingRequirements(doc) {
        const box = doc.querySelector('#missing_text');
        if (!box) return [];
        return [...box.querySelectorAll('[data-requirement-type]')]
            .map(el => el.textContent.trim()).filter(Boolean);
    }

    // ▪ Anforderungen aus Hilfe-Tab (unsichtbares Iframe)
    function extractHelpRequirements(helpDoc) {
        const table = [...helpDoc.querySelectorAll('div.col-md-4 table')]
            .find(t=>t.querySelector('th')?.textContent.includes('Benötigte Fahrzeuge'));
        if (!table) return [];
        return [...table.querySelectorAll('tbody tr')]
            .map(r=>{
                const [name,count] = r.querySelectorAll('td');
                let label = name.textContent.trim();
            const cnt = count.textContent.trim();
            if (!label) return null;

            // "Wahrscheinlichkeit"-Zeilen bleiben raus, aber "wenn vorhanden" behalten wir als normale Anforderung
            if (/wahrscheinlichkeit/i.test(label)) return null;

            // "wenn vorhanden" nur aus dem Text entfernen (damit das Mapping greift)
            label = label.replace(/\(?(wenn vorhanden)\)?/ig, '').trim();

            return `${cnt}x ${label}`;
            }).filter(Boolean);
    }

// ▪ Patienten-Nachalarm (UI + Klick + Auto-Alarm)
function handlePatientNachalarm(doc, attempt = 0, persist = { summed: null, alarmiert: {}, ended: false, autoFired: false }) {
    const MAX = 1; // wie gehabt
    const needs = getPatientAlerts(doc);
    if (!Object.keys(needs).length) return false;

    // Summierung inkl. Deckel für LNA/OrgL
    if (!persist.summed) {
        persist.summed = {};
        let lna = false, orgl = false;
        Object.entries(needs).forEach(([nm, c]) => {
            nm.split(',').forEach(n => {
                const s = n.trim();
                if (s === 'LNA' && !lna) { persist.summed.LNA = 1; lna = true; }
                else if (s === 'OrgL' && !orgl) { persist.summed.OrgL = 1; orgl = true; }
                else persist.summed[s] = (persist.summed[s] || 0) + c;
            });
        });
        ['LNA', 'OrgL'].forEach(k => { if (persist.summed[k] > 1) persist.summed[k] = 1; });
    }

    // Checkbox-Klicks
    const map = { "RTW": 28, "NEF": 29, "LNA": 55, "OrgL": 56, "RTH": 31 };
    Object.entries(persist.summed).forEach(([nm, c]) => {
        const tid = map[nm];
        let want = c - (persist.alarmiert[nm] || 0);
        if (!tid || want <= 0) return;
        [...doc.querySelectorAll('tr.vehicle_select_table_tr')].forEach(tr => {
            if (!want) return;
            const cb = tr.querySelector('input.vehicle_checkbox');
            const id = +cb?.getAttribute('vehicle_type_id');
            if (id === tid && !cb.checked) {
                cb.checked = true;
                want--;
                persist.alarmiert[nm] = (persist.alarmiert[nm] || 0) + 1;
            }
        });
    });

    // Box zeichnen
    renderNachalarmInfo(doc, persist.summed, persist.alarmiert, persist.ended, persist.autoFired);

    // Noch Bedarf? Einmal nachladen
    const missing = Object.entries(persist.summed).filter(([n, c]) => (persist.alarmiert[n] || 0) < c);
    const btn = doc.querySelector('a.missing_vehicles_load');
    if (missing.length && btn && attempt < MAX) {
        btn.click();
        setTimeout(() => {
            const nf = [...document.querySelectorAll('iframe.lightbox_iframe')].find(f => f.style.display !== 'none');
            const nd = nf?.contentDocument || nf?.contentWindow?.document;
            if (nd) handlePatientNachalarm(nd, attempt + 1, persist);
        }, 2000);
        return true;
    }

    // Abschluss
    persist.ended = true;
    const allMet = Object.entries(persist.summed).every(([n, c]) => (persist.alarmiert[n] || 0) >= c);

    if (allMet) {
        // Auto-Alarm nur einmal auslösen
        if (!persist.autoFired && !doc.body.dataset.aaoPatientAutoFired) {
            persist.autoFired = true;
            doc.body.dataset.aaoPatientAutoFired = '1';
            renderNachalarmInfo(doc, persist.summed, persist.alarmiert, true, true);
            triggerAutoAlarm(doc);
        }
    } else {
        renderNachalarmInfo(doc, persist.summed, persist.alarmiert, true, false);
    }

    return true;
}

    function triggerAutoAlarm(doc) {
    // bevorzugt „Alarm & weiter“, sonst „Alarm + Verband“
    const btn = doc.querySelector('a.alert_next') || doc.querySelector('a.alert_next_alliance');
    if (btn) {
        console.log('🚨 Auto-Nachalarm: klicke Alarm-Button');
        try { btn.click(); }
        catch { /* no-op */ }
    } else {
        console.warn('🚨 Auto-Nachalarm: Alarm-Button nicht gefunden.');
    }
}


    function getPatientAlerts(doc) {
        const alerts=[...doc.querySelectorAll('.mission_patient .alert-danger')];
        const o={};
        alerts.forEach(a=>{
            const m=a.textContent.match(/Wir benötigen:\s*(.+)/i);
            if(m) o[m[1].trim()] = (o[m[1].trim()]||0)+1;
        });
        return o;
    }
function renderNachalarmInfo(doc, summed, alarmed, ended = false, autoFired = false) {
    const ui = doc.getElementById('aao-info');

    // Box holen/erstellen – bevorzugt als Kind von #aao-info
    let box = ui ? ui.querySelector('#aao-nachalarminfo') : doc.getElementById('aao-nachalarminfo');
    if (!box) {
        box = doc.createElement('div');
        box.id = 'aao-nachalarminfo';
        if (ui) {
            ui.appendChild(box);
        } else {
            // Fallback: kurz eigenständig anzeigen, bis das UI erscheint
            box.style.cssText = `
              position:fixed;left:50%;top:calc(50% + 220px);transform:translate(-50%,0);z-index:99999;
              background:#1e1e1e;color:#fff;padding:8px 10px;border-radius:10px;
              font-size:12px;line-height:1.25;box-shadow:0 3px 14px rgba(0,0,0,.45);
              width:360px;max-width:92vw;border:1px solid #2a2a2a;
            `;
            doc.body.appendChild(box);
        }
    }

    // Wenn das UI inzwischen existiert, Box dort "anbauen"
    if (ui && box.parentElement !== ui) {
        box.remove();
        ui.appendChild(box);
    }

    // Styling je nach Platzierung (inline im UI vs. separat)
    const inline = ui && box.parentElement === ui;
    if (inline) {
        box.style.cssText = `
          margin-top:8px;padding:8px;border-radius:8px;
          background:#202020;border:1px solid #2a2a2a;
          white-space:pre-wrap;font-size:12px;line-height:1.25;color:#fff;
        `;
    }

    // Inhalt bauen
    const rows = Object.entries(summed).map(([n, c]) => {
        const a = alarmed[n] || 0, miss = c - a;
        return `${c}× ${n} → nachalarmiert: ${a}${miss ? ` (fehlend: ${miss})` : ''}`;
    }).join('\n');

    let status;
    if (!ended) status = '⏳ Nachalarm läuft…';
    else if (autoFired) status = '✅ Nachalarm erfüllt – Alarm ausgelöst…';
    else status = '⚠️ Nachalarm beendet, nicht alle Fahrzeuge verfügbar!';

    box.innerHTML = `
      <div style="font-weight:600;margin-bottom:4px;">🚑 Patienten-Nachalarm</div>
      <pre style="margin:0;white-space:pre-wrap">${rows}</pre>
      <div style="margin-top:6px;opacity:.85">${status}</div>
    `;
}

    // ▪ Haupt-AAO: Fahrzeuge auswählen

function selectVehiclesByRequirement(reqs, mapping, actualPatients = 0, istHilfeSeite = false, nefProb = 0, rthProb = 0) {
    const typeIdCounts = {};
    const selectedTypeCounts = {};
    const missingTypeCounts = {};
    let water = 0, people = 0;


    // --- RTW, NEF, RTH nur bei Erstanforderung aus Hilfeseite ---
    if (istHilfeSeite && actualPatients > 0) {
        typeIdCounts[28] = actualPatients;

        // NEF nach Wahrscheinlichkeit
        if (nefProb > 0) {
            let nefCount = 0;
            if (actualPatients <= 3 && nefProb >= 70) {
                nefCount = 0;
            } else if (actualPatients > 3) {
                nefCount = Math.ceil((nefProb / 100) * actualPatients);
            }
            if (nefCount > 0) {
                typeIdCounts[29] = Math.max(typeIdCounts[29] || 0, nefCount);
                console.log(`➕ NEF (Typ 29): ${nefCount} für ${actualPatients} Patienten bei ${nefProb}% Wahrscheinlichkeit`);
            }
        }
        // RTH nach Wahrscheinlichkeit
        if (rthProb > 0) {
            const rthCount = Math.ceil((rthProb / 100) * actualPatients);
            typeIdCounts[31] = Math.max(typeIdCounts[31] || 0, rthCount);
            console.log(`➕ RTH (Typ 31): ${rthCount} für ${actualPatients} Patienten bei ${rthProb}% Wahrscheinlichkeit`);
        }
        // LNA/OrgL-Deckel
        if (actualPatients > 4) typeIdCounts[55] = 1;
        if (actualPatients > 9) typeIdCounts[56] = 1;
    }

    // ─────────────────────────────────────────────────────────────
    // Fallback-Matrix (gleich-/höherwertige Ersatztypen)
    // NEA50-Gruppe: 110/111/112/175 dürfen sich gegenseitig ersetzen
    // ELW1-Gruppe: 3 darf durch 34 oder 129 ersetzt werden (Mischung erlaubt)

    const fallbackVehicleTypes = {
  // ELW1 → ELW2 / ELW2-Drohne
  3:   [34, 129],

  // ✅ neu: GW-Wasserrettung darf durch GKW (39) ersetzt werden
  64: [39],

  // NEA50-Gruppe
  110: [111, 175, 112],
  111: [110, 175, 112],
  175: [110, 111, 112],
  112: [110, 111, 175],

  // Drohnen-Gruppe: alle können alle ersetzen
  129: [127, 125, 126, 128],
  127: [129, 125, 126, 128],
  125: [129, 127, 126, 128],
  126: [129, 127, 125, 128],
  128: [129, 127, 125, 126],

  // ✅ neu: RTH kann durch RTH Winde ersetzt werden
  31: [157],
        // ggf. weitere Fallbacks hier…
    };

    // ─────────────────────────────────────────────────────────────

    // Bereits alarmierte/unterwegs
    const assignedCounts = {};
    document.querySelectorAll('[data-fms-status]').forEach(el => {
        const fms = parseInt(el.getAttribute('data-fms-status'), 10);
        if (fms === 3 || fms === 4) {
            const tid = parseInt(el.getAttribute('data-vehicle-type-id'), 10);
            if (!isNaN(tid)) assignedCounts[tid] = (assignedCounts[tid] || 0) + 1;
        }
    });
    console.log('ℹ️ Bereits dispatchte Fahrzeuge (FMS 3/4):', assignedCounts);

    // Sonderbedarfe aus "fehlende Anforderungen"
    let dekonpeople = 0;
    let wasserpeople = 0;
    let betreuerpeople = 0;
    let wasserbedarf = 0;
    let sonderbedarf = 0; // Sonderlöschmittel

    reqs = reqs.filter(r => {
        let m;
        if (m = r.match(/uns fehlt:\s*(\d+)\s*l/i)) { water = +m[1]; return false; }
        if (m = r.match(/fehlendes personal:\s*(\d+)\s*feuerwehrleute/i)) { people = +m[1]; return false; }
        if (m = r.match(/fehlendes personal:\s*(\d+)\s*personen mit dekon-p-ausbildung/i)) { dekonpeople = +m[1]; return false; }
        if (m = r.match(/fehlende personen mit dekon-p-ausbildung:?\s*(\d+)/i)) { dekonpeople = +m[1]; return false; }
        if (m = r.match(/fehlendes personal:\s*(\d+)\s*gw[\s\-]?wasserrettung/i)) { wasserpeople = +m[1]; return false; }
        if (m = r.match(/fehlendes personal:\s*(\d+)\s*x?\s*(?:gw[\s\-]?)?betreuungshelfer/i)) { betreuerpeople = +m[1]; return false; }
        if (m = r.match(/uns fehlt:\s*(\d+)\s*sonderlöschmittel/i)) {sonderbedarf = +m[1];return false;}
        return true;
    });

    // 2) Fahrzeugliste aufsplitten
    const vf = reqs.find(r => /^Fehlende Fahrzeuge:/i.test(r));
    let list = [];
    if (vf) {
        list = vf.replace(/^Fehlende Fahrzeuge:\s*/i, '')
                 .split(',')
                 .map(x => x.trim());
    }
    reqs.filter(r => !/^Fehlende Fahrzeuge:/i.test(r)).forEach(r => list.push(r));

    // 3) Verfügbare Fahrzeuge im IFrame
    const iframe = [...document.querySelectorAll('iframe.lightbox_iframe')]
        .find(f => f.style.display !== 'none');
    const doc = iframe?.contentDocument || iframe?.contentWindow?.document;
    if (doc) {
        const allCheckboxes = doc.querySelectorAll('input.vehicle_checkbox');
        allCheckboxes.forEach(cb => { cb.checked = false; });
    }

    const rows = [...doc.querySelectorAll('tr.vehicle_select_table_tr')];
    const avail = rows.map(tr => {
        const cb = tr.querySelector('input.vehicle_checkbox');
        return { tid: +cb.getAttribute('vehicle_type_id'), cb, sel: cb.checked };
    }).filter(v => v.cb && !v.sel);

    // 4) Liste durchgehen, Zähler füllen
    list.forEach(item => {
        const m = item.match(/^(\d+)\s*x?\s*(.+)$/i);
        if (!m) return;
        const cnt = +m[1];
        const label = m[2].toLowerCase().replace(/[\(\)]/g, ' ').replace(/\s+/g, ' ').trim();
        const labelNoSep = label.replace(/[\s\-]/g, '');
        let found = null;

        // --- Boote: egal welcher Typ, wir zählen auf Solltyp 66 und wählen später äquivalent aus ---
        if (/\bboot|boote\b/i.test(label)) {
            typeIdCounts[66] = (typeIdCounts[66] || 0) + cnt;
            console.log(`➕ Boot-Anforderung erkannt: +${cnt} (Solltyp 66; Auswahl über 66/70/68/67)`);
            return;
        }
        // Spezielle Fallback-Sonderfälle (zuerst prüfen)
        if (label.includes('dienstgruppenleitung')) {
            found = 103;
            console.log(`🔍 Fallback: Typ 103 (FuStW-DGL) wegen "${label}"`);
        }
        else if (label.includes('elw 1')) {
            // Wichtig: "ELW 1" wird als Typ 3 gezählt – Fallbacks decken 34/129 ab
            found = 3;
            console.log(`🔍 ELW 1-Anforderung → Basis-Typ 3 (Fallbacks: 34, 129)`);
        }
        else if (label.includes('betreuungs- und verpflegungsausstattung')) {
            found = 130;
            console.log(`🔍 Fallback: Typ 130 (GW-Bt) wegen "${label}"`);
        }
        else if (label.includes('wasserbedarf')) {
            const x = label.match(/(\d+)/); const minBD = x ? parseInt(x[1], 10) : cnt;
            const need = Math.ceil(minBD / 1600);
            found = 30;
            console.log(`🔍 Fallback: Wasserbedarf → ${need}x HLF20 (1.600 l) (Typ 30) für ${minBD} Wasser`);
            typeIdCounts[found] = (typeIdCounts[found] || 0) + need;
            return;
        }
        else if (label.includes('minimum feuerwehrleute')) {
            const x = label.match(/(\d+)/); const minFF = x ? parseInt(x[1], 10) : cnt;
            const need = Math.ceil(minFF / 9);
            found = 30;
            console.log(`🔍 Fallback: Mindest-Feuerwehrleute → ${need}x HLF20 (Typ 30) für ${minFF} Feuerwehrleute`);
            typeIdCounts[found] = (typeIdCounts[found] || 0) + need;
            return;
        }
        else if (label.includes('dekon-p')) {
            const x = label.match(/(\d+)/); const minDekon = x ? parseInt(x[1], 10) : cnt;
            const need = Math.ceil(minDekon / 6);
            found = 53;
            console.log(`🔍 Fallback: Fehlende Dekon-P Leute → ${need}x Dekon-P (Typ 53) für ${minDekon} Dekon-P Leute`);
            typeIdCounts[found] = (typeIdCounts[found] || 0) + need;
            return;
        }
        else if (label.includes('rettungshubschrauber') || label === 'rth') {
            found = 157; // 🔑 Primär immer RTH Winde
            console.log('🔍 RTH-Anforderung → Primär 157 (RTH Winde)');
        }
        else if (label.replace(/[\s\-]/g, '').includes('gwwasserrettung')) {
            const x = label.match(/(\d+)/);
            const minGW = x ? parseInt(x[1], 10) : cnt;

    // ✅ Bei DIR: 39 hat immer 9 Wasserrettungs-Personale
        const need39 = Math.ceil(minGW / 9);

    // Wir planen direkt 39 (weil es die Personal-Lösung ist)
    typeIdCounts[39] = (typeIdCounts[39] || 0) + need39;

    console.log(`🔍 Personal: GW-Wasserrettung → ${need39}× Typ 39 für ${minGW} Leute (9 pro 39)`);
    return;
}
        else if (label.includes('betreuungshelfer')) {
            const x = label.match(/(\d+)/); const minBH = x ? parseInt(x[1], 10) : cnt;
            const need = Math.ceil(minBH / 9);
            found = 131;
            console.log(`🔍 Fallback: Fehlende Betreuungshelfer → ${need}x Typ 131 für ${minBH} Leute`);
            typeIdCounts[found] = (typeIdCounts[found] || 0) + need;
            return;
        }
        // ✅ Taucher: nimm den ersten verfügbaren (63 vor 69) – robust normalisiert
const nLabel = norm(label);
if (!found && (nLabel.includes('taucher') || nLabel.includes('tauchkraftwagen') || nLabel.includes('gwtaucher'))) {
  const has63 = avail.some(v => v.tid === 63);
  const has69 = avail.some(v => v.tid === 69);

  if (has63) found = 63;
  else if (has69) found = 69;

  console.log(`🔍 Taucher-Sonderfall → genommen: ${found} (63:${has63}, 69:${has69})`);
}

        // Kein Sonderfall → Mapping inkl. "oder"-Logik (robust normalisiert)
if (!found) {
  // nLabel ist oben schon berechnet


  // "oder"-Fälle: jede Alternative einzeln matchen
  if (label.includes(' oder ')) {
    const alternativen = label.split(' oder ').map(s => s.trim());
    outer: for (const alt of alternativen) {
      const nAlt = norm(alt);
      for (const [tid, vars] of Object.entries(vehicleTypeNormMap)) {
        if (vars.some(v => nAlt.includes(v) || v.includes(nAlt))) {
          found = +tid;
          console.log(`🔍 Match (ODER): "${alt}" → Typ ${tid}`);
          break outer;
        }
      }
    }
  } else {
    // normaler Fall
    for (const [tid, vars] of Object.entries(vehicleTypeNormMap)) {
      if (vars.some(v => nLabel.includes(v) || v.includes(nLabel))) {
        found = +tid;
        console.log(`🔍 Match: "${label}" → Typ ${tid}`);
        break;
      }
    }
  }
}


        if (!found) {
            console.warn('⚠️ Kein Typ für', label);
            return;
        }

        // RTW-Sonderfall: keine Doppelzählung (Hilfeseite vs. Einsatzinfo)
        // RTW nur auf der Hilfeseite (Erstalarm) unterdrücken – beim Nachalarm normal zählen
        if (found === 28 && istHilfeSeite) {
            console.log('↩️ RTW auf Hilfeseite bereits berücksichtigt – keine Doppelzählung');
            return;
        }

        if (found === 55 || found === 56) {
            typeIdCounts[found] = 1;
        } else {
            typeIdCounts[found] = (typeIdCounts[found] || 0) + cnt; // ← das greift jetzt auch für RTW (28) beim Nachalarm
        }
    });

    // 5) Wasser/Leute-Zuordnung
    let lfByWater = 0, lfByPeople = 0;
    if (water > 0) {
        lfByWater = Math.ceil(water / 1600);
        if (lfByWater > 0) console.log(`➕ Wasser-Abgleich: ${lfByWater}x Typ 30 für ${water} l`);
    }
    if (people > 0) {
        lfByPeople = Math.ceil(people / 9);
        if (lfByPeople > 0) console.log(`➕ Personal-Abgleich: ${lfByPeople}x Typ 30 für ${people} Feuerwehrleute`);
    }
    const direkterLF = typeIdCounts[30] || 0;
    const maximalLF = Math.max(direkterLF, lfByWater, lfByPeople);
    if (maximalLF > 0) typeIdCounts[30] = maximalLF;

    if (wasserbedarf > 0) {
        const need = Math.ceil(wasserbedarf / 1600);
        typeIdCounts[30] = Math.max(typeIdCounts[30] || 0, need);
        console.log(`➕ Wasserbedarf-Abgleich: ${need}x Typ 30 für ${wasserbedarf} Liter Wasser`);
    }
    if (dekonpeople > 0) {
        const need = Math.ceil(dekonpeople / 6);
        typeIdCounts[53] = Math.max(typeIdCounts[53] || 0, need);
        console.log(`➕ Personal-Abgleich: ${need}x Typ 53 für ${dekonpeople} Dekon-P`);
    }
    if (wasserpeople > 0) {
    let remaining = wasserpeople;

    // verfügbare Fahrzeuge im Auswahlfenster zählen
    let avail64 = avail.filter(v => v.tid === 64 && !v.cb.checked).length;
    let avail39 = avail.filter(v => v.tid === 39 && !v.cb.checked).length;

    let need64 = 0;
    let need39 = 0;

    // ✅ Priorität: erst 64 (6 Plätze), dann 39 (9 Plätze)
    while (remaining > 0 && avail64 > 0) {
        need64++;
        avail64--;
        remaining -= 6;
    }
    while (remaining > 0 && avail39 > 0) {
        need39++;
        avail39--;
        remaining -= 9;
    }

    // Wenn immer noch was fehlt, planen wir weiter (auch wenn nicht verfügbar),
    // damit es im "Fehlende Fahrzeuge" sauber auftaucht.
    if (remaining > 0) {
        // hier macht 39 mehr Sinn pro Fahrzeug
        const extra39 = Math.ceil(remaining / 9);
        need39 += extra39;
        remaining -= extra39 * 9;
    }

    if (need64 > 0) typeIdCounts[64] = (typeIdCounts[64] || 0) + need64;
    if (need39 > 0) typeIdCounts[39] = (typeIdCounts[39] || 0) + need39;

    console.log(`➕ Personal-Abgleich GW-Wasserrettung: Bedarf=${wasserpeople} → plane ${need64}×64 (6er) + ${need39}×39 (9er)`);
}
    if (betreuerpeople > 0) {
        const need = Math.ceil(betreuerpeople / 9);
        typeIdCounts[131] = Math.max(typeIdCounts[131] || 0, need);
        console.log(`➕ Personal-Abgleich: ${need}x Typ 131 für ${betreuerpeople} Betreuungshelfer`);
    }
    if (sonderbedarf > 0) {
        const need = Math.ceil(sonderbedarf / 5000);
        typeIdCounts[167] = Math.max(typeIdCounts[167] || 0, need);
        console.log(`➕ Sonderlöschmittel-Abgleich: ${need}x Typ 167 (SLF) für ${sonderbedarf} Sonderlöschmittel`);
    }

    // ── SEG-Ableitung aus RTW-Bedarf ──
{
  // Konfigurierbare Schwellen
  const GW_SAN_PER_RTW = 5;   // 1x GW-San je 5 RTW
  const ELW_SEG_PER_RTW = 10; // 1x ELW1 (SEG) je 10 RTW

  const rtwNeed = typeIdCounts[28] || 0;
  if (rtwNeed > 0) {
    // gewünschte Zielmengen berechnen
    const wantGwSan = Math.floor(rtwNeed / GW_SAN_PER_RTW);   // 0,1,2,…
    const wantElwSeg = Math.floor(rtwNeed / ELW_SEG_PER_RTW); // 0,1,2,…

    // bestehende Zähler (falls irgendwo anders schon gefüllt)
    const curGwSan = typeIdCounts[60] || 0;
    const curElwSeg = typeIdCounts[59] || 0;

    // auf Soll anheben (nicht additiv „draufzählen“)
    if (wantGwSan > curGwSan) {
      typeIdCounts[60] = wantGwSan;
      if (wantGwSan > 0) console.log(`➕ SEG-Logik: ${wantGwSan}× GW-San (60) wegen ${rtwNeed} RTW`);
    }
    if (wantElwSeg > curElwSeg) {
      typeIdCounts[59] = wantElwSeg;
      if (wantElwSeg > 0) console.log(`➕ SEG-Logik: ${wantElwSeg}× ELW1 (SEG) (59) wegen ${rtwNeed} RTW`);
    }
  }
}


    // (Optional) Debug: Sollmengen protokollieren – ohne GKW-Autologik
    const boatNeed = (typeIdCounts[66] || 0) + (typeIdCounts[67] || 0) + (typeIdCounts[68] || 0) + (typeIdCounts[70] || 0);
    console.log('🧮 Boote Soll:', boatNeed, '→ Typ66 Soll:', typeIdCounts[66] || 0);
    console.table(Object.entries(typeIdCounts)
        .map(([k, v]) => ({ Typ: +k, Soll: v }))
        .sort((a, b) => a.Typ - b.Typ));

    // ─────────────────────────────────────────────────────────────
// GKW-Logik: Wenn mind. 1 Boot (66/67/68/70) unterwegs oder angefordert ist,
// stelle sicher, dass genau 1× GKW (Typ 39) am Einsatz beteiligt ist.
// ─────────────────────────────────────────────────────────────
{
  // Boote: in unseren Zählern läuft alles auf Solltyp 66
  const boatsRequested = (typeIdCounts[66] || 0);

  // Bereits alarmierte/unterwegs befindliche Boote (FMS 3/4) mitrechnen
  const boatsAssigned =
    (assignedCounts[66] || 0) +
    (assignedCounts[67] || 0) +
    (assignedCounts[68] || 0) +
    (assignedCounts[70] || 0);

  const totalBoats = boatsRequested + boatsAssigned;

  if (totalBoats > 0) {
    const gkwAlready   = (assignedCounts[39] || 0);   // schon unterwegs?
    const gkwPlanned   = (typeIdCounts[39] || 0);     // bereits vorgesehen?
    const needGKW      = Math.max(1 - (gkwAlready + gkwPlanned), 0);

    if (needGKW > 0) {
      typeIdCounts[39] = gkwPlanned + needGKW;
      console.log(`➕ GKW-Logik: ${totalBoats} Boot(e) vorhanden → ergänze ${needGKW}× GKW (Typ 39)`);
    } else {
      console.log('ℹ️ GKW-Logik: Bereits ausreichend GKW am/auf dem Weg – keine Ergänzung nötig.');
    }
  } else {
    // Kein Boot beteiligt → keine GKW-Pflicht
    // console.log('ℹ️ GKW-Logik: Keine Boote beteiligt – kein GKW nötig.');
  }
}
/*
    function applyDependentRequirements(deps, typeIdCounts, assignedCounts) {
  // Für jeden Haupttyp: pro Einheit genau 1 abhängiges Fahrzeug anfordern
  Object.entries(deps).forEach(([mainStr, depList]) => {
    const main = +mainStr;

    // Wie viele Main sind insgesamt geplant + schon unterwegs?
    const mainTotal = (typeIdCounts[main] || 0) + (assignedCounts[main] || 0);
    if (mainTotal <= 0) return;

    depList.forEach(dep => {
      const haveDep = (typeIdCounts[dep] || 0) + (assignedCounts[dep] || 0);
      const needDep = Math.max(mainTotal - haveDep, 0);
      if (needDep > 0) {
        typeIdCounts[dep] = (typeIdCounts[dep] || 0) + needDep;
        console.log(`➕ Abhängigkeit: +${needDep}× Typ ${dep} wegen ${mainTotal}× Typ ${main}`);
      }
    });
  });
}

    applyDependentRequirements(dependentVehicleTypes, typeIdCounts, assignedCounts);
*/



// 6) Klick-Durchlauf mit Fallbacks und Abzug dispatchter Fahrzeuge
Object.entries(typeIdCounts).forEach(([tidStr, need]) => {
    const tid = +tidStr;

    // Bereits unterwegs abziehen
    const already = assignedCounts[tid] || 0;
    if (already) console.log(`ℹ️ Ziehe ${already}x Typ ${tid} ab (FMS 3/4)`);
    let rem = Math.max(need - already, 0);

// 🚤 BOOT-SPEZIALPFAD (berücksichtigt bereits alarmierte Boote; bevorzugt 68)
if (tid === 66) {
    // 1) Bereits unterwegs/dispatchte Boote abziehen (FMS 3/4)
    const alreadyBoats =
        (assignedCounts[66] || 0) +
        (assignedCounts[67] || 0) +
        (assignedCounts[68] || 0) +
        (assignedCounts[70] || 0);

    if (alreadyBoats > 0) {
        rem = Math.max(rem - alreadyBoats, 0);
        console.log(`ℹ️ Ziehe bereits alarmierte Boote ab: ${alreadyBoats} → verbleibender Bedarf rem=${rem}`);
    }

    // Nichts mehr zu tun?
    if (rem <= 0) {
        console.log('🟩 Boote bereits vollständig durch unterwegs befindliche Fahrzeuge gedeckt.');
        return;
    }

    // 2) Verfügbare Boote anklicken – bevorzugt Typ 68
    const BOAT_TYPES = [66, 67, 68, 70];       // alle gültigen Boot-Typen
    const ORDER      = [68, 66, 67, 70];       // Bevorzugung: 68 → 66 → 70 → 67

    // Verfügbare Boot-Zeilen filtern und nach ORDER sortieren
    const boatsAvail = avail
        .filter(v => BOAT_TYPES.includes(v.tid) && !v.cb.checked)
        .sort((a, b) => ORDER.indexOf(a.tid) - ORDER.indexOf(b.tid));

    for (const v of boatsAvail) {
        if (rem <= 0) break;
        v.cb.checked = true;
        // auf Solltyp 66 hochzählen (egal welcher Boot-Typ gewählt wurde)
        selectedTypeCounts[66] = (selectedTypeCounts[66] || 0) + 1;
        rem--;
        console.log(`✅ Boot gewählt: Typ ${v.tid} → verbleibend rem=${rem}`);
    }

    if (rem > 0) {
        console.warn(`⚠️ Es fehlen noch ${rem} Boote (nicht genug verfügbar)!`);
        missingTypeCounts[66] = (missingTypeCounts[66] || 0) + rem;
    } else {
        console.log(`🟩 Boote erfüllt: Soll=${typeIdCounts[66]} Gewählt=${selectedTypeCounts[66]}`);
    }
    return; // Boote sind abgearbeitet
}



// ✅ RTH-Prio: wenn 31 gefordert ist, nimm erst 157 (RTH Winde), dann 31
if (tid === 31 && rem > 0) {
  avail.forEach(v => {
    if (rem > 0 && v.tid === 157 && !v.cb.checked) {
      v.cb.checked = true;
      selectedTypeCounts[31] = (selectedTypeCounts[31] || 0) + 1;
      console.log('✅ RTH: nehme 157 (Winde) als Erfüllung für 31');
      rem--;
    }
  });
}


    // 1) exakte Matches
    avail.forEach(v => {
        if (v.tid === tid && rem > 0) {
            v.cb.checked = true;
            selectedTypeCounts[tid] = (selectedTypeCounts[tid] || 0) + 1;
            rem--;
        }
    });

    // 2) Fallbacks solange Bedarf besteht (Mischung erlaubt)
    if (rem > 0 && fallbackVehicleTypes[tid]) {
        fallbackVehicleTypes[tid].forEach(fb => {
            avail.forEach(v => {
                if (v.tid === fb && rem > 0) {
                    v.cb.checked = true;
                    selectedTypeCounts[tid] = (selectedTypeCounts[tid] || 0) + 1;
                    console.log(`🔄 Ersatz: 1x Typ ${fb} statt Typ ${tid}`);
                    rem--;
                }
            });
        });
    }

    // 3) Fehlstände loggen
    if (rem > 0) {
        missingTypeCounts[tid] = rem;
        console.warn(`⚠️ Für Typ ${tid} fehlen noch ${rem}`);
    }
});


    return { typeIdCounts, selectedTypeCounts, missingTypeCounts };
} // ← HIER endet selectVehiclesByRequirement korrekt



function renderInfoBox(doc, typeIdCounts, selectedTypeCounts,
                      patienten, gefangene,
                      einsatzName, missionTypeId, eingangsZeit,
                      fehlende, hilfe,
                      statusText = '', credits = '', missingTypeCounts = {}) {


  // ── Helpers ─────────────────────────────────────────────────
  const fmt = n => {
    if (!n && n !== 0) return 'k.A.';
    const s = String(n).replace(/\D/g, '');
    return s.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };
  const findInDocOrTop = (sel) => doc.querySelector(sel) || (window.top?.document?.querySelector(sel));

  // warte bis ein Element existiert (Polling)
  function waitForEl(selector, root = doc, timeout = 8000, step = 120) {
    return new Promise(resolve => {
      const t0 = Date.now();
      const iv = setInterval(() => {
        const el = root.querySelector(selector);
        if (el) { clearInterval(iv); clearTimeout(to); resolve(el); }
        if (Date.now() - t0 > timeout) { clearInterval(iv); resolve(null); }
      }, step);
      const to = setTimeout(() => { clearInterval(iv); resolve(null); }, timeout + 50);
    });
  }

  // aktive Missions-ID
  function getMissionId(d = doc) {
    const share = d.querySelector('#mission_alliance_share_btn');
    const m1 = share?.href?.match(/\/missions\/(\d+)\//);
    if (m1) return m1[1];
    const holder = d.querySelector('[id^="mission_bar_holder_"]')?.id?.match(/(\d+)$/);
    if (holder) return holder[1];
    const m2 = d.querySelector('a[href*="/missions/"]')?.href?.match(/\/missions\/(\d+)\b/);
    if (m2) return m2[1];
    return null;
  }

  // Message: "€ {Credits} | {Ort}"
  function buildMsg() {
    let credsNum = parseInt(String(credits).replace(/\D/g, ''), 10);
    if (!Number.isFinite(credsNum) || credsNum <= 0) {
      const creditNode = [...doc.querySelectorAll('#mission_general_info td, #mission_general_info div, #mission_general_info span')]
        .find(el => /credits im durchschnitt/i.test(el.textContent));
      const m = creditNode?.textContent.match(/([\d.]+)/);
      if (m) credsNum = parseInt(m[1].replace(/\./g, ''), 10);
    }
    const kredTxt = '€ ' + (Number.isFinite(credsNum) ? credsNum.toLocaleString('de-DE') : 'k.A.');

    const info = doc.querySelector('#mission_general_info');
    let addr = info?.getAttribute('data-address')?.trim() || '';
    if (!addr) {
      const smallTxt = info?.querySelector('small')?.textContent || '';
      addr = (smallTxt.split('|')[0] || '').trim();
    }
    const ort = addr.includes(',') ? addr.split(',').pop().trim() : (addr || '—');
    return `${kredTxt} | ${ort}`;
  }

// Feld befüllen (nur wenn leer) + Checkbox setzen + absenden
async function fillAndSubmit(d = doc, message) {
  const field = await waitForEl('#mission_reply_content', d, 8000);
  if (!field) return false;

  try {
    const getVal = () => ('value' in field ? field.value : (field.textContent || '')).trim();
    const alreadyFilled = getVal().length > 0;

    if (!alreadyFilled) {
      field.focus();
      if ('value' in field) field.value = message;
      else field.textContent = message;
      field.dispatchEvent(new Event('input', { bubbles: true }));
    } else {
      console.log('💬 Chatfeld bereits befüllt – Text wird nicht überschrieben.');
    }

    // Checkbox "Im Verbandschat posten" anhaken
    const cb = await waitForEl('#mission_reply_alliance_chat', d, 2000);
    if (cb && !cb.checked) {
      cb.checked = true;
      cb.dispatchEvent(new Event('change', { bubbles: true }));
    }

    // Absenden
    const form = field.closest('form');
    let submitBtn =
      form?.querySelector('button[type="submit"], input[type="submit"]') ||
      field.parentElement?.querySelector('.input-group-addon button[type="submit"]') ||
      d.querySelector('.input-group-addon button[type="submit"]');

    await new Promise(r => setTimeout(r, 80)); // kurz atmen lassen

    if (submitBtn) { submitBtn.click(); return true; }
    if (form?.requestSubmit) { form.requestSubmit(); return true; }
    if (form) { form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })); return true; }

    return false;
  } catch {
    return false;
  }
}

  // nach Absenden automatisch „Alarmieren & weiter“ klicken (robust mit kurzem Polling)
function clickAlarmAndNext(d = doc) {
    const t0 = Date.now();
    (function tryClick(){
      const btn = d.querySelector('a.alert_next') || window.top?.document?.querySelector('a.alert_next');
      if (btn) {
        // kleine Pause vor dem Klicken
        setTimeout(() => {
          try { btn.click(); } catch {}
        }, 600); // 600 ms warten
        return;
      }
      if (Date.now() - t0 < 4000) setTimeout(tryClick, 150);
    })();
}
  // ────────────────────────────────────────────────────────────

  // Emoji
  const ids = Object.keys(typeIdCounts).map(Number);
  const totalNeed = ids.reduce((s, id) => s + (typeIdCounts[id] || 0), 0);
  const totalSel  = ids.reduce((s, id) => s + (selectedTypeCounts[id] || 0), 0);
  const emoji = totalSel === 0 ? '❌' : (totalSel < totalNeed ? '⚠️' : '✅');

  // Styles
  const btnBase = 'margin:0;padding:5px 8px;border:0;border-radius:5px;background:#444;color:#fff;cursor:pointer;user-select:none;font-size:12px;line-height:1.1;';
  const btnGreen = btnBase + 'background:#2e7d32;';
  const btnBlue  = btnBase + 'background:#1565c0;';
  const btnRed   = btnBase + 'background:#b71c1c;';
  const btnDisabled = 'opacity:.55;cursor:not-allowed;';
  const chip = 'display:inline-block;padding:2px 6px;border-radius:999px;background:#444;margin-right:6px;font-size:11px;';

// Box erstellen / holen
let box = doc.getElementById('aao-info');
if (!box) {
    box = doc.createElement('div');
    box.id = 'aao-info';
    box.style.cssText = `
      position:fixed;top:250px;right:350px;z-index:99998;
      background:#1e1e1e;color:#fff;padding:8px 10px;border-radius:10px;
      font-size:12px;line-height:1.25;box-shadow:0 3px 14px rgba(0,0,0,.45);
      max-width:340px;min-width:280px;border:1px solid #2a2a2a;
    `;
    doc.body.appendChild(box);
}

const kred = credits ? fmt(credits) : 'k.A.';
const small = (t)=>`<span style="opacity:.85">${t}</span>`;
const makeList = (arr) => !arr?.length
  ? '<i style="opacity:.7">keine</i>'
  : '<ul style="margin:4px 0 0 16px;padding:0;">' + arr.map(e=>`<li>${e}</li>`).join('') + '</ul>';

box.innerHTML = `
  <div style="display:flex;gap:8px;align-items:center;justify-content:space-between;">
    <div style="font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:230px;">
      ${emoji} ${einsatzName}(${missionTypeId})
    </div>
    <div style="${chip}">💰 ${kred}</div>
  </div>

  <div style="margin-top:4px;display:flex;gap:8px;flex-wrap:wrap;align-items:center;">
    <span style="${chip}">🆔 ${missionTypeId}</span>
    <span style="${chip}">🕰️ ${small(eingangsZeit || '–')}</span>
    <span style="${chip}">🧑‍⚕️ ${patienten||0}</span>
    <span style="${chip}">👮‍♂️ ${gefangene||0}</span>
  </div>

  <!-- Steuerungs-Row -->
  <div id="aao-ctrl-row" style="margin-top:6px;display:flex;gap:6px;align-items:center;justify-content:space-between;">
    <div style="display:flex;align-items:center;gap:4px;">
      <label style="font-weight:bold;">Nachladeversuche:</label>
      <input type="number" id="maxReloadsInput" value="${window.MAX_RELOADS||3}" min="1" max="10" style="width:50px;">
    </div>
  </div>

  <!-- Erst die zwei grünen Alarm-Buttons -->
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-top:6px;">
    <button id="btn-alarm"          style="${btnGreen}">🚨 ${emoji} ${kred} Alarm & weiter</button>
    <button id="btn-alarm-alliance" style="${btnGreen}">🤝 ${emoji} ${kred} Alarm + Verband</button>
  </div>

  <!-- Chat-Freigabe -->
  <div style="display:grid;grid-template-columns:1fr;gap:6px;margin-top:6px;">
    <button id="btn-chat-insert" style="${btnGreen}">💬 Freigeben + Chat-Text + Absenden</button>
  </div>

  <!-- Weiter / Schließen -->
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-top:6px;">
    <button id="btn-next"           style="${btnBlue}">➡️ Weiter</button>
    <button id="btn-close"          style="${btnRed}">❌ Schließen</button>
  </div>

  <div style="margin:6px 0 4px 0;border-top:1px solid #2a2a2a"></div>
  <div><b>Status:</b> <span id="aao-status" style="color:#7cf">${statusText || 'Bereit…'}</span></div>

  <div style="margin-top:6px;">
    <div style="display:flex;justify-content:space-between;gap:6px;align-items:center;">
      <button id="aao-toggle-details" style="${btnBase}background:#555;">▾ Details</button>
      <button id="aao-toggle-missing" style="${btnBase}background:#8e24aa;display:none;">▾ Fehlende Fahrzeuge</button>
    </div>

    <div id="aao-details" style="display:none;margin-top:6px;">
      <div><b>🚨 Fehlende Anforderungen</b>${makeList(fehlende)}</div>
      <div style="margin-top:6px;"><b>📖 Hilfe-Seite</b>${makeList(hilfe)}</div>
    </div>

    <div id="aao-missing-list" style="display:none;margin-top:6px;"></div>
  </div>
`;

// Event für das Input-Feld
box.querySelector('#maxReloadsInput').addEventListener('change', (e) => {
    const val = parseInt(e.target.value);
    if (!isNaN(val) && val > 0) {
        window.MAX_RELOADS = val;
        console.log('MAX_RELOADS gesetzt auf:', val);
        lblStatus.textContent = `MAX_RELOADS: ${val}`;
    }
});

// Refs
const lblStatus = box.querySelector('#aao-status');
const bChat     = box.querySelector('#btn-chat-insert');
const bAlarm    = box.querySelector('#btn-alarm');
const bAlliance = box.querySelector('#btn-alarm-alliance');
const bNext     = box.querySelector('#btn-next');
const bClose    = box.querySelector('#btn-close');
const bDet      = box.querySelector('#aao-toggle-details');
const detBox    = box.querySelector('#aao-details');

// ✅ NEU: Missing-Liste befüllen (nur wenn was fehlt)
// ✅ NEU: Missing-Button + Box
const bMiss   = box.querySelector('#aao-toggle-missing');
const missBox = box.querySelector('#aao-missing-list');

// ✅ Missing-Liste befüllen (und automatisch aufklappen)
const missingEntries = Object.entries(missingTypeCounts || {}).filter(([,c]) => c > 0);
const typeName = (tid) => (vehicleTypeNameVariants?.[tid]?.[0] || ('Typ ' + tid));

if (bMiss && missBox && missingEntries.length) {
  bMiss.style.display = 'inline-block';

  missBox.innerHTML =
    '<div><b>🧾 Fehlende Fahrzeuge</b></div>' +
    '<ul style="margin:4px 0 0 16px;padding:0;">' +
    missingEntries
      .sort((a,b)=> (+a[0])-(+b[0]))
      .map(([tid,c]) => `<li>${c}× ${typeName(+tid)} <span style="opacity:.7">(Typ ${tid})</span></li>`)
      .join('') +
    '</ul>';

  // ✅ automatisch offen starten
  missBox.style.display = 'block';
  bMiss.textContent = '▴ Fehlende Fahrzeuge';
} else if (bMiss && missBox) {
  // wenn nix fehlt: Button verstecken und Box zu
  bMiss.style.display = 'none';
  missBox.style.display = 'none';
}

// ✅ Toggle (Schließen/Öffnen jederzeit möglich)
if (bMiss && missBox) {
  bMiss.onclick = () => {
    const isOpen = missBox.style.display !== 'none';
    missBox.style.display = isOpen ? 'none' : 'block';
    bMiss.textContent = (isOpen ? '▾ Fehlende Fahrzeuge' : '▴ Fehlende Fahrzeuge');
  };
}



  // Details-Toggle
  bDet.onclick = () => {
    const vis = detBox.style.display !== 'none';
    detBox.style.display = vis ? 'none' : 'block';
    bDet.textContent = (vis ? '▾ Details' : '▴ Details');
  };

  // Buttons enable/disable
  const setBtnEnabled = (el, enabled) => {
    if (!el) return;
    el.disabled = !enabled;
    if (!enabled && !el.style.cssText.includes(btnDisabled)) el.style.cssText += btnDisabled;
    if (enabled) el.style.cssText = el.style.cssText.replace(btnDisabled, '');
  };

  const canAlertNext         = !!findInDocOrTop('a.alert_next');
  const canAlertNextAlliance = !!findInDocOrTop('a.alert_next_alliance');
  const canNextMission = (() => {
    const el = findInDocOrTop('#mission_next_mission_btn');
    return !!(el && el.getAttribute('href') !== '#');
  })();
  const canCloseLightbox = !!(findInDocOrTop('#lightbox_close_inside') || findInDocOrTop('#lightbox_close') || findInDocOrTop('button.close'));

  setBtnEnabled(bAlarm, canAlertNext);
  setBtnEnabled(bAlliance, canAlertNextAlliance);
  setBtnEnabled(bNext, canNextMission);
  setBtnEnabled(bClose, canCloseLightbox);

  // Click-Lock
  let clickLock = false;
  const withLock = (fn) => { if (clickLock) return; clickLock = true; try { fn(); } finally { setTimeout(()=>{ clickLock=false; }, 900); } };
  const spin = () => { if (lblStatus) lblStatus.textContent = '⏳ Aktion läuft…'; };

  // ── EIN-KLICK: Freigeben → (Reload tolerant) → Text + Checkbox → Absenden → Alarm & weiter
  if (bChat) {
    bChat.onclick = async () => {
      if (bChat.disabled) return;
      bChat.disabled = true;
      const mid = getMissionId(doc);
      if (mid) sessionStorage.setItem('aao_share_pending', mid);
      if (lblStatus) lblStatus.textContent = '⏳ Freigeben…';

      // 1) Freigeben
      const shareBtn = doc.querySelector('#mission_alliance_share_btn');
      try { shareBtn?.click(); } catch(e) {
        try { if (shareBtn?.href) location.href = shareBtn.href; } catch {}
      }

      // 2) Sofort versuchen (falls kein Reload passiert)
      const okNow = await fillAndSubmit(doc, buildMsg());
      if (okNow) {
        if (lblStatus) lblStatus.textContent = '📨 Nachricht gesendet. 🚨 Alarmiere…';
        if (mid) sessionStorage.removeItem('aao_share_pending');
        clickAlarmAndNext(doc);
        bChat.disabled = false;
        return;
      }

      // Wenn Reload passiert, übernimmt die Auto-Fortsetzung unten.
      if (lblStatus) lblStatus.textContent = '⏳ Warte auf Eingabefeld…';
      setTimeout(()=>{ bChat.disabled = false; }, 1200);
    };
  }

  // ── Auto-Fortsetzung nach Freigabe/Reload
  (async function continueIfPending() {
    const pending = sessionStorage.getItem('aao_share_pending');
    const thisId  = getMissionId(doc);
    if (!pending || !thisId || pending !== thisId) return; // nichts zu tun

    if (lblStatus) lblStatus.textContent = '✍️ Setze Chat-Text…';
    const ok = await fillAndSubmit(doc, buildMsg());
    if (ok) {
      if (lblStatus) lblStatus.textContent = '📨 Nachricht gesendet. 🚨 Alarmiere…';
      sessionStorage.removeItem('aao_share_pending');
      clickAlarmAndNext(doc);
    } else {
      if (lblStatus) lblStatus.textContent = '⚠️ Chat-Absenden fehlgeschlagen.';
    }
  })();

  // ── Bestehende Buttons ──────────────────────────────────────
  if (bAlarm) {
    bAlarm.onclick = () => withLock(() => {
      if (!canAlertNext) return;
      spin();
      const btn = findInDocOrTop('a.alert_next');
      if (btn) btn.click();
    });
  }
  if (bAlliance) {
    bAlliance.onclick = () => withLock(() => {
      if (!canAlertNextAlliance) return;
      spin();
      const btn = findInDocOrTop('a.alert_next_alliance');
      if (btn) btn.click();
    });
  }
  if (bNext) {
    bNext.onclick = () => withLock(() => {
      if (!canNextMission) return;
      spin();
      const btn = findInDocOrTop('#mission_next_mission_btn');
      if (btn) btn.click();
    });
  }
  if (bClose) {
    bClose.onclick = () => withLock(() => {
      if (!canCloseLightbox) return;
      spin();
      const btn = findInDocOrTop('#lightbox_close_inside') || findInDocOrTop('#lightbox_close') || findInDocOrTop('button.close');
      if (btn) btn.click();
    });
  }
/*
  // ── Auto/Schwelle ───────────────────────────────────────────
  const AUTO_KEY   = 'aao_auto_dispatch';
  const THRESH_KEY = 'aao_credit_threshold';
  let autoOn = localStorage.getItem(AUTO_KEY) === '1';
  let currentThreshold = (() => {
    const v = parseInt(localStorage.getItem(THRESH_KEY), 10);
    return Number.isFinite(v) ? Math.max(0, v) : 6000;
  })();

  const ctrl = box.querySelector('#aao-ctrl-row');
  ctrl.innerHTML = `
    <button id="btn-auto"  style="${btnBase}background:#ffb300;color:#000;flex:0 0 auto;min-width:90px;"></button>
    <div style="display:flex;gap:4px;align-items:center;">
      <button id="aao-threshold-minus" style="${btnBase}background:#555;">–100</button>
      <span id="aao-threshold-label" style="opacity:.85;min-width:90px;text-align:center;">Verband: ${currentThreshold}</span>
      <button id="aao-threshold-plus"  style="${btnBase}background:#555;">+100</button>
    </div>
  `;
  const bAuto  = ctrl.querySelector('#btn-auto');
  const minus  = ctrl.querySelector('#aao-threshold-minus');
  const plus   = ctrl.querySelector('#aao-threshold-plus');
  const lbl    = ctrl.querySelector('#aao-threshold-label');

  const updateAutoBtn = () => {
    bAuto.textContent = autoOn ? '🤖 Auto: AN' : '🤖 Auto: AUS';
    bAuto.title = 'Auto-Alarm nach Kreditschwelle (' + currentThreshold + ')';
    bAuto.style.opacity = autoOn ? '1' : '.7';
  };
  const setThreshold = (v) => {
    currentThreshold = Math.max(0, v);
    localStorage.setItem(THRESH_KEY, String(currentThreshold));
    lbl.textContent = 'Verband: ' + currentThreshold;
    try { focusByCredits(); } catch {}
  };
  bAuto.onclick = () => { autoOn = !autoOn; localStorage.setItem(AUTO_KEY, autoOn ? '1' : '0'); updateAutoBtn(); if (autoOn) try { focusByCredits(); } catch {} };
  minus.onclick = () => setThreshold(currentThreshold - 100);
  plus.onclick  = () => setThreshold(currentThreshold + 100);
  updateAutoBtn();

const focusByCredits = () => {
  const creditsNum = parseInt(String(credits).replace(/\D/g, ''), 10) || 0;

  // Ziel: ab Schwelle den Chat-Workflow nutzen, sonst wie bisher
  let target;
  if (creditsNum >= currentThreshold && bChat) {
    target = bChat; // Chat-Workflow (Freigeben + Chat + Absenden + Alarm&weiter)
  } else {
    target = (creditsNum < currentThreshold ? bAlarm : bAlliance) || bAlarm || bAlliance;
  }
  if (!target) return;

  // Outline vorher entfernen
  [bAlarm, bAlliance, bChat].forEach(el => { if (el) el.style.outline = ''; });

  setTimeout(() => {
    try { target.scrollIntoView({ block:'center', inline:'center', behavior:'smooth' }); } catch {}
    target.style.outline = '2px solid #ffd54f';

    // Wenn Anforderungen erfüllt (✅), zusätzlich den Chat-Button markieren
    if (emoji === '✅' && bChat && target !== bChat) bChat.style.outline = '2px solid #ffd54f';
  }, 60);

  if (autoOn) {
    const doClick = () => {
      if (target === bChat && !bChat.disabled) {
        bChat.click();  // erledigt Freigeben+Chat+Absenden+Alarm&weiter
      } else if (target === bAlarm && canAlertNext && !bAlarm.disabled) {
        bAlarm.click();
      } else if (target === bAlliance && canAlertNextAlliance && !bAlliance.disabled) {
        bAlliance.click();
      }
    };
    // sofort bei ✅, sonst etwas warten
    if (emoji === '✅') setTimeout(doClick, 180);
    else               setTimeout(doClick, 1200);
  }
};
  if (typeof requestAnimationFrame === 'function') requestAnimationFrame(()=>focusByCredits()); else setTimeout(focusByCredits,0);
*/
  // ── Auto/Schwelle ───────────────────────────────────────────
  // RAUS: Auto-Button + Schwelle + Auto-Klick-Logik
  const ctrl = box.querySelector('#aao-ctrl-row');
  if (ctrl) ctrl.remove();   // oder: ctrl.innerHTML = '';


  // ENTER-Komfort
  if (!box.dataset.enterHooked) {
    box.dataset.enterHooked = '1';
    doc.addEventListener('keydown', (ev) => {
      if (ev.key !== 'Enter') return;
      const ae = doc.activeElement;
      if (ae === bAlarm && !bAlarm.disabled) bAlarm.click();
      else if (ae === bAlliance && !bAlliance.disabled) bAlliance.click();
    }, { capture: true });
  }

  // optionale EasterEggs-Integration
  try {
    installEasterEggs?.(doc, {
      typeIdCounts, selectedTypeCounts, einsatzName,
      refreshControls: () => {
        const evt = new Event('aao-refresh', {bubbles:true});
        doc.dispatchEvent(evt);
      }
    });
  } catch {}
}









function waitForVehicleListUpdate(doc, callback, timeout = 10000) {
    // Merke dir, wie viele Fahrzeuge JETZT da sind
    const oldCount = doc.querySelectorAll('tr.vehicle_select_table_tr').length;
    const start = Date.now();

    function check() {
        const newCount = doc.querySelectorAll('tr.vehicle_select_table_tr').length;
        // Sobald die Liste länger ist (oder ganz leer und wird dann befüllt), geht's weiter
        if (newCount !== oldCount && newCount > 0) {
            callback();
            return;
        }
        if (Date.now() - start > timeout) {
            // Sicherheit: nach x Sekunden trotzdem weiter
            callback();
            return;
        }
        setTimeout(check, 100); // alle 100ms checken
    }
    check();
}


function injectLogic(iframe) {
    if (typeof iframe._reloadAttempts === "undefined") iframe._reloadAttempts = 0;
//    const MAX_RELOADS = 2; // nach Wunsch

    // 0️⃣ doc holen und Guard
    const doc = iframe.contentDocument || iframe.contentWindow.document;
    if (!doc) return;
    window._reloadAttempted = false;

    // 1️⃣ Einsatzfarbe bestimmen & ggf. überspringen
    const color = getMissionColor(doc);
    let colorText = '';
    if (color === 'rot') colorText = '🟥 Einsatz: Noch unbearbeitet oder Fahrzeuge fehlen (rot)';
    if (color === 'gelb') colorText = '🟨 Einsatz: Fahrzeuge auf Anfahrt (gelb)';
    if (color === 'gruen') colorText = '🟩 Einsatz: Vor Ort in Bearbeitung (grün)';
    if (!color) colorText = 'Einsatzstatus nicht erkennbar!';
    console.log(colorText);


    // 3️⃣ Patienten-Nachalarm zuerst behandeln
    if (handlePatientNachalarm(doc)) {
        return;
    }

    // GELB/GRÜN überspringen
    if (color === 'gelb' || color === 'gruen') {
        const nextBtn = doc.getElementById('mission_next_mission_btn') || doc.querySelector('#mission_next_mission_btn');
        if (nextBtn) {
            const isDisabled = nextBtn.classList.contains('btn-default') || nextBtn.getAttribute('href') === '#';
            if (isDisabled) {
                const closeBtn = doc.getElementById('lightbox_close_inside') || doc.querySelector('button.close, .close');
                if (closeBtn) {
                    console.log(`🟡🟢 Letzter ${color}-Einsatz erkannt – schließe das Fenster.`);
                    closeBtn.click();
                } else {
                    console.warn('Schließen-Button nicht gefunden!');
                }
            } else {
                console.log(`🟡🟢 Einsatz ist ${color} – klicke auf "Nächster Einsatz"-Button.`);
                nextBtn.click();
            }
            return;
        }
    }

    // EasterEgg-Collector: falls ein Sammelobjekt angezeigt wird, automatisch einsammeln
(function autoCollectEasterEgg() {
  const egg = doc.querySelector('#easter-egg-link');
  if (!egg) return; // nix da → nix tun

  console.log('🥚 EasterEgg gefunden – versuche Klick:', egg.href);
  // Variante 1: echtes Klick-Event
  egg.click();

  // Variante 2 (Fallback): POST direkt absetzen
  const claimUrl = egg.href.replace('_sync',''); // → …/claim_found_object
  fetch(claimUrl, { method: 'POST' })
    .then(r => r.text())
    .then(txt => {
      console.log('🥚 EasterEgg eingesammelt!', txt.slice(0,80));
      // im UI wie das Originalscript das Link-Element verstecken
      egg.style.display = 'none';
    })
    .catch(err => console.warn('🥚 EasterEgg claim fehlgeschlagen:', err));
})();




    // Sprechwunsch-Handling: Falls einer da, komplette Abarbeitung starten!
const sprechwunschBtn = [...doc.querySelectorAll('.alert.alert-danger a.btn-success')]
    .find(btn => btn.textContent.includes('Sprechwunsch bearbeiten'));
if (sprechwunschBtn) {
    console.log('📣 Sprechwunsch erkannt! Starte komplette Sprechwunsch-Abarbeitung...');
    processAllPatientRequests(doc);
    return; // Nichts anderes mehr tun!
}

    // 2. Polizeisprechwunsch-Button direkt im Sprechwunsch-Bereich?
    const policeAlertBtns = [...doc.querySelectorAll('.alert.alert-danger a.btn-success[data-prison-id]')];
    if (policeAlertBtns.length > 0) {
        console.log(`📣 ${policeAlertBtns.length} Polizei-Sprechwunsch(e) (direkt im Alert) erkannt!`);
        policeAlertBtns[0].click();
        setTimeout(() => {
            const polIframe = [...document.querySelectorAll('iframe.lightbox_iframe')].find(f => f.style.display !== 'none');
            if (!polIframe) {
                console.warn('❗ Polizei-IFrame nach Sprechwunsch nicht gefunden!');
                return;
            }
            processAllPrisonerRequests(polIframe, () => setTimeout(() => injectLogic(iframe), 500));
        }, 700);
        return;
    }

    // 3. Gefangene sollen abtransportiert werden – kein Button im Alert, aber Gefangenen-Buttons irgendwo im Frame?
    // Suche nach Prison-Buttons IM Frame (z.B. im .prison-select-Container)
    const policeFrameBtns = [...doc.querySelectorAll('a.btn-success[data-prison-id]')];
    if (policeFrameBtns.length > 0) {
        console.log(`📣 ${policeFrameBtns.length} Polizei-Sprechwunsch(e) (im Frame/Container) erkannt!`);
        policeFrameBtns[0].click();
        setTimeout(() => {
            const polIframe = [...document.querySelectorAll('iframe.lightbox_iframe')].find(f => f.style.display !== 'none');
            if (!polIframe) {
                console.warn('❗ Polizei-IFrame nach Prison-Klick nicht gefunden!');
                return;
            }
            processAllPrisonerRequests(polIframe, () => setTimeout(() => injectLogic(iframe), 500));
        }, 700);
        return;
    }


    // 2️⃣ Basisdaten
    const { patienten, gefangene } = extractPatientsAndPrisoners(doc);
    const fehlendeAnforderungen = extractMissingRequirements(doc);
const einsatzName = doc.querySelector('#missionH1')?.innerText.trim() || '';
const eingangsZeit = doc.querySelector('#missionH1')?.getAttribute('data-original-title')?.replace(/^.*?:\s*/, '') || '';
const missionTypeId = doc.querySelector('#mission_general_info')?.getAttribute('data-mission-type') || '';

// Credits im Durchschnitt auslesen
// Credits im Durchschnitt auslesen
let credits = '';
const creditNode = [...doc.querySelectorAll('#mission_general_info td, #mission_general_info div, #mission_general_info span')]
    .find(el => /credits im durchschnitt/i.test(el.textContent));
if (creditNode) {
    const numMatch = creditNode.textContent.match(/([\d.]+)/);
    if (numMatch) credits = numMatch[1].replace(/\./g, '');
}
    // 3️⃣ unsichtbares Hilfeskript-Iframe anlegen
    const invisible = document.createElement('iframe');
    invisible.style.display = 'none';
    invisible.src = doc.querySelector('#mission_help')?.href || '';
    document.body.appendChild(invisible);

invisible.onload = () => {
  const helpDoc = invisible.contentDocument || invisible.contentWindow.document;
  if (!helpDoc) {
    console.warn('❗ Einsatzhilfe konnte nicht geladen werden.');
    return;
  }

  // etwas warten, bis die Hilfe wirklich gerendert ist
  setTimeout(() => {
    let allOk = false;
    try {
      // ── 1) Anforderungen aus der Hilfe ──
      const hilfeAnforderungen = extractHelpRequirements(helpDoc);

      // ── 2) "Weitere Informationen" (Patienten / Wahrscheinlichkeiten) ──
      const infoTable = [...helpDoc.querySelectorAll('table')]
        .find(t => t.querySelector('th') && /weitere informationen/i.test(t.querySelector('th').textContent));
      const addInfo = {};
      if (infoTable) {
        [...infoTable.querySelectorAll('tbody tr')].forEach(tr => {
          const key = tr.children[0]?.textContent.trim() || '';
          const value = tr.children[1]?.textContent.trim() || '';
          if (/Mindest Patientenanzahl/i.test(key)) addInfo.minPatients = parseInt(value, 10);
          if (/NEF Anforderungswahrscheinlichkeit/i.test(key)) addInfo.nefProb = parseInt(value, 10);
          if (/RTH Anforderungswahrscheinlichkeit/i.test(key)) addInfo.rthProb = parseInt(value, 10);
          if (/Tragehilfe Anforderungswahrscheinlichkeit/i.test(key)) addInfo.carryProb = parseInt(value, 10);
        });
      }

      // ── 3) Credits aus "Belohnung und Voraussetzungen" ──
      let credits = '';
      const belohnungTable = [...helpDoc.querySelectorAll('table')]
        .find(t => t.querySelector('th') && /belohnung/i.test(t.querySelector('th').textContent));
      if (belohnungTable) {
        const creditRow = [...belohnungTable.querySelectorAll('tr')]
          .find(tr => /credits im durchschnitt/i.test(tr.textContent));
        if (creditRow) {
          const val = creditRow.querySelector('td:last-child')?.textContent.trim() || '';
          credits = val.replace(/\./g, '');
          console.log(`💰 Credits aus Einsatzhilfe: ${credits}`);
        }
      }
      // Fallback: wenn Hilfe nichts liefert, versuche Haupt-UI
      if (!credits) {
        const creditNode = [...doc.querySelectorAll('#mission_general_info td, #mission_general_info div, #mission_general_info span')]
          .find(el => /credits im durchschnitt/i.test(el.textContent));
        const numMatch = creditNode?.textContent.match(/([\d.]+)/);
        if (numMatch) credits = numMatch[1].replace(/\./g, '');
      }

      // ── 4) Hilfe ggf. um automatische RTW/NEF/Tragehilfe ergänzen ──
      if (fehlendeAnforderungen.length === 0 && (addInfo.minPatients || 0) > 0) {
        hilfeAnforderungen.unshift(`${addInfo.minPatients}x RTW`);
        console.log(`➕ RTW-Anforderung (min. Patienten): ${addInfo.minPatients}x RTW`);
      }
      if ((addInfo.carryProb || 0) > 0) {
        hilfeAnforderungen.unshift(`1x Löschfahrzeug`);
        console.log(`➕ Tragehilfe-Anforderung: 1x Löschfahrzeug`);
      }
      if (fehlendeAnforderungen.length === 0 && (addInfo.nefProb || 0) >= 40) {
        if (addInfo.nefProb === 100) {
          hilfeAnforderungen.unshift(`1x NAW`);
          console.log(`➕ NAW-Anforderung (100%)`);
        } else {
          hilfeAnforderungen.unshift(`1x NEF`);
          console.log(`➕ NEF-Anforderung (${addInfo.nefProb}%)`);
        }
      }

      // ── 5) Quelle wählen ──
      const quelle = fehlendeAnforderungen.length ? fehlendeAnforderungen : hilfeAnforderungen;
      console.log(`Anforderungsquelle: ${fehlendeAnforderungen.length ? '🚨 Fehlende Anforderungen' : '📖 Hilfeseite'}`);
      console.table(quelle.map(v => ({ Wert: v })));

      // ── 6) Patienten bestimmen ──
      const uiPatients = patienten;
      const helpPatients = addInfo.minPatients || 0;
      const actualPatients = Math.max(uiPatients, helpPatients);
      const istHilfeSeite = fehlendeAnforderungen.length === 0;

      // ── 7) Fahrzeuge wählen ──
      let typeIdCounts = {}, selectedTypeCounts = {}, missingTypeCounts = {};
({ typeIdCounts, selectedTypeCounts, missingTypeCounts } = selectVehiclesByRequirement(
  quelle,
  vehicleTypeNameVariants,
  actualPatients,
  istHilfeSeite,
  addInfo.nefProb || 0,
  addInfo.rthProb || 0
));

      // ── 8) Prüfen & InfoBox anzeigen ──
      allOk = Object.entries(typeIdCounts)
        .every(([tid, need]) => (selectedTypeCounts[tid] || 0) >= need);

      renderInfoBox(
  doc,
  typeIdCounts,
  selectedTypeCounts,
  patienten,
  gefangene,
  einsatzName,
  missionTypeId,
  eingangsZeit,
  fehlendeAnforderungen,
  hilfeAnforderungen,
  '',
  credits,
  missingTypeCounts
);

      // ── 9) Nachladen falls nötig ──
      if (!allOk && iframe._reloadAttempts < MAX_RELOADS) {
        const btn = doc.querySelector('a.missing_vehicles_load');
        if (btn) {
          iframe._reloadAttempts++;
          renderInfoBox(
  doc,
  typeIdCounts,
  selectedTypeCounts,
  patienten,
  gefangene,
  einsatzName,
  missionTypeId,
  eingangsZeit,
  fehlendeAnforderungen,
  hilfeAnforderungen,
            `Nachladen (Versuch ${iframe._reloadAttempts}/${MAX_RELOADS})…`, // statusText
            credits,
            missingTypeCounts
          );
          btn.click();
          waitForVehicleListUpdate(doc, () => injectLogic(iframe));
          return;
        }
      }

      if (allOk) {
        renderInfoBox(
          doc, typeIdCounts, selectedTypeCounts, patienten, gefangene, einsatzName,
          missionTypeId, eingangsZeit, fehlendeAnforderungen, hilfeAnforderungen,
          'Alle Anforderungen erfüllt – bereit zur Alarmierung!', // statusText
          credits,
  missingTypeCounts
);
        iframe._reloadAttempts = 0;
      } else if (iframe._reloadAttempts >= MAX_RELOADS) {
        renderInfoBox(
          doc, typeIdCounts, selectedTypeCounts, patienten, gefangene, einsatzName,
          missionTypeId, eingangsZeit, fehlendeAnforderungen, hilfeAnforderungen,
          '⚠️ Maximale Nachladeversuche erreicht, es fehlen noch Fahrzeuge!', // statusText
          credits,
  missingTypeCounts
);
        iframe._reloadAttempts = 0;
      }
    } catch (e) {
      console.error('❗ Fehler im Einsatzhilfe-Parser:', e);
    }

    // Unsichtbares IFrame nur entfernen, wenn kein Nachladen nötig
    if (allOk || !doc.querySelector('a.missing_vehicles_load')) {
      document.body.removeChild(invisible);
    }
  }, 250);
};
} // <--- schließt function injectLogic(...)

// ▪ Beobachter, der bei Iframe-Öffnung injectLogic triggert
const observer = new MutationObserver(()=>{
    const iframe=[...document.querySelectorAll('iframe.lightbox_iframe')]
        .find(f=>f.src.includes('/missions/') && f.style.display!=='none');
    if(!iframe|| iframe.dataset.done) return;
    iframe.dataset.done='1';
    iframe.addEventListener('load',()=>setTimeout(()=>injectLogic(iframe),500));
    if(iframe.contentDocument.readyState==='complete'){
        setTimeout(()=>injectLogic(iframe),500);
    }
});
observer.observe(document.body,{childList:true,subtree:true});

// Bearbeitung von Sprechwünschen
function processAllPatientRequests(mainDoc) {
    // Hole alle Sprechwunsch-Buttons für Patienten
    const sprechwunschBtns = [...mainDoc.querySelectorAll('.alert.alert-danger a.btn-success')]
        .filter(a => a.textContent.includes('Sprechwunsch bearbeiten') && a.href.includes('/vehicles/'));
    if (!sprechwunschBtns.length) {
        console.log('✅ Keine Patienten-Sprechwünsche mehr vorhanden.');
        return;
    }

    // Nimm den ersten Sprechwunsch-Button und klicke ihn
    const btn = sprechwunschBtns[0];
    console.log('🩺 Klicke Sprechwunsch-Button:', btn.href);
    btn.click();

    // Warte, bis das Krankenhaus-Frame geladen ist, dann handle den Patienten
    setTimeout(() => {
        // Finde das neue (sichtbare) IFrame für das Krankenhaus
        const khIframe = [...document.querySelectorAll('iframe.lightbox_iframe')]
            .find(f => f.style.display !== 'none');
        if (!khIframe) {
            console.warn('❗ KH-IFrame nach Sprechwunsch nicht gefunden!');
            return;
        }
        // Jetzt Patienten-Transport und Status 5 abarbeiten
        handleKHAndStatus5(khIframe, () => {
            // Nach Abarbeitung den nächsten Sprechwunsch abarbeiten (rekursiv!)
            setTimeout(() => processAllPatientRequests(mainDoc), 500);
        });
    }, 700);
}

    function processAllPrisonerRequests(polIframe, callback) {
    const polDoc = polIframe.contentDocument || polIframe.contentWindow.document;
    // 1. Nächster Gefangenen-Button?
    const prisonBtns = [...polDoc.querySelectorAll('a.btn-success[data-prison-id]')];
    if (prisonBtns.length > 0) {
        console.log('🚓 Klicke Gefangenentransport-Button:', prisonBtns[0].href);
        prisonBtns[0].click();
        setTimeout(() => processAllPrisonerRequests(polIframe, callback), 700);
        return;
    }
    // 2. Status-5-Button?
    const status5Btn = polDoc.querySelector('#next-vehicle-fms-5');
    if (status5Btn) {
        console.log('➡️ Klicke auf "Zum nächsten Fahrzeug im Status 5"-Button.');
        status5Btn.click();
        setTimeout(() => processAllPrisonerRequests(polIframe, callback), 700);
        return;
    }
    // 3. Zurück-Button oder Schließen
    const backBtn = polDoc.querySelector('#btn_back_to_mission');
    if (backBtn) {
        console.log('🔙 Klicke auf "Zurück zum Einsatz".');
        backBtn.click();
        setTimeout(callback, 700);
        return;
    }
    // 4. Schließen, wenn nichts mehr zu tun
    // Zuerst im IFrame versuchen
    let closeBtn = polDoc.getElementById('lightbox_close') || polDoc.querySelector('button.close');
    // Wenn nicht gefunden, im Hauptfenster versuchen!
    if (!closeBtn) {
        closeBtn = document.getElementById('lightbox_close') || document.querySelector('button.close#lightbox_close');
    }
    if (closeBtn) {
        closeBtn.click();
        console.log('🚓 Polizeisprechwunsch abgeschlossen, Fenster geschlossen.');
    } else {
        console.warn('⚠️ Schließen-Button nicht gefunden! Fenster bleibt offen.');
    }
    if (typeof callback === 'function') callback();
}
    function processSprechwuenscheFast() {
    const funkliste = document.querySelectorAll('#radio_messages_important li');
    let any = false;

    funkliste.forEach(li => {
        if (li.innerText.includes('Sprechwunsch')) {
            const einsatzBtn = li.querySelector('a.mission-radio-button');
            if (einsatzBtn) {
                any = true;
                // Direkt "Zum Einsatz"-Button klicken, öffnet Einsatz im IFrame
                einsatzBtn.click();
            }
        }
    });

    if (!any) {
        alert('✅ Keine offenen Sprechwünsche im Funkpanel gefunden.');
        return;
    }

    // Jetzt alle Sprechwünsche nacheinander abarbeiten
    // Beobachte, ob ein IFrame erscheint, und arbeite Sprechwünsche ab
    const observer = new MutationObserver(() => {
        const iframe = [...document.querySelectorAll('iframe.lightbox_iframe')]
            .find(f => f.style.display !== 'none');
        if (!iframe) return;

        // Sprechwunsch-Button im IFrame suchen und klicken
        setTimeout(() => {
            const doc = iframe.contentDocument || iframe.contentWindow.document;
            const btn = [...doc.querySelectorAll('.alert.alert-danger a.btn-success')]
                .find(b => b.textContent.includes('Sprechwunsch bearbeiten'));
            if (btn) {
                btn.click();
                // Nach kurzem Delay IFrame wieder schließen
                setTimeout(() => {
                    const closeBtn = doc.getElementById('lightbox_close') || doc.querySelector('button.close');
                    if (closeBtn) closeBtn.click();
                }, 700);
            } else {
                // Kein Sprechwunsch-Button gefunden, sofort schließen
                const closeBtn = doc.getElementById('lightbox_close') || doc.querySelector('button.close');
                if (closeBtn) closeBtn.click();
            }
        }, 700);
    });

    observer.observe(document.body, {childList:true, subtree:true});

    // Optional: Nach x Sekunden Observer wieder deaktivieren, damit er nicht ewig läuft
    setTimeout(() => observer.disconnect(), 30000);
}



function handleKHAndStatus5(khIframe, onDone) {
    const khDoc = khIframe.contentDocument || khIframe.contentWindow.document;

    // 1. Anfahren-Button suchen und klicken
    const anfahrenBtn = khDoc.querySelector('a.btn-success[id^="btn_approach_"]');
    if (anfahrenBtn) {
        console.log('🚑 Klicke auf "Anfahren"-Button:', anfahrenBtn.href);
        anfahrenBtn.click();
        setTimeout(() => handleKHAndStatus5(khIframe, onDone), 800);
        return;
    }

    // 2. Status 5-Button suchen und klicken
    const status5Btn = khDoc.querySelector('#next-vehicle-fms-5');
    if (status5Btn) {
        console.log('➡️ Klicke auf "Zum nächsten Fahrzeug im Status 5"-Button.');
        status5Btn.click();
        setTimeout(() => handleKHAndStatus5(khIframe, onDone), 800);
        return;
    }

    // 3. "Zurück zum Einsatz"-Button suchen und klicken
    const backBtn = khDoc.querySelector('#btn_back_to_mission');
    if (backBtn) {
        console.log('🔙 Klicke auf "Zurück zum Einsatz".');
        backBtn.click();
        setTimeout(onDone, 700);
        return;
    }

    // 4. **Kein Button mehr? Dann Schließen-Button finden und klicken!**
    // Suche den Schließen-Button im sichtbaren lightbox_div
    setTimeout(() => {
        // Suche in der Hauptseite, nicht im IFrame!
        const closeBtn = document.querySelector('#lightbox_close') || document.querySelector('button.close#lightbox_close');
        if (closeBtn) {
            console.log('🛑 Kein weiterer Button gefunden – klicke auf Schließen-Button im Hauptfenster!');
            closeBtn.click();
        } else {
            console.warn('⚠️ Schließen-Button nicht gefunden! Nichts mehr zu tun.');
        }
        // Callback zum Weiterarbeiten (z.B. nächster Sprechwunsch etc.)
        if (typeof onDone === 'function') setTimeout(onDone, 500);
    }, 700);
}
// === Gemeinsamer Helper: Element zentrieren + draggable machen ===
function makeDraggable(el, { handleSelector = null, storageKey = null } = {}) {
  if (!el) return;

  el.style.position = 'fixed';
  el.style.zIndex = '99998';

  const loadPos = () => {
    if (!storageKey) return null;
    try { return JSON.parse(localStorage.getItem(storageKey) || 'null'); } catch { return null; }
  };
  const savePos = (x, y) => {
    if (!storageKey) return;
    try { localStorage.setItem(storageKey, JSON.stringify({ x, y })); } catch {}
  };
  const clamp = (x, y) => {
    const w = el.offsetWidth || 300;
    const h = el.offsetHeight || 120;
    const maxX = window.innerWidth  - w;
    const maxY = window.innerHeight - h;
    return { x: Math.min(Math.max(0, x), Math.max(0, maxX)), y: Math.min(Math.max(0, y), Math.max(0, maxY)) };
  };
  const center = () => {
    // kurz sichtbar messen
    const prevVis = el.style.visibility;
    el.style.visibility = 'hidden';
    document.body.appendChild(el);
    const w = el.offsetWidth  || 300;
    const h = el.offsetHeight || 120;
    const x = Math.round((window.innerWidth  - w) / 2);
    const y = Math.round((window.innerHeight - h) / 2);
    const c = clamp(x, y);
    el.style.left = c.x + 'px';
    el.style.top  = c.y + 'px';
    el.style.visibility = prevVis || '';
    savePos(c.x, c.y);
  };

  // initiale Position: gespeicherte Werte oder zentrieren
  const pos = loadPos();
  if (pos && typeof pos.x === 'number' && typeof pos.y === 'number') {
    const c = clamp(pos.x, pos.y);
    el.style.left = c.x + 'px';
    el.style.top  = c.y + 'px';
  } else {
    center();
  }

  // Drag-Logik
  let dragging = false, startX = 0, startY = 0, baseX = 0, baseY = 0;
  const handle = handleSelector ? el.querySelector(handleSelector) : el;

  const onDown = (ev) => {
    // nur linke Maustaste / Touch
    const isTouch = ev.type.startsWith('touch');
    const btnOk = isTouch || (ev.button === 0);
    if (!btnOk) return;
    dragging = true;
    const p = isTouch ? ev.touches[0] : ev;
    startX = p.clientX; startY = p.clientY;
    baseX = parseInt(el.style.left || '0', 10);
    baseY = parseInt(el.style.top  || '0', 10);
    ev.preventDefault();
    ev.stopPropagation();
  };
  const onMove = (ev) => {
    if (!dragging) return;
    const p = ev.type.startsWith('touch') ? ev.touches[0] : ev;
    const nx = baseX + (p.clientX - startX);
    const ny = baseY + (p.clientY - startY);
    const c = clamp(nx, ny);
    el.style.left = c.x + 'px';
    el.style.top  = c.y + 'px';
  };
  const onUp = () => {
    if (!dragging) return;
    dragging = false;
    savePos(parseInt(el.style.left||'0',10), parseInt(el.style.top||'0',10));
  };

  handle?.addEventListener('mousedown', onDown, true);
  document.addEventListener('mousemove', onMove, true);
  document.addEventListener('mouseup',   onUp,   true);
  handle?.addEventListener('touchstart', onDown, { passive:false, capture:true });
  document.addEventListener('touchmove', onMove, { passive:false, capture:true });
  document.addEventListener('touchend',  onUp,   { passive:true,  capture:true });

  // Doppelklick auf Handle → zurück in die Mitte
  handle?.addEventListener('dblclick', (e) => { e.preventDefault(); center(); }, true);

  // bei Fenster-Resize im Viewport halten
  window.addEventListener('resize', () => {
    const c = clamp(parseInt(el.style.left||'0',10), parseInt(el.style.top||'0',10));
    el.style.left = c.x + 'px';
    el.style.top  = c.y + 'px';
    savePos(c.x, c.y);
  });
}



})();
