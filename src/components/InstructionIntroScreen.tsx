import React from 'react';

// Define the InstructionType for type safety
type InstructionType = "police-report" | "recipe-blog" | "job-experience" | "insurance-claim";

// Define a structure for the specific instruction data (X, Y, Z)
interface InstructionDetails {
    title: string; // The primary title for the task (Y)
    sectionX: string; // The section/category name (X)
    fieldZ: string; // The specific field name (Z)
    placeholder: string; // Placeholder text for the target field
    description: string; // The full description for the left panel
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

// Function to construct the full instruction content, including the generated description
const getInstructionContent = (type: InstructionType | string): InstructionDetails => {
    const defaultData: InstructionDetails = {
        title: "Error: Unknown or Loading Instruction",
        sectionX: "N/A",
        fieldZ: "N/A",
        placeholder: "Error...",
        description: "Error: Unknown or invalid instruction type provided.",
    };

    const data = instructionData[type as InstructionType] || defaultData;
    
    // Construct the dynamic description text
    const dynamicDescription = `You are responsible for providing AI validation instructions for one of the text fields in the form on the right. Specifically, these instructions are for the open-ended text field within the **red box**. This field falls under the "**${data.sectionX}**" section of a **${data.title.toLowerCase().replace(' form', '').replace(' report', '')}**, the field is labeled as "**${data.fieldZ}**". The requirements for this section of the form are given on the following screen. Note that not all the instructions provided apply to this particular field (some instructions provide guidance for other fields of the form). You should provide validation instructions for the AI that focuses only on the "**${data.fieldZ}**" field.`;
    
    return { ...data, description: dynamicDescription };
};

// --- END DATA/LOGIC SETUP ---

interface InstructionIntroScreenProps {
    instruction: InstructionType | string | null | undefined; 
    onComplete: () => void;
}

/**
 * Renders a placeholder input field (non-functional visual element)
 */
const PlaceholderInput: React.FC<{
    label: string; 
    placeholder: string; 
    isTextArea?: boolean; 
    isTarget?: boolean;
}> = ({ label, isTextArea = false, isTarget = false }) => {
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


const InstructionIntroScreen: React.FC<InstructionIntroScreenProps> = ({ instruction, onComplete }) => {
    // 1. Safety Check/Loading
    if (!instruction) {
        return (
            <div className="loading-screen">
                <p className="loading-message">Loading study instructions...</p>
            </div>
        );
    }
    
    // 2. Get Instruction Data
    const data = getInstructionContent(instruction);

    // 3. Define Section Type/Headers


    return (
        <div className="instruction-screen-wrapper">
            {/* Header Area */}
            <div className="header-container">
                <h1 className="header-title">Validation Instructions</h1>
                <hr className="header-separator" />
            </div>

            {/* Main Content: Dual Panel Layout */}
            <div className="main-content">
                
                {/* Left Panel: Detailed Instructions */}
                <div className="panel left-panel">
                    <h2 className="panel-title">
                        Task Instructions: <span className="task-name">{data.title}</span>
                    </h2>
                    <p className="instruction-description" dangerouslySetInnerHTML={{ __html: data.description.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                    
                    <div className="instruction-note-box">
                        <p className="instruction-note-title">
                            The following screen will provide the detailed requirements for this task.
                        </p>
                        <p className="instruction-note-subtitle">
                            Your goal is to turn those requirements into clear AI validation instructions for the highlighted field.
                        </p>
                    </div>

                    <button
                        onClick={onComplete}
                        className="start-button"
                    >
                        Start Section
                    </button>
                </div>
                
                {/* Right Panel: Placeholder Form */}
                <div className="panel right-panel">
                    <h2 className="form-preview-title">
                        {data.title} Preview
                    </h2>
                    
                    <div className="form-section form-section-identification">
                        <h3 className="section-title">IDENTIFICATION</h3>
                        
                        <div className="grid grid-2-col">
                            <PlaceholderInput label="Full Name" placeholder="Jane A. Doe" />
                            <PlaceholderInput label="Date of Submission" placeholder="YYYY-MM-DD" />
                            <PlaceholderInput label="Phone" placeholder="(555) 555-5555" />
                            <PlaceholderInput label="Email" placeholder="user@example.com" />
                        </div>
                    </div>

                    <div className="form-section-target">
                        <h3 className="section-title">
                            {data.sectionX}
                        </h3>
                        
                        {/* THE TARGET FIELD */}
                        <PlaceholderInput 
                            label={data.fieldZ} 
                            placeholder="Enter text here... "
                            isTextArea 
                            isTarget 
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InstructionIntroScreen;