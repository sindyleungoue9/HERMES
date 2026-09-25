import { mutation, query } from "./_generated/server"
import { v } from "convex/values"

const rfqStatus = v.union(
  v.literal("processing"),
  v.literal("to_review"),
  v.literal("not_found"),
  v.literal("sent"),
)

export const listRecent = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id("rfqs"),
      _creationTime: v.number(),
      reference: v.string(),
      client: v.string(),
      vessel: v.string(),
      articleCount: v.number(),
      status: rfqStatus,
      createdAt: v.number(),
    }),
  ),
  handler: async (ctx) => {
    return await ctx.db
      .query("rfqs")
      .withIndex("by_created_at")
      .order("desc")
      .take(20)
  },
})

export const create = mutation({
  args: {
    reference: v.string(),
    client: v.string(),
    vessel: v.string(),
    articleCount: v.number(),
    status: rfqStatus,
  },
  returns: v.id("rfqs"),
  handler: async (ctx, args) => {
    return await ctx.db.insert("rfqs", {
      ...args,
      createdAt: Date.now(),
    })
  },
})
