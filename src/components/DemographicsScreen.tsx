"use client"

import { useState } from "react"
import "./DemographicsScreen.css"

interface DemographicsScreenProps {
  onComplete: (
    experience: string,
    frequency: string,
    promptConfidence: string,
    writingAbility: string,
    usedModels: string
  ) => void
}

const questions = [
  {
    id: "experience",
    label: "How experienced are you with using AI chatbots (e.g., ChatGPT, Claude, Gemini, Copilot)?",
    type: "select",
    options: [
      "0 conversations",
      "1-10 conversations",
      "11-50 conversations",
      "50-100 conversations",
      "101+ conversations",
    ],
  },
  {
    id: "frequency",
    label: "How often do you use AI chatbots in a typical week?",
    type: "select",
    options: [
      "Never",
      "Less than once per week",
      "1-3 times per week",
      "4-10 times per week",
      "More than 10 times per week",
    ],
  },
  {
    id: "promptConfidence",
    label: "How confident are you in your ability to write an effective AI prompt? (1 = No confidence, 10 = Extremely confident)",
    type: "select",
    options: Array.from({ length: 10 }, (_, i) => `${i + 1}`),
  },
  {
    id: "writingAbility",
    label: "How would you rate your general writing ability? (1–10, with 5 being average)",
    type: "select",
    options: Array.from({ length: 10 }, (_, i) => `${i + 1}`),
  },
  {
    id: "usedModels",
    label: "To the best of your memory, list all the AI companies, services, and large language models (LLMs) you have used.",
    type: "textarea",
  },
]

export default function DemographicsScreen({ onComplete }: DemographicsScreenProps) {
  const [answers, setAnswers] = useState({
    experience: "",
    frequency: "",
    promptConfidence: "",
    writingAbility: "",
    usedModels: "",
  })

  const [step, setStep] = useState(0)
  const q = questions[step]

  const updateAnswer = (value: string) => {
    setAnswers((prev) => ({ ...prev, [q.id]: value }))
  }

  const handleNext = () => {
    if (step < questions.length - 1) {
      setStep(step + 1)
    } else {
      // Final completion → pass answers out
      onComplete(
        answers.experience,
        answers.frequency,
        answers.promptConfidence,
        answers.writingAbility,
        answers.usedModels
      )
    }
  }

  const isValid = answers[q.id as keyof typeof answers] !== ""

  return (
    <div className="demographics-screen">
      <div className="demographics-content">
        <h1>Background Questions</h1>
        <p className="demographics-subtitle">
          Please answer the following questions about your experience
        </p>

        <div className="question-group">
          <label>{q.label}</label>

          {q.type === "select" && (
            <select
              className="demographics-select"
              value={answers[q.id as keyof typeof answers]}
              onChange={(e) => updateAnswer(e.target.value)}
            >
              <option value="">Select an option</option>
              {q.options?.map((option: string) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          )}

          {q.type === "textarea" && (
            <textarea
              className="demographics-select"
              style={{ minHeight: "120px" }}
              value={answers[q.id as keyof typeof answers]}
              onChange={(e) => updateAnswer(e.target.value)}
            />
          )}
        </div>

        <button className="next-button" onClick={handleNext} disabled={!isValid}>
          {step === questions.length - 1 ? "Finish" : "Next"}
        </button>
      </div>
    </div>
  )
}
