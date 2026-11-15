import {
  Schema,
  model,
  models,
  type HydratedDocument,
  type Model,
} from "mongoose";

// Shape of an event as stored in MongoDB
export interface IEvent {
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string; // stored as YYYY-MM-DD
  time: string; // stored as 24-hour HH:MM
  mode: string;
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export type EventDocument = HydratedDocument<IEvent>;

const EVENT_MODES = ["online", "offline", "hybrid"];

// A required string. `trim` turns whitespace-only input into "",
// which the `required` validator then rejects.
const requiredString = (label: string) => ({
  type: String,
  required: [true, `${label} is required`] as [true, string],
  trim: true,
});

// A required list that must hold at least one non-empty string.
const requiredStringList = (label: string) => ({
  type: [String],
  required: [true, `${label} is required`] as [true, string],
  validate: {
    validator: (items: string[]) =>
      items.length > 0 && items.every((item) => item.trim().length > 0),
    message: `${label} must contain at least one non-empty item`,
  },
});

const EventSchema = new Schema<IEvent>(
  {
    title: requiredString("Title"),
    // Not `required`: validation runs before the pre-save hook that fills it in.
    // `unique` creates the unique index.
    slug: { type: String, unique: true, lowercase: true, trim: true },
    description: requiredString("Description"),
    overview: requiredString("Overview"),
    image: requiredString("Image"),
    venue: requiredString("Venue"),
    location: requiredString("Location"),
    date: requiredString("Date"),
    time: requiredString("Time"),
    mode: {
      ...requiredString("Mode"),
      lowercase: true,
      enum: {
        values: EVENT_MODES,
        message: "Mode must be online, offline or hybrid",
      },
    },
    audience: requiredString("Audience"),
    agenda: requiredStringList("Agenda"),
    organizer: requiredString("Organizer"),
    tags: requiredStringList("Tags"),
  },
  { timestamps: true }, // adds createdAt and updatedAt
);

const pad = (value: number): string => String(value).padStart(2, "0");

// "KubeCon + CloudNativeCon 2026" -> "kubecon-cloudnativecon-2026"
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "") // drop special characters
    .replace(/\s+/g, "-") // spaces become hyphens
    .replace(/-+/g, "-") // collapse repeated hyphens
    .replace(/^-|-$/g, ""); // no hyphen at either end
}

// Accepts "2026-05-15", "2026-05-15T09:00:00Z" or "May 15, 2026"; returns "2026-05-15".
function normalizeDate(value: string): string {
  const input = value.trim();
  const isoMatch = /^(\d{4})-(\d{2})-(\d{2})(?:T.*)?$/.exec(input);

  let year: number;
  let month: number;
  let day: number;

  if (isoMatch) {
    [year, month, day] = [
      Number(isoMatch[1]),
      Number(isoMatch[2]),
      Number(isoMatch[3]),
    ];
  } else {
    const parsed = new Date(input);
    if (Number.isNaN(parsed.getTime())) {
      throw new Error(`Invalid date: "${value}"`);
    }
    // Local getters keep the calendar day as written, whatever the server's time zone.
    [year, month, day] = [
      parsed.getFullYear(),
      parsed.getMonth() + 1,
      parsed.getDate(),
    ];
  }

  // Reject impossible dates such as 2026-02-31.
  const check = new Date(Date.UTC(year, month - 1, day));
  const isRealDate =
    check.getUTCFullYear() === year &&
    check.getUTCMonth() === month - 1 &&
    check.getUTCDate() === day;
  if (!isRealDate) {
    throw new Error(`Invalid date: "${value}"`);
  }

  return `${year}-${pad(month)}-${pad(day)}`;
}

// Accepts "9:00 AM", "09:00 pm" or "14:30"; returns 24-hour "HH:MM".
function normalizeTime(value: string): string {
  const match = /^(\d{1,2}):(\d{2})\s*(am|pm)?$/i.exec(value.trim());
  if (!match) {
    throw new Error(`Invalid time: "${value}". Use HH:MM or HH:MM AM/PM`);
  }

  let hours = Number(match[1]);
  const minutes = Number(match[2]);
  const period = match[3]?.toLowerCase();

  if (period) {
    if (hours < 1 || hours > 12) {
      throw new Error(`Invalid time: "${value}"`);
    }
    if (period === "pm" && hours !== 12) hours += 12;
    if (period === "am" && hours === 12) hours = 0;
  }

  if (hours > 23 || minutes > 59) {
    throw new Error(`Invalid time: "${value}"`);
  }

  return `${pad(hours)}:${pad(minutes)}`;
}

// Runs before every save. Each step only runs when its field changed
// (a new document counts as changed).
EventSchema.pre("save", function () {
  if (this.isModified("title")) {
    const slug = generateSlug(this.title);
    if (!slug) {
      throw new Error("Title must contain at least one letter or number");
    }
    this.slug = slug;
  }

  if (this.isModified("date")) {
    this.date = normalizeDate(this.date);
  }

  if (this.isModified("time")) {
    this.time = normalizeTime(this.time);
  }
});

// Reuse the model if it is already compiled. Next.js reloads this file
// in development, and compiling the same model twice throws an error.
const Event: Model<IEvent> =
  (models.Event as Model<IEvent> | undefined) ??
  model<IEvent>("Event", EventSchema);

export default Event;
