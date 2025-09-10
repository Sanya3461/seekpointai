export interface Dimension {
  name: string;
  reason: string;
}

export interface GradingSuggestion {
  dimensions: Dimension[];
  weights: Record<string, number>;
}

export function suggestDimensions(jobDescription: string, jobTitle?: string): GradingSuggestion {
  // Recruiting-focused dimension suggestions based on job description and title
  
  const commonDimensions: Dimension[] = [
    {
      name: "Role Fit & Experience",
      reason: "Tenure in similar roles, relevant responsibilities, scale of past work."
    },
    {
      name: "Technical / Hard Skills", 
      reason: "Stack/tools from the JD, depth, and recency of hands-on work."
    },
    {
      name: "Domain & Industry",
      reason: "Experience in the target industry, regulations, or product type."
    },
    {
      name: "Communication & Team Fit",
      reason: "Stakeholder comms, collaboration, leadership signals."
    }
  ];

  return {
    dimensions: commonDimensions,
    weights: {
      "Role Fit & Experience": 35,
      "Technical / Hard Skills": 35, 
      "Domain & Industry": 20,
      "Communication & Team Fit": 10
    }
  };
}