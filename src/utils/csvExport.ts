
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
export async function saveToCSV(flatData: FlatExportData) {
  try {
    // 1. Determine Headers: Use the keys of the flat object as headers.
    const headers = Object.keys(flatData)

    // 2. Determine Row Values: Map the values of the flat object, ensuring order matches headers.
    const row = headers.map(key => escapeCSV(flatData[key]))

    // Prepend a unique ID and Timestamp to the headers and row data.
    const uniqueId = crypto.randomUUID(); // Requires a modern environment
    const timestamp = new Date().toISOString();

    const finalHeaders = ["User_ID", ...headers, "Timestamp_UTC"];
    const finalRow = [escapeCSV(uniqueId), ...row, escapeCSV(timestamp)];
    
    // 3. Combine into CSV format
    const csvContent = finalHeaders.join(",") + "\n" + finalRow.join(",");
    const fileName = `user-data-${uniqueId}.csv`;

    if (isTauri) {
      await saveTauriCSV(csvContent, fileName)
    } else {
      saveBrowserCSV(csvContent, fileName)
    }
  } catch (error) {
    console.error("Error saving CSV:", error)
    alert("Error saving data. Please try again.")
  }
}

// --- Tauri and Browser Save Helpers (Keep these the same, just update params) ---

async function saveTauriCSV(csvContent: string, fileName: string) {
  const { writeTextFile } = await import("@tauri-apps/api/fs")
  const { save } = await import("@tauri-apps/api/dialog")

  const filePath = await save({
    defaultPath: fileName,
    filters: [
      {
        name: "CSV",
        extensions: ["csv"],
      },
    ],
  })

  if (filePath) {
    await writeTextFile(filePath, csvContent)
    alert("Data saved successfully!")
  }
}

function saveBrowserCSV(csvContent: string, fileName: string) {
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const link = document.createElement("a")
  const url = URL.createObjectURL(blob)

  link.setAttribute("href", url)
  link.setAttribute("download", fileName)
  link.style.visibility = "hidden"

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  alert("Data downloaded successfully!")
}