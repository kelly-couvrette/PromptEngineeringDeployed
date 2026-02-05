
// We use a simplified type here because App.tsx is responsible for creating the
// final flat structure before calling this function.
type FlatExportData = Record<string, any>;

const isTauri = typeof window !== "undefined" && "__TAURI__" in window

function escapeCSV(value: any): string {
  // Ensure we handle non-string values gracefully (like numbers or null)
  const stringValue = String(value || ""); 
  
  if (stringValue.includes(",") || stringValue.includes('"') || stringValue.includes("\n")) {
    // Enclose in quotes and double-up any existing quotes
    return `"${stringValue.replace(/"/g, '""')}"`
  }
  return stringValue
}

/**
 * Saves the user data to a CSV file.
 * NOTE: This function expects the data to already be flattened into a single object 
 * containing all demographic and scenario results (e.g., SCENARIO_1_UN_PROMPT).
 * @param flatData The single, flat object containing all user results.
 */
// Replace with your Google Web App URL
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxd39xZ3M0YJ4H7b832htOoGRZmuT13Tzvtoi6cLN7jZWrxaLglCaef62cg6SMIJaK8/exec";

export async function saveToCloud(flatData: FlatExportData) {
  const finalData = {
    ...flatData,
    User_ID: crypto.randomUUID(),
    Timestamp_UTC: new Date().toISOString()
  };

  // We don't "await" this fetch inside a try/catch in the traditional way 
  // because 'no-cors' always returns an opaque (empty) response.
  fetch(GOOGLE_SCRIPT_URL, {
    method: "POST",
    mode: "no-cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(finalData),
  }).catch(err => console.error("Background save failed:", err));

  // Alert the user immediately so they aren't waiting on a 
  // network response that the browser is technically blocking.
  console.log("Data sent to Google Sheets.");
}