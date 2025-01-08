<script>
  import { fetch } from "@tauri-apps/plugin-http";
  import { load } from "@tauri-apps/plugin-store";

  let { title, id } = $props();

  let amount = $state("");

  async function addDKP() {
    const store = await load("store.json", { autoSave: false });
    const loadapiKey = await store.get("API_KEY");
    const loadserverId = await store.get("SERVER_ID");
    const loadNote = await store.get("NOTE");

    const apiKey = loadapiKey.value;
    const serverId = loadserverId.value;
    const note = loadNote.value;
    const url = `https://raid-helper.dev/api/v2/servers/${serverId}/entities/${id}/dkp`;
    console.log(id);

    const data = {
      operation: "add",
      value: amount,
      description: "DKP für Teilnahme an Event: " + title + ` (${note})`,
    };
    try {
      fetch(url, {
        method: "PATCH",
        headers: {
          Authorization: apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to patch data");
          }
          return response.json();
        })
        .then((data) => {
          console.log(data);
        })
        .catch((error) => {
          console.error(error);
        });
    } catch (error) {
      console.error(error);
      console.log("error beim versuchen");
    }
  }
</script>

<div class="mr-3 flex w-1/3 justify-between">
  <div class="flex">
    <p class="mr-2">Anzahl Hinzugefügter DKP:</p>
    <input
      class="text-black font-bold bg-gray-400 w-24 placeholder-neutral-800 text-right h-6 rounded-sm px-1"
      type="text"
      placeholder="0"
      bind:value={amount}
    />
  </div>
  <button
    class="px-2 rounded-md bg-gray-500 hover:bg-gray-300 hover:border-2 hover:border-black hover:text-black"
    onclick={addDKP}>Add</button
  >
</div>
