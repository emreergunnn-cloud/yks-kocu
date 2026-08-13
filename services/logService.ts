type LogLevel = 'info' | 'warn' | 'error';

export function logToServer(level: LogLevel, message: string, data?: object) {
  // Ensure this only runs on the client
  if (typeof window === 'undefined') return;

  try {
    const absoluteUrl = `${window.location.origin}/api/log`;
    fetch(absoluteUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ level, message, data }),
    });
  } catch (error) {
    // If the logging itself fails, just log to console as a fallback.
    console.error('Failed to log to server', error);
  }
}
