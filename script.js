const form = document.querySelector("#age-form");
const birthDateInput = document.querySelector("#birth-date");
const errorMessage = document.querySelector("#error-message");
const results = document.querySelector("#results");
const resetButton = document.querySelector("#reset-button");

const today = new Date();
today.setHours(0, 0, 0, 0);
birthDateInput.max = formatDateForInput(today);
document.querySelector("#year-now").textContent = today.getFullYear();

function formatDateForInput(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function daysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function calculateAge(birthDate, currentDate) {
  let years = currentDate.getFullYear() - birthDate.getFullYear();
  let months = currentDate.getMonth() - birthDate.getMonth();
  let days = currentDate.getDate() - birthDate.getDate();

  if (days < 0) {
    months--;
    const previousMonth = (currentDate.getMonth() - 1 + 12) % 12;
    const previousMonthYear = currentDate.getMonth() === 0
      ? currentDate.getFullYear() - 1
      : currentDate.getFullYear();
    days += daysInMonth(previousMonthYear, previousMonth);
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  const totalDays = Math.floor((currentDate - birthDate) / 86400000);
  return { years, months, days, totalDays };
}

function getNextBirthday(birthDate, currentDate) {
  const month = birthDate.getMonth();
  const day = birthDate.getDate();
  let nextBirthday = new Date(currentDate.getFullYear(), month, day);

  // For a February 29 birthday in a non-leap year, observe it on February 28.
  if (month === 1 && day === 29 && nextBirthday.getMonth() !== 1) {
    nextBirthday = new Date(currentDate.getFullYear(), 1, 28);
  }

  if (nextBirthday < currentDate) {
    nextBirthday = new Date(currentDate.getFullYear() + 1, month, day);
    if (month === 1 && day === 29 && nextBirthday.getMonth() !== 1) {
      nextBirthday = new Date(currentDate.getFullYear() + 1, 1, 28);
    }
  }
  return nextBirthday;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  errorMessage.textContent = "";
  results.hidden = true;

  if (!birthDateInput.value) {
    errorMessage.textContent = "Please select your date of birth.";
    birthDateInput.focus();
    return;
  }

  const [year, month, day] = birthDateInput.value.split("-").map(Number);
  const birthDate = new Date(year, month - 1, day);

  if (
    birthDate.getFullYear() !== year ||
    birthDate.getMonth() !== month - 1 ||
    birthDate.getDate() !== day ||
    birthDate > today
  ) {
    errorMessage.textContent = "Please enter a valid date that is not in the future.";
    return;
  }

  const age = calculateAge(birthDate, today);
  const nextBirthday = getNextBirthday(birthDate, today);
  const daysUntilBirthday = Math.round((nextBirthday - today) / 86400000);

  document.querySelector("#years").textContent = age.years;
  document.querySelector("#months").textContent = age.months;
  document.querySelector("#days").textContent = age.days;
  document.querySelector("#total-days").textContent = age.totalDays.toLocaleString();
  document.querySelector("#total-weeks").textContent = Math.floor(age.totalDays / 7).toLocaleString();
  document.querySelector("#birthday-countdown").textContent =
    daysUntilBirthday === 0 ? "Today! 🎉" : `${daysUntilBirthday} days`;

  document.querySelector("#birthday-message").textContent =
    daysUntilBirthday === 0
      ? "Happy birthday! Wishing you a wonderful year ahead."
      : `Your next birthday is ${nextBirthday.toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" })}.`;

  results.hidden = false;
  results.scrollIntoView({ behavior: "smooth", block: "nearest" });
});

resetButton.addEventListener("click", () => {
  birthDateInput.value = "";
  errorMessage.textContent = "";
  results.hidden = true;
  birthDateInput.focus();
});
