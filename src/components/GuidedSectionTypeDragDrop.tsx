"use client"

import { useState } from "react"
import type { InstructionType } from "../types"
import { getInstructionContent } from "../utils/instructions"
import "./GuidedSection.css" // Keep if needed for general layout styles

// Define the quality levels and map them to their corresponding labels
type PromptQuality = "good" | "medium" | "bad"
const QualityOptions: { value: PromptQuality | ""; label: string }[] = [
  { value: "", label: "Select Quality..." },
  { value: "good", label: "Good" },
  { value: "medium", label: "Medium" },
  { value: "bad", label: "Bad" },
]

interface GuidedSectionTypeSelectProps {
  instruction: InstructionType
  onComplete: (data: Record<string, string>) => void
}

const examplePrompts = [
  {
    id: "good",
    text: "Validate that all required fields are filled: name, date, location, and description. Check that the date is in MM/DD/YYYY format and the description is at least 50 characters.",
    quality: "good" as PromptQuality, // Explicitly set type
  },
  {
    id: "medium",
    text: "Verify the name, date, and description fields are present, and make sure the description is long enough.",
    quality: "medium" as PromptQuality,
  },
  {
    id: "bad",
    text: "Make sure everything looks good.",
    quality: "bad" as PromptQuality,
  },
]

export default function GuidedSectionTypeSelect({ instruction, onComplete }: GuidedSectionTypeSelectProps) {
  const [step, setStep] = useState(1)
  // State to hold the user's selected quality for each prompt ID
  const [userSelections, setUserSelections] = useState<Record<string, PromptQuality | "">>({
    good: "",
    medium: "",
    bad: "",
  })
  const [userPrompt, setUserPrompt] = useState("")

  // --- Handlers ---
  
  const handleSelectionChange = (id: string, value: PromptQuality | "") => {
    setUserSelections(prev => ({ ...prev, [id]: value }))
  }

  const handleNextStep = () => {
    if (step === 1) {
      setStep(2)
    } else if (step === 2) {
      setStep(3)
    } else {
      onComplete({
        // Capture the user's own prompt and the text of the "good" example
        goodPromptExample: examplePrompts.find((p) => p.quality === "good")?.text || "",
        userPrompt,
        ...userSelections, // Optionally pass the user's selections from step 1
      })
    }
  }
  
  // --- Validation ---

  const instructionContent = getInstructionContent(instruction)
  
  // Check if ALL prompts have been selected AND if the selections are correct
  const isStep1Valid = examplePrompts.every(prompt => 
    userSelections[prompt.id] === prompt.quality
  )
  const isStep3Valid = userPrompt.trim().length > 0

  const goodPromptText = examplePrompts.find((p) => p.quality === "good")?.text
  const mediumPromptText = examplePrompts.find((p) => p.quality === "medium")?.text
  
  // --- Rendering ---

  return (
    <div className="guided-section">
      <div className="section-header">
        <h1>Validation Prompt Exercise - Step {step} of 3</h1>
        <p className="section-subtitle">Learn what makes a good validation prompt</p>
      </div>
      <div className="split-panel">
        <div className="left-panel">
          <div className="panel-content">
            <h2>{instructionContent.title}</h2>
            <div className="instruction-text">{instructionContent.content}</div>
          </div>
        </div>

        <div className="right-panel">
          <div className="panel-content">
            {step === 1 ? (
              <>
                <h2>Classify the Validation Prompts</h2>
                <p className="field-description">
                  Use the dropdowns to classify each prompt as **Good**, **Medium**, or **Bad**.
                </p>

                <div className="prompt-classification-container">
                  {examplePrompts.map((prompt) => (
                    <div key={prompt.id} className="prompt-row">
                      <div className="prompt-text">
                        **Prompt:** {prompt.text}
                      </div>
                      <select
                        value={userSelections[prompt.id]}
                        onChange={(e) => handleSelectionChange(prompt.id, e.target.value as PromptQuality | "")}
                        className={`quality-select ${userSelections[prompt.id] && userSelections[prompt.id] !== prompt.quality ? "incorrect" : ""}`}
                      >
                        {QualityOptions.map(option => (
                          <option key={option.value} value={option.value} disabled={option.value === ""}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      {/* Optional: Show feedback if selection is made and incorrect */}
                      {userSelections[prompt.id] !== "" && userSelections[prompt.id] !== prompt.quality && (
                          <span className="feedback incorrect-text">❌ Incorrect</span>
                      )}
                      {userSelections[prompt.id] === prompt.quality && (
                          <span className="feedback correct-text">✅ Correct</span>
                      )}
                    </div>
                  ))}
                </div>
                
                <button className="submit-button" onClick={handleNextStep} disabled={!isStep1Valid}>
                  Next
                </button>
              </>
            ) : step === 2 ? (
              <>
                <h2>Why These Prompts Have Different Qualities</h2>
                
                <div className="explanation-section">
                    <h3>🟢 Good Prompt:</h3>
                    <div className="good-prompt-display">
                        <p>**"{goodPromptText}"**</p>
                    </div>
                    <ul>
                      <li>**Specific Fields:** Specifies *exactly* which fields to validate (name, date, location, description).</li>
                      <li>**Specific Format/Criteria:** Includes specific format requirements (MM/DD/YYYY) and clear criteria (min. 50 characters).</li>
                    </ul>

                    <h3>🟡 Medium Prompt:</h3>
                    <div className="medium-prompt-display">
                        <p>**"{mediumPromptText}"**</p>
                    </div>
                    <ul>
                      <li>**Some Specificity:** Lists some fields (name, date, description).</li>
                      <li>**Vague Criteria:** Uses vague language like "long enough" instead of a specific number of characters.</li>
                    </ul>

                    <h3>🔴 Bad Prompt:</h3>
                    <div className="bad-prompt-display">
                        <p>**"Make sure everything looks good."**</p>
                    </div>
                    <ul>
                      <li>**Zero Specificity:** No mention of fields, formats, or criteria. Completely ambiguous.</li>
                    </ul>
                </div>
                
                <button className="submit-button" onClick={handleNextStep}>
                  Next
                </button>
              </>
            ) : (
              <>
                <h2>Write Your Own Validation Prompt</h2>
                <p className="field-description">
                  Now that you've learned what makes a good validation prompt, write your own for the scenario on the
                  left, making sure it is **specific and actionable**:
                </p>

                <div className="form-group">
                  <label htmlFor="userPrompt">Your Validation Prompt</label>
                  <textarea
                    id="userPrompt"
                    className="form-textarea"
                    value={userPrompt}
                    onChange={(e) => setUserPrompt(e.target.value)}
                    placeholder="Write a specific, actionable validation prompt (e.g., 'Check for X, Y, and Z fields, ensure Z is in A format...')"
                    rows={6}
                  />
                </div>

                <button className="submit-button" onClick={handleNextStep} disabled={!isStep3Valid}>
                  Finish
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}