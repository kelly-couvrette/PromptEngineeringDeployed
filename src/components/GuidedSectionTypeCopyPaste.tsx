"use client"

import { useState, useRef, useEffect } from "react"
import type { InstructionType } from "../types"
import { getInstructionContent } from "../utils/instructions"
import "./GuidedSection.css"

interface Item { 
  id: number; 
  value: string;
}

interface GuidedSectionTypeCopyPasteProps {
  instruction: InstructionType
  onComplete: (data: Record<string, string | number>) => void
}

const initialDetails: Item[] = [
  { id: 1, value: "" },
  { id: 2, value: "" },
  { id: 3, value: "" },
];

export default function GuidedSectionTypeCopyPaste({ instruction, onComplete }: GuidedSectionTypeCopyPasteProps) {
  const [step, setStep] = useState(1)
  const [details, setDetails] = useState<Item[]>(initialDetails)
  const [detailIdCounter, setDetailIdCounter] = useState(4)
  const [fullExample, setFullExample] = useState("");
  const [missingExample, setMissingExample] = useState("");
  // Step 3 state: The final combined string that the user can edit
  const [finalEditableString, setFinalEditableString] = useState("");

  const stepEntryTimeRef = useRef(Date.now());
  const [stepTimes, setStepTimes] = useState<{ step1: number | null, step2: number | null, step3: number | null }>({
    step1: null,
    step2: null,
    step3: null,
  });

  useEffect(() => {
    stepEntryTimeRef.current = Date.now();
  }, [step]);

  const logStepTime = (completedStep: 1 | 2 | 3) => {
    const durationMs = Date.now() - stepEntryTimeRef.current;
    const durationSeconds = Math.round(durationMs / 1000);
    
    setStepTimes(prev => ({
      ...prev,
      [`step${completedStep}`]: durationSeconds
    }));
    return durationSeconds;
  };

  const handleDetailChange = (id: number, value: string) => {
    setDetails((prevDetails) =>
      prevDetails.map((detail) => (detail.id === id ? { ...detail, value } : detail))
    )
  }

  const handleAddDetail = () => {
    const newId = detailIdCounter
    setDetailIdCounter((prev) => prev + 1)
    setDetails((prevDetails) => [...prevDetails, { id: newId, value: "" }])
  }

  const handleRemoveDetail = (id: number) => {
    if (details.length > 1) {
      setDetails((prevDetails) => prevDetails.filter((detail) => detail.id !== id))
    }
  }

  const handleNextStep = () => {
    if (step === 1) {
      logStepTime(1); 
      setStep(2);
    } else if (step === 2) {
      logStepTime(2); 
      
      // Construct the initial combined string for Step 3
      const detailsCombined = details
        .map(d => d.value.trim())
        .filter(v => v.length > 0)
        .join("\n- ");

      const combinedContent = `REQUIREMENTS:\n- ${detailsCombined}\n\nAI RESPONSE FORMATTING (SUCCESS):\n${fullExample}\n\nAI RESPONSE FORMATTING (MISSING):\n${missingExample}`;
      
      setFinalEditableString(combinedContent);
      setStep(3);
    } else if (step === 3) {
      const step3Time = logStepTime(3); 
      
      const finalData = {
          combined_editable_content: finalEditableString,
          ai_response_full_example: fullExample,
          ai_response_missing_example: missingExample,
          guided_step1_time: stepTimes.step1!,
          guided_step2_time: stepTimes.step2!,
          guided_step3_time: step3Time,
      };

      onComplete(finalData as Record<string, string | number>);
    }
  }

  const instructionContent = getInstructionContent(instruction)
  const isStep1Valid = details.every(d => d.value.trim().length > 0)
  const isStep2Valid = fullExample.trim().length > 0 && missingExample.trim().length > 0;
  const isStep3Valid = finalEditableString.trim().length > 0;

  return (
    <div className="guided-section">
      <div className="section-header">
        <h1>Copy & Paste Exercise - Step {step} of 3</h1>
        <p className="section-subtitle">Learn how to include important information</p>
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
            {step === 1 && (
              <>
                <h2>Extract Key Information</h2>
                <p className="field-description">
                  Refer to the instructions on the left and extract the requirements for the {instructionContent.requirement} input field.
                </p>

                {details.map((detail, index) => (
                  <div key={detail.id} className="form-group detail-input-group">
                    <label htmlFor={`detail-${detail.id}`}>Requirement {index + 1}</label>
                    <div className="input-with-remove">
                      <input
                        id={`detail-${detail.id}`}
                        type="text"
                        className="form-input"
                        value={detail.value}
                        onChange={(e) => handleDetailChange(detail.id, e.target.value)}
                        placeholder={`Enter Requirement ${index + 1}...`}
                      />
                      {details.length > 1 && (
                        <button 
                          type="button" 
                          className="remove-button" 
                          onClick={() => handleRemoveDetail(detail.id)}
                        >
                          &times;
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                <button type="button" className="add-button" onClick={handleAddDetail}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M12 5v14" /></svg>
                  Add Another Requirement
                </button>

                <button className="submit-button" onClick={handleNextStep} disabled={!isStep1Valid}>
                  Next: AI Response Formatting
                </button>
              </>
            )}

            {step === 2 && (
              <>
                <h2>AI Response Formatting</h2>
                <p className="field-description">
                  Provide examples of how the AI should format its final output based on the input data.
                </p>

                <div className="form-group">
                  <label htmlFor="fullExample">Success Output Example</label>
                  <textarea
                    id="fullExample"
                    className="form-input textarea"
                    rows={5}
                    value={fullExample}
                    onChange={(e) => setFullExample(e.target.value)}
                    placeholder="How the AI responds when everything is correct..."
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="missingExample">Missing Info Output Example</label>
                  <textarea
                    id="missingExample"
                    className="form-input textarea"
                    rows={5}
                    value={missingExample}
                    onChange={(e) => setMissingExample(e.target.value)}
                    placeholder="How the AI responds when info is missing..."
                  />
                </div>

                <button className="submit-button" onClick={handleNextStep} disabled={!isStep2Valid}>
                  Next: Review & Edit
                </button>
              </>
            )}

            {step === 3 && (
              <>
                <h2>Final Review</h2>
                <p className="field-description">
                  Review and refine your combined requirements and formatting instructions before finishing.
                </p>

                <div className="form-group">
                  <textarea
                    id="finalEditable"
                    className="form-input textarea"
                    style={{ minHeight: '300px', fontSize: '14px', lineHeight: '1.5' }}
                    value={finalEditableString}
                    onChange={(e) => setFinalEditableString(e.target.value)}
                  />
                </div>

                <button className="submit-button" onClick={handleNextStep} disabled={!isStep3Valid}>
                  Complete Exercise
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}