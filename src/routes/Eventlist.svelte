<script>
  import { fetch } from "@tauri-apps/plugin-http";
  import EventListElement from "./EventListElement.svelte";
  import { load } from "@tauri-apps/plugin-store";

  let events = [];

  export async function loadData() {
    const store = await load("store.json", { autoSave: false });
    const loadapiKey = await store.get("API_KEY");
    const loadserverId = await store.get("SERVER_ID");

    const apiKey = loadapiKey.value;
    const serverId = loadserverId.value;
    const url = `https://raid-helper.dev/api/v3/servers/${serverId}/events`;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `${apiKey}`,
          IncludeSignUps: "true",
        },
      });

      if (response.ok) {
        const data = await response.json();
        events = data.postedEvents;
      } else {
        console.error("Failed to fetch data");
      }
    } catch (error) {
      console.error(error);
      console.log("error beim versuchen");
    }
  }

  loadData();
</script>

<div>
  {#each events as event}
    <EventListElement {event} />
  {/each}
</div>
