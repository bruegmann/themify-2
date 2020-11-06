export const appLogo = require("./logo.svg");
export const appTitle = "Themify";

interface IPhrases {
    [key: string]: string[]
}

export const phrases: IPhrases = {
    "HELLO_WORLD": ["Hello World!", "Hallo Welt!"],
    "SAVE_AS": ["Save as", "Speichern unter"],
    "RESET_TO_DEFAULT": ["Reset to default", "Zurücksetzen"],
    "SHARE_THIS_CONFIG": ["Share this config", "Diese Konfig teilen"],
    "SAVE_TO_LIB": ["Save to Library", "Speichern in Library"],
    "SAVE":["Save", "Speichern"],
    "EXPORT_ZIP": ["Export as zip", "Als Zip exportieren"],
    "IMPORT_CONFIG": ["Import config", "Konfig importieren"],
    "EXPORT": ["Export ... ", "Exportieren ... "],
    "NEED_GITHUB_LOGIN": ["To use Themify/Library you need to login with Github.", "Um Themify/Library zu benutzen, musst du dich mit Github anmelden."],
    "NEW": ["New", "Neu"],
    "CUSTOMIZER": ["Customizer", "Customizer"],
    "THEME": ["Theme", "Theme"],
    "CONFIG": ["Config", "Konfig"],
    "LIBRARY": ["Library", "Bibliothek"],
    "TEXT": ["Text", "Text"],
    "File": ["File", "Datei"],
    "COLOR": ["Color", "Farbe"],
    "BOOLEAN": ["Boolean", "Boolescher Wert"],
    "TEMPLATE": ["Template", "Vorlage"],
    "ADD": ["Add", "Hinzufügen"],
    "NO_ATTRIBUTES": ["There are no attributes. Add your attributes or add a template", "Es sind keine Attributen vorhanden. Fügen Sie Attributen hinzu oder wählen sie ein Template"],
    "LOGIN_WITH_GITHUB": ["Login with Github", "Einloggen mit Github"],
    "THEMIFY/LIBRARY": ["Themify/Library", "Themify/Bibliothek"],
    "CREATE_NEW_THEME": ["Create new Theme", "Neues Theme erstellen"],
    "ACCOUNT": ["Account", "Konto"],
    "NOT_ONLINE_STORAGE": ["Online storage not possible. You have to be logged in to Github", "Online Speichern nicht möglich. Du musst bei Github angemeldet sein"],
    "CANCEL": ["Cancel", "Abbrechen"],
    "SUBMIT": ["Submit", "Absenden"],
    "DELETE": ["Delete", "Löschen"],
    "LOCAL_THEME": ["Local Theme", "Lokales Theme"],
    "BLUE_DOCUMENTATION": ["Blue Documentation", "Blue Dokumentation"],
    "NO_DATABASE": ["There doesn't seem to be a database yet. Do you want to create a database?", "Es scheint noch keine Datenbank vorhande zu sein. Wollen sie eine Datenbank erstellen?"],
    "ORG_THEME": ["Organisation Themes", "Organisations Themes"],
    "THEMES": ["Themes", "Themes"]
};

export function getPhrase(keyword: string, countryCode: string | undefined = undefined, _phrases: IPhrases | undefined = undefined) {
    countryCode = countryCode || (navigator.language).toLowerCase().indexOf("de") > -1 ? "de-DE" : "en-US";
    _phrases = _phrases || phrases;

    if (_phrases[keyword]) {
        if (countryCode.indexOf("de-") > -1) {
            return _phrases[keyword][1];
        }
        else {
            return _phrases[keyword][0];
        }
    }
    else {
        return keyword;
    }
}

export function createPhrase(keywords: any) {
    let countryCode = (navigator.language).toLowerCase().indexOf("de") > -1 ? "de-DE" : "en-US";
    let phrases = [] as any;
    let i: any;
    let keywordsCount = keywords.length as any;

    for (i = 0; i < keywordsCount; i++) {
        phrases.push(getPhrase(keywords[i], countryCode))
    }

    return phrases.join(" ");
}