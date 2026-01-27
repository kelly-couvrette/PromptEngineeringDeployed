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
  const [showIntro, setShowIntro] = useState(true); // Added for the intro screen
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

  // Format the list of requirements into a clean bulleted list
  const detailsList = details
    .map(d => d.value.trim())
    .filter(v => v.length > 0)
    .map(v => `- ${v}`) // Adds the bullet point here for consistency
    .join("\n");

  const combinedContent = `You are an AI assistant specialized in input validation. 

Your task is to check if the following requirements are met:
${detailsList}

GUIDELINES:
1. If ALL requirements are met, respond exactly with:
${fullExample}

2. If any requirements are missing, respond exactly with:
${missingExample}

Please analyze the input now.`;
  
  setFinalEditableString(combinedContent);
  setStep(3);
} else if (step === 3) {
      const step3Time = logStepTime(3); 
      
      // RE-CALCULATE or define the string here so it's in scope for finalData
      const detailsCombined = details
        .map(d => d.value.trim())
        .filter(v => v.length > 0)
        .join(" & "); // Using " & " as per your original CSV requirement

      const finalData = {
          guided_details_combined: detailsCombined,      // Requirements from Step 1
          ai_response_full_example: fullExample,         // Formatting from Step 2
          ai_response_missing_example: missingExample,   // Formatting from Step 2
          combined_editable_content: finalEditableString, // The big box from Step 3
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
if (showIntro) {
    return (
      <div className="demographics-screen">
        <div className="demographics-content">
          <h1>Method 2 - Guided</h1>
          
          <p className="demographics-subtitle" style={{ marginBottom: '2rem' }}>
            In this section, you will be asked to write an AI validation prompt with 
            <strong> step-by-step guidance</strong>. 
          </p>

          <div className="question-group">
            <label>The Process</label>
            <ul style={{ textAlign: 'left', fontSize: '14px', color: '#444', lineHeight: '1.8' }}>
              <li><strong>Step 1:</strong> Extract individual requirements from the source text.</li>
              <li><strong>Step 2:</strong> Define success and failure response formats.</li>
              <li><strong>Step 3:</strong> Review and refine the automatically generated prompt.</li>
            </ul>
          </div>

          <button 
            className="next-button" 
            onClick={() => setShowIntro(false)}
          >
            Start Guided Task
          </button>
        </div>
      </div>
    )
  }
  return (
    <div className="guided-section">
      <div className="section-header">
        <h1>Method 2 - Guided Prompt Creation</h1>
        <p className="section-subtitle">Step {step} of 3</p>
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
                  <label htmlFor="fullExample">Provide an example of how you would like the AI output to look when all of the content entered into this form field is accurate.</label>
                  <textarea
                    id="fullExample"
                    className="form-input textarea"
                    rows={5}
                    value={fullExample}
                    onChange={(e) => setFullExample(e.target.value)}
                    placeholder="e.g. 'VALID.'"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="missingExample">Provide an example of how you would like the AI output to look when some of the required information is missing.</label>
                  <textarea
                    id="missingExample"
                    className="form-input textarea"
                    rows={5}
                    value={missingExample}
                    onChange={(e) => setMissingExample(e.target.value)}
                    placeholder="e.g. 'INVALID. Entry is missing... [detailed missing requirements].'"
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