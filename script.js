/*
  Oiko-Librium 2027 registration frontend.
  Backend URL is already filled in. Do not change it unless you redeploy Apps Script.
*/
const CONFIG = {
  API_URL: "https://script.google.com/macros/s/AKfycbycAuVsLOc6PAJpDBS5pZlXOJWDBMtj3V5KUUYKduuTpljYh8dxI8z_X-8xPMsQRraVGLg/exec",
  MAX_ID_BYTES: 1 * 1024 * 1024
};

// IMPORTANT: IDs here are lowercase because the Apps Script backend uses lowercase keys.
const EVENTS = [
  {id:"bandopolis",name:"Bandopolis",category:"BRAND WAR",description:"Pit two competing brands against each other. Build your argument, defend your brand and answer the jury.",team:"2 members",mode:"On campus",min:2,max:2},
  {id:"answer_tainity",name:"Answer-tainity",category:"GENERAL QUIZ",description:"A general quiz with an economics streak. Written preliminaries followed by a stage final for the top six teams.",team:"1–3 members",mode:"On campus",min:1,max:3},
  {id:"diplomacia",name:"Diplomacia",category:"MODEL UNITED NATIONS",description:"Represent a nation in a simulated General Assembly. Debate, negotiate and draft resolutions.",team:"2–3 members",mode:"On campus",min:2,max:3},
  {id:"bid_o_nomics",name:"Bid-o-nomics",category:"MOCK CRICKET AUCTION",description:"Build your dream cricket squad with a virtual ₹120 crore purse after qualifying through a cricket quiz.",team:"1–3 members",mode:"On campus",min:1,max:3},
  {id:"wunderkammer",name:"Wunderkammer",category:"PAPER PRESENTATION",description:"Present original economic research. Eight minutes of presentation followed by two minutes of questions.",team:"1–3 members",mode:"On campus",min:1,max:3},
  {id:"pen_thesis",name:"Pen-thesis",category:"ESSAY WRITING",description:"Explore one of the announced topics through a thoughtful written submission.",team:"Individual",mode:"Online",min:1,max:1},
  {id:"chromanomics",name:"Chromanomics",category:"PHOTOGRAPHY",description:"Capture how markets and money shape everyday life through your photographic perspective.",team:"Individual",mode:"Online",min:1,max:1},
  {id:"cinemanimics",name:"Cinemanimics",category:"SHORT FILM",description:"Create a short film of 3–5 minutes based on one of the announced topics.",team:"1–5 members",mode:"Online",min:1,max:5}
];

const eventGrid = document.getElementById("eventGrid");
const eventSelect = document.getElementById("eventId");
const participantContainer = document.getElementById("participants");
const form = document.getElementById("registrationForm");
const addButton = document.getElementById("addParticipant");

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

function selectedEvent() {
  return EVENTS.find(item => item.id === eventSelect.value);
}

function updateParticipantLimit() {
  const chosen = selectedEvent();
  const max = chosen ? chosen.max : 5;
  addButton.disabled = participantContainer.children.length >= max;
  addButton.textContent = addButton.disabled ? "Maximum participants reached" : "+ Add participant";
}

eventGrid.addEventListener("click",event => {
  const button = event.target.closest("[data-event]");
  if (!button) return;
  eventSelect.value = button.dataset.event;
  updateParticipantLimit();
  document.getElementById("register").scrollIntoView({behavior:"smooth"});
});

function addParticipant() {
  const chosen = selectedEvent();
  const max = chosen ? chosen.max : 5;
  const count = participantContainer.children.length;
  if (count >= max) {
    alert(`This event allows a maximum of ${max} participant(s).`);
    return;
  }

  const card = document.createElement("div");
  card.className = "participant";
  card.innerHTML = `
    <div class="participant-title">PARTICIPANT ${count+1} — ${count === 0 ? "TEAM LEADER" : "MEMBER"}</div>
    <label>Full name *
      <input name="name" required maxlength="100" autocomplete="name">
    </label>
    <label>Age *
      <input name="age" type="number" required min="1" max="100" step="1" inputmode="numeric">
    </label>
    <label>Department *
      <input name="department" required maxlength="100">
    </label>
    <label>Phone number *
      <input name="phone" type="tel" required maxlength="20" autocomplete="tel" pattern="[0-9 +()-]{10,20}">
    </label>
    <label>Email address *
      <input name="email" type="email" required maxlength="150" autocomplete="email">
    </label>
    <label>Gender *
      <select name="gender" required>
        <option value="">Select gender</option>
        <option>Male</option>
        <option>Female</option>
        <option>Other</option>
        <option>Prefer not to say</option>
      </select>
    </label>
    <label>Meal preference *
      <select name="meal" required>
        <option value="">Select preference</option>
        <option value="Veg">Vegetarian</option>
        <option value="Non-veg">Non-vegetarian</option>
      </select>
    </label>
    <label>College ID card (JPG, PNG or PDF; max 1 MB) *
      <input name="idProof" type="file" accept="image/jpeg,image/png,application/pdf,.jpg,.jpeg,.png,.pdf" required>
    </label>
    <button class="button secondary small remove-participant" type="button">Remove participant</button>
  `;

  card.querySelector(".remove-participant").addEventListener("click",() => {
    card.remove();
    renumberParticipants();
    updateParticipantLimit();
  });
  participantContainer.appendChild(card);
  renumberParticipants();
  updateParticipantLimit();
}

function renumberParticipants() {
  [...participantContainer.children].forEach((card,index) => {
    card.querySelector(".participant-title").textContent =
      `PARTICIPANT ${index+1} — ${index === 0 ? "TEAM LEADER" : "MEMBER"}`;
  });
}

function readFileAsDataUrl(file) {
  return new Promise((resolve,reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error(`Could not read ${file.name}. Please choose it again.`));
    reader.readAsDataURL(file);
  });
}

addButton.addEventListener("click",addParticipant);

eventSelect.addEventListener("change",() => {
  const chosen = selectedEvent();
  const count = participantContainer.children.length;
  if (chosen && count > chosen.max) {
    alert(`This event allows at most ${chosen.max} participant(s). Please remove the extra participant(s).`);
  }
  updateParticipantLimit();
});

addParticipant();


async function makeParticipantCode(registrationId, participant) {
  const source = [
    registrationId,
    participant.name.trim().toLowerCase(),
    String(participant.age),
    participant.department.trim().toLowerCase()
  ].join("|");

  const bytes = new TextEncoder().encode(source);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  const hex = [...new Uint8Array(digest)]
    .map(value => value.toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase();

  return "OL27-" + hex.slice(0, 12);
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, character => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[character]);
}

async function showRegistrationConfirmation(registrationId, chosen, teamName, college, participants) {
  const formSection = document.getElementById("register");
  let confirmation = document.getElementById("registrationConfirmation");

  if (!confirmation) {
    confirmation = document.createElement("section");
    confirmation.id = "registrationConfirmation";
    confirmation.className = "section";
    confirmation.style.cssText = "background:#190b12;min-height:80vh;";
    formSection.insertAdjacentElement("afterend", confirmation);
  }

  const cards = [];
  for (const participant of participants) {
    const code = await makeParticipantCode(registrationId, participant);
    cards.push({ ...participant, code });
  }

  confirmation.innerHTML = `
    <div class="confirmation-sheet" style="max-width:850px;margin:0 auto;padding:32px;border:1px solid #d9ad62;background:#28121c;color:#f6ead9;">
      <p style="color:#d9ad62;letter-spacing:3px;font-size:11px;font-weight:700;">OIKO-LIBRIUM 2027 · STUDENTS' MEET</p>
      <h2 style="font-family:'Playfair Display',serif;font-size:clamp(30px,5vw,48px);margin:12px 0;">Registration <span style="color:#d9ad62;">Confirmed</span></h2>
      <p style="color:#c0aeb2;margin-bottom:20px;">Your registration has been received successfully. Keep this page or print it for your records.</p>
      <div style="padding:16px;border:1px solid rgba(217,173,98,.4);margin:20px 0;">
        <div style="color:#d9ad62;font-size:11px;letter-spacing:2px;">TEAM REGISTRATION ID</div>
        <div style="font-size:22px;font-weight:800;letter-spacing:1px;overflow-wrap:anywhere;">${escapeHtml(registrationId)}</div>
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:14px;margin:20px 0;">
        <div><small style="color:#d9ad62;">COMPETITION</small><div>${escapeHtml(chosen.name)}</div></div>
        <div><small style="color:#d9ad62;">TEAM NAME</small><div>${escapeHtml(teamName)}</div></div>
        <div><small style="color:#d9ad62;">COLLEGE</small><div>${escapeHtml(college)}</div></div>
      </div>
      <h3 style="font-family:'Playfair Display',serif;font-size:25px;margin:26px 0 14px;">Participant Passes</h3>
      ${cards.map((person,index) => `
        <article style="border:1px solid rgba(217,173,98,.35);padding:18px;margin:14px 0;break-inside:avoid;">
          <div style="display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;">
            <strong style="color:#d9ad62;">PARTICIPANT ${index+1}${index===0 ? " · TEAM LEADER" : ""}</strong>
            <strong style="font-size:18px;letter-spacing:1px;">${escapeHtml(person.code)}</strong>
          </div>
          <h3 style="font-size:23px;margin:10px 0;">${escapeHtml(person.name)}</h3>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:10px;color:#c0aeb2;">
            <div><small>AGE</small><div>${escapeHtml(person.age)}</div></div>
            <div><small>DEPARTMENT</small><div>${escapeHtml(person.department)}</div></div>
            <div><small>COMPETITION</small><div>${escapeHtml(chosen.name)}</div></div>
            <div><small>TEAM</small><div>${escapeHtml(teamName)}</div></div>
          </div>
        </article>
      `).join("")}
      <p style="color:#c0aeb2;font-size:12px;margin-top:20px;">Please retain your participant code. Present it to the organisers when required.</p>
      <button type="button" id="printRegistrationPass" class="button primary" style="margin-top:20px;">Print Registration Pass</button>
    </div>
  `;

  document.getElementById("printRegistrationPass").addEventListener("click",() => window.print());
  formSection.hidden = true;
  confirmation.hidden = false;
  confirmation.scrollIntoView({behavior:"smooth"});
  document.body.classList.add("showing-registration-confirmation");
}

(function addConfirmationPrintStyles() {
  const style = document.createElement("style");
  style.textContent = `
    @media print {
      @page { size: A4; margin: 12mm; }
      body.showing-registration-confirmation * { visibility:hidden !important; }
      body.showing-registration-confirmation #registrationConfirmation,
      body.showing-registration-confirmation #registrationConfirmation * { visibility:visible !important; }
      body.showing-registration-confirmation #registrationConfirmation {
        display:block !important; position:absolute; left:0; top:0; width:100%;
        padding:0 !important; background:white !important; color:#171017 !important;
      }
      body.showing-registration-confirmation .confirmation-sheet {
        max-width:none !important; border:0 !important; background:white !important;
        color:#171017 !important; padding:0 !important;
      }
      body.showing-registration-confirmation #registrationConfirmation p,
      body.showing-registration-confirmation #registrationConfirmation div,
      body.showing-registration-confirmation #registrationConfirmation h2,
      body.showing-registration-confirmation #registrationConfirmation h3,
      body.showing-registration-confirmation #registrationConfirmation strong,
      body.showing-registration-confirmation #registrationConfirmation small {
        color:#171017 !important;
      }
      body.showing-registration-confirmation #printRegistrationPass { display:none !important; }
      body.showing-registration-confirmation article { border:1px solid #999 !important; }
    }
  `;
  document.head.appendChild(style);
})();

form.addEventListener("submit",async event => {
  event.preventDefault();

  const message = document.getElementById("formMessage");
  const submitButton = document.getElementById("submitButton");
  const chosen = selectedEvent();
  const cards = [...participantContainer.children];

  if (!CONFIG.API_URL) {
    message.textContent = "The registration system is not connected. Please contact the organisers.";
    return;
  }
  if (!chosen) {
    message.textContent = "Please select an event.";
    return;
  }
  if (cards.length < chosen.min || cards.length > chosen.max) {
    message.textContent = `${chosen.name} requires ${chosen.min === chosen.max ? chosen.min : `${chosen.min}–${chosen.max}`} participant(s).`;
    return;
  }

  // Backend checks that the first participant is the team leader.
  const leaderName = document.getElementById("leaderName").value.trim();
  const firstName = cards[0].querySelector('[name="name"]').value.trim();
  if (leaderName.toLowerCase() !== firstName.toLowerCase()) {
    message.textContent = "The first participant's name must match the Team Leader name above.";
    cards[0].querySelector('[name="name"]').focus();
    return;
  }

  submitButton.disabled = true;
  addButton.disabled = true;
  message.textContent = "Checking details and preparing College ID files…";

  try {
    const participants = [];
    let totalFileBytes = 0;

    for (const card of cards) {
      const get = name => card.querySelector(`[name="${name}"]`);
      const file = get("idProof").files[0];

      if (!file) throw new Error("Please upload a College ID card for every participant.");
      if (file.size > CONFIG.MAX_ID_BYTES) throw new Error(`${file.name} is larger than 1 MB.`);
      totalFileBytes += file.size;
      if (totalFileBytes > 4 * 1024 * 1024) {
        throw new Error("Combined College ID files must not exceed 4 MB.");
      }

      const allowed = ["image/jpeg","image/png","application/pdf"];
      if (!allowed.includes(file.type)) {
        throw new Error(`${file.name}: only JPG, PNG or PDF files are accepted.`);
      }

      const age = Number(get("age").value);
      if (!Number.isInteger(age) || age < 1 || age > 100) {
        throw new Error("Please enter a valid age for every participant.");
      }

      participants.push({
        name: get("name").value.trim(),
        age,
        department: get("department").value.trim(),
        phone: get("phone").value.trim(),
        email: get("email").value.trim(),
        gender: get("gender").value,
        meal: get("meal").value,
        idProof: {
          mimeType: file.type,
          base64: await readFileAsDataUrl(file)
        }
      });
    }

    const payload = {
      action: "register",
      website: "", // Empty honeypot field required by the Apps Script endpoint.
      registration: {
        eventId: chosen.id,
        teamName: document.getElementById("teamName").value.trim(),
        leaderName,
        college: document.getElementById("college").value.trim(),
        participants
      }
    };

    message.textContent = "Submitting registration…";
    const response = await fetch(CONFIG.API_URL,{
      method: "POST",
      headers: {"Content-Type":"text/plain;charset=utf-8"},
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    if (!response.ok || !result.success) {
      throw new Error(result.message || "Registration could not be completed.");
    }

    message.textContent = "Registration successful! Preparing your participant passes…";
    await showRegistrationConfirmation(
      result.registrationId,
      chosen,
      payload.registration.teamName,
      payload.registration.college,
      participants
    );

  } catch(error) {
    message.textContent = "Submission failed: " + error.message + " Please contact the organisers if the problem continues.";
  } finally {
    submitButton.disabled = false;
    updateParticipantLimit();
  }
});
