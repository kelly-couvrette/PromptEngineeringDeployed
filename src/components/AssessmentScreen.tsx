"use client" // UNGUIDED

import { useState } from "react" // Keep useState only for the prompt
import type { InstructionType } from "../types"
import { getInstructionContent } from "../utils/instructions" // Assuming it is defined here
import "./AssessmentScreen.css"

// --- PlaceholderInput Definition ---
interface PlaceholderInputProps {
    label: string; 
    placeholder: string; 
    isTextArea?: boolean; 
    isTarget?: boolean;
}

const PlaceholderInput: React.FC<PlaceholderInputProps> = ({ label, isTextArea = false, isTarget = false }) => {
    const classes = ['placeholder-input-box'];
    if (isTextArea) classes.push('placeholder-input-textarea');
    if (isTarget) classes.push('placeholder-input-target');

    return (
        <div className="placeholder-input-container">
            <label className="placeholder-input-label">{label}</label>
            <div className={classes.join(' ')}>
                <span className="placeholder-text">Enter text here...</span>
            </div>
        </div>
    );
};
// -----------------------------------

// --- Instruction Data and Type Definitions ---
interface InstructionDetails {
    title: string; // The primary title for the task (Y)
    sectionX: string; // The section/category name (X)
    fieldZ: string; // The specific field name (Z)
    placeholder: string; // Placeholder text for the target field
    description: string; // The full description for the left panel (will be generated)
}

const instructionData: Record<InstructionType, InstructionDetails> = {
    "police-report": {
        title: "Police Incident Report",
        sectionX: "Incident",
        fieldZ: "Incident Description",
        placeholder: "Provide a detailed chronological account of the incident...",
        description: "", 
    },
    "recipe-blog": {
        title: "Recipe Blog Post",
        sectionX: "Ingredients",
        fieldZ: "Ingredients List/Amounts",
        placeholder: "List all ingredients and their corresponding amounts (e.g., 2 cups flour, 1 tsp salt)...",
        description: "",
    },
    "job-experience": {
        title: "Professional Experience Form",
        sectionX: "Relevant Experience",
        fieldZ: "Relevant Experience",
        placeholder: "Describe your professional roles and key accomplishments relevant to this position...",
        description: "",
    },
    "insurance-claim": {
        title: "Insurance Claim Form",
        sectionX: "Inventory of Damaged/Lost Property",
        fieldZ: "Inventory of Damaged/Lost Property",
        placeholder: "List each item damaged or lost, including estimated value and date of purchase...",
        description: "",
    },
};
// ------------------------------------------------

// // --- getInstructionContent Function (FIXED to include dynamic description) ---
const getInstructionContent2 = (type: InstructionType | string): InstructionDetails => {
    const defaultData: InstructionDetails = {
        title: "Error: Unknown or Loading Instruction",
        sectionX: "N/A",
        fieldZ: "N/A",
        placeholder: "Error...",
        description: "Error: Unknown or invalid instruction type provided.",
    };

    const data = instructionData[type as InstructionType] || defaultData;
    
    // 💡 RE-INCORPORATED THE FULL DYNAMIC DESCRIPTION LOGIC:
    const dynamicDescription = `You are responsible for providing AI validation instructions for one of the text fields in the form on the right. Specifically, these instructions are for the open-ended text field within the **red box**. This field falls under the "**${data.sectionX}**" section of a **${data.title.toLowerCase().replace(' form', '').replace(' report', '')}**, the field is labeled as "**${data.fieldZ}**". The requirements for this section of the form are given on the following screen. Note that not all the instructions provided apply to this particular field (some instructions provide guidance for other fields of the form). You should provide validation instructions for the AI that focuses only on the "**${data.fieldZ}**" field.`;
    
    // Return the data structure with the dynamic description populated
    return { ...data, description: dynamicDescription };
};
// -----------------------------------------------------

interface AssessmentScreenProps {
  instruction: InstructionType
  onComplete: (prompt: string) => void
}

export default function AssessmentScreen({ instruction, onComplete }: AssessmentScreenProps) {
  // ... state and handlesubmit ...
  const [prompt, setPrompt] = useState("") 

  const handleSubmit = () => {
    if (prompt.trim()) {
      onComplete(prompt)
    }
  }
  // ...

  const instructionContent = getInstructionContent(instruction)
  const instructionContent2 = getInstructionContent2(instruction)

  return (
    <div className="assessment-screen">
      <div className="split-panel"> 
        
        <div className="left-panel"> 
          <div className="panel-content">
            <h2>{instructionContent.title}</h2>
<div className="instruction-text">{instructionContent.content}</div>
</div>
        </div>
        <div className="right-panel">
          <div className="panel-content">
            {/* 🎯 TARGET INPUT 🎯 */}
            <div className="form-section-target">
                <h3 className="section-title">
                    {instructionContent2.sectionX}
                </h3>
                
                {/* THE TARGET FIELD */}
                <PlaceholderInput 
                    label={instructionContent2.fieldZ} 
                    placeholder="Enter text here..."
                    isTextArea 
                    isTarget 
                />
            </div>
            
            <h2>Write an AI validation prompt for the above input field</h2>
            <textarea
              className="prompt-input"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter your AI validation prompt here..."
            />
            <button className="submit-button" onClick={handleSubmit} disabled={!prompt.trim()}>
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}