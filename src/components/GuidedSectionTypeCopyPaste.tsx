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
  // State for dynamic details and the next available ID
  const [details, setDetails] = useState<Item[]>(initialDetails)
  const [detailIdCounter, setDetailIdCounter] = useState(4)
  const [aggregateInput, setAggregateInput] = useState("")
  const [heuristics, setHeuristics] = useState<Item[]>([{ id: 1, value: "" }]); // Step 2 content
  const [heuristicIdCounter, setHeuristicIdCounter] = useState(2);  
  // NEW state for Step 3: AI Response Formatting
  const [fullExample, setFullExample] = useState("");
  const [missingExample, setMissingExample] = useState("");
const stepEntryTimeRef = useRef(Date.now());
  // NEW: State to store the time spent on each step
  const [stepTimes, setStepTimes] = useState<{ step1: number | null, step2: number | null, step3: number | null }>({
    step1: null,
    step2: null,
    step3: null,
  });
useEffect(() => {
    // Reset the timer when the step changes
    stepEntryTimeRef.current = Date.now();
  }, [step]);
const logStepTime = (completedStep: 1 | 2 | 3) => {
    const durationMs = Date.now() - stepEntryTimeRef.current;
    const durationSeconds = Math.round(durationMs / 1000); // Round to nearest second
    
    setStepTimes(prev => ({
      ...prev,
      [`step${completedStep}`]: durationSeconds
    }));
    return durationSeconds; // Return for immediate use in final completion
  };

  const handleDetailChange = (id: number, value: string) => {
    setDetails((prevDetails) =>
      prevDetails.map((detail) => (detail.id === id ? { ...detail, value } : detail))
    )
  }
  const handleHeuristicChange = (id: number, value: string) => {
    setHeuristics(prev =>
      prev.map(h => h.id === id ? { ...h, value } : h)
    );
  };


  const handleAddDetail = () => {
    const newId = detailIdCounter
    setDetailIdCounter((prev) => prev + 1)
    setDetails((prevDetails) => [...prevDetails, { id: newId, value: "" }])
  }
  const handleAddHeuristic = () => {
    const newId = heuristicIdCounter;
    setHeuristicIdCounter(prev => prev + 1);
    setHeuristics(prev => [...prev, { id: newId, value: "" }]);
  };


  const handleRemoveDetail = (id: number) => {
    // Ensure we don't remove the last remaining detail
    if (details.length > 1) {
      setDetails((prevDetails) => prevDetails.filter((detail) => detail.id !== id))
    }
  }
  const handleRemoveHeuristic = (id: number) => {
    if (heuristics.length > 1) {
      setHeuristics(prev => prev.filter(h => h.id !== id));
    }
  };

  

  const handleNextStep = () => {
    if (step === 1) {
      // 1. LOG TIME
      logStepTime(1); 

      // Aggregate existing details
      const aggregate = details.map(d => d.value).join("\n");
      setAggregateInput(aggregate);

      // RESET heuristics for step 2
      setHeuristics([{ id: 1, value: "" }]);
      setHeuristicIdCounter(2);

      setStep(2);
    } else if (step === 2) {
      // 1. LOG TIME
      logStepTime(2); 
      
      // RESET examples for step 3
      setFullExample("");
      setMissingExample("");

      setStep(3);
    } else if (step === 3) {
      // 1. LOG TIME & retrieve the final time for step 3
      const step3Time = logStepTime(3); 
      
      // Consolidate text data
      const detailsCombined = details
            .map(d => d.value.trim())
            .filter(v => v.length > 0)
            .join(" & ");

      const heuristicsCombined = heuristics
            .map(h => h.value.trim())
            .filter(v => v.length > 0)
            .join(" & ");

      // We must pass ALL data needed for App.tsx to save the CSV, 
      // including the three step times from the stepTimes state + the final step 3 time.
      const finalData = {
          // Data fields
          guided_details_combined: detailsCombined,
          guided_heuristics_combined: heuristicsCombined,
          guided_aggregate_prompt: aggregateInput,
          ai_response_full_example: fullExample,
          ai_response_missing_example: missingExample,
          // NEW Time fields. We use stepTimes for step 1 & 2 (which are set by logStepTime)
          // and step3Time for step 3 (for immediate use)
          guided_step1_time: stepTimes.step1!, // Use ! as we assume they are set by now
          guided_step2_time: stepTimes.step2!,
          guided_step3_time: step3Time,
      };

      // Pass the simplified data back to App.tsx
      onComplete(finalData as Record<string, string | number>);

    }
  }

  const instructionContent = getInstructionContent(instruction)
  // Check if ALL currently visible detail fields are filled
  const isStep1Valid = details.every(d => d.value.trim().length > 0)
  const isStep2Valid = heuristics.every(d => d.value.trim().length > 0)
  const isStep3Valid = fullExample.trim().length > 0 && missingExample.trim().length > 0;

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
          {/* NOTE: Left panel shows the instructions, and remains constant */}
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
                          aria-label={`Remove detail ${index + 1}`}
                        >
                          &times;
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                <button 
                  type="button" 
                  className="add-button" 
                  onClick={handleAddDetail}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-plus">
                    <path d="M5 12h14" /><path d="M12 5v14" />
                  </svg>
                  Add Another Requirement
                </button>

                <button className="submit-button" onClick={handleNextStep} disabled={!isStep1Valid}>
                  Next: Add Instructions
                </button>
              </>
            )}

            {step === 2 && (
              <>
                <h2>Additional Instructions</h2>
                <p className="field-description">
                    Beyond the requirements you extracted on the previous page, are there any additional instructions you would like to provide the AI regarding how you want the contents of that field to be evaluated and validated?
                </p>

                {heuristics.map((heuristic, index) => (
                    <div key={heuristic.id} className="form-group detail-input-group">
                        <label htmlFor={`heuristic-${heuristic.id}`}>Additional Instruction {index + 1}</label>
                        <div className="input-with-remove">
                        <input
                            id={`heuristic-${heuristic.id}`}
                            type="text"
                            className="form-input"
                            value={heuristic.value}
                            onChange={(e) => handleHeuristicChange(heuristic.id, e.target.value)}
                            placeholder={`Enter Instruction ${index + 1}...`}
                        />
                        {heuristics.length > 1 && (
                            <button
                            type="button"
                            className="remove-button"
                            onClick={() => handleRemoveHeuristic(heuristic.id)}
                            aria-label={`Remove Instruction ${index + 1}`}
                            >
                            &times;
                            </button>
                        )}
                        </div>
                    </div>
                    ))}


                <button 
                  type="button" 
                  className="add-button" 
                  onClick={handleAddHeuristic}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-plus">
                    <path d="M5 12h14" /><path d="M12 5v14" />
                  </svg>
                  Add Another Instruction
                </button>

                <button className="submit-button" onClick={handleNextStep} disabled={!isStep2Valid}>
                  Next: AI Response Formatting
                </button>
              </>
            )}

            {step === 3 && (
              <>
                <h2>AI Response Formatting</h2>
                <p className="field-description">
                  Provide examples of how the AI should format its final output based on the input data.
                </p>

                <div className="form-group">
                  <label htmlFor="fullExample">
                    Provide an example of how you would like the AI output to look when all of the content entered into this form field is accurate.
                  </label>
                  <textarea
                    id="fullExample"
                    className="form-input textarea"
                    rows={6}
                    value={fullExample}
                    onChange={(e) => setFullExample(e.target.value)}
                    placeholder="Example of an AI response for a successful, compliant user input..."
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="missingExample">
                    Provide an example of how you would like the AI output to look when some of the required information is missing.
                  </label>
                  <textarea
                    id="missingExample"
                    className="form-input textarea"
                    rows={6}
                    value={missingExample}
                    onChange={(e) => setMissingExample(e.target.value)}
                    placeholder="Example of an AI response for invalid user input with missing information..."
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