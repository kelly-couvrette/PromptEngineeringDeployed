"use client"

import { useState } from "react"
import type { InstructionType } from "../types"
import { getInstructionContent } from "../utils/instructions"
import "./GuidedSection.css"

interface GuidedSectionTypeMultiShotProps {
  instruction: InstructionType
  onComplete: (data: Record<string, string>) => void
}

// Helper component for the color-coded guide and input
interface InputWithGuideProps {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  quality: "Good" | "Medium" | "Bad"
  scenarioTitle: string
}

const InputWithGuide: React.FC<InputWithGuideProps> = ({
  id,
  label,
  value,
  onChange,
  quality,
  scenarioTitle,
}) => {
  const colorMap: Record<"Good" | "Medium" | "Bad", string> = {
    Good: "guide-box-good", // Green
    Medium: "guide-box-medium", // Yellow
    Bad: "guide-box-bad", // Red
  }

  return (
    <div className="form-group">
      {/* The Guide Box */}
      <div className={`input-guide-box ${colorMap[quality]}`}>
        <p className="guide-box-text">
          <strong>{quality} User Input</strong> | {scenarioTitle}
        </p>
      </div>
      
      {/* Original Label and Input */}
      <label htmlFor={id}>{label}</label>
      <textarea
        id={id}
        className="form-textarea"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={`Enter your ${label.toLowerCase()} here...`}
        rows={3}
      />
    </div>
  )
}

export default function GuidedSectionTypeMultiShot({ instruction, onComplete }: GuidedSectionTypeMultiShotProps) {
  const [step, setStep] = useState(1)
  const [leftPanelExpanded, setLeftPanelExpanded] = useState(true)
  const [formData, setFormData] = useState({
    example1: "",
    example2: "",
    example3: "",
    newExample1: "",
    newExample2: "",
    newExample3: "",
    aggregateOutput: "",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleNextStep = () => {
    if (step === 1) {
      // Move to step 2 and auto-populate aggregate
      const aggregate = `Example 1: ${formData.example1}\n\nExample 2: ${formData.example2}\n\nExample 3: ${formData.example3}`
      setFormData((prev) => ({ ...prev, aggregateOutput: aggregate }))
      setStep(2)
      setLeftPanelExpanded(true)
    } else {
      onComplete(formData)
    }
  }

  const instructionContent = getInstructionContent(instruction)
  const isStep1Valid = formData.example1.trim() && formData.example2.trim() && formData.example3.trim()
  const isStep2Valid =
    formData.newExample1.trim() &&
    formData.newExample2.trim() &&
    formData.newExample3.trim() &&
    formData.aggregateOutput.trim()
  
  // Get the scenario title from the left panel content
  const scenarioTitle = instructionContent.title 

  return (
    <div className="guided-section">
      <div className="section-header">
        <h1>Multi-Shot Prompting Exercise - Step {step} of 2</h1>
        <p className="section-subtitle">Learn about providing multiple examples</p>
      </div>
      <div className={`split-panel ${leftPanelExpanded ? "left-expanded" : "right-expanded"}`}>
        <div className="left-panel" onClick={() => !leftPanelExpanded && setLeftPanelExpanded(true)}>
          <div className="panel-content">
            <h2>{scenarioTitle}</h2> {/* Use scenarioTitle here */}
            <div className="instruction-text">{instructionContent.content}</div>
          </div>
        </div>

        <div className="right-panel" onClick={() => leftPanelExpanded && setLeftPanelExpanded(false)}>
          <div className="panel-content">
            {step === 1 ? (
              <>
                <h2>Provide Multiple Examples</h2>
                <p className="field-description">
                  Multi-shot prompting means providing several examples. Follow the guidance in the colored boxes to create your examples:
                </p>

                {/* Example 1: Good Input */}
                <InputWithGuide
                    id="example1"
                    label="Example 1"
                    value={formData.example1}
                    onChange={(val) => handleInputChange("example1", val)}
                    quality="Good"
                    scenarioTitle={scenarioTitle}
                />

                <div className="multi-shot-separator">
                  <span>Then provide another example...</span>
                </div>

                {/* Example 2: Medium Input */}
                <InputWithGuide
                    id="example2"
                    label="Example 2"
                    value={formData.example2}
                    onChange={(val) => handleInputChange("example2", val)}
                    quality="Medium"
                    scenarioTitle={scenarioTitle}
                />

                <div className="multi-shot-separator">
                  <span>And one more example...</span>
                </div>

                {/* Example 3: Bad Input */}
                <InputWithGuide
                    id="example3"
                    label="Example 3"
                    value={formData.example3}
                    onChange={(val) => handleInputChange("example3", val)}
                    quality="Bad"
                    scenarioTitle={scenarioTitle}
                />

                <button className="submit-button" onClick={handleNextStep} disabled={!isStep1Valid}>
                  Next
                </button>
              </>
            ) : (
              // ... Step 2 remains the same
              <>
                <h2>Review and Extend Your Examples</h2>
                <p className="field-description">Here are your previous examples combined. Now add three more:</p>

                <div className="form-group">
                  <label htmlFor="aggregateOutput">Your Previous Examples</label>
                  <textarea
                    id="aggregateOutput"
                    className="form-textarea"
                    value={formData.aggregateOutput}
                    onChange={(e) => handleInputChange("aggregateOutput", e.target.value)}
                    rows={6}
                    readOnly 
                  />
                </div>

                <div className="multi-shot-separator">
                  <span>Now add three more examples below:</span>
                </div>

                <div className="form-group">
                  <label htmlFor="newExample1">New Example 1</label>
                  <textarea
                    id="newExample1"
                    className="form-textarea"
                    value={formData.newExample1}
                    onChange={(e) => handleInputChange("newExample1", e.target.value)}
                    placeholder="Enter another example..."
                    rows={3}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="newExample2">New Example 2</label>
                  <textarea
                    id="newExample2"
                    className="form-textarea"
                    value={formData.newExample2}
                    onChange={(e) => handleInputChange("newExample2", e.target.value)}
                    placeholder="Enter another example..."
                    rows={3}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="newExample3">New Example 3</label>
                  <textarea
                    id="newExample3"
                    className="form-textarea"
                    value={formData.newExample3}
                    onChange={(e) => handleInputChange("newExample3", e.target.value)}
                    placeholder="Enter another example..."
                    rows={3}
                  />
                </div>

                <button className="submit-button" onClick={handleNextStep} disabled={!isStep2Valid}>
                  Next
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}