const KEY = 'dts-ui:prefs'
export function loadPrefs(){
try{ return JSON.parse(localStorage.getItem(KEY)) || {} }catch{ return {} }
}
export function savePrefs(p){ localStorage.setItem(KEY, JSON.stringify(p)) }