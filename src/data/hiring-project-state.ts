import type { WorkspaceStateRecord } from "../../packages/types/src/workspace";

export const hiringProjectState: WorkspaceStateRecord = {
  project: {
    id: "hiring-project",
    name: "Talent Management and Hiring",
    title: "Hiring Workspace",
  },
  item_queue: [
    {
      id: "avery-chen",
      name: "Avery Chen",
      role: "Senior Product Designer",
      score: 88,
      status: "Waiting for Human Review",
      badge: "In Review",
      updatedAgo: "2h ago",
    },
    {
      id: "marcus-williams",
      name: "Marcus Williams",
      role: "Engineering Manager",
      score: 82,
      status: "Approved",
      badge: "Ready to Advance",
      updatedAgo: "4h ago",
    },
    {
      id: "priya-shah",
      name: "Priya Shah",
      role: "Senior Product Manager",
      score: 79,
      status: "Waiting for Human Review",
      badge: "In Review",
      updatedAgo: "1d ago",
    },
    {
      id: "daniel-kim",
      name: "Daniel Kim",
      role: "UX Researcher",
      score: 74,
      status: "Feedback Needed",
      badge: "Feedback Needed",
      updatedAgo: "1d ago",
    },
    {
      id: "sara-johnson",
      name: "Sara Johnson",
      role: "People Operations Manager",
      score: 71,
      status: "Waiting for Human Review",
      badge: "In Review",
      updatedAgo: "2d ago",
    },
  ],
  artifact_versions: [
    {
      id: "avery-chen",
      artifactId: "avery-chen",
      artifactType: "candidate-evaluation",
      title: "Evaluation Summary",
      score: 88,
      verdict: "Strong Hire",
      generatedBy: "Summary Agent",
      generatedAt: "May 20, 2025 at 10:14 AM",
      sections: [
        {
          title: "Overall Assessment",
          body: "Avery is a strong candidate with immediate impact potential. Recommend advancing to on-site interviews.",
        },
        {
          title: "Strengths",
          bullets: [
            "Excellent user empathy and customer insight",
            "Strong portfolio with measurable outcomes",
            "Systems thinking and ability to simplify complexity",
            "Collaborative and clear communicator",
            "High quality craft and attention to detail",
          ],
        },
        {
          title: "Concerns",
          bullets: [
            "Limited experience leading design teams",
            "Less exposure to large-scale design systems",
            "Growth area in prioritization at scale",
          ],
        },
        {
          title: "Recommendation",
          body: "Advance to on-site interview. High potential to succeed in this role. Concerns are addressable.",
        },
      ],
      tabs: [
        "evaluation-summary",
        "interview-brief",
        "follow-up-draft",
        "scorecard",
      ],
    },
  ],
  thread_index: [
    {
      id: "candidate:avery-chen",
      threadFor: "candidate:avery-chen",
      messages: [
        {
          author: "Jordan Lee",
          timestamp: "10:15 AM",
          text: "What are the biggest concerns?",
        },
        {
          author: "AI Assistant",
          timestamp: "10:15 AM",
          text: "The main concerns are limited leadership experience, less exposure to large-scale design systems, and prioritization at scale.",
        },
        {
          author: "Jordan Lee",
          timestamp: "10:16 AM",
          text: "Recommend next steps",
        },
        {
          author: "AI Assistant",
          timestamp: "10:16 AM",
          text: "Advance to on-site interview, schedule a design exercise, include cross-functional panel, and prepare scaling-systems questions.",
        },
      ],
    },
  ],
  agent_activity: [
    {
      id: "summary-agent",
      name: "Summary Agent",
      status: "Online",
      detail: "Generated summary",
      relatedTo: "candidate:avery-chen",
    },
    {
      id: "policy-check-agent",
      name: "Policy Check Agent",
      status: "Online",
      detail: "Checked policies",
      relatedTo: "candidate:avery-chen",
    },
    {
      id: "research-agent",
      name: "Research Agent",
      status: "Online",
      detail: "Gathered 5 sources",
      relatedTo: "candidate:avery-chen",
    },
    {
      id: "approval-activity-1",
      name: "Hiring Manager Review",
      status: "Pending",
      detail: "Awaiting approval for Avery Chen",
      relatedTo: "approval:avery-chen",
    },
  ],
  knowledge_links: [
    {
      id: "guide-1",
      title: "Interview Guide: Senior Product Designer",
      updatedAt: "Updated Apr 10, 2025",
      relatedTo: "candidate:avery-chen",
    },
    {
      id: "guide-2",
      title: "Design Competency Framework",
      updatedAt: "Updated Mar 5, 2025",
      relatedTo: "candidate:avery-chen",
    },
    {
      id: "guide-3",
      title: "Product Design Rubric",
      updatedAt: "Updated Apr 2, 2025",
      relatedTo: "candidate:avery-chen",
    },
  ],
  approval_state: [
    {
      id: "approval-avery",
      status: "Pending",
      candidateId: "avery-chen",
      candidateName: "Avery Chen",
      artifactId: "avery-chen",
      owner: "Jordan Lee",
    },
    {
      id: "approval-priya",
      status: "Pending",
      candidateId: "priya-shah",
      candidateName: "Priya Shah",
      artifactId: "priya-shah",
      owner: "Jordan Lee",
    },
  ],
};
