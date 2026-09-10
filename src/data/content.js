// ============================================================
//  Portfolio content — single source of truth
//  Swap placeholder image paths in /public/photos when ready.
// ============================================================

export const profile = {
  name: "Vajeeda Shaik",
  title: "AI/ML & Cloud Engineer",
  tagline:
    "I build production ML systems, cloud-native data pipelines, and multi-agent RL environments — designing for scale, fault isolation, and reliability.",
  location: "Chennai, India",
  email: "vajeeda.mastan@gmail.com",
  phone: "+91 9042965067",
  github: "https://github.com/vajeedashaik",
  linkedin: "https://www.linkedin.com/in/vajeeda-shaik-344774279",
  resumeUrl: "/Vajeeda_Resume.pdf",
  introVideo: "/intro.mp4",
};

export const about = {
  photo: "/photos/about.jpg",
  // Auto-advancing slideshow next to the intro. Any file that 404s is skipped,
  // so it works with 1 photo now and 5 once you drop the rest into public/photos/.
  slides: [
    { src: "/photos/about.jpg", caption: "" },
    { src: "/photos/slide-2.jpg", caption: "Speaking on pair programming — Agile Network India" },
    { src: "/photos/slide-3.jpg", caption: "Presenting ReNotify — IFQM MSME Symposium, SRM" },
    { src: "/photos/slide-4.jpg", caption: "OpenEnv × Scaler AI Hackathon" },
  ],
  slideIntervalMs: 5000,
  body: [
    "I'm a Computer Science Engineering student at SRM Institute of Science and Technology (KTR), specializing in Cloud Computing (CGPA 8.56). My work sits where machine learning meets infrastructure: I ship ML models as one layer inside containerized, event-driven systems on AWS, Azure, and GCP.",
    "Across internships and projects I've processed 2.9M+ property records, automated 8,500+ documents through OCR pipelines, and built multi-agent reinforcement learning systems for emergency dispatch and structured debate. I was a National Hackathon Finalist at the Meta × HuggingFace × PyTorch hackathon and presented traffic-prediction research at IEEE ICAFT 2025.",
  ],
  stats: [
    { value: "2.9M+", label: "records engineered" },
    { value: "8,500+", label: "documents automated" },
    { value: "94%", label: "OCR field accuracy" },
    { value: "Finalist", label: "Meta × HF × PyTorch" },
  ],
};

// Each item: { n: label, i?: devicon class fragment }. No `i` -> plain text chip.
export const skills = [
  {
    group: "Cloud",
    note: "Lambda · Cloud Run · S3 · SQS · SNS · Step Functions · CloudWatch · BigQuery · Cloud Functions · Cloud Storage",
    items: [
      { n: "AWS", i: "amazonwebservices-plain-wordmark" },
      { n: "Azure", i: "azure-plain" },
      { n: "Google Cloud", i: "googlecloud-plain" },
      { n: "Serverless" },
      { n: "Event-Driven Architecture" },
      { n: "Microservices" },
    ],
  },
  {
    group: "Languages",
    items: [
      { n: "Python", i: "python-plain" },
      { n: "JavaScript", i: "javascript-plain" },
      { n: "Java", i: "java-plain" },
      { n: "SQL / T-SQL", i: "azuresqldatabase-plain" },
      { n: "Bash", i: "bash-plain" },
    ],
  },
  {
    group: "Machine Learning & Data",
    items: [
      { n: "PyTorch", i: "pytorch-original" },
      { n: "scikit-learn", i: "scikitlearn-plain" },
      { n: "Pandas", i: "pandas-plain" },
      { n: "NumPy", i: "numpy-plain" },
      { n: "Apache Spark", i: "apachespark-original" },
      { n: "OpenCV", i: "opencv-plain" },
      { n: "Jupyter", i: "jupyter-plain" },
      { n: "XGBoost · LightGBM · CatBoost" },
      { n: "Multi-Agent RL · GRPO" },
      { n: "Transformers" },
      { n: "Explainable AI" },
      { n: "Feature Engineering" },
    ],
  },
  {
    group: "Backend & Data Stores",
    items: [
      { n: "FastAPI", i: "fastapi-plain" },
      { n: "Node.js", i: "nodejs-plain" },
      { n: "PostgreSQL", i: "postgresql-plain" },
      { n: "MySQL", i: "mysql-original" },
      { n: "SQL Server", i: "microsoftsqlserver-plain" },
      { n: "Supabase", i: "supabase-plain" },
      { n: "Firestore", i: "firebase-plain" },
      { n: "REST APIs" },
      { n: "OAuth 2.0" },
    ],
  },
  {
    group: "DevOps & Web",
    items: [
      { n: "Docker", i: "docker-plain" },
      { n: "Git", i: "git-plain" },
      { n: "GitHub", i: "github-original" },
      { n: "React", i: "react-original" },
      { n: "Tailwind CSS", i: "tailwindcss-original" },
      { n: "HTML5", i: "html5-plain" },
      { n: "CSS3", i: "css3-plain" },
      { n: "Streamlit", i: "streamlit-plain" },
      { n: "CI/CD" },
    ],
  },
];

export const experience = [
  {
    company: "IntoAEC",
    role: "Software Engineering Intern",
    period: "Dec 2025 – Jan 2026",
    project: "CrisisCore — emergency response coordination platform",
    points: [
      "Designed and deployed a fault-isolated microservices architecture: independently containerized (Docker) FastAPI services for allocation, ingestion, and notification, communicating over event-driven REST APIs so one component's outage never stalled dispatch.",
      "Built the allocation service around a multi-agent reinforcement learning model that scored and assigned response units across simultaneous incidents in real time, re-allocating automatically as new incident data streamed in.",
      "Cut average dispatch decision time 38% (15.4 min → 9.6 min) across 500+ simulated incidents by replacing manual triage with the RL-driven allocation service.",
    ],
  },
  {
    company: "Lean Impeccable Technologies",
    role: "AI Solutions Intern",
    period: "May 2024 – Aug 2024",
    project: "PriceLens — property valuation error-correction model",
    points: [
      "Deployed a stacked ensemble (XGBoost, LightGBM, CatBoost, Ridge) into the team's existing AWS pipeline, integrating it with production data flows serving 2.9M+ property records.",
      "Automated recurring model retraining through CI/CD — Optuna tuning and 5-fold cross-validation on each run — removing manual redeployment from the release cycle.",
      "Achieved 0.0742 RMSE, a 19% improvement over the single-model XGBoost baseline (0.0916).",
    ],
  },
];

export const achievements = [
  {
    title: "National Hackathon Finalist — Meta × HuggingFace × PyTorch",
    detail: "Selected as a finalist for MetaDebate, an OpenEnv-compliant multi-agent RL debate environment.",
    year: "2025",
  },
  {
    title: "IEEE ICAFT 2025 — Conference Presenter",
    detail:
      'Presented "Real-Time Traffic Prediction and Route Optimization Framework Using XATBoost Algorithm."',
    year: "2025",
  },
  {
    title: "ReNotify — Top project, SRM",
    detail: "Selected among ~7,000 student applicants at SRM; showcased at the IFQM MSME Symposium.",
    year: "2025",
  },
  {
    title: "Co-Speaker — Agile Network India",
    detail: "Spoke on pair programming and collaborative engineering practices.",
    year: "2025",
  },
  {
    title: "Certifications",
    detail: "AWS Certified Solutions Architect – Associate · Google Cloud Digital Leader",
    year: "",
  },
  {
    title: "Leadership",
    detail: "HR Officer @ YUCI · Tech Member @ NWC & IoT Alliance · ACM SIGAPP Management Team",
    year: "",
  },
];

export const education = {
  school: "SRM Institute of Science and Technology (KTR)",
  degree: "B.Tech, Computer Science Engineering (Cloud Computing)",
  period: "2023 – Present",
  cgpa: "8.56",
  coursework:
    "Data Structures & Algorithms · DBMS · Machine Learning · Cloud Computing · Operating Systems",
};

// ---------- PROJECTS ----------
// featured: shown large + full detail page. secondary: compact detail page.

export const projects = [
  {
    slug: "pricelens",
    name: "PriceLens",
    aka: "Zillow Zestimate error-correction",
    featured: true,
    year: "2024",
    blurb:
      "End-to-end data + ML pipeline on 2.9M property records. Stacked ensemble beats the single-model baseline by 19%.",
    tags: ["AWS", "GCP", "XGBoost", "LightGBM", "CatBoost", "Optuna", "CI/CD"],
    links: [{ label: "Live demo", href: "https://zillow-zestimate.vercel.app/" }],
    metrics: [
      { value: "2.9M+", label: "property records" },
      { value: "0.0742", label: "CV RMSE" },
      { value: "19%", label: "vs. XGBoost baseline" },
    ],
    problem:
      "The team's baseline Zestimate predictions carried enough error to affect pricing calls on high-value listings, and no system existed to correct for it.",
    approach: [
      "Engineered an end-to-end pipeline on 2.9M records: preprocessing, validation, transformation, and leakage-safe feature engineering.",
      "Evaluated Ridge, ExtraTrees, XGBoost, LightGBM, and CatBoost, then combined four models into a tuned stacked ensemble.",
      "Automated recurring retraining through CI/CD with Optuna tuning and 5-fold cross-validation on each run.",
      "Ran automated batch processing, cloud orchestration, monitoring, and logging across AWS/GCP.",
    ],
    result:
      "0.0742 CV RMSE — a 19% improvement over the single-model XGBoost baseline (0.0916), validated by 5-fold cross-validation.",
    stack: ["Python", "Pandas", "Scikit-learn", "XGBoost", "LightGBM", "CatBoost", "Optuna", "AWS", "GCP", "CI/CD"],
  },
  {
    slug: "renotify",
    name: "ReNotify",
    aka: "Cloud-native document processing pipeline",
    featured: true,
    year: "2025",
    blurb:
      "Event-driven OCR pipeline on GCP that turns messy Gmail bills and warranties into structured data and automated reminders.",
    tags: ["GCP", "Cloud Vision OCR", "Gmail API", "OAuth 2.0", "Serverless", "PostgreSQL"],
    links: [
      { label: "Live site", href: "https://renotify.online/" },
    ],
    metrics: [
      { value: "8,500+", label: "documents processed" },
      { value: "94%", label: "field-level accuracy" },
      { value: "70%", label: "less manual tracking" },
    ],
    problem:
      "Bills and warranties arrive as unstructured PDFs and photos in Gmail — inconsistent layouts, low scan quality, and no ground truth for what correct extraction looks like.",
    approach: [
      "Designed and deployed an event-driven ingestion pipeline on GCP: serverless functions orchestrating Cloud Vision OCR and persisting parsed results to PostgreSQL/Supabase.",
      "Integrated the Gmail API with OAuth 2.0 and user-level access controls for secure, per-user document ingestion.",
      "Evaluated extraction quality against a manually labeled ground-truth set, tracking field-level precision and recall.",
      "Hardened the pipeline against blurry scans, rotated pages, and multi-column receipts through iterative preprocessing.",
      "Extracted structured entities, classified dates, and automated renewal reminders.",
    ],
    result:
      "94% field-level extraction accuracy across 8,500+ processed documents and a 70% drop in manual bill-tracking effort. Selected among ~7,000 SRM student applicants and showcased at the IFQM MSME Symposium.",
    stack: ["Python", "GCP Cloud Functions", "Cloud Vision API", "Gmail API", "OAuth 2.0", "PostgreSQL", "Supabase", "REST APIs"],
  },
  {
    slug: "metadebate",
    name: "MetaDebate",
    aka: "Meta × HuggingFace × PyTorch — National Hackathon Finalist",
    featured: true,
    year: "2025",
    blurb:
      "Multi-agent RL environment testing whether GRPO-trained policies debate more coherently than a rule-based agent. 58% win rate.",
    tags: ["PyTorch", "GRPO", "Multi-Agent RL", "Transformers", "OpenEnv", "HuggingFace"],
    links: [{ label: "GitHub", href: "https://github.com/vajeedashaik/MetaDebate" }],
    metrics: [
      { value: "58%", label: "win rate vs. baseline" },
      { value: "200", label: "round-robin matches" },
      { value: "Finalist", label: "national hackathon" },
    ],
    problem:
      "Test whether reinforcement learning could shape more coherent, on-topic debate strategies than a fixed, rule-based agent.",
    approach: [
      "Implemented an OpenEnv-compliant multi-agent training environment on the Hugging Face ecosystem.",
      "Fine-tuned agent policies with GRPO on top of a pretrained transformer for structured LLM debate.",
      "Iterated the reward signal across repeated training runs to isolate components that generalized across debate topics.",
      "Evaluated trained agents against a rule-based baseline via round-robin matches.",
    ],
    result:
      "58% win rate against the rule-based baseline (vs. 50% at parity) across a 200-match round-robin evaluation — confirming the GRPO-trained policy generalized beyond its training topics. Selected as a national hackathon finalist.",
    stack: ["Python", "PyTorch", "Hugging Face", "OpenEnv", "GRPO", "Transformers"],
  },
  {
    slug: "urban-traffic",
    name: "Urban Traffic Congestion Prediction",
    aka: "IEEE ICAFT 2025 — published",
    featured: true,
    year: "2025",
    blurb:
      "End-to-end analytics + ML pipeline on 48K+ hourly sensor records. 93.69% accuracy, served over REST/MCP.",
    tags: ["Python", "Time Series", "Feature Engineering", "REST", "MCP", "IEEE"],
    links: [{ label: "GitHub", href: "https://github.com/vajeedashaik/Urban-Traffic-Congestion-Prediction" }],
    metrics: [
      { value: "48,000+", label: "sensor records" },
      { value: "93.69%", label: "accuracy" },
      { value: "0.9368", label: "weighted F1" },
    ],
    problem:
      "City mobility decisions needed reliable short-horizon congestion forecasts and route recommendations from raw hourly sensor data.",
    approach: [
      "Built an end-to-end data analytics and ML pipeline on 48,000+ hourly traffic sensor records.",
      "Applied data cleaning, temporal transformations, and lag / rolling-window features.",
      "Evaluated models and tuned for weighted F1 on imbalanced congestion classes.",
      "Exposed prediction and recommendation services through REST / MCP interfaces for downstream mobility apps.",
    ],
    result:
      "93.69% accuracy and 0.9368 weighted F1. Published and presented at IEEE ICAFT 2025 as \"Real-Time Traffic Prediction and Route Optimization Framework Using XATBoost Algorithm.\"",
    stack: ["Python", "Pandas", "Scikit-learn", "XGBoost", "REST APIs", "MCP"],
  },
  {
    slug: "crisiscore",
    name: "CrisisCore",
    aka: "Multi-agent RL emergency dispatch (IntoAEC)",
    featured: false,
    year: "2025",
    blurb:
      "Fault-isolated microservices with an RL allocation service. Cut dispatch decision time 38%.",
    tags: ["FastAPI", "Docker", "Multi-Agent RL", "Event-Driven", "Microservices"],
    links: [],
    metrics: [
      { value: "38%", label: "faster dispatch decisions" },
      { value: "500+", label: "simulated incidents" },
    ],
    problem:
      "During peak load, dispatchers manually assigned responders across overlapping incidents — often over 15 minutes to route the right unit to the right emergency.",
    approach: [
      "Designed a fault-isolated microservices architecture: independently containerized FastAPI services for allocation, ingestion, and notification over event-driven REST APIs.",
      "Built the allocation service around a multi-agent RL model that scored and assigned response units across simultaneous incidents in real time.",
      "Re-allocated automatically as new incident data streamed in, replacing static dispatch rules.",
    ],
    result:
      "38% cut in average dispatch decision time (15.4 min → 9.6 min) across 500+ simulated incidents.",
    stack: ["Python", "FastAPI", "Docker", "REST APIs", "Multi-Agent RL"],
  },
  {
    slug: "cattle-breed-classifier",
    name: "Cattle Breed Classifier",
    aka: "VGG16 — 41 Indian cattle & buffalo breeds",
    featured: false,
    year: "2024",
    blurb: "Transfer-learning image classifier for 41 Indian cattle and buffalo breeds.",
    tags: ["PyTorch", "VGG16", "Transfer Learning", "OpenCV", "Computer Vision"],
    links: [{ label: "Live demo", href: "https://cattle-breed-classifier-1rne.onrender.com/" }],
    metrics: [{ value: "41", label: "breed classes" }],
    problem:
      "Field identification of Indian cattle and buffalo breeds is manual and error-prone, with fine-grained visual differences between classes.",
    approach: [
      "Fine-tuned a VGG16 backbone with transfer learning on a 41-class breed dataset.",
      "Applied augmentation and preprocessing with OpenCV to handle varied lighting and pose.",
      "Deployed as a web app for single-image inference.",
    ],
    result: "A deployed classifier covering 41 Indian cattle and buffalo breeds.",
    stack: ["Python", "PyTorch", "VGG16", "OpenCV", "Streamlit"],
  },
  {
    slug: "groww-pulse",
    name: "Groww Pulse",
    aka: "Code by Groww",
    featured: false,
    year: "2025",
    blurb: "A markets / data web app built for the Code by Groww program.",
    tags: ["React", "Data Visualization", "Web App"],
    links: [{ label: "Live site", href: "https://code-by-groww.vercel.app/" }],
    metrics: [],
    problem: "Built for the Code by Groww 2025 program — a data-driven markets web experience.",
    approach: [
      "Designed and built the front end as a responsive React application.",
      "Focused on clear data presentation and a fast, lightweight UI.",
    ],
    result: "Deployed web app submitted for Code by Groww 2025.",
    stack: ["React", "JavaScript", "Vercel"],
  },
  {
    slug: "aixaec",
    name: "AIxAEC",
    aka: "Modular FastAPI backend platform",
    featured: false,
    year: "2025",
    blurb:
      "Modular Python/FastAPI backend with clean separation of application, data, and infrastructure.",
    tags: ["FastAPI", "PostgreSQL", "Docker", "Migrations", "Service Layer"],
    links: [{ label: "GitHub", href: "https://github.com/vajeedashaik/AIxAEC" }],
    metrics: [],
    problem:
      "Needed a maintainable backend foundation with clear boundaries between application logic, data, and infrastructure.",
    approach: [
      "Designed a modular Python/FastAPI backend using PostgreSQL, Docker, and database migrations.",
      "Used shared schemas, a service-layer architecture, and a test suite.",
      "Implemented structured API workflows with clear separation of concerns.",
    ],
    result: "A reusable, testable backend platform with well-defined module boundaries.",
    stack: ["Python", "FastAPI", "PostgreSQL", "Docker", "Pytest"],
  },
];

export const featuredProjects = projects.filter((p) => p.featured);
export const secondaryProjects = projects.filter((p) => !p.featured);
export const getProject = (slug) => projects.find((p) => p.slug === slug);
