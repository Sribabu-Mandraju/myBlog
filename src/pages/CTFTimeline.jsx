import React from "react";
import { Calendar, Trophy, Users, Target } from "lucide-react";

// Remove TypeScript interface and use plain JS objects
const ctfChallenges = [
  {
    id: "1",
    name: "PicoMini by redpwn",
    date: "2022-05",
    rank: "150th",
    team: "MJ0LN1R",
    category: "Mixed",
    description: "Reverse engineering and crypto challenges",
    difficulty: "Medium",
    points: 2850,
  },
  {
    id: "2",
    name: "HSCTF 9",
    date: "2022-06",
    rank: "78th",
    team: "TeamMJ0LN1R",
    category: "Web Security",
    description: "Advanced web exploitation techniques",
    difficulty: "Hard",
    points: 4200,
  },
  {
    id: "3",
    name: "angstromCTF",
    date: "2022-04",
    rank: "45th",
    team: "MJ0LN1R",
    category: "Cryptography",
    description: "Modern cryptographic vulnerabilities",
    difficulty: "Hard",
    points: 3780,
  },
  {
    id: "4",
    name: "DiceCTF 2023",
    date: "2023-02",
    rank: "32nd",
    team: "TeamMJ0LN1R",
    category: "Pwn",
    description: "Binary exploitation and ROP chains",
    difficulty: "Insane",
    points: 5600,
  },
  {
    id: "5",
    name: "GoogleCTF",
    date: "2023-06",
    rank: "67th",
    team: "MJ0LN1R",
    category: "Reverse Engineering",
    description: "Complex binary analysis and obfuscation",
    difficulty: "Hard",
    points: 4950,
  },
  {
    id: "6",
    name: "DEF CON CTF Quals",
    date: "2023-05",
    rank: "89th",
    team: "TeamMJ0LN1R",
    category: "Mixed",
    description: "Elite level challenges across all categories",
    difficulty: "Insane",
    points: 7200,
  },
];

const getDifficultyColor = (difficulty) => {
  switch (difficulty) {
    case "Easy":
      return "text-green-400";
    case "Medium":
      return "text-yellow-400";
    case "Hard":
      return "text-orange-400";
    case "Insane":
      return "text-red-400";
    default:
      return "text-primary";
  }
};

const CTFTimeline = () => {
  return (
    <section className="w-full py-12">
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 flex items-center gap-2">
          <Target className="w-6 h-6 text-primary" />
          CTF Timeline
          <span className="text-primary text-4xl">.</span>
        </h2>
        <p className="text-muted-foreground">
          My journey through Capture The Flag competitions and security
          challenges
        </p>
      </div>

      {/* Timeline Container */}
      <div className="relative">
        {/* Horizontal scroll container */}
        <div className="overflow-x-auto pb-6">
          <div className="flex gap-6 min-w-max px-4">
            {ctfChallenges.map((challenge, index) => (
              <div key={challenge.id} className="flex items-center">
                {/* Timeline Item */}
                <div
                  className="timeline-item hover-glow group animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-primary" />
                      <span className="text-sm text-muted-foreground font-mono">
                        {challenge.date}
                      </span>
                    </div>
                    <div
                      className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(
                        challenge.difficulty
                      )} bg-current/10`}
                    >
                      {challenge.difficulty}
                    </div>
                  </div>

                  <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">
                    {challenge.name}
                  </h3>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-primary" />
                      <span className="text-sm">
                        Rank: <strong>{challenge.rank}</strong>
                      </span>
                    </div>

                    {challenge.team && (
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-primary" />
                        <span className="text-sm">
                          Team: <strong>{challenge.team}</strong>
                        </span>
                      </div>
                    )}

                    {challenge.points && (
                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-primary" />
                        <span className="text-sm">
                          Points: <strong>{challenge.points}</strong>
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="mb-3">
                    <span className="hacker-code text-xs">
                      {challenge.category}
                    </span>
                  </div>

                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {challenge.description}
                  </p>
                </div>

                {/* Connector Line */}
                {index < ctfChallenges.length - 1 && (
                  <div className="timeline-connector w-16 mx-4" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Scroll Hint */}
        <div className="flex justify-center mt-4">
          <div className="text-xs text-muted-foreground flex items-center gap-2">
            <span>Scroll horizontally to explore timeline</span>
            <div className="flex gap-1">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <div
                className="w-2 h-2 rounded-full bg-primary animate-pulse"
                style={{ animationDelay: "0.3s" }}
              />
              <div
                className="w-2 h-2 rounded-full bg-primary animate-pulse"
                style={{ animationDelay: "0.6s" }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTFTimeline;
