export const autonomousVision = {
  matchZipToFolder: (zipCode: string) => {
    const map: Record<string, string> = { "29920": "BEAUFORT", "29928": "HHI", "23221": "RICHMOND" };
    return map[zipCode] || "REGIONAL";
  },
  serveLocalEvidence: function(leadZip: string) {
    const targetFolder = this.matchZipToFolder(leadZip);
    return {
      folder: targetFolder,
      message: `Loading verified ${targetFolder} projects for your estimate...`,
      images: [`/assets/geo/${targetFolder}/sample-1.jpg`] // Placeholder
    };
  }
};
