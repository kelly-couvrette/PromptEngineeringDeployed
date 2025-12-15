import type { InstructionType } from "../types"
import type React from "react" // Declare the JSX variable

interface InstructionContent {
  title: string
  content: React.ReactNode // Use React.ReactNode instead of JSX.Element
  requirement?: string
}

export function getInstructionContent(type: InstructionType): InstructionContent {
  switch (type) {
    case "police-report":
      return {
        title: "Filing a Police Report Online",
        content: (
          <>
            <p>
              This guidance is for filing a police report online for incidents that have already occurred and do not require an immediate, emergency response. Your submission should be factual, concise, and complete.
            </p>

            <h3>General Guidance</h3>
            <ul>
              <li>Only submit incidents that have already occurred and do not require an immediate response.</li>
              <li>Your entries should be <strong>factual, concise, and written in complete sentences</strong>, avoiding shorthand, slang, or symbols.</li>
              <li>Approximate information is allowed if exact details are unknown, but you must not present assumptions as fact.</li>
            </ul>

            <h3>Short Incident Summary Input</h3>
            <ul>
              <li>Provide a one to two sentence summary of the incident.</li>
              <li>Include the time and date in <strong>24-hour format (HH:MM)</strong> and <strong>YYYY-MM-DD format</strong>.</li>
              <li>Specify the <strong>location</strong> (street address, intersection, or clearly identifiable area); vague descriptions are not acceptable.</li>
              <li>Indicate the type of incident: “Injury,” “Property Damage,” “Near Miss,” “Security Breach,” or “Other.” If “Other” is chosen, include a short clarifying note of ten words or fewer.</li>
            </ul>

            <h3>People Involved Input</h3>
            <p>At least one person must be listed.</p>
            <ul>
              <li>List all individuals with their <strong>full names and their role/relationship</strong> to the incident (e.g., “John Smith – injured party”).</li>
              <li>If names are unknown, provide descriptive alternatives (e.g., “adult male, approximately 30s, medium build”).</li>
            </ul>

            <h3>Additional Details Input</h3>
            <ul>
              <li>Provide extra information like <strong>vehicle details</strong> (make, model, color, year, features, partial license plate numbers).</li>
              <li>For damaged or stolen property, describe it with <strong>specificity</strong> (brand, model, color, serial numbers).</li>
              <li>Include any supporting documentation or evidence (photographs, receipts, surveillance footage).</li>
              <li>All information must be factual and written in complete sentences.</li>
            </ul>

            <h3>Submission and Recordkeeping</h3>
            <ul>
              <li>Upon submission, you will receive a <strong>confirmation or case number</strong>, which should be kept for reference.</li>
              <li>Law enforcement <strong>may or may not follow up</strong>, depending on the completeness and clarity of your entries.</li>
              <li>You are responsible for ensuring the accuracy of all information provided.</li>
              <li>Knowingly providing false or misleading information may have legal consequences.</li>
            </ul>
          </>
        ),
        requirement: "Short Incident Summary Report",
      }

    case "recipe-blog":
      return {
        title: "Recipe Submission Guidelines",
        content: (
          <>
            <p>
              When submitting a recipe for possible publication, your goal is to strike the balance between <strong>completeness, clarity, and originality</strong>. If any essential information is missing or unclear—or if you're too close to someone else’s work—the submission is at risk of being rejected.
            </p>

            <h3>General Formatting</h3>
            <ul>
              <li>Write in <strong>full sentences</strong>, with no shorthand like “tbsp” or “u.”</li>
              <li>Use proper grammar and punctuation.</li>
              <li>Structure your submission with these headings: <strong>Title/Story, Ingredients, Instructions, Details, and Originality Note</strong>.</li>
            </ul>

            <h3>1. Identity, Angle & Story</h3>
            <ul>
              <li>Your recipe needs a <strong>purposeful title</strong> (e.g., “Late-Night Espresso Bundt for Last-Minute Company”).</li>
              <li>Offer a brief <strong>background/narrative hook</strong>: inspiration, family tradition, quick fix, or cultural context.</li>
              <li>Submissions with an absent or generic story may be rejected.</li>
            </ul>

            <h3>2. Ingredients & Quantities</h3>
            <ul>
              <li>Everything must be listed in the <strong>order used</strong>.</li>
              <li>Use <strong>clear and consistent metric measurements</strong> (grams, milliliters, liters, etc.). <strong>No cups or ounces.</strong></li>
              <li>Be precise: "some flour" or "a pinch of salt" are not acceptable.</li>
              <li>Group ingredients into categories if the recipe has multiple parts (e.g., “Cake,” “Frosting”).</li>
              <li>Absolutely <strong>no brand names</strong> should be given.</li>
            </ul>

            <h3>3. Instructions: Method & Visual Cues</h3>
            <ol>
              <li>Steps should be <strong>numbered or clearly separated</strong>.</li>
              <li>Each step must be <strong>actionable</strong> (e.g., “Preheat oven to 350°F. In a 9-inch round cake pan, cream butter and sugar...”).</li>
              <li>State how someone can tell the item is done (e.g., “Bake until a toothpick comes out clean, about 25 minutes”).</li>
              <li>Do not omit oven temperatures, pan sizes, or doneness signs.</li>
            </ol>

            <h3>4. Supporting Details</h3>
            <p>A strong submission must include:</p>
            <ul>
              <li><strong>Yield/Servings:</strong> Must be a number (e.g., “Serves 6”).</li>
              <li><strong>Prep and Cook Time:</strong> Must be split into three parts and expressed in minutes (e.g., “Prep 15 min, Cook 30 min, Total 45 min”). The total time must be the accurate addition of the prep and cook times.</li>
              <li><strong>Equipment Notes:</strong> Especially for unique pans or methods (e.g., “9-inch springform pan”).</li>
              <li><strong>Storage or Serving Tips:</strong> (e.g., “Cool completely before frosting”).</li>
            </ul>

            <h3>5. Originality & Testing</h3>
            <ul>
              <li>Your recipe must be your <strong>own creation—not copied</strong>.</li>
              <li>If based on another source, mention it and explain your adaptation.</li>
              <li>The recipe should ideally be <strong>tested multiple times</strong> to ensure consistency and clarity.</li>
              <li>Vague write-ups (e.g., “bake until it looks done”) indicate insufficient testing and risk rejection.</li>
            </ul>

            <h3>6. Contact and Meta Info</h3>
            <ul>
              <li>Include your name (or pen name), contact details (email or phone), and region or city.</li>
              <li>Include a line about why you are the right person to submit this recipe (experience, passion, cultural perspective).</li>
            </ul>
          </>
        ),
        requirement: "Ingredients List/Amount",
      }

    case "job-experience":
      return {
        title: "Job Application Validation for 'Graphic Designer' at BrightWave",
        content: (
          <>
            <p>
              This guide outlines the mandatory items and optional strengths an AI should confirm when validating a job application for the "Graphic Designer" role at BrightWave Creative.
            </p>

            <h3>Identity & Motivation (Mandatory)</h3>
            <ul>
              <li>Must explicitly mention <strong>BrightWave Creative</strong> by name.</li>
              <li>Must mention the job title <strong>“Graphic Designer”</strong> at least once.</li>
              <li>Must reference <strong>BrightWave’s mission</strong> (keywords like “strategic design,” “culture-shaping,” “engagement,” or equivalent).</li>
              <li>Must mention at least <strong>one active project</strong> (Aurora Launch Campaign, Momentum 360, PulsePoint Analytics, or Civic Voices).</li>
            </ul>

            <h3>Relevant Experience (Mandatory)</h3>
            <ul>
              <li>Must state the applicant’s education and confirm a <strong>Bachelor’s degree</strong> in Graphic Design, Marketing, or a related field.</li>
              <li>Must state at least <strong>2 years of professional design experience</strong>.</li>
              <li>Must include at least <strong>one measurable achievement</strong> (e.g., campaign reach, engagement increase, client outcome, award).</li>
              <li>Experience must be <strong>connected directly to marketing/branding/campaigns</strong> (not just generic design).</li>
            </ul>

            <h3>Skills Alignment</h3>
            <p>Mandatory and Optional Skills</p>
            <ul>
              <li>Must mention at least one of the <strong>required technical skills</strong>: Adobe Illustrator, Adobe Photoshop, Adobe InDesign, typography, layout, or color theory.</li>
              <li><strong>Optional bonus:</strong> mention at least one <strong>nice-to-have skill</strong>: motion graphics, video editing, UX/UI, or consumer branding.</li>
            </ul>

            <h3>Professional Presentation (Mandatory)</h3>
            <ul>
              <li>Must use <strong>complete sentences</strong> and a <strong>professional tone</strong> (no slang, emojis, or shorthand).</li>
              <li>Must be structured in at least <strong>3 distinct paragraphs</strong> (intro, body, conclusion).</li>
              <li>Must contain <strong>no obvious grammatical errors</strong>.</li>
            </ul>

            <h3>Originality & Fit (Mandatory)</h3>
            <ul>
              <li>Must be <strong>tailored</strong>: cannot be generic (e.g., must specifically name BrightWave or its projects).</li>
              <li>Must include a <strong>closing statement</strong> explaining why the applicant is a strong/unique fit.</li>
              <li>Must clearly express <strong>enthusiasm</strong> for contributing to BrightWave’s work.</li>
            </ul>
          </>
        ),
        requirement: "Relevant Experience",
      }

    case "insurance-claim":
      return {
        title: "Guidance for Standard Property Loss Insurance Claims",
        content: (
          <>
            <p>
              This guidance outlines the information and documentation required when submitting a homeowners insurance claim for standard property loss incidents (e.g., Water Damage, Theft, Fire, Storm). Providing complete and accurate information will help ensure your claim is reviewed efficiently.
            </p>

            <h3>1. Policy and Claimant Information</h3>
            <p>All claim submissions must include:</p>
            <ul>
              <li>The correct <strong>policy number</strong> as it appears on your documents.</li>
              <li>The <strong>insured name(s)</strong> listed on the policy.</li>
              <li>The <strong>full property address</strong> where the loss occurred.</li>
              <li>The <strong>date and time</strong> of the incident.</li>
              <li>Reliable <strong>contact information</strong> (phone number, email, and mailing address).</li>
            </ul>

            <h3>2. Description of the Incident</h3>
            <p>You must provide a clear description to avoid delays. Insufficient examples are "water damage in kitchen."</p>
            <ul>
              <li>Explain the <strong>cause of loss</strong>.</li>
              <li>State the <strong>specific location</strong> within the property where the damage occurred.</li>
              <li>Describe the <strong>sequence of events</strong> leading up to and following the incident.</li>
              <li>An appropriate description specifies the cause, date, location, spread of damage, and immediate action taken (e.g., shutting off water).</li>
            </ul>

            <h3>3. Documentation and Proof of Loss</h3>
            <p>Submissions without sufficient supporting evidence are at risk of being delayed, disputed, or denied.</p>
            <ul>
              <li><strong>Photographs or videos</strong> of the damage (close-up and wider perspectives).</li>
              <li><strong>Receipts, invoices, or other records</strong> proving ownership and value of damaged items.</li>
              <li>Copies of invoices for <strong>repairs or emergency services</strong> used.</li>
              <li>Written <strong>estimates</strong> from licensed contractors for structural damage.</li>
              <li>Proof of ownership (e.g., receipts, warranty cards, prior photographs).</li>
            </ul>

            <h3>4. Mitigation Efforts</h3>
            <p>You are responsible for taking reasonable steps to prevent additional damage.</p>
            <ul>
              <li>Describe the <strong>specific actions taken to mitigate the situation</strong> (e.g., shutting off water, boarding up windows).</li>
              <li>Provide <strong>documentation</strong> of these efforts (receipts from service providers, confirmation of temporary repairs).</li>
              <li>Claims that fail to demonstrate adequate mitigation may be subject to coverage limitations.</li>
            </ul>

            <h3>5. Inventory of Damaged or Lost Property</h3>
            <p>General statements like “furniture damaged” are insufficient and may result in rejection.</p>
            <ul>
              <li>Provide a <strong>detailed inventory</strong> for each item damaged, destroyed, or stolen.</li>
              <li>Include the <strong>make, model, brand, approximate purchase date, and condition</strong> prior to the loss.</li>
              <li>Include the <strong>estimated replacement or repair cost</strong> along with supporting documentation (receipts, online price listings, or contractor estimates).</li>
            </ul>
          </>
        ),
        requirement: "Inventory of Damaged/Lost Property",
      }
  }
}