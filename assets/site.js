document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("npcCanvas");
  const ctx = canvas.getContext("2d");

  // DOM elements
  const inputName = document.getElementById("npcName");
  const inputHometown = document.getElementById("npcHometown");
  const selectSkin = document.getElementById("skinTone");
  const selectHair = document.getElementById("hairStyle");
  const inputHairColor = document.getElementById("hairColor");
  const selectTop = document.getElementById("topOutfit");
  const selectBottom = document.getElementById("bottomOutfit");
  const selectAccessory = document.getElementById("accessory");

  const displayName = document.getElementById("displayGuestName");
  const displayOrigin = document.getElementById("displayGuestOrigin");
  const jsonBox = document.getElementById("jsonModal");
  const jsonCode = document.getElementById("jsonOutput");

  // Disable image smoothing for authentic chunky pixels
  ctx.imageSmoothingEnabled = false;

  // Draw procedural 16-bit paperdoll slices
  function renderPaperdoll() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Canvas center point
    const cx = 64;
    const cy = 40;
    const scale = 3;

    // 1. Base Head & Neck (Skin Layer)
    ctx.fillStyle = selectSkin.value;
    ctx.fillRect(cx - 5 * scale, cy, 10 * scale, 10 * scale); // Head
    ctx.fillRect(cx - 2 * scale, cy + 10 * scale, 4 * scale, 2 * scale); // Neck

    // 2. Eyes
    ctx.fillStyle = "#1b1b1b";
    ctx.fillRect(cx - 3 * scale, cy + 4 * scale, 1 * scale, 2 * scale);
    ctx.fillRect(cx + 2 * scale, cy + 4 * scale, 1 * scale, 2 * scale);

    // 3. Bottoms (Trousers / Shorts)
    switch (selectBottom.value) {
      case "jeans":
        ctx.fillStyle = "#2b5c8f";
        ctx.fillRect(cx - 4 * scale, cy + 18 * scale, 8 * scale, 8 * scale);
        break;
      case "trackie":
        ctx.fillStyle = "#3a414d";
        ctx.fillRect(cx - 4 * scale, cy + 18 * scale, 8 * scale, 8 * scale);
        break;
      case "cargo":
      default:
        ctx.fillStyle = "#8a7a58";
        ctx.fillRect(cx - 4 * scale, cy + 18 * scale, 8 * scale, 5 * scale);
        // Bare legs under shorts
        ctx.fillStyle = selectSkin.value;
        ctx.fillRect(cx - 3 * scale, cy + 23 * scale, 2 * scale, 3 * scale);
        ctx.fillRect(cx + 1 * scale, cy + 23 * scale, 2 * scale, 3 * scale);
        break;
    }

    // Shoes / Feet
    ctx.fillStyle = "#2c221e";
    ctx.fillRect(cx - 4 * scale, cy + 26 * scale, 3 * scale, 2 * scale);
    ctx.fillRect(cx + 1 * scale, cy + 26 * scale, 3 * scale, 2 * scale);

    // 4. Tops (Torso & Arms)
    switch (selectTop.value) {
      case "hawaiian":
        ctx.fillStyle = "#d64545"; // Red floral base
        ctx.fillRect(cx - 5 * scale, cy + 12 * scale, 10 * scale, 7 * scale);
        ctx.fillStyle = "#ffeb3b"; // Flower dot pattern
        ctx.fillRect(cx - 2 * scale, cy + 14 * scale, 1 * scale, 1 * scale);
        ctx.fillRect(cx + 2 * scale, cy + 16 * scale, 1 * scale, 1 * scale);
        break;
      case "gilet":
        ctx.fillStyle = "#2e4a3d"; // Dark green body
        ctx.fillRect(cx - 5 * scale, cy + 12 * scale, 10 * scale, 7 * scale);
        ctx.fillStyle = "#d1d5db"; // Long sleeve undershirt
        ctx.fillRect(cx - 7 * scale, cy + 12 * scale, 2 * scale, 6 * scale);
        ctx.fillRect(cx + 5 * scale, cy + 12 * scale, 2 * scale, 6 * scale);
        break;
      case "raincoat":
        ctx.fillStyle = "#f5b041"; // Bright yellow mac
        ctx.fillRect(cx - 6 * scale, cy + 12 * scale, 12 * scale, 8 * scale);
        break;
      case "hoodie":
      default:
        ctx.fillStyle = "#5c6bc0";
        ctx.fillRect(cx - 6 * scale, cy + 12 * scale, 12 * scale, 7 * scale);
        break;
    }

    // 5. Hair Layer
    ctx.fillStyle = inputHairColor.value;
    switch (selectHair.value) {
      case "messy":
        ctx.fillRect(cx - 6 * scale, cy - 2 * scale, 12 * scale, 4 * scale);
        ctx.fillRect(cx - 5 * scale, cy + 2 * scale, 3 * scale, 2 * scale);
        break;
      case "balding":
        ctx.fillRect(cx - 6 * scale, cy + 2 * scale, 2 * scale, 4 * scale);
        ctx.fillRect(cx + 4 * scale, cy + 2 * scale, 2 * scale, 4 * scale);
        break;
      case "ponytail":
        ctx.fillRect(cx - 5 * scale, cy - 1 * scale, 10 * scale, 3 * scale);
        ctx.fillRect(cx + 5 * scale, cy + 1 * scale, 3 * scale, 6 * scale);
        break;
      case "short":
      default:
        ctx.fillRect(cx - 5 * scale, cy - 1 * scale, 10 * scale, 3 * scale);
        break;
    }

    // 6. Accessory Layer
    switch (selectAccessory.value) {
      case "flatcap":
        ctx.fillStyle = "#4a453e";
        ctx.fillRect(cx - 7 * scale, cy - 2 * scale, 14 * scale, 3 * scale);
        ctx.fillRect(cx - 8 * scale, cy + 1 * scale, 16 * scale, 1 * scale); // Visor brim
        break;
      case "buckethat":
        ctx.fillStyle = "#e0e0e0";
        ctx.fillRect(cx - 6 * scale, cy - 4 * scale, 12 * scale, 4 * scale);
        ctx.fillRect(cx - 8 * scale, cy, 16 * scale, 2 * scale); // Wide brim
        break;
      case "sunglasses":
        ctx.fillStyle = "#111111";
        ctx.fillRect(cx - 4 * scale, cy + 4 * scale, 8 * scale, 2 * scale);
        break;
      default:
        break;
    }

    // Update Dossier labels
    displayName.textContent = inputName.value || "Anonymous Camper";
    displayOrigin.textContent = `From: ${inputHometown.value || "Unknown"}`;
  }

  // Generate the Godot-ready JSON Recipe
  function exportJson() {
    const payload = {
      name: inputName.value,
      hometown: inputHometown.value,
      archetype: "camper_custom",
      style: {
        skin_hex: selectSkin.value,
        hair_style: selectHair.value,
        hair_color: inputHairColor.value,
        top_id: selectTop.value,
        bottom_id: selectBottom.value,
        accessory_id: selectAccessory.value
      }
    };
    jsonCode.textContent = JSON.stringify(payload, null, 2);
    jsonBox.classList.remove("hidden");
    jsonBox.scrollIntoView({ behavior: "smooth" });
  }

  // Event Listeners
  const formInputs = [inputName, inputHometown, selectSkin, selectHair, inputHairColor, selectTop, selectBottom, selectAccessory];
  formInputs.forEach(input => input.addEventListener("input", renderPaperdoll));

  document.getElementById("btnExport").addEventListener("click", exportJson);

  document.getElementById("btnRandom").addEventListener("click", () => {
    const names = ["Uncle Barry", "Auntie Brenda", "Dave from Leeds", "Nigel", "Gemma", "Kev"];
    const towns = ["Great Yarmouth", "Cromer", "Norwich", "Hunstanton", "Lowestoft"];
    
    inputName.value = names[Math.floor(Math.random() * names.length)];
    inputHometown.value = towns[Math.floor(Math.random() * towns.length)];
    selectSkin.selectedIndex = Math.floor(Math.random() * selectSkin.options.length);
    selectHair.selectedIndex = Math.floor(Math.random() * selectHair.options.length);
    selectTop.selectedIndex = Math.floor(Math.random() * selectTop.options.length);
    selectBottom.selectedIndex = Math.floor(Math.random() * selectBottom.options.length);
    selectAccessory.selectedIndex = Math.floor(Math.random() * selectAccessory.options.length);

    renderPaperdoll();
  });

  // Initial render
  renderPaperdoll();
});