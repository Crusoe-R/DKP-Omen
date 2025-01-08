<script>
  import { load } from "@tauri-apps/plugin-store";
  import { onMount } from "svelte";

  let apiKey = $state("");
  let serverId = $state("");
  let rollID = $state("");
  let note = $state("");

  onMount(() => {
    init();
  });

  async function init() {
    const store = await load("store.json", { autoSave: false });
    let loadApiKey = await store.get("API_KEY");
    apiKey = loadApiKey.value;
    let loadServerId = await store.get("SERVER_ID");
    serverId = loadServerId.value;
    let loadRollId = await store.get("ROLL_ID");
    rollID = loadRollId.value;
    let loadNote = await store.get("NOTE");
    note = loadNote.value;
  }

  async function save() {
    try {
      console.log("test async loaded");

      const store = await load("store.json", { autoSave: false });
      await store.set("API_KEY", { value: apiKey });
      await store.set("SERVER_ID", { value: serverId });
      await store.set("ROLL_ID", { value: rollID });
      await store.set("NOTE", { value: note });

      await store.save();
      console.log("saved");
    } catch (error) {
      console.error(error);
    }
  }
</script>

<div class="w-full flex justify-end flex-wrap pr-1">
  <div class="w-full p-1 my-2 flex flex-col">
    <p>API Key:</p>
    <input
      class="bg-gray-300 text-black rounded-sm h-6 mt-1 ml-auto mr-0 w-52 px-1"
      bind:value={apiKey}
    />
  </div>
  <div class="flex flex-col justify-between w-full p-1 my-2">
    <p>Server ID:</p>
    <input
      class="bg-gray-300 text-black rounded-sm h-6 mt-1 ml-auto mr-0 w-52 px-1"
      bind:value={serverId}
    />
  </div>
  <div class="flex flex-col justify-between w-full p-1 my-2">
    <p>Member Rollen ID:</p>
    <input
      class="bg-gray-300 text-black rounded-sm h-6 mt-1 ml-auto mr-0 w-52 px-1"
      bind:value={rollID}
    />
  </div>
  <div class="flex flex-col w-full p-1 my-2">
    <p>Editors Note:</p>
    <textarea
      class="placeholder-black font-medium text-black p-1 bg-gray-300"
      placeholder="Edited by Robin"
      bind:value={note}
    ></textarea>
    <p class="text-gray-400">
      Die "Editors Note" wird am ende der Description angefügt
    </p>
  </div>
  <div class="w-full flex justify-center">
    <button
      class="bg-gray-400 text-black rounded-md p-1 w-3/4 font-bold hover:bg-gray-300 hover:text-black active:bg-violet-600"
      onclick={save}>Save</button
    >
  </div>
</div>
