export function generateClipboardStringFromJSON(json: any) {
  navigator.clipboard.writeText(JSON.stringify(json, null, 4));
}

export function generateClipboardStringFromString(text: any) {
  navigator.clipboard.writeText(text);
}
