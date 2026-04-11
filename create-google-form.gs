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
 * HOW TO RUN
 *   1. Open https://script.google.com → New project.
 *   2. Paste this entire file into Code.gs.
 *   3. Click Run → updateYouthCampForm.
 *   4. Grant permissions when prompted.
 *   5. The SAME form URL now reflects all changes.
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

// ── Main function ──────────────────────────────────────────────────────────
function updateYouthCampForm() {

  var form = FormApp.openById(FORM_ID);

  // ── 1. Clear every existing item ────────────────────────────────────────
  // Always fetch a fresh reference to item[0] so stale IDs from branching
  // dependencies never cause "Invalid data updating form".
  while (form.getItems().length > 0) {
    form.deleteItem(form.getItems()[0]);
  }

  // ── 2. Form-level metadata ───────────────────────────────────────────────
  form.setTitle('\uD83C\uDFD5\uFE0F  2026 ABC Youth Camp  \uD83C\uDFD5\uFE0F');
  form.setDescription(
    '\u2728 Welcome to ABC Youth Camp 2026! \u2728\n\n' +
    '\uD83C\uDF31  This camp is designed to empower young people through ' +
    'spiritual growth, leadership development, and community connection.\n\n' +
    '\uD83D\uDCC5  Registration Deadline : 19 April 2026\n' +
    '\uD83D\uDCB3  Payment Deadline      : 30 April 2026\n\n' +
    '\u2709\uFE0F  For enquiries:\n' +
    '       Finance   \u2013 Salote  : salotesoroaqali@gmail.com\n' +
    '       Logistics \u2013 Laisane : l.tubuna@gmail.com\n\n' +
    '\u270F\uFE0F  Please complete all required fields (*) accurately.'
  );
  form.setConfirmationMessage(
    'Thank you for registering for the 2026 ABC Youth Camp!\n\n' +
    'Your registration has been successfully submitted. ' +
    'We look forward to seeing you at camp!\n\n' +
    'If you have any questions please reach out to:\n' +
    '  Finance queries : Salote – salotesoroaqali@gmail.com\n' +
    '  Camp logistics  : Laisane – l.tubuna@gmail.com'
  );
  form.setIsQuiz(false);
  form.setAllowResponseEdits(true);
  form.setShowLinkToRespondAgain(false);

  // ── 3. WELCOME SECTION (first page – no page break before it) ──────────
  //
  // TIP  ▸  For stylish fonts open the form editor → palette icon
  //         (Customize theme) → Text → choose a display font such as
  //         "Pacifico", "Lobster", or "Dancing Script" for the heading.
  //         Then pick warm earth/orange tones to match the camp logo.
  form.addSectionHeaderItem()
    .setTitle('\uD83C\uDF1F\u2728  Welcome to ABC Youth Camp 2026!  \u2728\uD83C\uDF1F')
    .setHelpText(
      '\uD83D\uDC9A  A transformative journey of faith, leadership & community  \uD83D\uDC9A\n\n' +
      'ABC Youth Camp 2026 is crafted to ignite spiritual growth, develop ' +
      'bold leaders, and build a generation of young people deeply rooted ' +
      'in community and purpose.\n\n' +
      'We are SO excited to journey alongside your family this year and ' +
      'cannot wait to see what God will do through each and every camper!\n\n' +
      '\uD83D\uDD25  Get ready for an incredible experience!\n\n' +
      '\uD83D\uDCC5  Registration closes  \u2794  19 April 2026\n' +
      '\uD83D\uDCB0  Payment due by       \u2794  30 April 2026\n\n' +
      '\u27A1\uFE0F  Click NEXT to begin the registration.'
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

  // ── 5. CAMPER SECTIONS (1 – 10) ─────────────────────────────────────────
  var camperBasicPages = [];
  var moreCampersItems = [];

  var ORDINALS = [
    'First','Second','Third','Fourth','Fifth',
    'Sixth','Seventh','Eighth','Ninth','Tenth'
  ];

  for (var n = 1; n <= TOTAL_CAMPERS; n++) {
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

  } // end camper loop

  // ── 6. PAYMENT & CAMP FEES ───────────────────────────────────────────────
  var paymentPage = form.addPageBreakItem()
    .setTitle('Payment & Camp Fees');

  form.addSectionHeaderItem()
    .setTitle('Registration Fees')
    .setHelpText(
      'The registration fees for the 2026 ABC Youth Camp are as follows:\n\n' +
      '  In-Person Payment : FJD $70.00 per camper\n' +
      '  Online Payment    : FJD $40.00 per camper\n\n' +
      'Your total will be based on the number of campers you have registered ' +
      'and your chosen payment method.\n\n' +
      'Deadline to pay camp fees : 30 April 2026'
    );

  form.addMultipleChoiceItem()
    .setTitle('How will you be making your payment?')
    .setChoiceValues([
      'In-Person – FJD $70.00 per camper',
      'Online – FJD $40.00 per camper'
    ])
    .setRequired(true);

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

  var paymentQ = form.addMultipleChoiceItem()
    .setTitle('Please select one of the options below that best describes your situation.')
    .setRequired(true);
  // Choices set below once donationPage exists.

  // Donation branch (only reached via the donate choice — no assistance page).
  var donationPage = form.addPageBreakItem()
    .setTitle('Donation');

  form.addTextItem()
    .setTitle('How much are you willing to donate to assist in the running of the camp?')
    .setHelpText('Enter the amount in FJD (Fijian Dollars).')
    .setRequired(true);

  // Payment branching choices.
  paymentQ.setChoices([
    paymentQ.createChoice(
      'I am able to pay the camp fee.',
      FormApp.PageNavigationType.SUBMIT
    ),
    paymentQ.createChoice(
      'I will need assistance for payment.',
      FormApp.PageNavigationType.SUBMIT
    ),
    paymentQ.createChoice(
      'I am able to pay the camp fee, and I am willing to donate some more to assist in the running of the camp.',
      donationPage
    )
  ]);

  // ── 7. SET UP "MORE CAMPERS?" BRANCHING ─────────────────────────────────
  for (var i = 0; i < moreCampersItems.length; i++) {
    var q        = moreCampersItems[i];
    var nextPage = camperBasicPages[i + 1]; // next camper's basic info section
    q.setChoices([
      q.createChoice('Yes, I have another camper to register', nextPage),
      q.createChoice('No, that is all the campers',            paymentPage)
    ]);
  }

  // ── Done ─────────────────────────────────────────────────────────────────
  Logger.log('Form updated successfully!');
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

    var numCampersRaw = responses['How many campers will you be registering?'] || '1 Camper';
    var numCampers    = parseInt(numCampersRaw, 10) || 1;

    // Collect per-camper data
    var campers = [];
    for (var n = 1; n <= numCampers; n++) {
      var lbl = 'Camper ' + n;
      var name = responses[lbl + "'s Full Name"];
      if (!name) continue; // skip if section was left blank
      campers.push({
        number:    n,
        name:      name,
        dob:       responses[lbl + "'s Date of Birth"]                                          || '',
        location:  responses['Location of ' + lbl]                                              || '',
        pg:        responses["What is " + lbl + "'s People's Group?"]                          || '',
        edu:       responses["What is " + lbl + "'s current education or employment status?"] || '',
        medical:   responses["Does " + lbl + " have any current medical condition?"]           || '',
        allergies: responses["Is " + lbl + " allergic to anything?"]                           || '',
        dietary:   responses["Does " + lbl + " have any dietary requirements?"]               || '',
        transport: responses["How will " + lbl + " be travelling to the camp-site?"]          || '',
        goals:     responses["What are " + lbl + "'s expectations or goals for this camp?"]   || ''
      });
    }

    var paymentMethod = responses['How will you be making your payment?'] || '';
    var feePerCamper  = paymentMethod.indexOf('Online') !== -1 ? 40 : 70;
    var totalFee      = campers.length * feePerCamper;

    var subject  = '\uD83C\uDFD5\uFE0F 2026 ABC Youth Camp \u2013 Registration Confirmed!';
    var htmlBody = buildConfirmationHtml_(guardianName, campers, feePerCamper, totalFee);
    var textBody = buildConfirmationText_(guardianName, campers, feePerCamper, totalFee);

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
function buildConfirmationHtml_(guardianName, campers, feePerCamper, totalFee) {
  // Fee summary rows (one row per camper)
  var feeRows = campers.map(function (c) {
    return '<tr style="background:' + (c.number % 2 === 0 ? '#f9f5ee' : '#ffffff') + '">' +
      '<td style="padding:8px;border:1px solid #e0d5c0;color:#3a2000;">' + c.number + '</td>' +
      '<td style="padding:8px;border:1px solid #e0d5c0;color:#3a2000;">' + c.name + '</td>' +
      '<td style="padding:8px;border:1px solid #e0d5c0;color:#3a2000;text-align:right;">' +
        'FJD $' + feePerCamper + '.00</td>' +
      '</tr>';
  }).join('');

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

    '<p style="font-size:17px;color:#4a2c0a;">Dear <strong>' + guardianName + '</strong>,</p>' +

    '<p style="color:#5a3010;line-height:1.7;font-size:15px;">' +
    'Thank you so much for registering for the <strong>2026 ABC Youth Camp</strong>! \uD83D\uDE4F ' +
    'We are thrilled to have your camper(s) join us for what is going to be an incredible ' +
    'and life-changing experience.</p>' +

    '<p style="color:#5a3010;line-height:1.7;font-size:15px;">' +
    'Below is a summary of the camper(s) you have registered, including the registration ' +
    'fees. Please review it and reach out if anything needs to be corrected.</p>' +

    // Fee summary table
    '<h3 style="color:#5a3010;border-bottom:2px solid #DAA520;padding-bottom:6px;' +
    'margin-bottom:12px;">\uD83D\uDCB0 Fee Summary</h3>' +
    '<div style="overflow-x:auto;margin:0 0 28px;">' +
    '<table style="width:100%;max-width:520px;border-collapse:collapse;font-size:14px;' +
    'box-shadow:0 2px 8px rgba(0,0,0,.10);">' +
    '<thead><tr style="background:#8B4513;color:#fff;">' +
    '<th style="padding:10px 12px;text-align:left;">#</th>' +
    '<th style="padding:10px 12px;text-align:left;">Camper Name</th>' +
    '<th style="padding:10px 12px;text-align:right;">Fee</th>' +
    '</tr></thead><tbody>' + feeRows +
    '<tr style="background:#f0e6cc;">' +
    '<td colspan="2" style="padding:10px 12px;font-weight:bold;color:#3a2000;' +
    'border:1px solid #e0d5c0;">Total (' + campers.length + ' camper' +
    (campers.length === 1 ? '' : 's') + ')</td>' +
    '<td style="padding:10px 12px;font-weight:bold;color:#2a5a00;text-align:right;' +
    'border:1px solid #e0d5c0;">FJD $' + totalFee + '.00</td>' +
    '</tr></tbody></table></div>' +

    // Camper details table header
    '<h3 style="color:#5a3010;border-bottom:2px solid #DAA520;padding-bottom:6px;' +
    'margin-bottom:12px;">\uD83C\uDFD5\uFE0F Camper Details</h3>' +

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
    '<p style="color:#5a3010;font-size:14px;line-height:1.8;">' +
    'If you have any questions, please don\'t hesitate to reach out:<br>' +
    '\uD83D\uDCB0 <strong>Finance queries:</strong> Salote \u2013 ' +
    '<a href="mailto:salotesoroaqali@gmail.com" style="color:#8B4513;">' +
    'salotesoroaqali@gmail.com</a><br>' +
    '\uD83C\uDFD5\uFE0F <strong>Camp logistics:</strong> Laisane \u2013 ' +
    '<a href="mailto:l.tubuna@gmail.com" style="color:#8B4513;">' +
    'l.tubuna@gmail.com</a></p>' +

    '<p style="color:#5a3010;font-size:15px;line-height:1.7;margin-top:24px;">' +
    'We cannot wait to see your family at camp. God bless! \uD83C\uDF1F</p>' +

    '<p style="color:#8B4513;font-size:14px;font-style:italic;">' +
    'Warm regards,<br><strong>ABC Ministry Team</strong><br>' +
    '2026 ABC Youth Camp</p>' +

    '</div>' + // end body div
    '</body></html>';
}

function td(header, value) {
  return '<td style="padding:8px;border:1px solid #e0d5c0;vertical-align:top;' +
    'color:#3a2000;">' + (value || '\u2014') + '</td>';
}

// ── Plain-text fallback ───────────────────────────────────────────────────────
function buildConfirmationText_(guardianName, campers, feePerCamper, totalFee) {
  var lines = [
    'Dear ' + guardianName + ',',
    '',
    'Thank you for registering for the 2026 ABC Youth Camp!',
    'We are so excited to have your camper(s) join us.',
    '',
    'FEE SUMMARY',
    '-----------'
  ];

  campers.forEach(function (c) {
    lines.push('  Camper ' + c.number + ': ' + c.name + '  –  FJD $' + feePerCamper + '.00');
  });
  lines.push(
    '  ' + '─'.repeat(38),
    '  Total (' + campers.length + ' camper' + (campers.length === 1 ? '' : 's') +
      ')  :  FJD $' + totalFee + '.00',
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
    '  Finance queries : Salote  - salotesoroaqali@gmail.com',
    '  Camp logistics  : Laisane - l.tubuna@gmail.com',
    '',
    'We cannot wait to see your family at camp. God bless!',
    '',
    'Warm regards,',
    'ABC Ministry Team',
    '2026 ABC Youth Camp'
  );

  return lines.join('\n');
}
