export function MoodSelector() {
  return (
    <div className="flex flex-wrap gap-2">
      {['Calm', 'Anxious', 'Sad', 'Stressed', 'Hopeful', 'Tired'].map((mood) => (
        <button className="rounded-full border border-sky bg-white px-3 py-1.5 text-sm font-medium text-ocean hover:bg-mint/40" key={mood}>
          {mood}
        </button>
      ))}
    </div>
  );
}
