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
  form.setTitle('2026 ABC Youth Camp Registration Form');
  form.setDescription(
    'Welcome to ABC Youth Camp 2026!\n\n' +
    'This camp is designed to empower young people through spiritual growth, ' +
    'leadership development, and community connection.\n\n' +
    '-------------------------------------\n' +
    'Registration Deadline : 19 April 2026\n' +
    'Payment Deadline      : 30 April 2026\n' +
    '-------------------------------------\n\n' +
    'Please complete all required fields (*) accurately.\n\n' +
    'For enquiries:\n' +
    '  Finance   – Salote  : salotesoroaqali@gmail.com\n' +
    '  Logistics – Laisane : l.tubuna@gmail.com'
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
    .setTitle('\u2756  ABC Youth Camp 2026  \u2756')
    .setHelpText(
      '\u2728  Welcome, families!  \u2728\n\n' +
      'ABC Youth Camp 2026 is a transformative journey crafted to ignite ' +
      'spiritual growth, develop bold leaders, and build a generation of ' +
      'young people deeply rooted in community and purpose.\n\n' +
      'We are excited to journey alongside your family and cannot wait to ' +
      'see what God will do through each camper this year!\n\n' +
      '\u23f0  Registration Deadline  \u2192  19 April 2026\n' +
      '\ud83d\udcb3  Payment Deadline       \u2192  30 April 2026\n\n' +
      'Click NEXT to begin the registration.'
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
    .setRequired(true);

  form.addTextItem()
    .setTitle('Phone Number')
    .setHelpText('Include country code if overseas, e.g. +679 777 1234')
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
      .setTitle(label + "'s Email Address")
      .setHelpText("Enter the camper's email address if they have one.");

    form.addTextItem()
      .setTitle(label + "'s Phone Contact")
      .setHelpText("Enter the camper's mobile number.");

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
      .setTitle('Is ' + label + ' a coordinator?')
      .setChoiceValues(['Yes', 'No'])
      .setRequired(true);

    // ── Education & Employment Status (branching question) ─────────────────
    var eduStatusPage = form.addPageBreakItem()
      .setTitle(label + ' – Education & Employment Status');

    var eduQ = form.addMultipleChoiceItem()
      .setTitle("What is " + label + "'s current education or employment status?")
      .showOtherOption(true)  // must be set BEFORE navigation choices are applied
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
    // eduStatusPage default is also set to healthPage so the built-in
    // "Other" text field (showOtherOption) routes there automatically.
    priSecPage.setGoToPage(healthPage);
    tertiaryPage.setGoToPage(healthPage);
    professionalPage.setGoToPage(healthPage);
    eduStatusPage.setGoToPage(healthPage);

    // Named choices branch to their detail sections.
    // "Other" (with its inline text field) follows eduStatusPage's default
    // navigation → healthPage, set via eduStatusPage.setGoToPage() above.
    eduQ.setChoices([
      eduQ.createChoice('Primary School',        priSecPage),
      eduQ.createChoice('Secondary School',      priSecPage),
      eduQ.createChoice('Tertiary / Vocational', tertiaryPage),
      eduQ.createChoice('Working Professional',  professionalPage)
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
    .setTitle('Payment Information')
    .setHelpText(
      'Camp fee details will be communicated to you directly by the organising team. ' +
      'Please indicate your payment situation below.\n\n' +
      'Payment Deadline: 30 April 2026\n' +
      'Finance contact: Salote – salotesoroaqali@gmail.com'
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
