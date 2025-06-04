// Generate unique command IDs
export function generateCommandId() {
  const timestamp = Date.now().toString(36)
  const randomPart = Math.random().toString(36).substring(2, 8)
  return `${timestamp}-${randomPart}`.toUpperCase()
}

// Parse command ID to get timestamp
export function parseCommandId(commandId) {
  try {
    const [timestampPart] = commandId.toLowerCase().split("-")
    const timestamp = Number.parseInt(timestampPart, 36)
    return new Date(timestamp)
  } catch {
    return null
  }
}
