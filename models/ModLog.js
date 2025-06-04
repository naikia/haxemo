import { Schema, model } from "mongoose"

const modLogSchema = new Schema(
  {
    commandId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    userId: {
      type: String,
      required: true,
      index: true,
    },
    guildId: {
      type: String,
      required: true,
      index: true,
    },
    moderatorId: {
      type: String,
      required: true,
    },
    action: {
      type: String,
      required: true,
      enum: ["warn", "mute", "kick", "ban", "timeout", "unban", "unmute", "clear", "pardon"],
    },
    reason: {
      type: String,
      default: "No reason provided",
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    duration: {
      type: String,
      default: null,
    },
    evidence: {
      type: String,
      default: null,
    },
    additionalInfo: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  },
)

// Compound index for efficient queries
modLogSchema.index({ userId: 1, guildId: 1 })
modLogSchema.index({ commandId: 1 })

export default model("ModLog", modLogSchema)
