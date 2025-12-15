"use client"

import { useState } from "react"
import type { InstructionType } from "../types"
import { getInstructionContent } from "../utils/instructions"
import "./GuidedSection.css"

interface GuidedSectionProps {
  sectionIndex: number
  instruction: InstructionType
  onComplete: (data: Record<string, string>) => void
}

export default function GuidedSection({ sectionIndex, instruction, onComplete }: GuidedSectionProps) {
  const [formData, setFormData] = useState({
    input1: "",
    input2: "",
    textarea1: "",
    textarea2: "",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = () => {
    onComplete(formData)
  }

  const instructionContent = getInstructionContent(instruction)
  const isValid = Object.values(formData).every((val) => val.trim())

  return (
    <div className="guided-section">
      <div className="section-header">
        <h1>Guided Section {sectionIndex + 1} of 3</h1>
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
            <h2>Response Fields</h2>
            <p className="field-description">Please fill in all fields below (to be customized later)</p>

            <div className="form-group">
              <label htmlFor={`input1-${sectionIndex}`}>Input Field 1</label>
              <input
                id={`input1-${sectionIndex}`}
                type="text"
                className="form-input"
                value={formData.input1}
                onChange={(e) => handleInputChange("input1", e.target.value)}
                placeholder="Enter text..."
              />
            </div>

            <div className="form-group">
              <label htmlFor={`input2-${sectionIndex}`}>Input Field 2</label>
              <input
                id={`input2-${sectionIndex}`}
                type="text"
                className="form-input"
                value={formData.input2}
                onChange={(e) => handleInputChange("input2", e.target.value)}
                placeholder="Enter text..."
              />
            </div>

            <div className="form-group">
              <label htmlFor={`textarea1-${sectionIndex}`}>Text Area 1</label>
              <textarea
                id={`textarea1-${sectionIndex}`}
                className="form-textarea"
                value={formData.textarea1}
                onChange={(e) => handleInputChange("textarea1", e.target.value)}
                placeholder="Enter longer text..."
                rows={4}
              />
            </div>

            <div className="form-group">
              <label htmlFor={`textarea2-${sectionIndex}`}>Text Area 2</label>
              <textarea
                id={`textarea2-${sectionIndex}`}
                className="form-textarea"
                value={formData.textarea2}
                onChange={(e) => handleInputChange("textarea2", e.target.value)}
                placeholder="Enter longer text..."
                rows={4}
              />
            </div>

            <button className="submit-button" onClick={handleSubmit} disabled={!isValid}>
              {sectionIndex === 2 ? "Complete" : "Next"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
