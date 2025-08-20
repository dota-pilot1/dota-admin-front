export function ChallengeBoard() {
    // TODO: 실제 챌린지 목록 API 연동 필요
    const challenges = [
        { id: 1, title: "출석 챌린지", achieved: true },
        { id: 2, title: "글쓰기 챌린지", achieved: false },
        { id: 3, title: "댓글 챌린지", achieved: true },
    ];
    return (
        <section className="mt-6">
            <ul className="space-y-2">
                {challenges.map(ch => (
                    <li key={ch.id} className="p-4 border rounded flex justify-between items-center">
                        <span>{ch.title}</span>
                        <span className={ch.achieved ? "text-green-600" : "text-gray-400"}>
                            {ch.achieved ? "달성" : "미달성"}
                        </span>
                    </li>
                ))}
            </ul>
        </section>
    );
}
