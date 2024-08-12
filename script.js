const COHORT = "2407-FTB-ET-WEB-FT";
const API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/${COHORT}/events`;

const state = {
  parties: [],
};

const partiesList = document.querySelector("#parties");

const partyForm = document.querySelector("#partyForm");
partyForm.addEventListener("submit", addParty);

/**
 * Sync state with the API and rerender
 */
async function render() {
  await getParties();
  renderParties();
}
render();

/**
 * Update state with parties from API
 */
async function getParties() {
  try {
    const response = await fetch(API_URL);
    const json = await response.json();
    console.log(json.data);
    state.parties = json.data;
  } catch (error) {
    console.error(error);
  }
}
async function deleteParty(id) {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });
    console.log(response.status);

    if (!response.ok) {
      throw new Error("Party could not be deleted");
    }
  } catch (error) {
    console.error(error);
  }
  render();
}

/**
 * Handle form submission for adding a party
 * @param {Event} event
 */
async function addParty(event) {
  event.preventDefault();

  const name = document.querySelector("#name").value;
  const date = new Date(document.querySelector("#date").value).toISOString();
  const time = document.querySelector("#time");
  const location = document.querySelector("#location").value;
  const description = document.querySelector("#description").value;

  await createParty(name, date, time, location, description);
}

// Send a POST request to add the new party
async function createParty(name, date, time, location, description) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, date, time, location, description }),
    });
    const json = await response.json();
    console.log(json);
  } catch (error) {
    console.error(error);
  }
  render();
}

// Render parties from state
function renderParties() {
  if (!state.parties.length) {
    partiesList.innerHTML = `<li>No parties found.</li>`;
    return;
  }

  const partyCards = state.parties.map((party) => {
    const partyCard = document.createElement("li");
    partyCard.classList.add("party");
    partyCard.innerHTML = `<h2>${party.name}</h2>
    <p>${party.date}</p>
    <p>${party.time}</p>
    <p>${party.location}</p>
    <p>${party.description}</p>`;

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete Party";
    partyCard.append(deleteButton);
    deleteButton.addEventListener("click", () => deleteParty(party.id));
    return partyCard;
  });
  partiesList.replaceChildren(...partyCards);
}
