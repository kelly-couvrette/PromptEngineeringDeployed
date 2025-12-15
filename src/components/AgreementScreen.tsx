"use client"
import { useState } from "react"
import "./AgreementScreen.css"

interface AgreementScreenProps {
  onAgree: () => void
}

export default function AgreementScreen({ onAgree }: AgreementScreenProps) {
  const [step, setStep] = useState(1)
  // State for the password input
  const [password, setPassword] = useState("")
  // State for showing a password error message
  const [passwordError, setPasswordError] = useState(false)

  // Function to handle the click on the "Agree" button
  const handleAgreeClick = () => {
    // Check if the entered password matches the required password
    if (password === "PS3!") {
      setStep(2)
      setPasswordError(false) // Clear any previous error
    } else {
      setPasswordError(true) // Set error if password is wrong
    }
  }

  return (
    <div className="agreement-screen">
      <div className="agreement-content">

        {/* ---------------- STEP 1: CONSENT SCREEN ---------------- */}
        {step === 1 && (
          <>
            <h1>User Data Gathering Study</h1>
            <div className="agreement-text">
              <h2>Consent to Participate</h2>
              <p>
                Thank you for your interest in participating in this study. This application will collect data about your
                responses to various prompts and questions.
              </p>
              <p>
                Your participation is voluntary and you may withdraw at any time. The data collected will be used for
                research purposes only.
              </p>
              <p>
                By clicking "Agree" below, you consent to participate in this study and acknowledge that you understand the
                purpose of this data collection.
              </p>
            </div>

            {/* NEW: Password Input Field */}
            <div className="password-input-container">
              <label htmlFor="password">Enter Password</label>
              <input
                type="password" // Use type="password" to hide the input characters
                id="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  if (passwordError) setPasswordError(false) // Clear error on change
                }}
                className="password-input"
              />
              {/* NEW: Password Error Message */}
              {passwordError && (
                <p className="password-error">
                  Incorrect password. Please try again.
                </p>
              )}
            </div>

            <button className="agree-button" onClick={handleAgreeClick}>
              Agree
            </button>
          </>
        )}

        {/* ---------------- STEP 2: INSTRUCTIONS SCREEN ---------------- */}
        {step === 2 && (
          <>
            <h1>Study Instructions</h1>
            <div className="agreement-text-1">
              <p>Thank you for taking part in this research study.</p>
              <p>
                In this study, you will be helping us understand how people create instructions for AI, and how well AI can
                use those instructions to evaluate entries in various forms and reports.
              </p>
              <p>
                Many forms include large text boxes meant for longer, open-ended responses. For example, a job application
                might have a box for typing a cover letter. A maintenance form might include a field labeled “Problem
                Description.” Sometimes these open-ended text fields come with instructions or requirements (for example:
                “Along with a description of the problem, include the date it was discovered and any troubleshooting steps
                taken”). Our goal is to develop better ways for AI systems to check whether responses to these fields are
                complete, clear, and meet their intended requirements.
              </p>
              <p>
                In the future, we hope to make it possible for anyone—regardless of their familiarity with AI—to write
                effective guidance that an AI system can use to validate form-field content. Before we can do that, we need
                to understand how people naturally write these instructions.
              </p>
              <p>
                During this brief study, you will be writing simple guidance that will later be used by an AI system to
                assess the quality of different types of form entries. Information about each specific task will be
                provided on the following screens. If you have any questions, please feel free to ask the assessment
                proctor at any time.
              </p>
            </div>

            <button className="agree-button" onClick={onAgree}>
              Continue
            </button>
          </>
        )}

      </div>
    </div>
  )
}