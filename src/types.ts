// types.ts

export type InstructionType = "police-report" | "recipe-blog" | "job-experience" | "insurance-claim";
export type GuidedSectionType = "copy-paste" | "drag-drop" | "multi-shot"; 

export type GuidedSectionData = Record<string, string> & {
    guided_step1_time: number;
    guided_step2_time: number;
    guided_step3_time: number;
};

export type ScenarioResult = {
  instruction: InstructionType;
  unguidedPrompt: string;
  guidedType: GuidedSectionType;
  // UPDATE: Use the new GuidedSectionData type
  guidedData: GuidedSectionData; 
  instructionTime: number | null; 
  unguidedTime: number | null;    
  // REMOVE: The old guidedTime property
  // guidedTime: number | null;     
};

export interface GuidedSection { // Define the nested type if needed
    type: GuidedSectionType;
    instruction: InstructionType;
    data: Record<string, string>;
}


export interface UserData {
    // ------------------------------------
    // Fields actively used in the new flow
    // ------------------------------------
    agreed: boolean;
    experienceWithAI: string;
    frequencyOfUse: string;
    promptConfidence: string;
    writingAbility: string;
    usedModels: string;
    scenarioResults: ScenarioResult[];
    
    // ------------------------------------
    // Fields from the OLD flow (Keep them optional to match App.tsx state structure)
    // You MUST include these if they were in the previous UserData definition.
    // ------------------------------------
    assessmentInstruction?: InstructionType | null; 
    assessmentPrompt?: string;
    guidedSections?: GuidedSection[];
}