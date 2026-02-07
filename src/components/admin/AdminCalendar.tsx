import { useState, useMemo } from "react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Users } from "lucide-react";
import { Application, getAvatarUrl, getGradient } from "./types";
import { format, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";

interface AdminCalendarProps {
  applications: Application[];
  onSelectApplication: (app: Application) => void;
}

export function AdminCalendar({ applications, onSelectApplication }: AdminCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  // Group applications by date
  const applicationsByDate = useMemo(() => {
    const map = new Map<string, Application[]>();
    applications.forEach((app) => {
      const dateKey = format(new Date(app.created_at), "yyyy-MM-dd");
      if (!map.has(dateKey)) map.set(dateKey, []);
      map.get(dateKey)!.push(app);
    });
    return map;
  }, [applications]);

  // Get dates that have applications (for highlighting)
  const datesWithApplications = useMemo(() => {
    return Array.from(applicationsByDate.keys()).map((d) => new Date(d));
  }, [applicationsByDate]);

  // Get applications for selected date
  const selectedDateKey = format(selectedDate, "yyyy-MM-dd");
  const selectedDateApps = applicationsByDate.get(selectedDateKey) || [];

  // Get stats for the current month
  const monthStats = useMemo(() => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    let count = 0;
    applications.forEach((app) => {
      const d = new Date(app.created_at);
      if (d >= start && d <= end) count++;
    });
    return count;
  }, [currentMonth, applications]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-sans text-2xl font-bold text-foreground">Calendar</h2>
        <p className="text-muted-foreground mt-1">
          View applications by date · {monthStats} application{monthStats !== 1 ? "s" : ""} this month
        </p>
      </div>

      <div className="grid lg:grid-cols-[auto_1fr] gap-6">
        {/* Calendar */}
        <div className="bg-card rounded-2xl border border-border p-6 self-start">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => date && setSelectedDate(date)}
            month={currentMonth}
            onMonthChange={setCurrentMonth}
            className="pointer-events-auto"
            modifiers={{
              hasApplications: datesWithApplications,
            }}
            modifiersClassNames={{
              hasApplications: "has-applications",
            }}
            components={{
              DayContent: ({ date }) => {
                const key = format(date, "yyyy-MM-dd");
                const count = applicationsByDate.get(key)?.length || 0;
                return (
                  <div className="relative flex flex-col items-center">
                    <span>{date.getDate()}</span>
                    {count > 0 && (
                      <div className="absolute -bottom-1 flex gap-0.5">
                        {Array.from({ length: Math.min(count, 3) }).map((_, i) => (
                          <div
                            key={i}
                            className="w-1 h-1 rounded-full bg-accent"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                );
              },
            }}
          />
        </div>

        {/* Selected Day Details */}
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          {/* Day Header */}
          <div className="p-6 border-b border-border">
            <h3 className="font-sans text-lg font-semibold text-foreground">
              {format(selectedDate, "EEEE, MMMM d, yyyy")}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {selectedDateApps.length} application{selectedDateApps.length !== 1 ? "s" : ""} received
            </p>
          </div>

          {/* Applications List */}
          <div className="divide-y divide-border">
            {selectedDateApps.length === 0 ? (
              <div className="p-12 text-center">
                <Users className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
                <p className="text-muted-foreground text-sm">No applications on this date</p>
              </div>
            ) : (
              selectedDateApps.map((app) => (
                <div
                  key={app.id}
                  className="flex items-center gap-4 p-4 hover:bg-secondary/30 cursor-pointer transition-colors"
                  onClick={() => onSelectApplication(app)}
                >
                  <img
                    src={getAvatarUrl(app.full_name)}
                    alt={app.full_name}
                    className="w-12 h-12 rounded-full bg-secondary shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-foreground truncate">{app.full_name}</p>
                    <p className="text-sm text-muted-foreground truncate">{app.email}</p>
                  </div>
                  <span className={`text-xs font-medium px-3 py-1.5 rounded-full bg-gradient-to-r ${getGradient(app.position)} text-white shrink-0`}>
                    {app.position}
                  </span>
                  <span className="text-xs text-muted-foreground shrink-0">
                    {format(new Date(app.created_at), "h:mm a")}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
