# User Data Gathering Application

A Tauri-wrapped React application for collecting user data through a structured questionnaire flow.



## Development

### Prerequisites

- Node.js (v16 or higher)
- Rust (latest stable)
- Tauri CLI

### Setup

npm install
npm run tauri dev


### Building

npm run tauri build

# if npm run deploy doesn't work: Run this from the project root
npm run build; cd dist; git init; git add .; git commit -m "Manual Deploy"; git push -f [https://github.com/kelly-couvrette/PromptEngineeringDeployed.git](https://github.com/kelly-couvrette/PromptEngineeringDeployed.git) master:gh-pages; cd ..