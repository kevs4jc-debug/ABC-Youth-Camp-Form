/**
 * 2026 ABC Youth Camp – Google Form Creator
 * ==========================================
 * This Google Apps Script recreates the full JotForm registration in Google Forms,
 * including section-based conditional logic (education paths, medical branching).
 *
 * HOW TO USE:
 *   1. Go to https://script.google.com and click "New project".
 *   2. Delete any existing code in the editor.
 *   3. Paste this entire script into the editor.
 *   4. Click Run → createYouthCampForm (you may need to grant permissions the first time).
 *   5. After it runs, open the "Execution log" (View → Logs) to find the form URL.
 *   6. Open the link to review and publish your new Google Form.
 *
 * NOTE ON CONDITIONAL LOGIC:
 *   Google Forms supports section-level branching (not per-question visibility).
 *   This script implements branching via separate sections for:
 *     - Education/employment status paths (Primary/Secondary, Tertiary, Professional)
 *     - Medical condition details (shown only when camper has a condition)
 *   Other follow-up questions (allergy details, medication details, etc.) use
 *   helper text to indicate they are conditional (e.g. "Complete only if yes").
 *
 * NOTE ON CASCADING LOCATION:
 *   The original JotForm had a cascading country→state→city dropdown powered by
 *   a JotForm API. Google Forms does not support cascading dropdowns, so Location
 *   is replaced with a single dropdown listing the known Fiji locations.
 */

function createYouthCampForm() {
  var form = FormApp.create('2026 ABC Youth Camp Registration Form');
  form.setTitle('2026 ABC Youth Camp Registration Form');
  form.setDescription(
    'ABC Ministry – 2026 Youth Camp Registration\n\n' +
    'Please complete all required fields accurately. ' +
    'If you are registering multiple campers, work through each Camper section in order. ' +
    'Camp fee details and payment instructions will be communicated separately.\n\n' +
    'Fields marked with * are required.'
  );
  form.setIsQuiz(false);
  form.setAllowResponseEdits(true);
  form.setCollectEmail(false); // Organizer email is captured as a question

  // ─────────────────────────────────────────────────────────────────────────────
  // SECTION 1 – ORGANIZER INFORMATION  (implicit first section – no page break)
  // ─────────────────────────────────────────────────────────────────────────────
  form.addSectionHeaderItem()
    .setTitle('Section 1 – Organizer Information')
    .setHelpText('Please provide your details as the person completing this registration.');

  form.addTextItem()
    .setTitle('Your Full Name')
    .setRequired(true);

  form.addTextItem()
    .setTitle('Your Email Address')
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('Please select your Kingdom Community')
    .setChoiceValues([
      'Advanced Breakthrough Centre',
      'Mataka Vou Kingdom Community'
    ])
    .showOtherOption(true)
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('How many campers will you be registering?')
    .setChoiceValues([
      'One Camper',
      'Two Campers',
      'Three Campers',
      'Four Campers',
      'Five Campers',
      'Six Campers'
    ])
    .setRequired(true);

  // ─────────────────────────────────────────────────────────────────────────────
  // CAMPER SECTIONS (1 – 6)
  // ─────────────────────────────────────────────────────────────────────────────
  // References needed for cross-section branching setup (filled per camper):
  var camperBasicPages  = [];  // First section of each camper (used by "more campers?" choices)
  var moreCampersItems  = [];  // "Register another camper?" items for campers 1-5

  var TOTAL_CAMPERS = 6;

  for (var n = 1; n <= TOTAL_CAMPERS; n++) {
    var label  = 'Camper ' + n;
    var isLast = (n === TOTAL_CAMPERS);

    // ── BASIC INFORMATION ────────────────────────────────────────────────────
    var basicPage = form.addPageBreakItem()
      .setTitle('Section ' + (n + 1) + ' – ' + label + ': Basic Information');
    if (n > 1) {
      basicPage.setHelpText(
        'Complete this section only if you are registering ' + n + ' or more campers.'
      );
    }
    camperBasicPages.push(basicPage);

    form.addTextItem()
      .setTitle(label + "'s Full Name")
      .setRequired(true);

    form.addDateItem()
      .setTitle(label + "'s Date of Birth")
      .setRequired(true);

    // Location — single dropdown (replaces cascading country→state→city from JotForm)
    form.addMultipleChoiceItem()
      .setTitle('Location of ' + label)
      .setChoiceValues([
        'Suva',
        'Lautoka',
        'Nadi',
        'Levuka',
        'Vanua Levu',
        'Overseas'
      ])
      .showOtherOption(true)
      .setRequired(true);

    form.addMultipleChoiceItem()
      .setTitle("What is " + label + "'s People's Group?")
      .setChoiceValues([
        'Project Heritage',
        'Evolution',
        'X-Elle GPS',
        'Hebron GPS',
        'X-Elle',
        'Charis',
        'Hebron',
        'Not yet in a PG'
      ])
      .setRequired(true);

    form.addMultipleChoiceItem()
      .setTitle('Are you the coordinator for ' + label + '?')
      .setChoiceValues(['Yes', 'No'])
      .setRequired(true);

    // ── EDUCATION & EMPLOYMENT STATUS (branching question) ───────────────────
    form.addPageBreakItem()
      .setTitle(label + ': Education & Employment Status');

    var eduQ = form.addMultipleChoiceItem()
      .setTitle("What is " + label + "'s current education or employment status?")
      .setHelpText(
        'Primary School → school details section\n' +
        'Secondary School → school details section\n' +
        'Tertiary / Vocational → tertiary details section\n' +
        'Working Professional → employment details section\n' +
        'Other → health section'
      )
      .setRequired(true);
    // eduQ choices are set further below once target section objects exist.

    // ── PRIMARY / SECONDARY SCHOOL DETAILS ──────────────────────────────────
    var priSecPage = form.addPageBreakItem()
      .setTitle(label + ': School Details (Primary / Secondary)');

    form.addTextItem()
      .setTitle("Name of " + label + "'s school")
      .setRequired(true);

    form.addMultipleChoiceItem()
      .setTitle("What year is " + label + " in?")
      .setChoiceValues([
        'Year 6', 'Year 7', 'Year 8',  'Year 9',
        'Year 10', 'Year 11', 'Year 12', 'Year 13'
      ])
      .setRequired(true);

    // ── TERTIARY EDUCATION DETAILS ───────────────────────────────────────────
    var tertiaryPage = form.addPageBreakItem()
      .setTitle(label + ': Tertiary Education Details');

    form.addMultipleChoiceItem()
      .setTitle("Which tertiary institution does " + label + " attend?")
      .setChoiceValues([
        'University of the South Pacific (USP)',
        'Fiji National University (FNU)',
        'University of Fiji'
      ])
      .showOtherOption(true)
      .setRequired(true);

    form.addTextItem()
      .setTitle("What program or course is " + label + " studying?")
      .setRequired(true);

    form.addMultipleChoiceItem()
      .setTitle("What is " + label + "'s employment status? (if also employed)")
      .setChoiceValues(['Full Time', 'Part Time'])
      .setHelpText("Leave blank if not currently employed alongside studies.");

    // ── EMPLOYMENT / PROFESSIONAL DETAILS ────────────────────────────────────
    var professionalPage = form.addPageBreakItem()
      .setTitle(label + ': Employment Details');

    form.addTextItem()
      .setTitle("What is " + label + "'s occupation?")
      .setRequired(true);

    form.addMultipleChoiceItem()
      .setTitle("What is " + label + "'s employment status?")
      .setChoiceValues(['Full Time', 'Part Time'])
      .setRequired(true);

    // ── HEALTH & MEDICAL (branching question) ────────────────────────────────
    var healthPage = form.addPageBreakItem()
      .setTitle(label + ': Health & Medical');

    // All three education detail sections end here.
    priSecPage.setGoToPage(healthPage);
    tertiaryPage.setGoToPage(healthPage);
    professionalPage.setGoToPage(healthPage);

    // Now set education branching choices (all target pages now exist).
    eduQ.setChoices([
      eduQ.createChoice('Primary School',        priSecPage),
      eduQ.createChoice('Secondary School',      priSecPage),
      eduQ.createChoice('Tertiary / Vocational', tertiaryPage),
      eduQ.createChoice('Working Professional',  professionalPage),
      eduQ.createChoice('Other',                 healthPage)
    ]);

    var medQ = form.addMultipleChoiceItem()
      .setTitle("Does " + label + " have any current medical condition?")
      .setHelpText("Selecting 'Yes' will take you to a section for medical details.")
      .setRequired(true);
    // medQ choices set below once medDetailsPage exists.

    // ── MEDICAL CONDITION DETAILS ─────────────────────────────────────────────
    var medDetailsPage = form.addPageBreakItem()
      .setTitle(label + ': Medical Condition Details');

    form.addParagraphTextItem()
      .setTitle("Please describe " + label + "'s current medical condition(s)")
      .setRequired(true);

    form.addMultipleChoiceItem()
      .setTitle("Will this condition affect " + label + "'s ability to participate in physical activities?")
      .setChoiceValues(['Yes', 'No'])
      .setRequired(true);

    form.addParagraphTextItem()
      .setTitle("If yes above – please explain how the condition affects participation in physical activities")
      .setHelpText('Complete only if the condition affects physical activities.');

    form.addMultipleChoiceItem()
      .setTitle("Is " + label + " currently taking any medication?")
      .setChoiceValues(['Yes', 'No'])
      .setRequired(true);

    form.addParagraphTextItem()
      .setTitle("If yes – please state the medication(s) " + label + " is taking")
      .setHelpText('Complete only if the camper is currently on medication.');

    // ── ALLERGIES, ACTIVITIES & TRAVEL ───────────────────────────────────────
    var lifestylePage = form.addPageBreakItem()
      .setTitle(label + ': Allergies, Activities & Travel');

    // Medical details section always ends at lifestyle page.
    medDetailsPage.setGoToPage(lifestylePage);

    // Medical condition branching choices (both target pages now exist).
    medQ.setChoices([
      medQ.createChoice('Yes', medDetailsPage),
      medQ.createChoice('No',  lifestylePage)
    ]);

    form.addMultipleChoiceItem()
      .setTitle("Is " + label + " allergic to anything?")
      .setChoiceValues(['Yes', 'No'])
      .setRequired(true);

    form.addParagraphTextItem()
      .setTitle("If yes – please state the type of allergy / allergies " + label + " has")
      .setHelpText('Complete only if the camper has allergies.');

    form.addMultipleChoiceItem()
      .setTitle("Will " + label + " be able to participate in all outdoor activities?")
      .setChoiceValues(['Yes', 'No'])
      .setRequired(true);

    form.addParagraphTextItem()
      .setTitle("If no – please explain why " + label + " cannot participate in all outdoor activities")
      .setHelpText('Complete only if the camper cannot participate in all activities.');

    form.addMultipleChoiceItem()
      .setTitle("Does " + label + " have any dietary requirements?")
      .setChoiceValues(['Yes', 'No'])
      .setRequired(true);

    form.addParagraphTextItem()
      .setTitle("If yes – please state " + label + "'s dietary requirements")
      .setHelpText('Complete only if the camper has dietary requirements.');

    form.addMultipleChoiceItem()
      .setTitle("How will " + label + " be travelling to the camp-site?")
      .setChoiceValues([
        'Organised Transport',
        'Own Transport',
        'Virtual Attendance (Online)'
      ])
      .setRequired(true);

    form.addParagraphTextItem()
      .setTitle("What are " + label + "'s expectations or goals for this camp?")
      .setRequired(true);

    // For campers 1-5: add a gateway question to route to the next camper or payment.
    if (!isLast) {
      var moreCampersQ = form.addMultipleChoiceItem()
        .setTitle('Are you registering another camper?')
        .setHelpText(
          'Select "Yes" to fill in the next camper\'s details, ' +
          'or "No" to proceed to the payment section.'
        )
        .setRequired(true);
      // Choices are set after the loop (payment page must exist first).
      moreCampersItems.push(moreCampersQ);
    }
  } // end camper loop

  // ─────────────────────────────────────────────────────────────────────────────
  // PAYMENT & CAMP FEES
  // ─────────────────────────────────────────────────────────────────────────────
  var paymentPage = form.addPageBreakItem()
    .setTitle('Payment & Camp Fees');

  form.addSectionHeaderItem()
    .setTitle('Camp Fee Information')
    .setHelpText(
      'The camp fee details will be communicated to you directly by the organising team. ' +
      'Please indicate your payment situation below.'
    );

  var paymentQ = form.addMultipleChoiceItem()
    .setTitle('Are you able to pay the full amount of the camp fee as stated?')
    .setRequired(true);
  // Choices set below once assistance/donation pages exist.

  // Payment assistance branch
  var assistancePage = form.addPageBreakItem()
    .setTitle('Payment Assistance');

  form.addTextItem()
    .setTitle('Please state how much you are able to pay towards the camp fee')
    .setHelpText('Enter the amount in FJD (Fijian Dollars).')
    .setRequired(true);

  // Donation branch
  var donationPage = form.addPageBreakItem()
    .setTitle('Donation');

  form.addTextItem()
    .setTitle('How much are you willing to donate to assist in the running of the camp?')
    .setHelpText('Enter the amount in FJD (Fijian Dollars).')
    .setRequired(true);

  // Payment branching choices
  paymentQ.setChoices([
    paymentQ.createChoice(
      'Yes, I am able to pay the full amount.',
      FormApp.PageNavigationType.SUBMIT
    ),
    paymentQ.createChoice(
      'No. I will need assistance for payment.',
      assistancePage
    ),
    paymentQ.createChoice(
      'Yes I am able to pay the full amount, and I am willing to donate some more to assist in the running of the camp.',
      donationPage
    )
  ]);

  // ─────────────────────────────────────────────────────────────────────────────
  // SET UP "MORE CAMPERS?" BRANCHING  (done here because paymentPage now exists)
  // ─────────────────────────────────────────────────────────────────────────────
  for (var i = 0; i < moreCampersItems.length; i++) {
    var q        = moreCampersItems[i];
    var nextPage = camperBasicPages[i + 1]; // next camper's basic info section
    q.setChoices([
      q.createChoice('Yes, I have another camper to register', nextPage),
      q.createChoice('No, that is all the campers',            paymentPage)
    ]);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // DONE – log the URLs
  // ─────────────────────────────────────────────────────────────────────────────
  Logger.log('✅ Form created successfully!');
  Logger.log('📋 Fill-in URL  : ' + form.getPublishedUrl());
  Logger.log('✏️  Edit URL     : ' + form.getEditUrl());

  return form;
}
