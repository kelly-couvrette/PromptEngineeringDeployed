"use client"
import { useState } from "react"
import "./AgreementScreen.css"

interface AgreementScreenProps {
  onAgree: () => void
}

export default function AgreementScreen({ onAgree }: AgreementScreenProps) {
  const [step, setStep] = useState(1)

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

            <button className="agree-button" onClick={() => setStep(2)}>
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
