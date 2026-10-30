
/*
  Replace the empty URL after deploying the backend.
  Do not put passwords or private administrator keys here.
*/
const CONFIG = {
  API_URL: ""
};

const EVENTS = [
  {
    id:"BANDOPOLIS",
    name:"Bandopolis",
    category:"BRAND WAR",
    description:"Pit two competing brands against each other. Build your argument, defend your brand and answer the jury.",
    team:"2 members",
    mode:"On campus"
  },
  {
    id:"ANSWER_TAINITY",
    name:"Answer-tainity",
    category:"GENERAL QUIZ",
    description:"A general quiz with an economics streak. Written preliminaries followed by a stage final for the top six teams.",
    team:"1–3 members",
    mode:"On campus"
  },
  {
    id:"DIPLOMACIA",
    name:"Diplomacia",
    category:"MODEL UNITED NATIONS",
    description:"Represent a nation in a simulated General Assembly. Debate, negotiate and draft resolutions.",
    team:"2–3 members",
    mode:"On campus"
  },
  {
    id:"BID_O_NOMICS",
    name:"Bid-o-nomics",
    category:"MOCK CRICKET AUCTION",
    description:"Build your dream cricket squad with a virtual ₹120 crore purse after qualifying through a cricket quiz.",
    team:"1–3 members",
    mode:"On campus"
  },
  {
    id:"WUNDERKAMMER",
    name:"Wunderkammer",
    category:"PAPER PRESENTATION",
    description:"Present original economic research. Eight minutes of presentation followed by two minutes of questions.",
    team:"Up to 3 members",
    mode:"On campus"
  },
  {
    id:"PEN_THESIS",
    name:"Pen-thesis",
    category:"ESSAY WRITING",
    description:"Explore one of the announced topics through a thoughtful written submission.",
    team:"Individual",
    mode:"Online"
  },
  {
    id:"CHROMANOMICS",
    name:"Chromanomics",
    category:"PHOTOGRAPHY",
    description:"Capture how markets and money shape everyday life through your photographic perspective.",
    team:"Individual",
    mode:"Online"
  },
  {
    id:"CINEMANIMICS",
    name:"Cinemanimics",
    category:"SHORT FILM",
    description:"Create a short film of 3–5 minutes based on one of the announced topics.",
    team:"Team size to be confirmed",
    mode:"Online"
  }
];

const eventGrid = document.getElementById("eventGrid");
const eventSelect = document.getElementById("eventId");
const participantContainer = document.getElementById("participants");

EVENTS.forEach((event,index) => {
  const card = document.createElement("article");
  card.className = "event-card";
  card.innerHTML = `
    <span class="event-number">EVENT 0${index+1} / ${event.category}</span>
    <h3>${event.name}</h3>
    <p>${event.description}</p>
    <div class="event-meta">${event.team} · ${event.mode}</div>
    <button type="button" data-event="${event.id}">Register for this event ↗</button>
  `;
  eventGrid.appendChild(card);

  const option = document.createElement("option");
  option.value = event.id;
  option.textContent = event.name;
  eventSelect.appendChild(option);
});

eventGrid.addEventListener("click",event => {
  const button = event.target.closest("[data-event]");
  if (!button) return;
  eventSelect.value = button.dataset.event;
  document.getElementById("register").scrollIntoView({behavior:"smooth"});
});

function addParticipant() {
  const count = participantContainer.children.length;
  if (count >= 5) {
    alert("The current form supports a maximum of five participants. Event-specific limits will be enforced by the backend.");
    return;
  }

  const card = document.createElement("div");
  card.className = "participant";
  card.innerHTML = `
    <div class="participant-title">PARTICIPANT ${count+1}</div>
    <label>Full name *
      <input name="name" required maxlength="100">
    </label>
    <label>Date of birth *
      <input name="dob" type="date" required>
    </label>
    <label>Department *
      <input name="department" required maxlength="100">
    </label>
    <label>Phone number *
      <input name="phone" type="tel" required maxlength="20">
    </label>
    <label>Email address *
      <input name="email" type="email" required maxlength="150">
    </label>
    <label>Gender (optional)
      <select name="gender">
        <option value="">Prefer not to say</option>
        <option>Male</option>
        <option>Female</option>
      </select>
    </label>
    <label>Meal preference *
      <select name="meal" required>
        <option value="">Select preference</option>
        <option value="Veg">Vegetarian</option>
        <option value="Non-veg">Non-vegetarian</option>
      </select>
    </label>
    <button class="button secondary small remove-participant"
      type="button">Remove participant</button>
  `;

  card.querySelector(".remove-participant").addEventListener("click",() => {
    card.remove();
    renumberParticipants();
  });
  participantContainer.appendChild(card);
}

function renumberParticipants() {
  [...participantContainer.children].forEach((card,index) => {
    card.querySelector(".participant-title").textContent =
      `PARTICIPANT ${index+1}`;
  });
}

document.getElementById("addParticipant")
  .addEventListener("click",addParticipant);

addParticipant();

document.getElementById("registrationForm")
  .addEventListener("submit",async event => {
    event.preventDefault();

    const message = document.getElementById("formMessage");
    const submitButton = document.getElementById("submitButton");

    if (!CONFIG.API_URL) {
      message.textContent =
        "The registration system is not connected yet. Please wait for the backend setup.";
      return;
    }

    const participants = [...participantContainer.children].map(card => {
      const data = {};
      card.querySelectorAll("input,select").forEach(input => {
        data[input.name] = input.value.trim();
      });
      return data;
    });

    const payload = {
      action:"register",
      registration:{
        eventId:eventSelect.value,
        teamName:document.getElementById("teamName").value.trim(),
        leaderName:document.getElementById("leaderName").value.trim(),
        college:document.getElementById("college").value.trim(),
        participants
      }
    };

    submitButton.disabled = true;
    message.textContent = "Submitting registration...";

    try {
      const response = await fetch(CONFIG.API_URL,{
        method:"POST",
        headers:{"Content-Type":"text/plain;charset=utf-8"},
        body:JSON.stringify(payload)
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Registration could not be completed.");
      }

      message.textContent =
        "Registration successful! Your ID: " + result.registrationId;
      event.target.reset();
      participantContainer.innerHTML = "";
      addParticipant();

    } catch(error) {
      message.textContent =
        "Submission failed: " + error.message +
        " Please contact the organisers.";
    } finally {
      submitButton.disabled = false;
    }
  });
