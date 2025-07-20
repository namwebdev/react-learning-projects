interface Resume {
    id: string;
    companyName?: string;
    jobTitle?: string;
    imagePath: string;
    resumePath: string;
    feedback: Feedback;
}

interface Feedback {
    overallScore: number;
    ATS: FeedbackItem;
    toneAndStyle: FeedbackItem;
    content: FeedbackItem;
    structure: FeedbackItem;
    skills: FeedbackItem;
}

interface FeedbackItem {
    score: number;
    tips: Tip[];
}

interface Tip {
    type: "good" | "improve";
    tip: string;
    explanation: string;
}
