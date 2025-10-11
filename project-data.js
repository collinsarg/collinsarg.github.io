
// project-data.js
// Edit this file to add/update projects and image snapshots.

window.PROJECTS = {
  dsp: {
    slug: "dsp",
    title: "Amazon DSP Data Warehouse",
    summary:
      "SQL Server schema (dsp.Associate, dsp.Itineraries, etc.), Python ingestion with Pandas + pyodbc, \
and performance dashboards for fleet operations.",
    details: [
      "SQL Server schema design with normalized tables and views (Associate, Routes, Itineraries, Scorecards).",
      "ETL scripts in Python (Pandas + pyodbc) with duplicate detection and robust type parsing.",
      "Power BI-style dashboard sketches: on‑time rate, rescue tracking, route progress KPIs."
    ],
    tags: ["SQL", "Python", "ETL"],
    images: [
      "assets/dsp/snapshot1.png",
      "assets/dsp/snapshot2.png",
      "assets/dsp/snapshot3.png"
    ]
  },

  interp: {
    slug: "interp",
    title: "Interpolation Toolkit",
    summary:
      "Chebyshev nodes, Newton’s divided differences, and clamped cubic splines for smooth approximations.",
    details: [
      "Cosine calculator via Chebyshev interpolation and Newton form.",
      "Cubic spline variants (clamped, natural) with comparison plots.",
      "Error analysis and visualizations of node choices."
    ],
    tags: ["Numerical", "Python"],
    images: ["assets/interp/snapshot1.png", "assets/interp/snapshot2.png"]
  },

  opt: {
    slug: "opt",
    title: "Optimization Algorithms",
    summary:
      "From‑scratch BFGS/DFP implementations with line‑search strategies and contour visualizations.",
    details: [
      "Armijo / strong Wolfe backtracking demos on nonconvex surfaces.",
      "Hessian approximations and convergence comparisons.",
      "Interactive matplotlib notebooks exported to static images."
    ],
    tags: ["Optimization", "Python"],
    images: ["assets/opt/snapshot1.png"]
  },

  android: {
    slug: "android",
    title: "Android App – DSP Logistics",
    summary:
      "Navigation Drawer app with login, theme, and a messaging workflow for DSP ops.",
    details: [
      "Login fragment + demo auth, dark theme, and status bar styling.",
      "Messaging UI with channels for drivers, dispatch, and rescues.",
      "Room/Retrofit scaffolding (planned) for persistence and API integration."
    ],
    tags: ["Android", "Kotlin"],
    images: ["assets/android/snapshot1.png", "assets/android/snapshot2.png"]
  }
};
