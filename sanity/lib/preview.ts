import { definePreview } from "next-sanity/preview"
import { client } from "./client"

function onPublicAccessOnly() {
  throw new Error(`Unable to load preview as you're not logged in`)
}

export const usePreview = definePreview({
  client,
  onPublicAccessOnly,
})
