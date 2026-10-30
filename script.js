
/* OIKO-LIBRIUM 2027 — GOOGLE FORM SETUP
   Uses the EXISTING spreadsheet.
   Run createOikoGoogleForm() only ONCE.
*/

function createOikoGoogleForm() {
  const props = PropertiesService.getScriptProperties();
  const spreadsheetId = props.getProperty("DATABASE_ID");

  if (!spreadsheetId) {
    throw new Error(
      "Existing spreadsheet ID not found. Do not run setupOikoLibrium()."
    );
  }

  const existingFormId = props.getProperty("OIKO_GOOGLE_FORM_ID");

  if (existingFormId) {
    const existingForm = FormApp.openById(existingFormId);
    Logger.log("Form already exists. No duplicate created.");
    Logger.log("FORM URL: " + existingForm.getPublishedUrl());
    Logger.log("EDIT URL: " + existingForm.getEditUrl());
    Logger.log("SPREADSHEET: " +
      SpreadsheetApp.openById(spreadsheetId).getUrl());
    return;
  }

  const spreadsheet = SpreadsheetApp.openById(spreadsheetId);

  const form = FormApp.create(
    "Oiko-Librium 2027 | Participant Registration"
  );

  form.setDescription(
    "Organiser: Team OIKO-LIBRIUM\n\n" +
    "EVENT DATE: 8 January 2027 (TENTATIVE).\n" +
    "If the date changes, all registered participants will be informed through WhatsApp.\n\n" +
    "REGISTRATION FEES:\n" +
    "Standard on-campus events: ₹75 per participant, per event.\n" +
    "Answer-tainity Quiz: ₹225.\n" +
    "Online events: FREE.\n\n" +
    "For team games, it will be appreciated if the total payment is made together.\n\n" +
    "The organising committee reserves the right to disqualify any participant or team for misconduct, violation of event rules, unfair practices, or other inappropriate behaviour. The committee's decision will be final."
  );

  form.setConfirmationMessage(
    "Thank you for registering for Oiko-Librium 2027! " +
    "Your response has been recorded."
  );

  form.setAllowResponseEdits(false);
  form.setDestination(
    FormApp.DestinationType.SPREADSHEET,
    spreadsheetId
  );

  // EVENT SELECTION
  form.addSectionHeaderItem().setTitle("01 — Event Selection");

  form.addListItem()
    .setTitle("Select your event")
    .setChoiceValues([
      "Bandopolis — Brand War",
      "Answer-tainity — General Quiz",
      "Diplomacia — Model United Nations",
      "Bid-o-nomics — Mock Cricket Auction",
      "Wunderkammer — Paper Presentation",
      "Pen-thesis — Essay Writing (Online)",
      "Chromanomics — Photography (Online)",
      "Cinemanimics — Short Film (Online)"
    ])
    .setRequired(true);

  form.addTextItem()
    .setTitle("Team name (write Individual if applicable)")
    .setRequired(true);

  form.addTextItem()
    .setTitle("College / Institution")
    .setRequired(true);

  form.addTextItem()
    .setTitle("Team leader's full name")
    .setRequired(true);

  form.addTextItem()
    .setTitle("Team leader's phone number")
    .setRequired(true);

  form.addTextItem()
    .setTitle("Team leader's WhatsApp number")
    .setRequired(true);

  form.addTextItem()
    .setTitle("Team leader's email address")
    .setRequired(true);

  form.addTextItem()
    .setTitle("Number of participants")
    .setRequired(true);

  // PARTICIPANT DETAILS
  form.addSectionHeaderItem()
    .setTitle("02 — Participant Details")
    .setHelpText(
      "Enter details for each team member. " +
      "Participant 1 should be the team leader."
    );

  for (let i = 1; i <= 5; i++) {
    const required = i === 1;

    form.addSectionHeaderItem()
      .setTitle("Participant " + i);

    form.addTextItem()
      .setTitle("Participant " + i + " — Full name")
      .setRequired(required);

    form.addTextItem()
      .setTitle("Participant " + i + " — Age")
      .setRequired(required);

    form.addTextItem()
      .setTitle("Participant " + i + " — Department")
      .setRequired(required);

    form.addTextItem()
      .setTitle("Participant " + i + " — Phone")
      .setRequired(required);

    form.addTextItem()
      .setTitle("Participant " + i + " — Email")
      .setRequired(required);

    form.addMultipleChoiceItem()
      .setTitle("Participant " + i + " — Gender")
      .setChoiceValues([
        "Male",
        "Female",
        "Other",
        "Prefer not to say"
      ])
      .setRequired(required);

    form.addMultipleChoiceItem()
      .setTitle("Participant " + i + " — Meal preference")
      .setChoiceValues([
        "Veg",
        "Non-veg"
      ])
      .setRequired(required);
  }

  // PAYMENT
  form.addSectionHeaderItem()
    .setTitle("03 — Payment Details")
    .setHelpText(
      "Standard on-campus events: ₹75 per participant. " +
      "Answer-tainity Quiz: ₹225. Online events: Free."
    );

  form.addTextItem()
    .setTitle("Amount paid (₹) — enter 0 for online events")
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle("Payment status")
    .setChoiceValues([
      "Paid",
      "Online event — Free",
      "Payment will be completed shortly"
    ])
    .setRequired(true);

  form.addTextItem()
    .setTitle("UPI transaction ID / Payment reference (if available)")
    .setRequired(false);

  // UPLOAD PLACEHOLDERS — ADD FILE UPLOAD QUESTIONS MANUALLY
  form.addSectionHeaderItem()
    .setTitle("04 — Document Uploads")
    .setHelpText(
      "Organisers: add two File upload questions here manually: " +
      "College ID card(s) and Payment screenshot. " +
      "Make the payment screenshot question optional for free online events."
    );

  // DECLARATION
  form.addCheckboxItem()
    .setTitle("Declaration")
    .setChoiceValues([
      "I confirm that the information is correct, agree to follow the event rules, and accept the organising committee's decisions."
    ])
    .setRequired(true);

  props.setProperty("OIKO_GOOGLE_FORM_ID", form.getId());

  Logger.log("GOOGLE FORM URL: " + form.getPublishedUrl());
  Logger.log("GOOGLE FORM EDIT URL: " + form.getEditUrl());
  Logger.log("EXISTING SPREADSHEET: " + spreadsheet.getUrl());
}
