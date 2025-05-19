// Toggle popup
function togglePopup(action) {
  const popup = document.getElementById("popup-window");
  const isOpening = action === "open";

  popup.classList.toggle("open", isOpening);
  popup.setAttribute("aria-hidden", !isOpening);

  const btn = document.querySelector(
    '.btn[aria-label="Open configuration settings"]'
  );
  btn.setAttribute("aria-expanded", isOpening);

  if (!isOpening) {
    setTimeout(() => popup.classList.add("hidden"), 300);
  }
}

function saveToServer(event) {
  const checkbox = document.getElementById("roomsOnStartup");
  const isChecked = checkbox.checked;

  const settings = {
    roomsOnStartup: isChecked,
  };

  fetch("/save-settings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(settings),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to save settings.");
      }
      // Reload the page after successful save
      window.location.reload();
    })
    .catch((error) => {
      console.error("Error saving settings:", error);
    });
}

// Cache toggle button
const toggleButton = document.getElementById("toggle-button");

// Ensure the script runs after DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  const toggleButton = document.getElementById("toggle-button");

  // Verify if the toggle button exists
  if (!toggleButton) {
    console.error("Toggle button not found!");
    return;
  }

  toggleButton.addEventListener("click", () => {
    const rooms = document.querySelectorAll(".room-container");
    const isCurrentlyHiding = toggleButton.textContent === "Hide All Rooms";

    rooms.forEach((room) => {
      const content = room.querySelector(".room-content");
      const toggleBtn = room.querySelector(".room-toggle");

      if (isCurrentlyHiding) {
        content.classList.add("hidden");
        toggleBtn.textContent = "Show Room";
      } else {
        content.classList.remove("hidden");
        toggleBtn.textContent = "Hide Room";
      }
    });

    toggleButton.textContent = isCurrentlyHiding
      ? "Show All Rooms"
      : "Hide All Rooms";
  });

  // Load settings and apply roomsOnStartup
  const showAllRoomsOnStartup = window.appSettings?.roomsOnStartup;

  if (showAllRoomsOnStartup) {
    toggleButton.click(); // Simulate "Show All Rooms" click
  }
});

// Toggle individual room content
function toggleRoomContent(roomId) {
  const room = document.getElementById(roomId);

  if (!room) {
    console.error(`Room with ID "${roomId}" not found.`);
    return;
  }

  const content = room.querySelector(".room-content");
  const toggleBtn = room.querySelector(".room-toggle");

  const isContentHidden = content.classList.contains("hidden");
  content.classList.toggle("hidden", !isContentHidden);
  toggleBtn.textContent = isContentHidden ? "Hide Room" : "Show Room";
  toggleBtn.setAttribute("aria-expanded", !isContentHidden);
}
