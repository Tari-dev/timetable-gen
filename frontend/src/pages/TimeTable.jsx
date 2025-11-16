import EnhancedTimetableViews from "../components/EnhancedTimetable";

export default function Timetable() {
  const timetable = JSON.parse(localStorage.getItem("timetable") || "[]");

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Generated Timetable</h2>
      {timetable.length > 0 ? (
        <EnhancedTimetableViews data={timetable} />
      ) : (
        <p>No timetable generated yet.</p>
      )}
    </div>
  );
}
