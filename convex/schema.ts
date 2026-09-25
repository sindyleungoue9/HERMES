import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

const rfqStatus = v.union(
  v.literal("processing"),
  v.literal("to_review"),
  v.literal("not_found"),
  v.literal("sent"),
)

export default defineSchema({
  rfqs: defineTable({
    reference: v.string(),
    client: v.string(),
    vessel: v.string(),
    articleCount: v.number(),
    status: rfqStatus,
    createdAt: v.number(),
  })
    .index("by_created_at", ["createdAt"])
    .index("by_status", ["status"]),
})
