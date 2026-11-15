import {
  Schema,
  model,
  models,
  type HydratedDocument,
  type Model,
  type Types,
} from "mongoose";

import Event from "./event.model";

// Shape of a booking as stored in MongoDB
export interface IBooking {
  eventId: Types.ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export type BookingDocument = HydratedDocument<IBooking>;

// Simple shape check: something@something.something, no spaces
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const BookingSchema = new Schema<IBooking>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event", // lets .populate("eventId") load the event
      required: [true, "Event ID is required"],
      index: true, // bookings are usually looked up by event
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true, // so the same address always matches
      validate: {
        validator: (email: string) => EMAIL_PATTERN.test(email),
        message: "Please provide a valid email address",
      },
    },
  },
  { timestamps: true }, // adds createdAt and updatedAt
);

// MongoDB does not enforce references, so check that the event
// exists before saving a booking that points to it.
BookingSchema.pre("save", async function () {
  if (this.isModified("eventId")) {
    const eventExists = await Event.exists({ _id: this.eventId });
    if (!eventExists) {
      throw new Error(
        `Event with ID ${this.eventId.toString()} does not exist`,
      );
    }
  }
});

// Reuse the model if it is already compiled (see event.model.ts).
const Booking: Model<IBooking> =
  (models.Booking as Model<IBooking> | undefined) ??
  model<IBooking>("Booking", BookingSchema);

export default Booking;
