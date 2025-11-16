import React, { useMemo } from 'react';
import { Calendar, User, Clock } from 'lucide-react';

function WeeklyGridTimetable({ data }) {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  const maxPeriod = data.length > 0 ? Math.max(...data.map(item => item.period)) : 6;
  const periods = Array.from({ length: maxPeriod }, (_, i) => i + 1);

  const timetableGrid = useMemo(() => {
    const grid = {};
    days.forEach(day => {
      grid[day] = {};
      periods.forEach(period => {
        grid[day][period] = [];
      });
    });

    data.forEach(item => {
      if (grid[item.day] && grid[item.day][item.period] !== undefined) {
        grid[item.day][item.period].push(item);
      }
    });

    return grid;
  }, [data, days, periods]);

  if (data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
        <p>No timetable data available</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="mb-4 text-sm text-gray-600">
        Showing {data.length} sessions across {days.length} days and {periods.length} periods
      </div>

      <div className="overflow-x-auto shadow-lg rounded-lg border border-gray-200">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
              <th className="border border-blue-500 px-4 py-3 text-left font-semibold min-w-[120px]">
                <Clock className="w-4 h-4 inline mr-2" />
                Period
              </th>
              {days.map(day => (
                <th
                  key={day}
                  className="border border-blue-500 px-4 py-3 text-center font-semibold min-w-[220px]"
                >
                  <Calendar className="w-4 h-4 inline mr-2" />
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {periods.map((period, periodIdx) => (
              <tr key={period} className={periodIdx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                <td className="border border-gray-300 px-4 py-4 font-semibold bg-gray-100 text-gray-700">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-sm mr-2">
                      {period}
                    </div>
                    Period {period}
                  </div>
                </td>
                {days.map(day => (
                  <td
                    key={`${day}-${period}`}
                    className="border border-gray-300 px-3 py-4 align-top h-24"
                  >
                    <div className="space-y-1">
                      {timetableGrid[day][period].length > 0 ? (
                        timetableGrid[day][period].map((item, idx) => (
                          <div
                            key={idx}
                            className="bg-gradient-to-br from-blue-100 to-blue-200 border-l-4 border-blue-500 rounded-r-lg p-3 shadow-sm hover:shadow-md transition-shadow"
                          >
                            <div className="font-semibold text-blue-900 text-sm mb-1">
                              {item.course_id}
                            </div>
                            <div className="text-xs text-blue-700 mb-1 line-clamp-1">
                              {item.course_name}
                            </div>
                            <div className="text-xs text-blue-600 flex items-center">
                              <User className="w-3 h-3 mr-1" />
                              {item.faculty_id}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              Slot: {item.timeslot}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-gray-400 text-xs italic text-center py-6">
                          No class
                        </div>
                      )}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-center space-x-6 text-xs text-gray-500">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-blue-100 border-l-2 border-blue-500 mr-1"></div>
          Class Session
        </div>
        <div className="flex items-center">
          <Clock className="w-3 h-3 mr-1" />
          Time Slot Reference
        </div>
        <div className="flex items-center">
          <User className="w-3 h-3 mr-1" />
          Faculty Assignment
        </div>
      </div>
    </div>
  );
}

export default function EnhancedTimetableViews({ data }) {
  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Weekly Timetable</h1>

      <div className="bg-gray-50 p-4 rounded-lg mb-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div className="text-center">
          <div className="font-semibold text-lg">{data.length}</div>
          <div className="text-gray-600">Total Sessions</div>
        </div>
        <div className="text-center">
          <div className="font-semibold text-lg">
            {new Set(data.map(item => item.faculty_id)).size}
          </div>
          <div className="text-gray-600">Faculty Members</div>
        </div>
        <div className="text-center">
          <div className="font-semibold text-lg">
            {new Set(data.map(item => item.course_id)).size}
          </div>
          <div className="text-gray-600">Courses</div>
        </div>
        <div className="text-center">
          <div className="font-semibold text-lg">
            {new Set(data.map(item => item.day)).size}
          </div>
          <div className="text-gray-600">Days</div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <WeeklyGridTimetable data={data} />
      </div>
    </div>
  );
}
