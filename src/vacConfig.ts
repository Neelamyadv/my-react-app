// Value Added Certificate ka data yahan store hoga
// Easy to edit: bas neeche array me topic add/update/remove karo

export const vacTopics = [
  {
    id: "ai-basics", // unique id
    name: "AI Basics", // topic ka naam
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", // video link (null ho to direct quiz chalega)
    questions: [
      {
        q: "AI ka full form kya hai?",
        options: [
          "Artificial Intel",
          "Artificial Intelligence",
          "Auto Intelligence",
          "None"
        ],
        answer: 1, // correct option ka index
      },
      {
        q: "AI ka ek real example kaun sa hai?",
        options: ["ChatGPT", "MS Paint", "Notepad", "Calculator"],
        answer: 0,
      },
    ],
  },
  {
    id: "no-video-demo",
    name: "No Video Example",
    videoUrl: null, // is topic me video nahi hoga
    questions: [
      { q: "2 + 2 = ?", options: ["3", "4", "5", "6"], answer: 1 },
      { q: "Sun rises from?", options: ["West", "East", "North", "South"], answer: 1 },
    ],
  },
];

// helper function to get topic by id
export const getTopicById = (id: string) => {
  return vacTopics.find((t) => t.id === id);
};