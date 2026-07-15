export const commandBot = {
  status: "ONLINE",
  hq: "1601 Ware Bottom Spring Rd, Suite 214, Chester, VA 23836",
  processCommand: function(input: string) {
    const lowerInput = input.toLowerCase();
    if (lowerInput.includes("leads")) return "Checking Kickserv pipeline... 3 High-Velocity leads found.";
    if (lowerInput.includes("photos")) return "Syncing Vision Folders... BEAUFORT updated.";
    if (lowerInput.includes("pricing")) return "Fetching live binder costs... Bids adjusted for 2026 volatility.";
    return "Command not recognized. Try: 'leads', 'photos', or 'pricing'.";
  }
};
