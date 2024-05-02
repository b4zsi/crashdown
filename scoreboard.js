var fs = require("fs");
function submitform() {
  fs.readFile("scores.txt", "utf8", (err, data) => {
    if (err) {
      console.error("Error reading scores.txt:", err);
      return;
    }

    const existingData = data.split("\n").filter(Boolean);

    const newData = "newUsername,newScore";

    existingData.push(newData);

    const updatedData = existingData.join("\n");

    fs.writeFile("scores.txt", updatedData, (err) => {
      if (err) {
        console.error("Hiba a fájlba írás során:", err);
        return;
      }
      console.log("Adat sikeresen hozzáadva a scores.txt fájlhoz.");
    });
  });
}
