"use client"

import { useState, useEffect, useRef } from "react"
import AgreementScreen from "./components/AgreementScreen"
import DemographicsScreen from "./components/DemographicsScreen"
import AssessmentScreen from "./components/AssessmentScreen"
import GuidedSectionTypeCopyPaste from "./components/GuidedSectionTypeCopyPaste"
// import GuidedSectionTypeDragDrop from "./components/GuidedSectionTypeDragDrop"
import InstructionIntroScreen from "./components/InstructionIntroScreen"
import type { UserData, InstructionType, GuidedSectionType } from "./types"
import { saveToCSV } from "./utils/csvExport"

// The new flow has 4 scenarios, each with 3 screens: Intro, Unguided, Guided.
// Total non-intro/demographics screens: 4 scenarios * 3 screens/scenario = 12 screens
// Overall screen flow: 0(Agreement), 1(Demographics), 2-13(Scenarios), 14(Thank You)
const TOTAL_SCENARIOS = 4;
const SCREENS_PER_SCENARIO = 3;

type GuidedDataWithTimes = Record<string, string> & {
    guided_step1_time: number;
    guided_step2_time: number;
    guided_step3_time: number;
}

// Helper to determine the instruction index based on the current screen number
const getScenarioIndex = (screen: number) => Math.floor((screen - 2) / SCREENS_PER_SCENARIO);

// Define a type for the time logs
type TimeLog = {
  instructionTime: number | null;
  unguidedTime: number | null;
  guidedTime: number | null;
};

function App() {
  // Current screen index
  const [currentScreen, setCurrentScreen] = useState(0)
  
  // Ref to track when the current screen started (time in milliseconds)
  const screenEntryTimeRef = useRef(Date.now());
  
  // NEW STATE: Array to store the time spent on each screen for all 4 scenarios
  const [scenarioTimeLogs, setScenarioTimeLogs] = useState<TimeLog[]>([]);

  const [userData, setUserData] = useState<UserData>({
    agreed: false,
    experienceWithAI: "",
  frequencyOfUse: "",
  promptConfidence: "",
  writingAbility: "",
  usedModels: "",
  scenarioResults: [], // Will store { instruction, unguidedPrompt, guidedData } for each
  })

  // Instructions are still randomized and cover 4 scenarios:
  const [instructionOrder, setInstructionOrder] = useState<InstructionType[]>([])

  // State for temporary storage during a scenario
  const [currentUnguidedPrompt, setCurrentUnguidedPrompt] = useState<string>("")
  
  useEffect(() => {
    // Randomize instruction order when app loads (4 scenarios needed)
    const instructions: InstructionType[] = ["police-report", "recipe-blog", "job-experience", "insurance-claim"]
    const shuffled = [...instructions].sort(() => Math.random() - 0.5)
    setInstructionOrder(shuffled)
  }, [])

  // NEW useEffect: Time tracking logic
  useEffect(() => {
    // 1. Record the entry time for the NEW screen
    screenEntryTimeRef.current = Date.now();
    
    // 2. Initialize the scenarioTimeLogs array if it's the first time entering a scenario
    // This runs once when the app is initialized with 0 entries, and we expect 4
    if (instructionOrder.length > 0 && scenarioTimeLogs.length === 0) {
      setScenarioTimeLogs(
        Array(TOTAL_SCENARIOS).fill(null).map(() => ({
          instructionTime: null,
          unguidedTime: null,
          guidedTime: null,
        }))
      );
    }

  }, [currentScreen, instructionOrder.length])


  const handleNext = () => {
    setCurrentScreen((prev) => prev + 1)
  }
  
  // --- Handlers ---
  
  /**
   * Calculates the time spent on the PREVIOUS screen and updates the scenarioTimeLogs.
   * NOTE: This helper is only used for screens 2 through 13.
   * @param screen The index of the screen that was just completed (currentScreen before handleNext)
   * @param timeKey The key in the TimeLog object to update (e.g., 'instructionTime')
   */
  const logScreenTime = (screen: number, timeKey: keyof TimeLog) => {
    // Calculate duration in seconds
    const durationMs = Date.now() - screenEntryTimeRef.current;
    const durationSeconds = Math.round(durationMs / 1000); // Round to nearest second

    // Determine the scenario index that was just completed
    // Note: The first two screens (0, 1) are handled separately if needed, this focuses on scenarios
    const scenarioIndex = getScenarioIndex(screen);

    if (scenarioIndex < TOTAL_SCENARIOS) {
      setScenarioTimeLogs(prevLogs => {
        const newLogs = [...prevLogs];
        // Ensure the log object exists and update the specific time key
        newLogs[scenarioIndex] = {
          ...(newLogs[scenarioIndex] || {}), // Ensure existing object is merged
          [timeKey]: durationSeconds,
        };
        return newLogs;
      });
    }
  }


  const handleAgreementComplete = () => {
    setUserData((prev) => ({ ...prev, agreed: true }))
    handleNext() // -> Screen 1: Demographics
  }

  const handleDemographicsComplete = (
  experience: string,
  frequency: string,
  promptConfidence: string,
  writingAbility: string,
  usedModels: string
) => {
  setUserData((prev) => ({
    ...prev,
    experienceWithAI: experience,
    frequencyOfUse: frequency,
    promptConfidence,
    writingAbility,
    usedModels,
  }))

  handleNext() // -> Scenario 0 Intro
}

  
  const handleIntroComplete = () => {
    // Current screen is e.g. 2, 5, 8, 11
    logScreenTime(currentScreen, 'instructionTime'); 
    handleNext() // Moves from Instruction Intro to Unguided Assessment
  }

  // Completes the Unguided Assessment for the current scenario
  const handleUnguidedAssessmentComplete = (prompt: string) => {
    // Current screen is e.g. 3, 6, 9, 12
    logScreenTime(currentScreen, 'unguidedTime'); 
    setCurrentUnguidedPrompt(prompt);
    handleNext(); // -> Guided Section (Copy/Paste)
  }
  
// Inside App.tsx

// Completes the Guided Section for the current scenario
const handleGuidedSectionComplete = (guidedData: Record<string, string | number>) => {   
    // logScreenTime(currentScreen, 'guidedTime'); 
const scenarioIndex = getScenarioIndex(currentScreen);
    const instruction = instructionOrder[scenarioIndex];
    const timeLog = scenarioTimeLogs[scenarioIndex] || {}; 

    // CAST the incoming data to the expected shape
    const finalGuidedData = guidedData as GuidedDataWithTimes;

    const newScenarioResult = {
        instruction: instruction,
        unguidedPrompt: currentUnguidedPrompt,
        guidedType: "copy-paste" as GuidedSectionType,
        guidedData: finalGuidedData, // Store the full object, including data AND step times
        instructionTime: timeLog.instructionTime,
        unguidedTime: timeLog.unguidedTime,
        // REMOVE the old guidedTime property here
        // guidedTime: timeLog.guidedTime, 
    };
    
    // 1. Calculate the updated array immediately
    const updatedScenarioResults = [...userData.scenarioResults, newScenarioResult];

    // 2. Set the state with the new result array
    setUserData((prev) => ({
        ...prev,
        scenarioResults: updatedScenarioResults,
    }));
    
    // 3. Check if all scenarios are complete
    // ... inside App.tsx where you process updatedScenarioResults
if (scenarioIndex === TOTAL_SCENARIOS - 1) {
    const flatDataForExport = {
        'agreed': userData.agreed ? "Yes" : "No",
        'experienceWithAI': userData.experienceWithAI,
        'frequencyOfUse': userData.frequencyOfUse,
        'promptConfidence': userData.promptConfidence,
        'writingAbility': userData.writingAbility,
        'usedModels': userData.usedModels,
        
        ...updatedScenarioResults.reduce((acc, scenario, index) => {
            const prefix = `SCENARIO_${index + 1}_`;
            const gData = scenario.guidedData; // This comes from your GuidedSection component
            
            // Core Scenario Info
            acc[`${prefix}INSTRUCTION`] = scenario.instruction;
            acc[`${prefix}INSTRUCTION_TIME`] = scenario.instructionTime;
            acc[`${prefix}UN_PROMPT`] = scenario.unguidedPrompt;
            acc[`${prefix}UN_PROMPT_TIME`] = scenario.unguidedTime;

            // Guided Step Data (Updated for your new flow)
            // Step 1: The individual requirements joined by &
            acc[`${prefix}G_DETAILS`] = gData.guided_details_combined; 
            
            // Step 2: The formatting examples
            acc[`${prefix}G_AI_FULL_EX`] = gData.ai_response_full_example;
            acc[`${prefix}G_AI_MISS_EX`] = gData.ai_response_missing_example;

            // Step 3: The NEW big editable block
            acc[`${prefix}G_FINAL_PROMPT`] = gData.combined_editable_content;

            // Step Timing
            acc[`${prefix}GUIDED_1_TIME`] = gData.guided_step1_time; 
            acc[`${prefix}GUIDED_2_TIME`] = gData.guided_step2_time; 
            acc[`${prefix}GUIDED_3_TIME`] = gData.guided_step3_time; 

            return acc;
        }, {} as Record<string, any>),
    };

    saveToCSV(flatDataForExport);
    setCurrentScreen(14);
} else {
        // ... (rest of the else block)
        setCurrentUnguidedPrompt(""); 
        handleNext(); 
    }
}
  
  // Renders the appropriate component based on the current screen index
  const renderCurrentScreen = () => {
    // Initial Screens
    if (currentScreen === 0) return <AgreementScreen onAgree={handleAgreementComplete} />;
    if (currentScreen === 1) return <DemographicsScreen onComplete={handleDemographicsComplete} />;

    // Thank You Screen
    if (currentScreen === 14) {
      return (
        <div style={{ padding: 50, textAlign: 'center' }}>
          <h2 style={{ fontSize: '2rem', color: '#13437b' }}>✅ Study Complete!</h2>
          <p style={{ fontSize: '1.2rem', marginTop: '1rem' }}>Thank you for your valuable participation. Your data has been successfully saved.</p>
        </div>
      );
    }
    
    // Scenarios (Screens 2 through 13)
    const scenarioIndex = getScenarioIndex(currentScreen);
    if (scenarioIndex >= TOTAL_SCENARIOS || instructionOrder.length === 0) {
      // Should not happen if logic is correct, but a safeguard
      return <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}>Error: Invalid Screen or Instructions Missing.</div>;
    }
    
    const instruction = instructionOrder[scenarioIndex];
    const screenWithinScenario = (currentScreen - 2) % SCREENS_PER_SCENARIO;

    switch (screenWithinScenario) {
      case 0: // Instruction Intro Page (e.g., Screen 2, 5, 8, 11)
        return (
          <InstructionIntroScreen
            instruction={instruction}
            // isUnguided is no longer needed/relevant for the intro since both unguided and guided follow
            // isUnguided={false} // Use false or remove if the component doesn't need it
            onComplete={handleIntroComplete} 
          />
        );
      case 1: // Unguided Assessment Page (e.g., Screen 3, 6, 9, 12)
        return (
          <AssessmentScreen 
            instruction={instruction} 
            onComplete={handleUnguidedAssessmentComplete} 
          />
        );
      case 2: // Guided (Copy/Paste) Page (e.g., Screen 4, 7, 10, 13)
        return (
          <GuidedSectionTypeCopyPaste
            instruction={instruction}
            onComplete={handleGuidedSectionComplete}
          />
        );
      default:
        return <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}>Loading...</div>;
    }
  }

  if (instructionOrder.length === 0) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}>Loading...</div>
    )
  }

  return <>{renderCurrentScreen()}</>;
}

export default App