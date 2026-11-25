// ============================================================
//  Single source of truth for site copy.
//  Every number here comes from Project KnowledgeBase/*.md or
//  PERSONAL_PROFILE.md. `status` tags keep claims honest.
// ============================================================

export const profile = {
  name: "Shaik Vajeeda",
  first: "SHAIK",
  last: "VAJEEDA",
  role: "AI/ML Engineer",
  claim: ["I build AI systems that", "learn, argue, see", "and ship."],
  sub: "Multi-agent RL environments, LLM pipelines with guardrails, computer vision and ensemble models — taken from notebook to tested, cloud-deployed systems.",
  location: "Chennai, India",
  availability: "Open to AI/ML internships & new-grad roles",
  email: "vajeeda.mastan@gmail.com",
  github: "https://github.com/vajeedashaik",
  linkedin: "https://www.linkedin.com/in/vajeeda-shaik-344774279/",
  resume: "/Vajeeda_Resume.pdf",
  cutout: "/photos/cutout.webp",
};

export const paper = {
  title:
    "Real-Time Traffic Prediction and Route Optimization Framework Using XatBoost Algorithm",
  venue: "2025 1st International Conference on Advancement in Futuristic Technologies (ICAFT)",
  authors: "Shaik Vajeeda, Dharshini BJ, Neha Michael, Irfan Saleem, Banu Priya Prathaban",
  doi: "10.1109/ICAFT66710.2025.11453027",
  url: "https://ieeexplore.ieee.org/document/11453027",
};

// status: measured | counted | design | verified | award
export const proof = [
  { value: 93.69, decimals: 2, suffix: "%", label: "congestion-class accuracy on 48K hourly sensor records", status: "measured", tag: "IEEE ICAFT 2025" },
  { value: 0.0742, decimals: 4, label: "5-fold CV RMSE — 3-model stack + Ridge meta-learner over 2.9M properties", status: "measured", tag: "PriceLens" },
  { value: 70000, decimals: 0, suffix: "+", label: "participants in the Meta × Hugging Face × PyTorch hackathon — national finalist", status: "award", tag: "Finalist" },
  { value: 700, decimals: 0, suffix: "+", label: "automated tests across my AI systems (pytest + Vitest)", status: "counted", tag: "Engineering" },
  { value: 10, decimals: 0, label: "reward components + 3 anti-gaming rules in one RL environment", status: "design", tag: "MetaDebate" },
  { value: 8, decimals: 0, label: "AWS services wired and verified end-to-end for a CV pipeline", status: "verified", tag: "AEC AI Platform" },
];

export const projects = [
  {
    id: "metadebate",
    no: "01",
    name: "MetaDebate",
    kicker: "Multi-agent RL · LLM arbitration",
    line: "An RL environment where an LLM learns to referee a debate about how to fix a video script.",
    body: [
      "A Critic attacks the script with falsifiable claims, a Defender protects what already works, and the Arbitrator — the only trained policy — picks one fix. A Rewriter applies exactly that fix, then ten reward components score the result.",
      "Accepting every critique wrecks coherence; rejecting all stagnates. The reward is built so the only way to win is to reason about trade-offs, and an escalation engine writes harder scripts once a flaw class is mastered.",
    ],
    facts: [
      ["Agents", "4 (1 trained via GRPO)"],
      ["Rewards", "R1–R10 + process reward"],
      ["Anti-gaming", "hard-zero · drop guard · repetition"],
      ["Policy", "Qwen2.5-7B · LoRA r16 · TRL"],
    ],
    stack: ["GRPO", "TRL", "Unsloth", "Qwen2.5-7B", "sentence-transformers", "scikit-learn", "FastAPI", "OpenEnv", "Docker", "HF Spaces"],
    status: "Environment complete across 13 phases · full GRPO run queued for GPU",
    award: "Finale build · Meta × Hugging Face × PyTorch OpenEnv Hackathon",
    next: "Run the 200-step GRPO job on real compute and publish measured curves against the rule-based baseline.",
    links: [{ label: "GitHub", href: "https://github.com/vajeedashaik/MetaDebate" }],
    demo: "debate",
  },
  {
    id: "aec",
    no: "02",
    name: "AEC AI Platform",
    kicker: "Computer vision · LLM commands · AWS",
    line: "Upload a floor-plan image, get a typed building model, then edit it by talking to it.",
    body: [
      "An 8-stage OpenCV pipeline turns pixels into walls, rooms and openings. Natural-language edits are parsed into one of 8 typed commands, then validated — schema, entity resolution, semantics, constraints — before a deterministic Shapely engine touches geometry.",
      "The LLM never moves a wall. Ambiguity returns a clarification, not a guess. No calibrated scale means millimetre commands are refused. Every edit is an immutable version with O(1) undo.",
    ],
    facts: [
      ["Pipeline", "8 isolated CV stages"],
      ["Tests", "270 pytest + 65 Vitest"],
      ["Worker", "Lambda 6.5 s cold · 4.5 s warm"],
      ["Cloud", "Cognito · S3 · SQS · Lambda · RDS · CloudWatch"],
    ],
    stack: ["OpenCV", "Shapely", "FastAPI", "Pydantic v2", "SQLAlchemy", "PostgreSQL", "Next.js 16", "AWS Lambda", "SQS", "CloudWatch EMF"],
    status: "Built during my IntoAEC internship · verified on AWS (ap-south-1)",
    next: "Measure CV accuracy on real architectural drawings — so far only synthetic plans have been exercised.",
    links: [{ label: "GitHub", href: "https://github.com/vajeedashaik/AIxAEC" }],
    demo: "floorplan",
  },
  {
    id: "crisiscore",
    no: "03",
    name: "CrisisCore",
    kicker: "RL environment · agent hierarchy",
    line: "A partially-observable building-evacuation world for training emergency-response agents.",
    body: [
      "Each tick an agent sees a noisy slice of the building — occupancy, sensor smoke and sound, open exits — and must route people, dispatch services or set severity while hazards spread stochastically.",
      "An Orchestrator fans out to Evacuation, Dispatch and Comms agents in parallel; a 3-level curriculum promotes on a rolling reward window, and an incident log feeds past mistakes back into the prompt.",
    ],
    facts: [
      ["Tests", "258 passing"],
      ["Curriculum", "3 levels · promote at 0.7 mean"],
      ["Observation", "partial · sensor noise up to 15%"],
      ["Policy", "Qwen2.5-3B · GRPO script"],
    ],
    stack: ["Python", "FastAPI", "dataclasses", "BFS routing", "Unsloth", "TRL", "Docker", "pytest"],
    status: "Environment + API + dashboard shipped · training run not yet executed",
    next: "Unify the env and training rewards so GRPO scores the exact state each completion saw.",
    links: [{ label: "GitHub", href: "https://github.com/vajeedashaik/CrisisCore" }],
    demo: "evac",
  },
  {
    id: "metamod",
    no: "04",
    name: "MetaModEnv",
    kicker: "LLM evaluation · trust & safety",
    line: "A benchmark that puts an LLM in a content-moderation queue and grades every call it makes.",
    body: [
      "Three tasks escalate from obvious violations to satire, journalism and reclaimed language, then to adversarial evasion — leetspeak, emoji threats, coordinated brigading and disguised self-harm.",
      "Rewards are deliberately asymmetric: missing a self-harm escalation costs more than a false removal, which costs more than a missed violation. Ground truth is hidden twice, and the environment ships with an MCP server so agents can play it directly.",
    ],
    facts: [
      ["Tasks", "20 · 30 · 50 items"],
      ["Worst penalty", "missed escalation −0.25"],
      ["Interfaces", "REST · Gradio · MCP"],
      ["Data", "synthetic, seed 42"],
    ],
    stack: ["FastAPI", "Pydantic v2", "OpenEnv", "FastMCP", "Gradio", "uv", "Docker", "Qwen2.5-72B baseline"],
    status: "Round 1 build · same hackathon · deployed to a Hugging Face Space",
    next: "Price REQUEST_CONTEXT so it stops being a free skip, and add cross-language adversarial items.",
    links: [],
    demo: "moderation",
  },
  {
    id: "forgeml",
    no: "05",
    name: "ForgeML Traffic",
    kicker: "Published research · time-series ML · MCP",
    line: "Predicts I-94 congestion tiers from time, weather and recent traffic — and explains every call.",
    body: [
      "27 engineered features (cyclical time, rush-hour flags, leakage-safe lag and rolling windows) feed a HistGradientBoosting classifier that beat Random Forest and Extra Trees on weighted F1.",
      "A 4-agent pipeline turns each prediction into an operator action plan, and 4 MCP servers expose 22 tools so Claude can query the model in plain language. The surprise finding: all eight weather features together carry under 1% of the signal.",
    ],
    facts: [
      ["Accuracy", "93.69% · weighted F1 0.9368"],
      ["Data", "48,187 hourly records"],
      ["Inference", "1–3 ms on CPU"],
      ["MCP", "4 servers · 22 tools · 11 resources"],
    ],
    stack: ["scikit-learn", "HistGradientBoosting", "pandas", "Permutation importance", "Streamlit", "Plotly", "Folium", "FastMCP", "Docker"],
    status: "Published at IEEE ICAFT 2025 — first author",
    next: "Re-evaluate on a temporal split; the random stratified split flatters a forecasting task.",
    links: [
      { label: "IEEE paper", href: "https://ieeexplore.ieee.org/document/11453027" },
      { label: "GitHub", href: "https://github.com/vajeedashaik/Urban-Traffic-Congestion-Prediction" },
    ],
    demo: "traffic",
  },
  {
    id: "pricelens",
    no: "06",
    name: "PriceLens",
    kicker: "Ensemble learning · feature engineering",
    line: "Predicts where Zillow's Zestimate is wrong — and by how much — across 2.9M properties.",
    body: [
      "XGBoost, LightGBM and CatBoost are trained on out-of-fold splits, then a Ridge meta-model learns how to blend them. Twelve engineered features include KMeans geo-clusters and 5-fold target encoding that never sees its own fold.",
      "The stack beats every single model, and a chunked batch scorer writes per-county Parquet for all 2.9M parcels.",
    ],
    facts: [
      ["Best single", "LightGBM 0.0749 (Optuna)"],
      ["Stack", "0.0742 CV RMSE"],
      ["vs baseline", "−6.2% vs Ridge"],
      ["Features", "12 engineered · leakage-safe"],
    ],
    stack: ["XGBoost", "LightGBM", "CatBoost", "Optuna", "SHAP", "KMeans", "FastAPI", "Parquet", "AWS", "GCP"],
    status: "Model results from 5-fold CV · public demo runs a lightweight approximation",
    next: "Ship the real ensemble artifacts behind the live endpoint instead of the approximation formula.",
    links: [
      { label: "Live site", href: "https://zillow-zestimate.vercel.app/" },
      { label: "GitHub", href: "https://github.com/vajeedashaik/PriceLens-Zillow-Zestimate" },
    ],
    demo: "stack",
  },
];

export const moreWork = [
  {
    name: "BovineID",
    line: "VGG16 transfer learning for 41 Indian cattle & buffalo breeds, with 4-view test-time augmentation.",
    metric: "78.37%",
    metricLabel: "top-1 · 92.19% top-5",
    tags: ["TensorFlow", "VGG16", "TTA", "Flask"],
    href: "https://github.com/vajeedashaik/cattle-breed-classifier",
  },
  {
    name: "ConvoyMind",
    line: "4 onboard agents negotiate truck-convoy speed and spacing; an XGBoost fatigue model served via ONNX with a synthetic fallback.",
    metric: "R² 0.919",
    metricLabel: "fatigue model · synthetic data",
    tags: ["XGBoost", "ONNX", "FastAPI", "Simulation"],
  },
  {
    name: "ReNotify",
    line: "Gmail bills → Cloud Vision OCR → a 6-stage date extractor with an LLM fallback → automatic reminders.",
    metric: "6-stage",
    metricLabel: "date extraction pipeline",
    tags: ["Cloud Vision", "Claude Haiku", "OAuth 2.0", "Supabase"],
    href: "https://renotify.online/",
  },
];

export const experience = [
  {
    org: "IntoAEC",
    role: "AI / Software Engineering Intern",
    period: "Dec 2025 — Jan 2026",
    text: "Developed and validated an AI-powered computer-vision pipeline in Python that converts 2D floor plans into structured building models — image processing, geometry extraction and automated model generation.",
    link: "#aec",
  },
  {
    org: "Lean Impeccable Technologies",
    role: "AI / Digital Solutions Intern",
    period: "May 2024 — Aug 2024",
    text: "Translated requirements from US-based client stakeholders into an IoT platform integrating PostgreSQL, REST APIs, property-management APIs and LoRaWAN data for tenant, occupancy, unit and facility insights.",
  },
];

export const education = {
  school: "SRM Institute of Science & Technology, Kattankulathur",
  degree: "B.Tech, Computer Science & Engineering — Cloud Computing",
  period: "2023 — 2027",
  cgpa: "8.56",
};

export const recognition = [
  { k: "Publication", v: "IEEE ICAFT 2025 — first-author paper on real-time traffic prediction & route optimization", href: "https://ieeexplore.ieee.org/document/11453027" },
  { k: "Hackathon", v: "National finalist — Meta × Hugging Face × PyTorch, among 70,000+ participants" },
  { k: "Hackathon", v: "Tata Technologies InnoVent — second round, among 20,000+ projects" },
  { k: "Certification", v: "Microsoft Certified: Azure Administrator Associate (AZ-104)" },
  { k: "Certification", v: "Microsoft Certified: Azure Data Fundamentals (DP-900)" },
  { k: "Speaking", v: "Co-speaker, Agile Network India" },
  { k: "Leadership", v: "HR Officer @ YUCI · ACM SIGAPP management team · Tech member, NWC & IoT Alliance" },
];

// Skill graph: each skill lists the project ids that use it.
export const skillGroups = [
  {
    group: "Reinforcement learning",
    skills: [
      { n: "Environment design", p: ["metadebate", "crisiscore", "metamod"] },
      { n: "Reward shaping & anti-gaming", p: ["metadebate", "crisiscore", "metamod"] },
      { n: "GRPO · TRL · Unsloth", p: ["metadebate", "crisiscore"] },
      { n: "Curriculum & self-play", p: ["metadebate", "crisiscore"] },
    ],
  },
  {
    group: "LLM systems",
    skills: [
      { n: "Multi-agent orchestration", p: ["metadebate", "crisiscore", "forgeml"] },
      { n: "Structured outputs & validation", p: ["aec", "metadebate", "metamod"] },
      { n: "Evaluation & graders", p: ["metamod", "metadebate"] },
      { n: "MCP servers", p: ["forgeml", "metamod"] },
    ],
  },
  {
    group: "Classical & deep ML",
    skills: [
      { n: "Gradient boosting", p: ["pricelens", "forgeml"] },
      { n: "Stacking ensembles", p: ["pricelens"] },
      { n: "Feature engineering", p: ["pricelens", "forgeml"] },
      { n: "Embeddings & retention models", p: ["metadebate"] },
    ],
  },
  {
    group: "Computer vision",
    skills: [
      { n: "OpenCV pipelines", p: ["aec"] },
      { n: "Geometry (Shapely)", p: ["aec"] },
      { n: "Transfer learning", p: [] },
    ],
  },
  {
    group: "Shipping ML",
    skills: [
      { n: "FastAPI services", p: ["aec", "crisiscore", "metamod", "metadebate", "pricelens"] },
      { n: "AWS · GCP", p: ["aec", "pricelens"] },
      { n: "Docker · HF Spaces", p: ["metadebate", "crisiscore", "metamod", "forgeml"] },
      { n: "Testing (pytest · Vitest)", p: ["aec", "crisiscore", "metadebate"] },
    ],
  },
];
