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
    "SAVE":["Save", "Speichern"],
    "EXPORT_ZIP": ["Export as zip", "Als Zip exportieren"],
    "IMPORT_CONFIG": ["Import config", "Konfig importieren"],
    "EXPORT":["Export ... ","Exportieren ... " ],
    "NEED_GITHUB_LOGIN":["To use Themify/Library you need to login with Github.","Um Themify/Library zu benutzen, musst du dich mit Github anmelden."],
    "NEW": ["New", "Neu"]
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