/**
 * 2026 ABC Youth Camp – Update Existing Google Form
 * ==================================================
 * This script UPDATES the already-created form in-place so the same
 * fill-in URL continues to work.  It clears all existing content and
 * rebuilds the form from scratch with every change listed below.
 *
 * FORM URLs
 *   Fill-in : https://docs.google.com/forms/d/e/1FAIpQLScvUL-b9WMIVA5BLyk-S0BPqFsI1glQA06Zckx3Q7kw8VY_uw/viewform
 *   Edit    : https://docs.google.com/forms/d/1zQ53mV8LAcEd_jJr5bJ05aLWCa32pGRpZrvhylhywTY/edit
 *
 * HOW TO RUN  (three steps – each well under the 6-min execution limit)
 *   1. Open https://script.google.com → New project.
 *   2. Paste this entire file into Code.gs.
 *   3. Run clearForm()                 – deletes all existing items (re-run if
 *                                        interrupted until the form is empty).
 *   4. Run updateYouthCampForm()       – builds welcome, parents, campers 1-5.
 *   5. Run updateYouthCampForm_Step2() – builds campers 6-10, payment, navigation.
 *   6. Grant permissions when prompted on first run.
 *   7. The SAME form URL now reflects all changes.
 *
 *   FIRST BUILD ONLY: skip step 3 (form is already empty).
 *
 * MANUAL STEPS AFTER RUNNING  (cannot be done via Apps Script)
 *   • Header image  : Form editor → palette icon (Customize theme)
 *                     → Choose image → upload the groups diagram (image.jpeg).
 *   • Theme colour  : Same palette menu → pick a warm earth tone
 *                     (e.g. the deep orange/brown from the logo).
 *   • Progress bar  : Settings → Presentation → Show progress bar.
 *
 * CHANGES APPLIED vs. PREVIOUS VERSION
 *   1.  Updates the existing form (no new URL needed).
 *   2.  Welcome / overview section added before organiser questions.
 *   3.  Registration deadline 19 Apr 2026 | Payment deadline 30 Apr 2026.
 *   4.  "Organiser Information" → "Parents and Guardians Information".
 *   5.  Phone number field added for parent/guardian.
 *   6.  Camper count extended to 10 (was 6).
 *   7.  Coordinator question → "Is Camper N a coordinator?"
 *   8.  Email + phone contact fields added per camper.
 *   9.  Education "Other" → dedicated text-entry section → health section.
 *   10. "Are you registering another camper?" help text uses "next section".
 *   11. Payment question reworded: "Please select one of the options below…"
 *   12. Payment options reworded – "full amount" wording removed.
 *   13. Payment Assistance amount question removed.
 *   14. Donation section only branches from the donate option (fixed).
 *   15. Confirmation message includes Salote & Laisane contact details.
 */

// ── Configuration ──────────────────────────────────────────────────────────
var FORM_ID       = '1zQ53mV8LAcEd_jJr5bJ05aLWCa32pGRpZrvhylhywTY';
var TOTAL_CAMPERS = 10;
// Fill this in AFTER deploying the script as a Web App (see instructions below).
var WEBAPP_URL    = '';

// ── STEP 0 – Clear the form ───────────────────────────────────────────────────
// Run this FIRST (before updateYouthCampForm).
// Safe to re-run if interrupted – it picks up where it left off.
function clearForm() {
  var form      = FormApp.openById(FORM_ID);
  var startTime = new Date().getTime();
  var MAX_MS    = 300000; // stop at 5 min to avoid the 6-min hard cut-off

  var items = form.getItems();
  if (items.length === 0) {
    Logger.log('Form is already empty. Proceed to updateYouthCampForm().');
    return;
  }

  for (var di = 0; di < items.length; di++) {
    if (new Date().getTime() - startTime > MAX_MS) {
      Logger.log('5-min safety stop. ' + (items.length - di) + ' item(s) remain. Run clearForm() again.');
      return;
    }
    form.deleteItem(items[di]);
  }

  Logger.log('Form cleared (' + items.length + ' items deleted). Now run updateYouthCampForm().');
}

// ── STEP 1 of 2 – Build welcome, parents and campers 1-5 ─────────────────────
// Run AFTER clearForm() completes with an empty form.
// Then immediately run updateYouthCampForm_Step2().
function updateYouthCampForm() {

  var form = FormApp.openById(FORM_ID);

  // Safety check – abort if form still has items so nothing gets added twice.
  if (form.getItems().length > 0) {
    Logger.log('ERROR: Form is not empty. Run clearForm() first, then try again.');
    return;
  }

  // ── 2. Form-level metadata ───────────────────────────────────────────────
  form.setTitle('\uD83C\uDFD5\uFE0F  2026 ABC Youth Camp  \uD83C\uDFD5\uFE0F');
  form.setDescription('');
  form.setConfirmationMessage(
    'Thank you for registering for the 2026 ABC Youth Camp!\n\n' +
    'Your registration has been successfully submitted.\n\n' +
    'If you have any questions please reach out to:\n' +
    '  Finance queries : Salote  – finance@advancedbreakthroughcentre.org\n' +
    '  Camp logistics  : Laisane – l.tubuna@gmail.com'
  );
  form.setIsQuiz(false);
  form.setAllowResponseEdits(true);
  form.setShowLinkToRespondAgain(false);

  // ── 3. INTRODUCTION + INSTRUCTIONS (first page – no page break before it) ─
  form.addSectionHeaderItem()
    .setTitle('INTRODUCTION')
    .setHelpText(
      'The 2026 ABC Youth Camp will take place from May 4th to May 8th, 2026, ' +
      'at Coral Coast Christian Camp in Deuba, Fiji.\n\n' +
      'The camp will focus on the following group of youths:\n' +
      '  \u2022 Project Heritage (Year 8+)\n' +
      '  \u2022 Evolution\n' +
      '  \u2022 Hebron GPS and X-Elle GPS (secondary school students only)\n\n' +
      'Tertiary students and young professionals may also attend the camp, ' +
      'provided they are free on those dates.\n\n' +
      '\uD83D\uDCC5 Registration Deadline : 19 April 2026\n' +
      '\uD83D\uDCB3 Payment Deadline      : 30 April 2026\n\n' +
      'For enquiries:\n' +
      '  Finance   \u2013 Salote  : finance@advancedbreakthroughcentre.org\n' +
      '  Logistics \u2013 Laisane : l.tubuna@gmail.com'
    );

  form.addSectionHeaderItem()
    .setTitle('INSTRUCTIONS ON HOW TO USE THE FORM')
    .setHelpText(
      'The following sections will need to be filled by parents or guardians.\n\n' +
      'Section 2: Parents and Guardians Information\n\n' +
      'Section 3 onwards: Camper\'s personal details\n\n' +
      'Do contact us on our email (finance@advancedbreakthroughcentre.org) if you ' +
      'need further instructions regarding filling this form.\n\n' +
      '\u27A1\uFE0F Click NEXT to begin the registration.'
    );

  // ── 4. PARENTS AND GUARDIANS INFORMATION (separate page) ────────────────
  form.addPageBreakItem()
    .setTitle('Parents and Guardians Information')
    .setHelpText('Please provide your contact details as the parent or guardian completing this registration.');

  form.addTextItem()
    .setTitle('Full Name')
    .setRequired(true);

  form.addTextItem()
    .setTitle('Email Address')
    .setValidation(FormApp.createTextValidation()
      .setHelpText('Please enter a valid email address (e.g. name@example.com).')
      .requireTextMatchesPattern('^[a-zA-Z0-9._%+\\-]+@[a-zA-Z0-9.\\-]+\\.[a-zA-Z]{2,}$')
      .build())
    .setRequired(true);

  form.addTextItem()
    .setTitle('Phone Number')
    .setHelpText('Digits only, at least 7 numbers. Include country code if overseas e.g. +679 777 1234')
    .setValidation(FormApp.createTextValidation()
      .setHelpText('Please enter a valid phone number with at least 7 digits (no letters).')
      .requireTextMatchesPattern('^[+]?[\\d][\\d\\s\\-]{5,}[\\d]$')
      .build())
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('Kingdom Community')
    .setChoiceValues([
      'Advanced Breakthrough Centre',
      'Mataka Vou Kingdom Community'
    ])
    .showOtherOption(true)
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('How many campers will you be registering?')
    .setChoiceValues([
      '1 Camper',  '2 Campers', '3 Campers', '4 Campers',  '5 Campers',
      '6 Campers', '7 Campers', '8 Campers', '9 Campers', '10 Campers'
    ])
    .setRequired(true);

  // ── 5. CAMPER SECTIONS 1–5 ──────────────────────────────────────────────
  var camperBasicPages = [];
  var moreCampersItems = [];

  for (var n = 1; n <= 5; n++) {
    var label  = 'Camper ' + n;
    var isLast = (n === TOTAL_CAMPERS);

    // ── Basic Information ──────────────────────────────────────────────────
    var basicPage = form.addPageBreakItem()
      .setTitle(label + ' – Basic Information');
    if (n > 1) {
      basicPage.setHelpText(
        'Complete this section only if you are registering ' + n + ' or more campers.'
      );
    }
    camperBasicPages.push(basicPage);

    form.addTextItem()
      .setTitle(label + "'s Full Name")
      .setRequired(true);

    form.addTextItem()
      .setTitle(label + "'s Email Address (Optional)")
      .setHelpText("If the camper has an email address, enter it here. If not, leave this blank.")
      .setValidation(FormApp.createTextValidation()
        .setHelpText('Please enter a valid email address (e.g. name@example.com), or leave blank.')
        .requireTextMatchesPattern('^[a-zA-Z0-9._%+\\-]+@[a-zA-Z0-9.\\-]+\\.[a-zA-Z]{2,}$')
        .build());

    form.addTextItem()
      .setTitle(label + "'s Phone Contact (Optional)")
      .setHelpText("If the camper has a phone number, enter it here (digits only, at least 7 numbers). If not, leave this blank.")
      .setValidation(FormApp.createTextValidation()
        .setHelpText('Please enter a valid phone number with at least 7 digits (no letters), or leave blank.')
        .requireTextMatchesPattern('^[+]?[\\d][\\d\\s\\-]{5,}[\\d]$')
        .build());

    form.addDateItem()
      .setTitle(label + "'s Date of Birth")
      .setRequired(true);

    form.addMultipleChoiceItem()
      .setTitle('Location of ' + label)
      .setChoiceValues(['Suva', 'Lautoka', 'Nadi', 'Levuka', 'Vanua Levu', 'Overseas'])
      .showOtherOption(true)
      .setRequired(true);

    form.addMultipleChoiceItem()
      .setTitle("What is " + label + "'s People's Group?")
      .setChoiceValues([
        'Project Heritage', 'Evolution', 'X-Elle GPS', 'Hebron GPS',
        'X-Elle', 'Charis', 'Hebron', 'Not yet in a PG'
      ])
      .setRequired(true);

    form.addMultipleChoiceItem()
      .setTitle('Is ' + label + ', a Youth Coordinator?')
      .setChoiceValues(['Yes', 'No'])
      .setRequired(true);

    // ── Education & Employment Status (branching question) ─────────────────
    var eduStatusPage = form.addPageBreakItem()
      .setTitle(label + ' – Education & Employment Status');

    // NOTE: Apps Script does not allow showOtherOption(true) on a question
    // that also has page-navigation choices — it throws "Invalid data updating
    // form" regardless of call order.  After running this script, open each
    // camper's education question in the form editor and click
    // "Add option  or  Add 'Other'" to add the inline text field manually.
    // It takes about 10 seconds per camper and only needs to be done once.
    var eduQ = form.addMultipleChoiceItem()
      .setTitle("What is " + label + "'s current education or employment status?")
      .setRequired(true);

    // Choices set further below once all target page references exist.

    // ── Primary / Secondary School Details ────────────────────────────────
    var priSecPage = form.addPageBreakItem()
      .setTitle(label + ' – School Details (Primary / Secondary)');

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

    // ── Tertiary Education Details ─────────────────────────────────────────
    var tertiaryPage = form.addPageBreakItem()
      .setTitle(label + ' – Tertiary Education Details');

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
      .setHelpText('Leave blank if not currently employed alongside studies.');

    // ── Employment / Professional Details ──────────────────────────────────
    var professionalPage = form.addPageBreakItem()
      .setTitle(label + ' – Employment Details');

    form.addTextItem()
      .setTitle("What is " + label + "'s occupation?")
      .setRequired(true);

    form.addMultipleChoiceItem()
      .setTitle("What is " + label + "'s employment status?")
      .setChoiceValues(['Full Time', 'Part Time'])
      .setRequired(true);

    // ── Health & Medical (branching question) ──────────────────────────────
    var healthPage = form.addPageBreakItem()
      .setTitle(label + ' – Health & Medical');

    // Education detail sections end at healthPage.
    priSecPage.setGoToPage(healthPage);
    tertiaryPage.setGoToPage(healthPage);
    professionalPage.setGoToPage(healthPage);
    // NOTE: do NOT call eduStatusPage.setGoToPage() — that mistakenly
    // redirects the Basic Info section (the page before eduStatusPage)
    // straight to healthPage, bypassing the education questions entirely.

    // "Other" is an explicit choice → healthPage so the camper's typed
    // status (in the text field below the radio buttons) is captured first.
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

    // ── Medical Condition Details ──────────────────────────────────────────
    var medDetailsPage = form.addPageBreakItem()
      .setTitle(label + ' – Medical Condition Details');

    form.addParagraphTextItem()
      .setTitle("Please describe " + label + "'s current medical condition(s)")
      .setRequired(true);

    form.addMultipleChoiceItem()
      .setTitle("Will this condition affect " + label + "'s ability to participate in physical activities?")
      .setChoiceValues(['Yes', 'No'])
      .setRequired(true);

    form.addParagraphTextItem()
      .setTitle("If yes above – please explain how the condition affects participation")
      .setHelpText('Complete only if the condition affects physical activities.');

    form.addMultipleChoiceItem()
      .setTitle("Is " + label + " currently taking any medication?")
      .setChoiceValues(['Yes', 'No'])
      .setRequired(true);

    form.addParagraphTextItem()
      .setTitle("If yes – please state the medication(s) " + label + " is taking")
      .setHelpText('Complete only if the camper is currently on medication.');

    // ── Allergies, Activities & Travel ────────────────────────────────────
    var lifestylePage = form.addPageBreakItem()
      .setTitle(label + ' – Allergies, Activities & Travel');

    // Medical details always ends at lifestyle page.
    medDetailsPage.setGoToPage(lifestylePage);

    // Medical condition branching choices.
    medQ.setChoices([
      medQ.createChoice('Yes', medDetailsPage),
      medQ.createChoice('No',  lifestylePage)
    ]);

    form.addMultipleChoiceItem()
      .setTitle("Is " + label + " allergic to anything?")
      .setChoiceValues(['Yes', 'No'])
      .setRequired(true);

    form.addParagraphTextItem()
      .setTitle("If yes – please state the type of allergy / allergies")
      .setHelpText('Complete only if the camper has allergies.');

    form.addMultipleChoiceItem()
      .setTitle("Will " + label + " be able to participate in all outdoor activities?")
      .setChoiceValues(['Yes', 'No'])
      .setRequired(true);

    form.addParagraphTextItem()
      .setTitle("If no – please explain why")
      .setHelpText('Complete only if the camper cannot participate in all activities.');

    form.addMultipleChoiceItem()
      .setTitle("Does " + label + " have any dietary requirements?")
      .setChoiceValues(['Yes', 'No'])
      .setRequired(true);

    form.addParagraphTextItem()
      .setTitle("If yes – please state the dietary requirements")
      .setHelpText('Complete only if the camper has dietary requirements.');

    form.addMultipleChoiceItem()
      .setTitle("How will " + label + " be travelling to the camp-site?")
      .setChoiceValues(['Organised Transport', 'Own Transport', 'Virtual Attendance (Online)'])
      .setRequired(true);

    form.addParagraphTextItem()
      .setTitle("What are " + label + "'s expectations or goals for this camp?")
      .setRequired(true);

    // Gateway question for campers 1–9.
    if (!isLast) {
      var moreCampersQ = form.addMultipleChoiceItem()
        .setTitle('Are you registering another camper?')
        .setHelpText(
          "Select 'Yes' to add another camper, or 'No' to proceed to the next section."
        )
        .setRequired(true);
      // Choices set after the loop (paymentPage must exist first).
      moreCampersItems.push(moreCampersQ);
    }

  } // end camper 1-5 loop

  // ── 6. Save page IDs so Step 2 can set up navigation ────────────────────
  PropertiesService.getScriptProperties().setProperties({
    'camperBasicPageIds': JSON.stringify(camperBasicPages.map(function (p) { return p.getId(); })),
    'moreCampersItemIds': JSON.stringify(moreCampersItems.map(function (q) { return q.getId(); }))
  });

  Logger.log('Step 1 complete – campers 1-5 built.');
  Logger.log('Now run updateYouthCampForm_Step2() to add campers 6-10, payment, and navigation.');
}

// ── Main function – STEP 2 of 2 ──────────────────────────────────────────────
// Run this immediately after updateYouthCampForm() finishes.
function updateYouthCampForm_Step2() {

  var form  = FormApp.openById(FORM_ID);
  var props = PropertiesService.getScriptProperties();

  // ── Restore state from Step 1 ────────────────────────────────────────────
  var basicPageIds   = JSON.parse(props.getProperty('camperBasicPageIds') || '[]');
  var moreCampersIds = JSON.parse(props.getProperty('moreCampersItemIds') || '[]');

  // Build a lookup map so we can find items by their numeric ID.
  var itemById = {};
  form.getItems().forEach(function (it) { itemById[it.getId()] = it; });

  var camperBasicPages = basicPageIds.map(function (id) { return itemById[id].asPageBreakItem(); });
  var moreCampersItems = moreCampersIds.map(function (id) { return itemById[id].asMultipleChoiceItem(); });

  // ── CAMPER SECTIONS 6–10 ─────────────────────────────────────────────────
  for (var n = 6; n <= TOTAL_CAMPERS; n++) {
    var label  = 'Camper ' + n;
    var isLast = (n === TOTAL_CAMPERS);

    // ── Basic Information ────────────────────────────────────────────────
    var basicPage = form.addPageBreakItem()
      .setTitle(label + ' – Basic Information')
      .setHelpText('Complete this section only if you are registering ' + n + ' or more campers.');
    camperBasicPages.push(basicPage);

    form.addTextItem()
      .setTitle(label + "'s Full Name")
      .setRequired(true);

    form.addTextItem()
      .setTitle(label + "'s Email Address (Optional)")
      .setHelpText("If the camper has an email address, enter it here. If not, leave this blank.")
      .setValidation(FormApp.createTextValidation()
        .setHelpText('Please enter a valid email address (e.g. name@example.com), or leave blank.')
        .requireTextMatchesPattern('^[a-zA-Z0-9._%+\\-]+@[a-zA-Z0-9.\\-]+\\.[a-zA-Z]{2,}$')
        .build());

    form.addTextItem()
      .setTitle(label + "'s Phone Contact (Optional)")
      .setHelpText("If the camper has a phone number, enter it here (digits only, at least 7 numbers). If not, leave this blank.")
      .setValidation(FormApp.createTextValidation()
        .setHelpText('Please enter a valid phone number with at least 7 digits (no letters), or leave blank.')
        .requireTextMatchesPattern('^[+]?[\\d][\\d\\s\\-]{5,}[\\d]$')
        .build());

    form.addDateItem()
      .setTitle(label + "'s Date of Birth")
      .setRequired(true);

    form.addMultipleChoiceItem()
      .setTitle('Location of ' + label)
      .setChoiceValues(['Suva', 'Lautoka', 'Nadi', 'Levuka', 'Vanua Levu', 'Overseas'])
      .showOtherOption(true)
      .setRequired(true);

    form.addMultipleChoiceItem()
      .setTitle("What is " + label + "'s People's Group?")
      .setChoiceValues([
        'Project Heritage', 'Evolution', 'X-Elle GPS', 'Hebron GPS',
        'X-Elle', 'Charis', 'Hebron', 'Not yet in a PG'
      ])
      .setRequired(true);

    form.addMultipleChoiceItem()
      .setTitle('Is ' + label + ', a Youth Coordinator?')
      .setChoiceValues(['Yes', 'No'])
      .setRequired(true);

    // ── Education & Employment Status ──────────────────────────────────
    form.addPageBreakItem()
      .setTitle(label + ' – Education & Employment Status');

    var eduQ = form.addMultipleChoiceItem()
      .setTitle("What is " + label + "'s current education or employment status?")
      .setRequired(true);

    var priSecPage = form.addPageBreakItem()
      .setTitle(label + ' – School Details (Primary / Secondary)');

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

    var tertiaryPage = form.addPageBreakItem()
      .setTitle(label + ' – Tertiary Education Details');

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
      .setHelpText('Leave blank if not currently employed alongside studies.');

    var professionalPage = form.addPageBreakItem()
      .setTitle(label + ' – Employment Details');

    form.addTextItem()
      .setTitle("What is " + label + "'s occupation?")
      .setRequired(true);

    form.addMultipleChoiceItem()
      .setTitle("What is " + label + "'s employment status?")
      .setChoiceValues(['Full Time', 'Part Time'])
      .setRequired(true);

    // ── Health & Medical ───────────────────────────────────────────────
    var healthPage = form.addPageBreakItem()
      .setTitle(label + ' – Health & Medical');

    priSecPage.setGoToPage(healthPage);
    tertiaryPage.setGoToPage(healthPage);
    professionalPage.setGoToPage(healthPage);

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

    var medDetailsPage = form.addPageBreakItem()
      .setTitle(label + ' – Medical Condition Details');

    form.addParagraphTextItem()
      .setTitle("Please describe " + label + "'s current medical condition(s)")
      .setRequired(true);

    form.addMultipleChoiceItem()
      .setTitle("Will this condition affect " + label + "'s ability to participate in physical activities?")
      .setChoiceValues(['Yes', 'No'])
      .setRequired(true);

    form.addParagraphTextItem()
      .setTitle("If yes above – please explain how the condition affects participation")
      .setHelpText('Complete only if the condition affects physical activities.');

    form.addMultipleChoiceItem()
      .setTitle("Is " + label + " currently taking any medication?")
      .setChoiceValues(['Yes', 'No'])
      .setRequired(true);

    form.addParagraphTextItem()
      .setTitle("If yes – please state the medication(s) " + label + " is taking")
      .setHelpText('Complete only if the camper is currently on medication.');

    var lifestylePage = form.addPageBreakItem()
      .setTitle(label + ' – Allergies, Activities & Travel');

    medDetailsPage.setGoToPage(lifestylePage);
    medQ.setChoices([
      medQ.createChoice('Yes', medDetailsPage),
      medQ.createChoice('No',  lifestylePage)
    ]);

    form.addMultipleChoiceItem()
      .setTitle("Is " + label + " allergic to anything?")
      .setChoiceValues(['Yes', 'No'])
      .setRequired(true);

    form.addParagraphTextItem()
      .setTitle("If yes – please state the type of allergy / allergies")
      .setHelpText('Complete only if the camper has allergies.');

    form.addMultipleChoiceItem()
      .setTitle("Will " + label + " be able to participate in all outdoor activities?")
      .setChoiceValues(['Yes', 'No'])
      .setRequired(true);

    form.addParagraphTextItem()
      .setTitle("If no – please explain why")
      .setHelpText('Complete only if the camper cannot participate in all activities.');

    form.addMultipleChoiceItem()
      .setTitle("Does " + label + " have any dietary requirements?")
      .setChoiceValues(['Yes', 'No'])
      .setRequired(true);

    form.addParagraphTextItem()
      .setTitle("If yes – please state the dietary requirements")
      .setHelpText('Complete only if the camper has dietary requirements.');

    form.addMultipleChoiceItem()
      .setTitle("How will " + label + " be travelling to the camp-site?")
      .setChoiceValues(['Organised Transport', 'Own Transport', 'Virtual Attendance (Online)'])
      .setRequired(true);

    form.addParagraphTextItem()
      .setTitle("What are " + label + "'s expectations or goals for this camp?")
      .setRequired(true);

    if (!isLast) {
      var moreCampersQ = form.addMultipleChoiceItem()
        .setTitle('Are you registering another camper?')
        .setHelpText("Select 'Yes' to add another camper, or 'No' to proceed to the next section.")
        .setRequired(true);
      moreCampersItems.push(moreCampersQ);
    }

  } // end camper 6-10 loop

  // ── PAYMENT & CAMP FEES ──────────────────────────────────────────────────
  var paymentPage = form.addPageBreakItem()
    .setTitle('Payment & Camp Fees');

  form.addSectionHeaderItem()
    .setTitle('Registration Fees')
    .setHelpText(
      'The registration fees for the 2026 ABC Youth Camp are as follows:\n\n' +
      '  \u2022 FJD $70.00 per camper\n' +
      '  \u2022 FJD $100.00 per Youth Coordinator\n\n' +
      'Your total will be based on the number of campers you have registered ' +
      'and whether the camper is a Youth Coordinator.\n\n' +
      'Deadline to pay camp fees : 30 April 2026'
    );

  form.addSectionHeaderItem()
    .setTitle('Payment Instructions')
    .setHelpText(
      'You may pay the camp fees directly to ABC\'s BSP, Westpac, or MPAISA accounts.\n\n' +
      'Bank Account Details:\n\n' +
      '  BSP     – A/c# 3178242\n' +
      '  A/c Name: Advanced Breakthrough Centre\n\n' +
      '  Westpac – A/c# 9803986679\n' +
      '  A/c Name: Advanced Breakthrough Centre\n\n' +
      '  MPAISA  – Merchant Name: Advanced Breakthrough Centre\n\n' +
      'For your narration, please put down the word CAMP and the family surname.\n' +
      'Example: CAMPTakalaivuna (for the Takalaivuna family)\n\n' +
      'Afterwards, please send us the transfer receipt from the bank or MPAISA to:\n' +
      'finance@advancedbreakthroughcentre.org'
    );

  // ── Set up "More Campers?" navigation for ALL 9 gateway questions ────────
  for (var i = 0; i < moreCampersItems.length; i++) {
    var q        = moreCampersItems[i];
    var nextPage = camperBasicPages[i + 1];
    q.setChoices([
      q.createChoice('Yes, I have another camper to register', nextPage),
      q.createChoice('No, that is all the campers',            paymentPage)
    ]);
  }

  // Clean up stored properties
  props.deleteProperty('camperBasicPageIds');
  props.deleteProperty('moreCampersItemIds');

  Logger.log('Step 2 complete – form fully updated!');
  Logger.log('Fill-in URL : ' + form.getPublishedUrl());
  Logger.log('Edit URL    : ' + form.getEditUrl());
}

// =============================================================================
// AUTOMATED CONFIRMATION EMAIL
// =============================================================================
// After running updateYouthCampForm(), run installFormTrigger() ONCE to
// register the onFormSubmit trigger.  Every time a parent submits the form,
// they will automatically receive a friendly HTML summary email.
// =============================================================================

/**
 * Run this ONCE after updateYouthCampForm() to register the submit trigger.
 */
function installFormTrigger() {
  var form = FormApp.openById(FORM_ID);

  // Remove any existing onFormSubmit triggers for this script to avoid duplicates.
  ScriptApp.getProjectTriggers().forEach(function (t) {
    if (t.getHandlerFunction() === 'onFormSubmit') ScriptApp.deleteTrigger(t);
  });

  ScriptApp.newTrigger('onFormSubmit')
    .forForm(form)
    .onFormSubmit()
    .create();

  Logger.log('Trigger installed. Confirmation emails will now be sent on every submission.');
}

/**
 * Called automatically each time the form is submitted.
 * Sends a friendly HTML email with a camper summary table.
 */
function onFormSubmit(e) {
  try {
    var response  = e.response;
    var responses = {};
    response.getItemResponses().forEach(function (ir) {
      responses[ir.getItem().getTitle()] = ir.getResponse();
    });

    var guardianName  = responses['Full Name']         || 'Parent/Guardian';
    var guardianEmail = responses['Email Address'];
    if (!guardianEmail) return; // nothing to send to

    // Collect per-camper data — loop all slots; skip any that were not filled in.
    // Do NOT cap by the dropdown answer: a registrant may select "2 campers" but
    // then continue adding more via "Yes, register another camper" navigation.
    var campers = [];
    for (var n = 1; n <= TOTAL_CAMPERS; n++) {
      var lbl = 'Camper ' + n;
      var name = responses[lbl + "'s Full Name"];
      if (!name) continue; // skip if section was left blank
      var isCoordinator = (responses['Is ' + lbl + ', a Youth Coordinator?'] || '').toLowerCase() === 'yes';
      var transport = responses["How will " + lbl + " be travelling to the camp-site?"] || '';
      campers.push({
        number:      n,
        name:        name,
        coordinator: isCoordinator,
        fee:         isCoordinator ? 100 : 70,
        dob:         responses[lbl + "'s Date of Birth"]                                          || '',
        location:    responses['Location of ' + lbl]                                              || '',
        pg:          responses["What is " + lbl + "'s People's Group?"]                          || '',
        edu:         responses["What is " + lbl + "'s current education or employment status?"] || '',
        medical:     responses["Does " + lbl + " have any current medical condition?"]           || '',
        allergies:   responses["Is " + lbl + " allergic to anything?"]                           || '',
        dietary:     responses["Does " + lbl + " have any dietary requirements?"]               || '',
        transport:   transport,
        goals:       responses["What are " + lbl + "'s expectations or goals for this camp?"]   || ''
      });
    }

    var totalFee  = campers.reduce(function (sum, c) { return sum + c.fee; }, 0);
    var subject   = '2026 ABC Youth Camp \u2013 Registration Confirmed';
    var htmlBody  = buildConfirmationHtml_(guardianName, guardianEmail, campers, totalFee);
    var textBody  = buildConfirmationText_(guardianName, guardianEmail, campers, totalFee);

    MailApp.sendEmail({
      to:       guardianEmail,
      subject:  subject,
      body:     textBody,
      htmlBody: htmlBody
    });

  } catch (err) {
    Logger.log('onFormSubmit error: ' + err.message);
  }
}

// ── HTML email builder ────────────────────────────────────────────────────────
function buildConfirmationHtml_(guardianName, guardianEmail, campers, totalFee) {
  // Fee summary rows – one per camper
  var feeRows = campers.map(function (c) {
    var type = c.coordinator ? 'Youth Coordinator' : 'Camper';
    var bg = c.number % 2 === 0 ? '#f9f5ee' : '#ffffff';
    return '<tr style="background:' + bg + '">' +
      '<td style="padding:8px 10px;border:1px solid #ddd;color:#333;">' + c.number + '</td>' +
      '<td style="padding:8px 10px;border:1px solid #ddd;color:#333;">' + c.name + '</td>' +
      '<td style="padding:8px 10px;border:1px solid #ddd;color:#333;">' + type + '</td>' +
      '<td style="padding:8px 10px;border:1px solid #ddd;color:#333;text-align:right;">FJD $' + c.fee + '.00</td>' +
      '</tr>';
  }).join('');

  // Camper details rows
  var rows = campers.map(function (c) {
    return '<tr style="background:' + (c.number % 2 === 0 ? '#f9f5ee' : '#ffffff') + '">' +
      td('#', c.number) +
      td('Full Name', c.name) +
      td('Date of Birth', c.dob) +
      td('Location', c.location) +
      td("People's Group", c.pg) +
      td('Education / Employment', c.edu) +
      td('Medical Condition?', c.medical) +
      td('Allergies?', c.allergies) +
      td('Dietary Requirements?', c.dietary) +
      td('Transport', c.transport) +
    '</tr>';
  }).join('');

  return '<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body ' +
    'style="margin:0;padding:0;background:#f4f0e8;font-family:Georgia,serif;">' +

    // Header banner
    '<div style="background:linear-gradient(135deg,#8B4513,#D2691E,#DAA520);' +
    'padding:36px 32px;text-align:center;">' +
    '<h1 style="color:#fff;margin:0;font-size:26px;letter-spacing:1px;">' +
    '\uD83C\uDFD5\uFE0F 2026 ABC Youth Camp</h1>' +
    '<p style="color:#ffe4b5;margin:8px 0 0;font-size:15px;">Registration Confirmation</p>' +
    '</div>' +

    // Body
    '<div style="max-width:700px;margin:0 auto;padding:32px 24px;">' +

    '<p style="font-size:16px;color:#333;">Dear <strong>' + guardianName + '</strong>,</p>' +

    '<p style="color:#333;line-height:1.7;font-size:14px;">' +
    'Thank you for registering for the <strong>2026 ABC Youth Camp</strong>. ' +
    'Below is a summary of the camper(s) you have submitted. ' +
    'Please check the details and contact us if any corrections are needed.</p>' +

    // Fee summary table
    '<h3 style="color:#333;border-bottom:2px solid #ccc;padding-bottom:6px;' +
    'margin:20px 0 12px;">Registration Fees</h3>' +
    '<div style="overflow-x:auto;margin-bottom:8px;">' +
    '<table style="width:100%;max-width:520px;border-collapse:collapse;font-size:14px;">' +
    '<thead><tr style="background:#555;color:#fff;">' +
    '<th style="padding:10px;text-align:left;">#</th>' +
    '<th style="padding:10px;text-align:left;">Camper Name</th>' +
    '<th style="padding:10px;text-align:left;">Type</th>' +
    '<th style="padding:10px;text-align:right;">Fee (FJD)</th>' +
    '</tr></thead>' +
    '<tbody>' + feeRows + '</tbody>' +
    '<tfoot><tr style="background:#eee;">' +
    '<td colspan="3" style="padding:10px;font-weight:bold;border-top:2px solid #ccc;color:#333;">' +
    'Total (' + campers.length + ' camper' + (campers.length === 1 ? '' : 's') + ')</td>' +
    '<td style="padding:10px;font-weight:bold;border-top:2px solid #ccc;color:#333;text-align:right;">' +
    'FJD $' + totalFee + '.00</td>' +
    '</tr></tfoot></table></div>' +
    '<p style="font-size:12px;color:#888;margin-bottom:20px;">' +
    'Camper: FJD $70.00 &nbsp;|&nbsp; Youth Coordinator: FJD $100.00</p>' +

    // Payment confirmation buttons (only shown if WEBAPP_URL is configured)
    (WEBAPP_URL ? (function () {
      var enc       = encodeURIComponent;
      var base      = WEBAPP_URL + '?name=' + enc(guardianName) + '&email=' + enc(guardianEmail);
      var payUrl    = base + '&choice=pay';
      var assistUrl = base + '&choice=assist';
      var donateUrl = base + '&choice=donate';
      var btn = function (href, bg, label) {
        return '<a href="' + href + '" style="display:inline-block;margin:6px 8px 6px 0;' +
          'padding:12px 20px;background:' + bg + ';color:#fff;text-decoration:none;' +
          'border-radius:5px;font-size:14px;font-family:Arial,sans-serif;">' + label + '</a>';
      };
      return '<hr style="border:none;border-top:1px solid #ddd;margin:28px 0 20px;">' +
        '<h3 style="color:#333;margin-bottom:8px;">Payment Confirmation</h3>' +
        '<p style="color:#555;font-size:14px;margin-bottom:16px;">' +
        'Please indicate your payment situation by clicking one of the options below. ' +
        'This will be recorded for the camp team.</p>' +
        '<div>' +
        btn(payUrl,    '#4a7c59', 'I am able to pay the camp fee') +
        btn(assistUrl, '#c0703a', 'I will need assistance for payment') +
        btn(donateUrl, '#3a6a9c', 'I can pay and I\'d like to donate more') +
        '</div>' +
        '<p style="color:#999;font-size:12px;margin-top:12px;">' +
        'Please click only once to record your payment situation.</p>';
    })() : '') +

    // Payment instructions
    '<hr style="border:none;border-top:1px solid #ddd;margin:28px 0 20px;">' +
    '<h3 style="color:#333;margin-bottom:8px;">Payment Instructions</h3>' +
    '<p style="color:#555;font-size:14px;margin:0 0 12px;">' +
    'You may pay the camp fees directly to ABC\u2019s BSP, Westpac, or MPAISA accounts:</p>' +
    '<table style="font-size:13px;color:#3a2000;border-collapse:collapse;margin-bottom:12px;">' +
    '<tr><td style="padding:4px 12px 4px 0;font-weight:bold;">BSP</td>' +
    '<td style="padding:4px 0;">A/c&nbsp;# 3178242 &nbsp;&mdash;&nbsp; Advanced Breakthrough Centre</td></tr>' +
    '<tr><td style="padding:4px 12px 4px 0;font-weight:bold;">Westpac</td>' +
    '<td style="padding:4px 0;">A/c&nbsp;# 9803986679 &nbsp;&mdash;&nbsp; Advanced Breakthrough Centre</td></tr>' +
    '<tr><td style="padding:4px 12px 4px 0;font-weight:bold;">MPAISA</td>' +
    '<td style="padding:4px 0;">Merchant Name: Advanced Breakthrough Centre</td></tr>' +
    '</table>' +
    '<p style="color:#555;font-size:14px;margin:0 0 6px;">' +
    '<strong>Narration:</strong> Please put the word <strong>CAMP</strong> followed by your family ' +
    'surname (e.g. <em>CAMPTakalaivuna</em>).</p>' +
    '<p style="color:#555;font-size:14px;margin:0 0 20px;">' +
    'Once payment is made, please send the transfer receipt to ' +
    '<a href="mailto:finance@advancedbreakthroughcentre.org" style="color:#555;">' +
    'finance@advancedbreakthroughcentre.org</a>.</p>' +

    // Camper details table header
    '<h3 style="color:#333;border-bottom:2px solid #ccc;padding-bottom:6px;' +
    'margin:20px 0 12px;">Camper Details</h3>' +

    // Table
    '<div style="overflow-x:auto;margin:0 0 24px;">' +
    '<table style="width:100%;border-collapse:collapse;font-size:13px;' +
    'box-shadow:0 2px 8px rgba(0,0,0,.12);">' +
    '<thead>' +
    '<tr style="background:#8B4513;color:#fff;">' +
    '<th style="padding:10px 8px;">#</th>' +
    '<th style="padding:10px 8px;">Name</th>' +
    '<th style="padding:10px 8px;">Date of Birth</th>' +
    '<th style="padding:10px 8px;">Location</th>' +
    "<th style=\"padding:10px 8px;\">People's Group</th>" +
    '<th style="padding:10px 8px;">Education / Employment</th>' +
    '<th style="padding:10px 8px;">Medical?</th>' +
    '<th style="padding:10px 8px;">Allergies?</th>' +
    '<th style="padding:10px 8px;">Dietary?</th>' +
    '<th style="padding:10px 8px;">Transport</th>' +
    '</tr>' +
    '</thead><tbody>' + rows + '</tbody></table></div>' +

    // Deadlines reminder
    '<div style="background:#fff8ec;border-left:4px solid #DAA520;' +
    'padding:16px 20px;border-radius:4px;margin:20px 0;">' +
    '<p style="margin:0;color:#7a4f00;font-size:14px;">' +
    '\uD83D\uDCC5 <strong>Registration Deadline:</strong> 19 April 2026<br>' +
    '\uD83D\uDCB3 <strong>Payment Deadline:</strong> 30 April 2026</p></div>' +

    // Contacts
    '<p style="color:#333;font-size:14px;line-height:1.8;margin-top:24px;">' +
    'For any questions, please contact:<br>' +
    '<strong>Finance:</strong> Salote \u2013 ' +
    '<a href="mailto:finance@advancedbreakthroughcentre.org" style="color:#555;">' +
    'finance@advancedbreakthroughcentre.org</a><br>' +
    '<strong>Camp logistics:</strong> Laisane \u2013 ' +
    '<a href="mailto:l.tubuna@gmail.com" style="color:#555;">' +
    'l.tubuna@gmail.com</a></p>' +

    '<p style="color:#333;font-size:14px;">' +
    'Regards,<br><strong>ABC Youth Camp Team</strong><br>' +
    '2026 ABC Youth Camp</p>' +

    '</div>' + // end body div
    '</body></html>';
}

function td(header, value) {
  return '<td style="padding:8px;border:1px solid #e0d5c0;vertical-align:top;' +
    'color:#3a2000;">' + (value || '\u2014') + '</td>';
}

// ── Plain-text fallback ───────────────────────────────────────────────────────
function buildConfirmationText_(guardianName, guardianEmail, campers, totalFee) {
  var lines = [
    'Dear ' + guardianName + ',',
    '',
    'Thank you for registering for the 2026 ABC Youth Camp.',
    'Below is a summary of the camper(s) you have submitted.',
    '',
    'REGISTRATION FEES',
    '-----------------'
  ];

  campers.forEach(function (c) {
    var type = c.coordinator ? 'Youth Coordinator' : 'Camper';
    lines.push('  Camper ' + c.number + ': ' + c.name +
      '  (' + type + ')  –  FJD $' + c.fee + '.00');
  });
  lines.push(
    '  ' + Array(42).join('-'),
    '  Total (' + campers.length + ' camper' + (campers.length === 1 ? '' : 's') +
      ')  :  FJD $' + totalFee + '.00',
    ''
  );

  lines.push(
    'PAYMENT CONFIRMATION',
    'Please click one of the links below to indicate your payment situation:',
    ''
  );

  if (WEBAPP_URL) {
    var enc  = encodeURIComponent;
    var base = WEBAPP_URL + '?name=' + enc(guardianName) + '&email=' + enc(guardianEmail);
    lines.push(
      '  Option 1 – I am able to pay the camp fee:',
      '  ' + base + '&choice=pay',
      '',
      '  Option 2 – I will need assistance for payment:',
      '  ' + base + '&choice=assist',
      '',
      '  Option 3 – I can pay and I\'d like to donate more:',
      '  ' + base + '&choice=donate',
      ''
    );
  } else {
    lines.push('  (Payment links will appear here once the web app is deployed.)', '');
  }

  lines.push(
    'PAYMENT INSTRUCTIONS',
    '--------------------',
    'You may pay the camp fees to any of the following accounts:',
    '',
    '  BSP     – A/c# 3178242',
    '  A/c Name: Advanced Breakthrough Centre',
    '',
    '  Westpac – A/c# 9803986679',
    '  A/c Name: Advanced Breakthrough Centre',
    '',
    '  MPAISA  – Merchant Name: Advanced Breakthrough Centre',
    '',
    'Narration: CAMP + family surname (e.g. CAMPTakalaivuna)',
    '',
    'Once payment is made, please send the receipt to:',
    '  finance@advancedbreakthroughcentre.org',
    ''
  );

  lines.push('REGISTRATION SUMMARY', '--------------------');

  campers.forEach(function (c) {
    lines.push(
      '',
      'Camper ' + c.number + ': ' + c.name,
      '  Date of Birth     : ' + (c.dob       || 'N/A'),
      '  Location          : ' + (c.location  || 'N/A'),
      "  People's Group    : " + (c.pg        || 'N/A'),
      '  Education Status  : ' + (c.edu       || 'N/A'),
      '  Medical Condition : ' + (c.medical   || 'N/A'),
      '  Allergies         : ' + (c.allergies || 'N/A'),
      '  Dietary Req.      : ' + (c.dietary   || 'N/A'),
      '  Transport         : ' + (c.transport || 'N/A')
    );
  });

  lines.push(
    '',
    'IMPORTANT DEADLINES',
    '  Registration Deadline : 19 April 2026',
    '  Payment Deadline      : 30 April 2026',
    '',
    'CONTACTS',
    '  Finance queries : Salote  - finance@advancedbreakthroughcentre.org',
    '  Camp logistics  : Laisane - l.tubuna@gmail.com',
    '',
    'Regards,',
    'ABC Youth Camp Team',
    '2026 ABC Youth Camp'
  );

  return lines.join('\n');
}

// =============================================================================
// PAYMENT CONFIRMATION WEB APP
// =============================================================================
// HOW TO DEPLOY:
//   1. In the Apps Script editor, click Deploy → New deployment.
//   2. Type: Web app.
//   3. Execute as: Me.
//   4. Who has access: Anyone.
//   5. Click Deploy and copy the URL shown.
//   6. Paste that URL into the WEBAPP_URL constant at the top of this file.
//   7. Re-run updateYouthCampForm() (only needed to update any form items;
//      the email will immediately start using the new URL).
//
// HOW IT WORKS:
//   Each confirmation email contains three buttons:
//     • "I am able to pay"       → records choice instantly, shows thank-you page
//     • "Need assistance"        → records choice instantly, shows thank-you page
//     • "Can pay + donate more"  → opens a page asking for the donation amount;
//                                   submitting THAT page records choice + amount
//   All responses are written to a "Payment Confirmations" tab in the Google
//   Sheet that is already linked to the registration form.
// =============================================================================

/**
 * Handles GET requests (pay / assist choices, and the donate amount page).
 */
function doGet(e) {
  var name   = (e.parameter.name   || '').replace(/</g, '&lt;');
  var email  = e.parameter.email   || '';
  var choice = e.parameter.choice  || '';

  if (choice === 'pay' || choice === 'assist') {
    recordPaymentChoice_(name, email, choice, '');
    return HtmlService.createHtmlOutput(buildThankYouPage_(choice, name))
      .setTitle('2026 ABC Youth Camp');
  }
  if (choice === 'donate') {
    return HtmlService.createHtmlOutput(buildDonationPage_(name, email))
      .setTitle('2026 ABC Youth Camp');
  }
  return HtmlService.createHtmlOutput('<p>Invalid request.</p>')
    .setTitle('2026 ABC Youth Camp');
}

/**
 * Handles POST requests (donation amount form submission).
 */
function doPost(e) {
  var name   = (e.parameter.name   || '').replace(/</g, '&lt;');
  var email  = e.parameter.email   || '';
  var amount = e.parameter.amount  || '';
  recordPaymentChoice_(name, email, 'donate', amount);
  return HtmlService.createHtmlOutput(buildThankYouPage_('donate', name))
    .setTitle('2026 ABC Youth Camp');
}

/**
 * Writes a payment choice to the "Payment Confirmations" tab
 * of the Google Sheet linked to the registration form.
 */
function recordPaymentChoice_(name, email, choice, amount) {
  try {
    var destId = FormApp.openById(FORM_ID).getDestinationId();
    if (!destId) {
      Logger.log('recordPaymentChoice_: no linked spreadsheet found.');
      return;
    }
    var ss    = SpreadsheetApp.openById(destId);
    var sheet = ss.getSheetByName('Payment Confirmations');
    if (!sheet) {
      sheet = ss.insertSheet('Payment Confirmations');
      sheet.appendRow(['Timestamp', 'Name', 'Email', 'Payment Choice', 'Donation Amount (FJD)']);
      sheet.setFrozenRows(1);
      sheet.getRange(1, 1, 1, 5).setFontWeight('bold');
    }
    var label = choice === 'pay'    ? 'I am able to pay the camp fee.' :
                choice === 'assist' ? 'I will need assistance for payment.' :
                                     'I can pay and I am willing to donate more.';
    sheet.appendRow([new Date(), name, email, label, amount || '']);
  } catch (err) {
    Logger.log('recordPaymentChoice_ error: ' + err.message);
  }
}

/** Page asking for the donation amount (shown only for the "donate" choice). */
function buildDonationPage_(name, email) {
  return '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8">' +
    '<meta name="viewport" content="width=device-width,initial-scale=1">' +
    '<title>2026 ABC Youth Camp – Donation</title>' +
    '<style>' +
    '*{box-sizing:border-box;margin:0;padding:0;}' +
    'body{font-family:Arial,sans-serif;' +
    'background:linear-gradient(135deg,#5a2d0c 0%,#8B4513 55%,#DAA520 100%);' +
    'min-height:100vh;display:flex;align-items:center;justify-content:center;padding:20px;}' +
    '.wrap{background:#fff;border-radius:14px;box-shadow:0 10px 40px rgba(0,0,0,.35);' +
    'max-width:480px;width:100%;overflow:hidden;}' +
    '.hdr{background:linear-gradient(135deg,#5a2d0c,#8B4513);' +
    'padding:28px 32px;text-align:center;}' +
    '.hdr .icon{font-size:36px;display:block;margin-bottom:8px;}' +
    '.hdr h1{color:#fff;font-size:22px;margin-bottom:4px;}' +
    '.hdr p{color:#ffe4b5;font-size:13px;}' +
    '.bdy{padding:28px 32px;}' +
    '.greet{font-size:15px;color:#333;margin-bottom:18px;}' +
    '.badge{background:#fdf6ec;border-left:4px solid #DAA520;' +
    'padding:12px 16px;border-radius:4px;margin-bottom:22px;' +
    'font-size:13px;color:#5a3000;line-height:1.5;}' +
    '.lbl{display:block;font-size:14px;color:#444;margin-bottom:10px;line-height:1.6;}' +
    '.pfx{display:flex;align-items:center;border:2px solid #ccc;border-radius:6px;' +
    'overflow:hidden;transition:border-color .2s;}' +
    '.pfx:focus-within{border-color:#8B4513;}' +
    '.pfx .sym{padding:0 12px;font-size:16px;font-weight:bold;color:#8B4513;' +
    'background:#fdf6ec;border-right:2px solid #ccc;line-height:46px;}' +
    '.pfx input{border:none;outline:none;width:100%;padding:12px 14px;font-size:16px;color:#333;}' +
    'button{margin-top:22px;width:100%;' +
    'background:linear-gradient(135deg,#4a7c59,#3a6448);' +
    'color:#fff;border:none;padding:14px;font-size:15px;font-weight:bold;' +
    'border-radius:6px;cursor:pointer;letter-spacing:.3px;}' +
    'button:hover{opacity:.9;}' +
    '.note{font-size:12px;color:#aaa;text-align:center;margin-top:14px;line-height:1.5;}' +
    '</style></head><body>' +
    '<div class="wrap">' +
    '<div class="hdr"><span class="icon">&#x26FA;</span>' +
    '<h1>2026 ABC Youth Camp</h1><p>Donation Contribution</p></div>' +
    '<div class="bdy">' +
    '<p class="greet">Thank you, <strong>' + name + '</strong>!</p>' +
    '<div class="badge">You have selected:<br>' +
    '<strong>I can pay the camp fee and I&rsquo;d like to donate more.</strong></div>' +
    '<form method="POST" action="' + WEBAPP_URL + '">' +
    '<input type="hidden" name="name" value="' + name + '">' +
    '<input type="hidden" name="email" value="' + email + '">' +
    '<label class="lbl" for="amt">' +
    'Please kindly state below the amount you are willing to donate ' +
    'to assist in the running of the camp (in FJD):</label>' +
    '<div class="pfx"><span class="sym">FJD&nbsp;$</span>' +
    '<input type="text" id="amt" name="amount" placeholder="e.g. 50" required></div>' +
    '<button type="submit">&#10003;&nbsp; Submit Donation</button>' +
    '</form>' +
    '<p class="note">Your generosity helps make the camp possible for every participant.<br>' +
    'Thank you for your kind support.</p>' +
    '</div></div></body></html>';
}

/** Thank-you page shown after a payment choice or donation is recorded. */
function buildThankYouPage_(choice, fullName) {
  var firstName = (fullName || '').split(' ')[0] || 'there';

  var headerTitle, headerSub, cardBg, borderColor, icon, heading, body1, body2;

  if (choice === 'donate') {
    headerTitle = 'Donation Received';
    headerSub   = 'Thank you for your generosity!';
    cardBg      = '#f0f7f2';
    borderColor = '#4a7c59';
    icon        = '&#x1F49A;'; // green heart
    heading     = 'Thank you, ' + firstName + '!';
    body1       = 'Your donation amount has been received and recorded. ' +
                  'The camp team truly appreciates your willingness to go above and beyond ' +
                  'for the 2026 ABC Youth Camp.';
    body2       = 'We will be in touch with further details. ' +
                  'God bless you for your generosity!';
  } else if (choice === 'pay') {
    headerTitle = 'Payment Confirmed';
    headerSub   = 'Your response has been recorded.';
    cardBg      = '#f0f7f2';
    borderColor = '#4a7c59';
    icon        = '&#x2705;'; // check mark
    heading     = 'Thank you, ' + firstName + '!';
    body1       = 'Your payment intention has been recorded: ' +
                  '<em>I am able to pay the camp fee.</em>';
    body2       = 'Please ensure your payment is made by <strong>30 April 2026</strong>. ' +
                  'The camp team will be in touch with further details.';
  } else {
    headerTitle = 'Response Recorded';
    headerSub   = 'We have noted your situation.';
    cardBg      = '#fdf6ec';
    borderColor = '#DAA520';
    icon        = '&#x1F4AC;'; // speech bubble
    heading     = 'Thank you, ' + firstName + '!';
    body1       = 'Your response has been recorded: ' +
                  '<em>I will need assistance for payment.</em>';
    body2       = 'The camp team will reach out to you shortly to discuss further. ' +
                  'Please do not hesitate to contact us at ' +
                  '<a href="mailto:finance@advancedbreakthroughcentre.org" style="color:#8B4513;">' +
                  'finance@advancedbreakthroughcentre.org</a>.';
  }

  return '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8">' +
    '<meta name="viewport" content="width=device-width,initial-scale=1">' +
    '<title>2026 ABC Youth Camp</title>' +
    '<style>' +
    '*{box-sizing:border-box;margin:0;padding:0;}' +
    'body{font-family:Arial,sans-serif;' +
    'background:linear-gradient(135deg,#5a2d0c 0%,#8B4513 55%,#DAA520 100%);' +
    'min-height:100vh;display:flex;align-items:center;justify-content:center;padding:20px;}' +
    '.wrap{background:#fff;border-radius:14px;box-shadow:0 10px 40px rgba(0,0,0,.35);' +
    'max-width:460px;width:100%;overflow:hidden;}' +
    '.hdr{background:linear-gradient(135deg,#5a2d0c,#8B4513);' +
    'padding:28px 32px;text-align:center;}' +
    '.hdr .icon{font-size:40px;display:block;margin-bottom:8px;}' +
    '.hdr h1{color:#fff;font-size:20px;margin-bottom:4px;}' +
    '.hdr p{color:#ffe4b5;font-size:13px;}' +
    '.bdy{padding:28px 32px;}' +
    '.card{background:' + cardBg + ';border-left:4px solid ' + borderColor + ';' +
    'border-radius:6px;padding:20px 22px;}' +
    '.card h2{font-size:20px;color:#333;margin-bottom:14px;}' +
    '.card p{font-size:14px;color:#444;line-height:1.7;margin-bottom:10px;}' +
    '.card p:last-child{margin-bottom:0;}' +
    '.footer{text-align:center;padding:16px 32px 24px;' +
    'font-size:12px;color:#aaa;line-height:1.5;}' +
    '</style></head><body>' +
    '<div class="wrap">' +
    '<div class="hdr"><span class="icon">' + icon + '</span>' +
    '<h1>' + headerTitle + '</h1><p>' + headerSub + '</p></div>' +
    '<div class="bdy"><div class="card">' +
    '<h2>' + heading + '</h2>' +
    '<p>' + body1 + '</p>' +
    '<p>' + body2 + '</p>' +
    '</div></div>' +
    '<div class="footer">2026 ABC Youth Camp &mdash; Advanced Breakthrough Centre</div>' +
    '</div></body></html>';
}
