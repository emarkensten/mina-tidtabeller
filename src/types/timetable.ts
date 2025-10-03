// Types for saved timetables

export interface SavedTimetable {
  id: string;
  fromStation: {
    name: string;
    signature: string;
  };
  toStation: {
    name: string;
    signature: string;
  };
  createdAt: Date;
  lastUsed: Date;
}

export interface TimetableStorage {
  timetables: SavedTimetable[];
}
