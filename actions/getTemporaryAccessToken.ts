'use server'

import { currentUser } from "@clerk/nextjs/server";
import {SchematicClient} from "@schematichq/schematic-typescript-node";

const apiKey = process.env.SCHEMATIC_API_KEY;
const client = new SchematicClient({
    apiKey,
})

export default async function getTemporaryAccessToken() {
    console.log("Getting temporary access token");

    const user = await currentUser();
    if (!user) {
        console.log("User not found, returning null");
        return null;
    }
    
    const resp = await client.accesstokens.issueTemporaryAccessToken({
        resourceType: "company",
        lookup: { id: user.id }, // The lookup will vary depending on how you have configured your company keys
      });
      console.log(resp.data ? "Token issued successfully" : "Failed to issue token");
      return resp.data?.token;
}
