const openButton = document.getElementById("openInvitation");
const intro = document.getElementById("intro");
const weddingContent = document.getElementById("weddingContent");

const music = document.getElementById("weddingMusic");
const musicBtn = document.getElementById("musicBtn");

const confirmBtn = document.getElementById("confirmBtn");
const shareBtn = document.getElementById("shareBtn");
const modal = document.getElementById("rsvpModal");
const closeModal = document.getElementById("closeModal");
const rsvpSubmit = document.getElementById("rsvpSubmit");
const guestName = document.getElementById("guestName");
const attendance = document.getElementById("attendance");
const guestCount = document.getElementById("guestCount");
const rsvpNote = document.getElementById("rsvpNote");

openButton.addEventListener("click", () => {
  openButton.disabled = true;
  intro.classList.add("animate");

  // Browsers allow audio to start after a real user interaction.
  music.play().then(() => {
    musicBtn.classList.add("playing");
  }).catch(() => {});

  setTimeout(() => {
    intro.classList.add("finished");
    weddingContent.classList.add("show");
    window.scrollTo({ top: 0, behavior: "instant" });
  }, 2450);
});

musicBtn.addEventListener("click", async () => {
  if (music.paused) {
    await music.play();
    musicBtn.classList.add("playing");
  } else {
    music.pause();
    musicBtn.classList.remove("playing");
  }
});

// Countdown: December 12, 2026 at 8:00 PM Cairo time (UTC+2 in December).
const weddingDate = new Date("2026-12-12T20:00:00+02:00").getTime();
const $ = id => document.getElementById(id);

function updateCountdown() {
  const diff = weddingDate - Date.now();

  if (diff <= 0) {
    $("days").textContent = "00";
    $("hours").textContent = "00";
    $("minutes").textContent = "00";
    $("seconds").textContent = "00";
    return;
  }

  $("days").textContent = String(Math.floor(diff / 86400000)).padStart(2, "0");
  $("hours").textContent = String(Math.floor((diff / 3600000) % 24)).padStart(2, "0");
  $("minutes").textContent = String(Math.floor((diff / 60000) % 60)).padStart(2, "0");
  $("seconds").textContent = String(Math.floor((diff / 1000) % 60)).padStart(2, "0");
}
updateCountdown();
setInterval(updateCountdown, 1000);

// Share invitation.
shareBtn.addEventListener("click", async () => {
  const shareData = {
    title: "Adham & Salma — Wedding Invitation",
    text: "You're invited to celebrate Adham & Salma's wedding on December 12, 2026.",
    url: window.location.href
  };

  try {
    if (navigator.share) {
      await navigator.share(shareData);
    } else {
      await navigator.clipboard.writeText(window.location.href);
      alert("Invitation link copied!");
    }
  } catch (err) {
    // User cancelled the share sheet.
  }
});

// RSVP modal.
function showModal() {
  modal.classList.add("show");
  modal.setAttribute("aria-hidden", "false");
  setTimeout(() => guestName.focus(), 50);
}
function hideModal() {
  modal.classList.remove("show");
  modal.setAttribute("aria-hidden", "true");
  rsvpNote.textContent = "";
}
confirmBtn.addEventListener("click", showModal);
closeModal.addEventListener("click", hideModal);
modal.addEventListener("click", e => {
  if (e.target === modal) hideModal();
});

rsvpSubmit.addEventListener("click", async () => {
  const name = guestName.value.trim() || "Guest";
  const count = Math.max(1, Number(guestCount.value) || 1);
  const status = attendance.value;

  const message =
    `Wedding RSVP — Adham & Salma%0A` +
    `Name: ${encodeURIComponent(name)}%0A` +
    `Attendance: ${encodeURIComponent(status)}%0A` +
    `Guests: ${count}`;

  try {
    await navigator.clipboard.writeText(
      `Wedding RSVP — Adham & Salma\nName: ${name}\nAttendance: ${status}\nGuests: ${count}`
    );
    rsvpNote.textContent = "Your RSVP message is copied. Send it to the couple.";
  } catch {
    rsvpNote.textContent = "Your RSVP is ready. Please copy the details and send them to the couple.";
  }
});
